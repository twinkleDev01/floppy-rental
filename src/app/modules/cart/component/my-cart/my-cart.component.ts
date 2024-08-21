import { Component } from "@angular/core";
import { CartService } from "../../services/cart.service";
import { Router } from "@angular/router";


@Component({
  selector: 'app-my-cart',
  templateUrl: './my-cart.component.html',
  styleUrl: './my-cart.component.scss'
})
export class MyCartComponent {
  cartItems: any[] = []
  OfferAndCoupon: any
  isUpdate: boolean = false
  constructor(private cartService: CartService, private router:Router) {
    this.getCartItems()
    this.getOfferAndCoupon()
  }

  getCartItems() {
    this.cartService.getAllCartItems().subscribe(data =>
      this.cartItems = data
    )
  }

  getOfferAndCoupon() {
    this.cartService.getOfferAndCoupon().subscribe((data: any) =>
      this.OfferAndCoupon = data
    )
  }

  onInputChange(value: string, input: HTMLInputElement): void {
    value = value.replace(/[^0-9]/g, '');
    if (value) {
      value = parseInt(value, 10).toString().padStart(2, '0');
    } else {
      return;
    }
    input.value = value;
  }
  // Handle blur to ensure formatting when input loses focus
  onBlur(cart: any): void {
    cart.quantity = parseInt(cart.quantity, 10).toString().padStart(2, '0');
  }

  // Handle quantity change (+/- buttons)
  changeQuantity(cart: any, change: number): void {
    let quantity = parseInt(cart.quantity, 10) || 0;
    quantity += change;
    if (quantity < 1) {
      quantity = 1;
    }
    cart.quantity = quantity.toString().padStart(2, '0');
  }

  removeCartItems(item: any) {
    console.log(item.id)
    this.cartItems = this.cartItems.filter(cart => cart.id != item.id)
  }

  updateCart() {
    this.cartService.getUpdateCartDetails().subscribe(res => {
      if (res) {
        this.isUpdate = true;
      }
    }
    )
  }

  proceedToCheckout(item: any) {
    console.log(item)
    const navigationExtras = {
      state: {
        item: item,
      }
    };
    this.router.navigate(['cart/checkout'], navigationExtras);
    if (this.isUpdate) {
      alert('Are you sure you want to checkout this item')
    } else {
      alert('Please press Update cart button first before continuing proceed to checkout')
    }
  }

  get sabTotal() {
    return this.cartItems.reduce((totalAmount, cart, index) => {
      return totalAmount + cart.price
    }, 0
    )
  }
  get sabTotalSaving() {
    return this.cartItems.reduce((totalAmount, cart, index) => {
      return totalAmount + (cart.price*cart.discount/100)
    }, 0
    )
  }
  //getter for tax amount
  get totalTaxAmount() {
    return this.cartItems.reduce((totalAmount, cart) => {
      return totalAmount + ((cart.price-(cart.price*cart.discount/100))  * cart.tex / 100);
    }, 0);
  }
  

  get AmountToCheckout() {
    return this.sabTotal - this.sabTotalSaving + this.totalTaxAmount
  }
}
