import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { AuthService } from '../services/auth/auth.service';
import { LoaderService } from '../loader.service';
import { AlertsService } from '../services/alerts.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService, private loaderService: LoaderService, private alertsService: AlertsService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.loaderService.display(true);

        return next.handle(request).pipe(
            catchError(err => {
                if (err.status === 401 && err.error.error === 'invalid_token') {
                    //alert("Session expired!");
                    this.alertsService.state = true;
                    this.alertsService.showSessionExpiredModal();
                    // auto logout if 401 response returned from api
                    //this.authService.logout();
                    //location.reload(true);
                }
                if (err.status === 0) {
                   this.alertsService.state = true;
                    //show service is not available (SNA)
                    this.alertsService.state = true;
                   this.alertsService.showErrorModal("Service is currently not available. Please try again later.");
                }
                //const error = err.error.message || err.statusText;
                return throwError(err);
            }),
            finalize(() => {
                this.loaderService.display(false);
                return;
            })
        )
    }
}