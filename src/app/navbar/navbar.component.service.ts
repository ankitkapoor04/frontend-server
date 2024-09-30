import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiConstants } from '../constant/apiConstant';
import { AppSettings } from '../config/config';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private url = AppSettings.API_ENDPOINT;
    private logouturl = apiConstants.logout;

    constructor(private http: HttpClient) { }

    logout(token: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'token': `Bearer ${token}`
        });
        const body = {};
        return this.http.post(`${this.url}${this.logouturl}`, body, { headers })
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    return throwError(error);
                })
            );
    }
}