import { Injectable } from '@angular/core';
import { LoaderService } from './loader.service';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { finalize, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderInterceptor implements HttpInterceptor {

  requestCounter = 0;

  constructor(private loaderService: LoaderService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  
this.beginRequest();
    return next.handle(request).pipe(
      finalize(() => {
        this.endRequest();
      }) // Hide loader on response
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
      this.loaderService.hide()
     
    }
  }
}
