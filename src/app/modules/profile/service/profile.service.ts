import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { ApiResponsegetProfileDetailsById, UpdateUserProfilePayload, UpdateUserProfileResponse } from './profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  userBookingiUrl = environment.ApiBaseUrl + 'Order/orderlist/';
userDetailUrl = environment.ApiBaseUrl + 'User/get_profile_details_by_id/'
private updateProfileUrl = environment.ApiBaseUrl + 'User/update_user_profile';
private deleteUrl = environment.ApiBaseUrl + 'Order'; 
private updateSlotUrl = environment.ApiBaseUrl + 'Order';

  constructor(private http: HttpClient) { }

   // Method to get user bookings by userId
   getUserBooking(userId: number): Observable<any> {
    const url = `${this.userBookingiUrl}${userId}`; // Construct the API URL with userId
    return this.http.get(url); // Perform HTTP GET request
  }

  getProfileDetailsById(id: number): Observable<ApiResponsegetProfileDetailsById> {
    const url = this.userDetailUrl + `${id}`;
    return this.http.get<ApiResponsegetProfileDetailsById>(url);
  }

  // Method to update user profile
  updateUserProfile(payload: UpdateUserProfilePayload): Observable<UpdateUserProfileResponse> {
    return this.http.post<UpdateUserProfileResponse>(this.updateProfileUrl, payload);
}


   // Method to delete an order by id
   deleteOrder(id: number): Observable<object> {
    const url = `${this.deleteUrl}/${id}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, { headers });
  }
  


  // Method to update an order
  updateOrder(orderData: { orderId: number, newDateTime: string, newSlot: string }): Observable<void> {
    return this.http.post<void>(this.updateSlotUrl, orderData);
  }
  
}
