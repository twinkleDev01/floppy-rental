import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  userBookingiUrl = environment.ApiBaseUrl + 'Order/orderlist/';

  constructor(private http: HttpClient) { }

   // Method to get user bookings by userId
   getUserBooking(userId: number): Observable<any> {
    const url = `${this.userBookingiUrl}${userId}`; // Construct the API URL with userId
    return this.http.get(url); // Perform HTTP GET request
  }
}
