import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { apiConstants } from '../constant/apiConstant';
import { AppSettings } from '../config/config';

@Injectable({
    providedIn: 'root',
})
export class signupService {
    private url = AppSettings.API_ENDPOINT;
    private signup= apiConstants.signup;
    headers: HttpHeaders;

    constructor(private http: HttpClient) {
        this.headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
    }

    registerUser(userData: any): Observable<any> {
        return this.http.post(`${this.url}${this.signup}`, userData, { headers: this.headers })
        .pipe(
            map((res) => res),
            catchError((error: HttpErrorResponse) => {
                return throwError(error);
            })
        );
    }
}