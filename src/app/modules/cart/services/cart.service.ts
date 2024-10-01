import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { ToastrService } from 'ngx-toastr';
import { isPlatformBrowser } from '@angular/common';

export interface cartItemsType {
  productTitle: string,
  price: number,
  currency: string,
  quantity: number,
  discount :number,
  tex:number,
}

export interface couponCodesType{
  offerType: string,
  icon: string,
  title: string,
  sortDescription:string,
  description: string,
}

const cartItems = [
  {
    id:0,
    img:'images/nitiGroup.svg',
    productTitle: 'Niti Group Facility Services',
    price: 14000,
    currency: 'INR',
    quantity: 1,
    discount :1,
    tex:2,
  },
  {
    id:1,
    img:'images/apSecurity.svg',
    productTitle: 'A.P.Securitas Pvt.Ltd.',
    price: 16000,
    currency: 'INR',
    quantity: 1,
    discount :1,
    tex:2,
  },
  {
    id:2,
    img:'images/addbivSecurer.svg',
    productTitle: 'Addbiv Securer Pvt.Ltd.',
    price: 18000,
    currency: 'INR',
    quantity: 1,
    discount :1,
    tex:2,
  },
  ];

  // const couponCodes = [
  //   {
  //     offerType: 'bank',
  //     icon: '/images/bank_logo.png',
  //     title: '20% off on Kotak Silk Cards',
  //     sortDescription: '20% off up to INR 350',
  //     description: 'SAVE INR 350 On This Order',
  //   },
  // ];

@Injectable({
  providedIn: 'root'
})
export class CartService {

  public cartLength: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  url = environment.ApiBaseUrl
  token:any // Replace with your actual token
  private paymentUrl = 'https://firstfloppy.asptask.in/api/Payments/create-order';
  private addCouponUrl = 'https://firstfloppy.asptask.in/api/Coupon/AddCoupon';
  isBrowser: boolean;

  constructor(private http:HttpClient,private toastr:ToastrService, @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if(this.isBrowser){ 
    this.token = localStorage.getItem("token");
    }
  }

  getAllCartItems(userId:any){
    // return of (cartItems)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const httpOptions = {
      headers: headers
    };
    return this.http.get(this.url+`Cart/cart-items/${userId}` ,httpOptions)
  }
  UpdateCartDetails(CardItemId:any){
    // return of (cartItems)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const httpOptions = {
      headers: headers
    };
    return this.http.post(this.url+`Cart/update-cart-items`,CardItemId ,httpOptions)
  }

  // deleteCart(CardItemId:any){
  //   // return of (cartItems)
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //   });
  //   const httpOptions = {
  //     headers: headers
  //   };
  //   return this.http.post(this.url+`Cart/delete-cart-item/${CardItemId}` ,httpOptions)
  // }
  
  // getOfferAndCoupon(){
  //   return of (couponCodes)
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //   });
  //   const httpOptions = {
  //     headers: headers
  //   };
  //   return this.http.get(this.url+'' ,httpOptions)
  // }

  // ---------- check out Api's ----------- //
  
  // saveOrderDetails(details:any){
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //   });
  //   const httpOptions = {
  //     headers: headers
  //   };
  //   return this.http.post(this.url+`Order/save_order_details`,details ,httpOptions)
  // }


  deleteCart(cardItemIds: any[]) {
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
    });
    const httpOptions = {
        headers: headers
    };

    return this.http.post(this.url + 'Cart/delete-cart-item', cardItemIds, httpOptions);
}

  

  saveOrderDetails(details: any) {
    console.log(this.token,"133")
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}` // Add the Authorization header
    });

    const httpOptions = {
      headers: headers
    };
    return this.http.post(this.url + 'Order/save_order_details', details, httpOptions);
  }

  createOrder(payload: any): Observable<any> {
    this.token = localStorage.getItem("token")
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.post<any>(this.paymentUrl, payload, { headers });
  }

  addCoupon(userId: number, couponId: number, totalPrice: number): Observable<any> {
    const payload = {
      userId: userId,
      couponId: couponId,
      totalPrice: totalPrice
    };

    return this.http.post(this.addCouponUrl, payload);
  }

  getCartItems(): Observable<any[]> {
    if(this.isBrowser){
    const userId = localStorage?.getItem('userId');
    
    // Return the observable so the caller can subscribe
    return this.getAllCartItems(userId).pipe(
      tap((res: any) => {
        const cartItems = res.data;
      }),
      catchError((err: any) => {
        // this.toastr.error(err.error.message);
        // Re-throw the error to handle it outside
        return throwError(err);
      })
    );
  }else{
    return of([])
  }
  }

  private apiUrl = 'https://firstfloppy.asptask.in/api/Payments/UpdatePaymentStatus';
  updatePaymentStatus(orderId: string, userId: number, isCashOnDelivery: boolean): Observable<any> {
    const payload = {
      orderId,
      userId,
      isCashOnDelivery
    };

    return this.http.post<any>(this.apiUrl, payload);
  }

  placeEnquiry(cartItems: any[]): Observable<any> {
    const token = localStorage.getItem("token");
  
    // Create HTTP headers with the authorization token
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  
    const httpOptions = {
      headers: headers
    };
  
    // Extract all `itemId` values from cartItems
    const cardItemIds = cartItems.map(item => item.id);
  
    // Send the array of item IDs directly in the request body
    return this.http.post(this.url + 'PlaceEnquiry/placeenquiry', cardItemIds, httpOptions);
  }
  
  
  
}
