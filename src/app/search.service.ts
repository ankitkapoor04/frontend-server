import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchSubject = new Subject<string>();
  private currentSubject = new Subject<number>();
  private ticketAvailabilitySubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  get searchTerm$(): Observable<string> {
    return this.searchSubject.asObservable();
  }
  get currentTerm$(): Observable<number> {
    return this.currentSubject.asObservable();
  }

  get ticketAvailability$(): Observable<boolean> {
    return this.ticketAvailabilitySubject.asObservable();
  }

  search(searchTerm: string) {
    this.searchSubject.next(searchTerm);
  }
  current(currentPage: number) {
    this.currentSubject.next(currentPage);
  }

  updateTicketAvailability(hasTickets: boolean) {
    this.ticketAvailabilitySubject.next(hasTickets);
  }
}
