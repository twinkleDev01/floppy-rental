import { Injectable } from '@angular/core';
import { LoaderService } from './loader.service';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { finalize, Observable, tap } from 'rxjs';
import { AuthService } from './auth.service'; // Assuming AuthService handles logout
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class LoaderInterceptor implements HttpInterceptor {

  requestCounter = 0;

  constructor(
    private loaderService: LoaderService,
    private authService: AuthService, // Inject AuthService for logout
    private toastr: ToastrService
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.beginRequest();
    return next.handle(request).pipe(
      tap({
        error: (err: HttpErrorResponse) => {
          if (err instanceof HttpErrorResponse && err.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('userId')
            this.toastr.error('Your session has been expired, please login again')
            this.authService.updateLoginStatus(false);
          }
        }
      }),
      finalize(() => {
        this.endRequest();
      })
    );
  }

  private beginRequest(): void {
    this.requestCounter = Math.max(this.requestCounter, 0) + 1;
    if (this.requestCounter === 1) {
      this.loaderService.show(); // Show loader on API call
    }
  }

  private endRequest(): void {
    this.requestCounter = Math.max(this.requestCounter, 1) - 1;
    if (this.requestCounter === 0) {
      this.loaderService.hide(); // Hide loader on response
    }
  }
}
