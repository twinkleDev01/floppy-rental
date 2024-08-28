import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

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

  const couponCodes = [
    {
      offerType: 'bank',
      icon: '/images/bank_logo.png',
      title: '20% off on Kotak Silk Cards',
      sortDescription: '20% off up to INR 350',
      description: 'SAVE INR 350 On This Order',
    },
  ];

@Injectable({
  providedIn: 'root'
})
export class CartService {

  public cartLength: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  url = environment.ApiBaseUrl

  constructor(private http:HttpClient) { }

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

  deleteCart(CardItemId:any){
    // return of (cartItems)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const httpOptions = {
      headers: headers
    };
    return this.http.post(this.url+`Cart/delete-cart-item/${CardItemId}` ,httpOptions)
  }
  
  getOfferAndCoupon(){
    return of (couponCodes)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const httpOptions = {
      headers: headers
    };
    return this.http.get(this.url+'' ,httpOptions)
  }
  
}
