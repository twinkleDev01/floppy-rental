import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  userBookingiUrl = environment.ApiBaseUrl + 'Order/orderlist/';
userDetailUrl = environment.ApiBaseUrl + 'User/get_profile_details_by_id/'
private updateProfileUrl = 'https://firstfloppy.asptask.in/api/User/update_user_profile';

  constructor(private http: HttpClient) { }

   // Method to get user bookings by userId
   getUserBooking(userId: number): Observable<any> {
    const url = `${this.userBookingiUrl}${userId}`; // Construct the API URL with userId
    return this.http.get(url); // Perform HTTP GET request
  }

  getProfileDetailsById(id: number): Observable<any> {
    const url = this.userDetailUrl + `${id}`;
    return this.http.get<any>(url);
  }

  // Method to update user profile
  updateUserProfile(payload: {
    userId: number;
    name: string;
    phone: string;
    pincode: string;
    locality: string;
    address: string;
    state: string;
    city: string;
    image: string; // This will be the base64 image string
  }): Observable<any> {
    return this.http.post<any>(this.updateProfileUrl, payload);
  }
  
}
