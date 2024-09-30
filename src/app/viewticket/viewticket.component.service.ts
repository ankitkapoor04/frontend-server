import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppSettings } from '../config/config';
import { apiConstants } from '../constant/apiConstant';
import { TicketData } from './viewticket.response.modal';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private url = AppSettings.API_ENDPOINT;
  private viewticketsUrl = apiConstants.viewTickets;
  private editticketUrl = apiConstants.editTickets;
  private deleteticketUrl = apiConstants.deleteTickets;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'token': `Bearer ${token}`
    });
  }

  getTicketsByUserId(page: number = 1, limit: number = 10, searchTerm: string = ''): Observable<any> {
    const headers = this.getHeaders();
    let queryUrl = `${this.url}${this.viewticketsUrl}?page=${page}&limit=${limit}`;
    if (searchTerm) {
      queryUrl += `&searchTerm=${encodeURIComponent(searchTerm)}`;
    }
    return this.http.get(queryUrl, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error);
        })
      );
  }


  updateTicket(ticket: TicketData): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put(`${this.url}${this.editticketUrl}`, ticket, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error);
        })
      );
  }

  deleteTicket(ticketId: string): Observable<any> {
    const body = { ticketId };
    const headers = this.getHeaders();
    return this.http.put(`${this.url}${this.deleteticketUrl}`, body, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error);
        })
      );
  }
}
