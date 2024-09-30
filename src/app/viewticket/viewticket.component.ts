
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import viewTicketStrings from '../stringFile/viewticket.json';
import { ToastrService } from 'ngx-toastr';
import { TicketService } from './viewticket.component.service';
import { firstValueFrom } from 'rxjs';
import { TicketData } from './viewticket.response.modal';
import { TicketUpdateService } from './viewticketservice';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-viewticket',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './viewticket.component.html',
  styleUrls: ['./viewticket.component.css']
})

export class ViewticketComponent implements OnInit {
  strings = viewTicketStrings;
  tickets: TicketData[] = [];
  pageSize = 8;
  currentPage = 1;
  isActive=true;
  totalPages = 0;
  totalItems = 0;
  activeDropdown: string | null = null;
  isFormOpen = false;
  selectedTicket: TicketData = { ticketId: '', name: '', contactNumber: '', membershipCategory: '', amount: 0 , pin:''};
  isDeletePopupOpen = false;
  ticketToDelete: TicketData | null = null;
  searchTerm: string = '';
  isSearchActive = false;

  constructor(
    private toastr: ToastrService,
    private ticketService: TicketService,
    private ticketUpdateService: TicketUpdateService,
    private searchService: SearchService
  ) { }

  ngOnInit() {
    this.ticketUpdateService.ticketUpdated$.subscribe(() => {
      this.fetchTickets();
    });
    this.searchService.searchTerm$.subscribe(searchTerm => {
      this.searchTerm = searchTerm;
      this.fetchTickets(1, this.pageSize, searchTerm); // Start from page 1 when searching
    });
    this.fetchTickets();
  }
  async fetchTickets(currentPage: number = 1, limit: number = this.pageSize, searchTerm: string = '') {
    try {
      const response = await firstValueFrom(this.ticketService.getTicketsByUserId(currentPage, limit, searchTerm));
      const hasTickets = response.success && response.tickets.length > 0;
      this.searchService.updateTicketAvailability(hasTickets);

      if (response.success && response.tickets.length > 0) {
        this.tickets = response.tickets;
        this.totalPages = response.pagination.totalPages;
        this.currentPage = response.pagination.currentPage;
        this.totalItems = response.pagination.totalItems;

        this.isSearchActive=true;
        this.isActive=true;
      }
      else {
        this.toastr.error(response.message || this.strings.noTicketsText, this.strings.errorText);
      }

    } catch (error: any) {

      this.isActive=false;
      this.tickets = [];

      if (error.status === 404) {
      } else if (error.error && error.error.message) {
        this.toastr.error(error.error.message, this.strings.errorText);
      } else {
        this.toastr.error(this.strings.errorText);
      }
    }
  }

  trackByTicketID(index: number, ticket: TicketData) {
    return ticket.ticketId;
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.fetchTickets(--this.currentPage, this.pageSize, this.searchTerm);
      this.searchService.current(this.currentPage);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.fetchTickets(++this.currentPage, this.pageSize, this.searchTerm);
      this.searchService.current(this.currentPage);
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.fetchTickets(page);
      this.searchService.current(this.currentPage);
    }
  }

  isFirstOrLastPage(): boolean {
    return this.currentPage === 1 || this.currentPage === this.totalPages;
  }

  isNextPageDisabled(): boolean {
    return this.currentPage >= this.totalPages;
  }

  isPrevPageDisabled(): boolean {
    return this.currentPage <= 1;
  }

  shouldShowLeftDots(): boolean {
    return this.currentPage > 2 && this.totalPages > 3;
  }

  shouldShowRightDots(): boolean {
    return this.currentPage < this.totalPages - 1 && this.totalPages > 3;
  }

  shouldDisablePagination(): boolean {
    return this.totalItems <= this.pageSize;
  }

  toggleDropdown(ticketId: string, event: Event) {
    event.stopPropagation();
    this.activeDropdown = this.activeDropdown === ticketId ? null : ticketId;
  }

  selectCategory(category: string) {
    this.selectedTicket.membershipCategory = category;
  }

  openEditForm(ticket: TicketData) {
    const { ticketId, name, contactNumber, membershipCategory, amount, pin } = ticket;
    this.selectedTicket = { ticketId, name, contactNumber, membershipCategory, amount, pin };
    this.isFormOpen = true;
    this.activeDropdown = null;
  }

  closeEditForm() {
    this.isFormOpen = false;
    this.selectedTicket = { ticketId: '', name: '', contactNumber: '', membershipCategory: '', amount: 0, pin:'' };
  }

  async saveTicket(form: NgForm) {
    if (form.valid) {
      try {

        const { pin, ...ticketWithoutPin } = this.selectedTicket;

        const response = await firstValueFrom(this.ticketService.updateTicket(ticketWithoutPin));
        if (response.success) {
          const index = this.tickets.findIndex(t => t.ticketId === this.selectedTicket.ticketId);
          if (index !== -1) {
            this.tickets[index] = { ...this.selectedTicket };
          }
          this.toastr.success(response.message, this.strings.successText);
          this.fetchTickets(this.currentPage);
          this.closeEditForm();
        } else {
          this.toastr.error(response.message, this.strings.errorText);
        }
      } catch (error: any) {
        this.toastr.error(error.message || this.strings.errorText);
      }
    } else {
      form.form.markAllAsTouched();
    }
  }


  openDeletePopup(ticket: TicketData) {
    this.ticketToDelete = ticket;
    this.isDeletePopupOpen = true;
    this.activeDropdown = null;
  }

  closeDeletePopup() {
    this.isDeletePopupOpen = false;
    this.ticketToDelete = null;
  }

  async deleteTicket(ticket: TicketData) {
    try {
      const response = await firstValueFrom(this.ticketService.deleteTicket(ticket.ticketId));
      if (response.success) {
        const index = this.tickets.findIndex(t => t.ticketId === ticket.ticketId);
        if (index !== -1) {
          this.tickets.splice(index, 1);
          this.totalItems--;
          this.totalPages = Math.ceil(this.totalItems / this.pageSize);
          if (this.currentPage > this.totalPages) {
            this.currentPage = this.totalPages;
          }
          if(this.totalItems==0){
            this.searchService.updateTicketAvailability(false);
            this.isSearchActive=false;
          }
          this.fetchTickets();
        }
        this.toastr.success(response.message, this.strings.successText);
      } else {
        this.toastr.error(response.message, this.strings.errorText);
      }
    } catch (error: any) {
      this.toastr.error(error.message || this.strings.errorText);
    }
  }

  confirmDelete() {
    if (this.ticketToDelete) {
      this.deleteTicket(this.ticketToDelete);
      this.closeDeletePopup();
    }
  }
}
