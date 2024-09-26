import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AddressListResponse, AddressPayload, AddressResponse, CouponListResponse, FooterListResponse, MetaTagResponse, TestimonialResponse } from './_model/shared.model';

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

    private addressSaveUrl = environment.ApiBaseUrl + 'Address/save-address';
    private metaTagUrl = 'https://firstfloppy.asptask.in/api/MetaTag/GetMetagByPageName';

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

  getTestimonials(): Observable<TestimonialResponse> {
    return this.http.get<TestimonialResponse>(this.TestmonialsUrl);
  }

  getFooterList(): Observable<FooterListResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const httpOptions = {
      headers: headers,
    };
    return this.http
      .get<FooterListResponse>(this.url + 'Footer/fetch-listData-footer', httpOptions)
      .pipe(
        map((res: FooterListResponse) => res), // Response is typed now
        catchError((err) => this.handleError(err))
      );
  }
  

  handleError(error: HttpErrorResponse): Observable<never> {
    // Handle the error, log it, or rethrow
    console.error('An error occurred:', error);
    return throwError(() => new Error(error.message || 'Unknown error'));
  }
  

  getCouponList(): Observable<CouponListResponse> {
    return this.http.get<CouponListResponse>(this.couponListUrl); // Makes an HTTP GET request to the API
  }

  saveAddress(addressPayload: AddressPayload): Observable<AddressResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<AddressResponse>(this.addressSaveUrl, addressPayload, { headers });
  }
  
  getAddressesByUser(userId: number): Observable<AddressListResponse> {
    const url = `${environment.ApiBaseUrl}Address/get-addresses-by-user/${userId}`;
    return this.http.get<AddressListResponse>(url);
  }

  getMetaTags(pageName: string): Observable<MetaTagResponse> {
    return this.http.get<MetaTagResponse>(`${this.metaTagUrl}/${pageName}`);
  }
}
