import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  userBookingiUrl = environment.ApiBaseUrl + 'Order/orderlist/';
userDetailUrl = environment.ApiBaseUrl + 'User/get_profile_details_by_id/'
private updateProfileUrl = environment.ApiBaseUrl + 'User/update_user_profile';
private deleteUrl = environment.ApiBaseUrl + 'Order/CancelOrderById'; 
private updateSlotUrl = environment.ApiBaseUrl + 'Order/UpdateOrder';
token:any
  constructor(private http: HttpClient) { 
    
  }

   // Method to get user bookings by userId
   getUserBooking(userId: number): Observable<any> {
    this.token = localStorage.getItem('token')
    const url = `${this.userBookingiUrl}${userId}`; // Construct the API URL with userId
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}` // Replace with your token logic
    });
  
    return this.http.get(url, { headers }); 
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

   // Method to delete an order by id
  //  deleteOrder(id: number,userEmail:string): Observable<Object> {
  //   const url = `${this.deleteUrl}/${id}`;
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json'
  //   });
  //   let params = new HttpParams().set('useremail',userEmail );
  //   return this.http.post(url, { headers });
  // }

  deleteOrder(id: number, userEmail: string, token: string): Observable<Object> {
    const url = `${this.deleteUrl}/${id}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Add Authorization header with the token
    });
    let params = new HttpParams().set('useremail', userEmail);
  
    // Sending headers and params in the post request
    return this.http.post(url, { params }, { headers });
  }
  


  // Method to update an order
  // updateOrder(orderData: { orderId: number, newDateTime: string, newSlot: string }): Observable<void> {
  //   return this.http.post<void>(this.updateSlotUrl, orderData);
  // }
  
  updateOrder(orderData: { orderId: number, newDateTime: string, newSlot: string }, token: string): Observable<void> {
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Add Authorization header with the token
    });

    // Sending headers and the orderData in the post request
    return this.http.post<void>(this.updateSlotUrl, orderData, { headers });
}
}
