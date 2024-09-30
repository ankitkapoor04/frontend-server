import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import newticketstrings from '../stringFile/newticket.json'; // Import your strings file
import { ToastrService } from 'ngx-toastr';
import { NewTicketService } from './newticket.component.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { TicketUpdateService } from '../viewticket/viewticketservice'
import { SearchService } from '../search.service';

@Component({
  selector: 'app-newticket',
  standalone: true,
  imports: [CommonModule, FormsModule,],
  templateUrl: './newticket.component.html',
  styleUrls: ['./newticket.component.css'],

})
export class NewticketComponent {
  strings = newticketstrings;
  isModalOpen = false;
  selectedCategory = this.strings.guestCategory;
  searchTerm: string = '';
  hasTickets: boolean= false;
  count =1;
  currentTerm=0;
  placeholder: string = 'Search by name, password, or pin...';

  constructor(
    private newticketService: NewTicketService,
    private toastr: ToastrService,
    private router: Router,
    private ticketUpdateService: TicketUpdateService,
    private searchService: SearchService
  ) {}

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  getMessageForCategory(category: string): string {
    switch (category) {
      case this.strings.guestCategory:
        return this.strings.infoMessageGuest;
      case this.strings.yearlyCategory:
        return this.strings.infoMessageYearly;
      case this.strings.monthlyCategory:
        return this.strings.infoMessageMonthly;
      default:
        return '';
    }
  }

  onRefresh(): void {
    this.searchTerm = '';
    this.searchService.search(this.searchTerm);
  }
  validateNoLeadingSpace(control: any): void {
    if (control.value.startsWith(' ')) {
      control.control.setValue(control.value.trimStart());
    }
  }

  async onSubmit(form: NgForm) {
    if (form.invalid) {
      Object.keys(form.controls).forEach(key => {
        const control = form.controls[key];
        control.markAsTouched();
      });
      this.toastr.error(this.strings.formInvalid);
      return;
    }

    const formData = {
      name: form.value.name.trim(),
      contactNumber: form.value.contactNumber.trim(),
      membershipCategory: this.selectedCategory,
      amount: form.value.amount
    };

    try {
      const response = await firstValueFrom(this.newticketService.addTicket(formData));
      if (response.success){
      const message = response.message || this.strings.ticketCreatedSuccessfully;
      this.toastr.success(message, this.strings.success);
      this.ticketUpdateService.notifyTicketAdded();
      form.resetForm();
      this.closeModal();

      this.searchService.search(this.searchTerm);
      }
      else {
        this.toastr.error(response.message, this.strings.error);
     }
    } catch (error: any) {
      let errorMessage = this.strings.ticketCreationFailed;
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
      this.toastr.error(errorMessage, this.strings.error);
    }
  }
  ngOnInit() {
    this.searchService.ticketAvailability$.subscribe(hasTickets => {
      this.hasTickets = hasTickets;
    });
    this.searchService.currentTerm$.subscribe(currentTerm => {
      this.currentTerm = currentTerm;
      if(this.count==this.currentTerm){
      }
      else if(this.count<this.currentTerm) {
        this.searchTerm="";
        this.count++;
        this.placeholder="";

      }
      else{
        this.searchTerm="";
        this.count--;
        this.placeholder="";
      }
    });
  }
  onSearchChange(searchTerm: string) {
    this.searchTerm = searchTerm;
  }
  onEnterPress() {
    if (this.searchTerm.startsWith(' ')) {
      this.searchTerm = this.searchTerm.trimStart();
    }

    this.searchService.search(this.searchTerm);
  }
}
