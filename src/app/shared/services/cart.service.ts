import { Injectable } from '@angular/core';
import { of } from 'rxjs';

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
    img:'https://static01.nyt.com/images/2023/07/10/well/00ASKWELL-EXPIRED-SKINCARE3/00ASKWELL-EXPIRED-SKINCARE3-articleLarge.jpg?quality=75&auto=webp&disable=upscale',
    productTitle: 'Niti Group Facility Services',
    price: 14000,
    currency: 'INR',
    quantity: 1,
    discount :1,
    tex:2,
  },
  {
    id:1,
    img:'https://static01.nyt.com/images/2023/07/10/well/00ASKWELL-EXPIRED-SKINCARE3/00ASKWELL-EXPIRED-SKINCARE3-articleLarge.jpg?quality=75&auto=webp&disable=upscale',
    productTitle: 'Niti Group Facility Services',
    price: 14000,
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

  constructor() { }

  getAllCartItems(){
    return of (cartItems)
  }
  
  getOfferAndCoupon(){
    return of (couponCodes)
  }

  getUpdateCartDetails(){
    return of (cartItems)
  }

}
