import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { catchError, map } from "rxjs/operators";
import { LoginResponse } from './login.response.modal';
import { apiConstants } from '../constant/apiConstant';
import { AppSettings } from '../config/config';

@Injectable({
    providedIn: 'root',
})
export class loginService {
    private url = AppSettings.API_ENDPOINT;
    private login = apiConstants.login;
    headers: HttpHeaders;

    constructor(private http: HttpClient) {
        this.headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
    }

    VerifyLogin(body: any): Observable<LoginResponse> {
        return this.http
            .post<LoginResponse>(`${this.url}${this.login}`, body, {
                headers: this.headers,
            })
            .pipe(
                map((res) => res),
                catchError((error: HttpErrorResponse) => {
                    return throwError(error);
                })
            );
    }
}