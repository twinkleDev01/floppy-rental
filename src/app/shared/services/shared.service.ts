import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  public base: BehaviorSubject<string> = new BehaviorSubject<string>('home');
  public page: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public last: BehaviorSubject<string> = new BehaviorSubject<string>('');
  url = environment.ApiBaseUrl;
  private TestmonialsUrl =
    environment.ApiBaseUrl + 'Testimonial/testimonial-list';

    couponListUrl = environment.ApiBaseUrl + 'Coupon/CouponList';

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

  getFooterList() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const httpOptions = {
      headers: headers,
    };
    return this.http
      .get(this.url + 'Footer/fetch-listData-footer', httpOptions)
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((err: any) => this.handleError(err))
      );
  }

  handleError(error: any): any {
    throw new Error('Method not implemented.');
  }

  getCouponList(): Observable<any> {
    return this.http.get<any>(this.couponListUrl); // Makes an HTTP GET request to the API
  }
}
