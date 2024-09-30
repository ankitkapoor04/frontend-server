import { HttpInterceptorFn } from '@angular/common/http';
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { inject } from '@angular/core'; 
import { Router } from '@angular/router';  

export const serviceInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const token = localStorage.getItem('token');
  let clonedReq = req;

  const router = inject(Router);

  if (token) {
    clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  return next(clonedReq).pipe(
    tap((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
      }
    }),
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || (error.error && error.error.message === 'Session expired')) {
        localStorage.clear();
        router.navigate(['/login']);
      }
      return throwError(error);
    })
  );
};
