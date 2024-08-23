import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public base: BehaviorSubject<string> = new BehaviorSubject<string>('home');
  public page: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public last: BehaviorSubject<string> = new BehaviorSubject<string>('');

   private TestmonialsUrl = environment.ApiBaseUrl + 'Testimonial/testimonial-list'

  constructor(private http: HttpClient) {}

  // Method to update the full breadcrumb path
  updateBreadcrumb(url: string) {
    const segments = url.split('/').filter(Boolean); // Split the URL and remove empty segments
    this.base.next(segments[0] || 'home');
    if (segments.length > 1) {
      this.page.next(segments[1]);
      this.last.next(segments.slice(2).join(' ') || ''); // Join the remaining segments if they exist
    } else {
      this.page.next('');
      this.last.next('');
    }
  }

  getTestimonials(): Observable<any> {
    return this.http.get<any>(this.TestmonialsUrl);
  }
}
