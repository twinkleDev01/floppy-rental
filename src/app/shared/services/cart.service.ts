import { Injectable } from '@angular/core';
import { of } from 'rxjs';

const items = [ {
  serviceImage:'',
  title:'Niti Group Facility Services',
  price:14000,
  quantity:1,
  discount :1,
  tex:89,
  currency:'',
  }]

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor() { }

  getAllCartItems(){
    return of (items)
  }

}
