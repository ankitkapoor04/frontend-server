import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppSettings } from '../config/config';
import { apiConstants } from '../constant/apiConstant';

@Injectable({
  providedIn: 'root',
})
export class NewTicketService {
  private apiUrl = AppSettings.API_ENDPOINT;
  private addTicketUrl = apiConstants.addTicket;

  constructor(
    private http: HttpClient,
  ) {}

  addTicket(ticketData: any): Observable<any> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': `Bearer ${token}`
    });

    return this.http.post<any>(`${this.apiUrl}${this.addTicketUrl}`, ticketData, { headers })
      .pipe(
        map(res => res),
        catchError((error: HttpErrorResponse) => {

          return throwError(error);
        })
      );
  }
}
