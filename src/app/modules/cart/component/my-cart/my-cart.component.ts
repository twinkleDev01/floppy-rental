import { Component } from "@angular/core";
import { CartService } from "../../services/cart.service";
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { SharedService } from "../../../../shared/services/shared.service";
import { AuthService } from "../../../../shared/services/auth.service";


@Component({
  selector: 'app-my-cart',
  templateUrl: './my-cart.component.html',
  styleUrl: './my-cart.component.scss'
})
export class MyCartComponent {
  cartItems: any[] = []
  OfferAndCoupon: any
  isUpdate: boolean = false
  userId = localStorage.getItem("userId");
  couponCode!:number;
  discountedPrice: number | null = null; 
  initialAmountToCheckout: number = 0
  discountAmount: number | null = null;
  constructor(private cartService: CartService, private router:Router, private toastr: ToastrService, private sharedService:SharedService, private auth:AuthService
  ) {
    
  }

  ngOnInit(){
      // Subscribe to login status
    
      // this.getCartItems()
     this.cartService.getCartItems().subscribe(
        (cartItems:any) => {
          this.cartItems = cartItems?.data;
        },
        (error) => {
          // Handle error here
        }
      );
    this.getCouponList()
  }
  
 
    
    updateCart() {
      const payload = [
        ...this.cartItems
      ]
      this.cartService.UpdateCartDetails(payload).subscribe(
        (res:any)=>{
          this.isUpdate = true;
          this.cartService.getCartItems().subscribe(
            (cartItems:any) => {
              this.cartItems = cartItems?.data;
            },
            (error) => {
              // Handle error here
            }
          );
           this.toastr.success(res.message)
        },
        (err)=>{
          this.toastr.error(err.message)
        }
      )
    }
  removeCartItems(item: any) {
    console.log(item)
    // Find the index of the item to remove using a different variable name
  const index = this.cartItems.findIndex(cartItem => cartItem === item);
  
  if (index !== -1) {
    // Remove the item from the array
    this.cartItems.splice(index, 1);
  }
    this.cartService.deleteCart(item.id).subscribe(
      (res:any)=>{
        this.toastr.success(res.message)
        // this.getCartItems()
      },
      (err:any) => {
        this.toastr.error(err.message)
      }
    )
  }
  proceedToCheckout(item: any) {
    console.log(item)
    alert('Are you sure you want to checkout this item')
    if (this.isUpdate) {
      const navigationExtras = {
        state: {
          sabTotal: this.sabTotal,
          sabTotalSaving: this.sabTotalSaving,
          AmountToCheckout: this.AmountToCheckout,
          productId: this.cartItems.map((item: any) => item.id),
        }
      };
      this.router.navigate(['cart/checkout'], navigationExtras);
    }
  }
  getCouponList() {
    this.sharedService.getCouponList().subscribe((response: any) =>
      this.OfferAndCoupon = response.data
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

    let quantity = parseInt(cart.quantity, 10) || 0; // Convert to an integer or default to 0 if invalid
    quantity += change; // Add or subtract the change
  
    // Allow the quantity to go to 0, but not below 0
    if (quantity < 1) {
      quantity = 1;
    }
  
    // Convert back to string and pad with leading zero if needed
    // cart.quantity = quantity.toString().padStart(2, '0');
    // Update the cart quantity directly as a number
  cart.quantity = quantity;  // Keep it as a number without padding
  }
  

  
  get sabTotal() {
    return this.cartItems.reduce((totalAmount, cart, index) => {
      return totalAmount + (cart.itemRate * cart.quantity)
    }, 0
    )
  }
  // get sabTotalSaving() {
  //   if (this.discountAmount !== null) {
  //     console.log("Discounted Price Applied:", this.discountAmount);
  //     return this.discountAmount; // Use the discounted price from the API response
  //   }
  //   return this.cartItems.reduce((totalAmount, cart, index) => {
  //     return totalAmount + ((cart.itemRate * cart.quantity)*cart.discountPercent/100)
  //   }, 0
  //   )
  // }
  //getter for tax amount
 
  get sabTotalSaving() {
    // Check if discountAmount is available (not null or undefined)
    if (this.discountAmount !== null && this.discountAmount !== undefined) {
      console.log("Discount Amount from API Applied:", this.discountAmount);
      return this.discountAmount; // Use the discount amount from the API response
    }
  
    // Calculate the savings from the cart items if no API discount is available
    return this.cartItems.reduce((totalAmount, cart) => {
      return totalAmount + ((cart.itemRate * cart.quantity) * cart.discountPercent / 100);
    }, 0);
  }
  
  get totalTaxAmount() {
    return this.cartItems.reduce((totalAmount, cart) => {
      console.log(totalAmount, cart)
      return totalAmount + (((cart.itemRate * cart.quantity)-((cart.itemRate * cart.quantity)*cart.discountPercent/100))  * cart.tax / 100);
    }, 0);
  }
  

  // Getter for total amount to checkout
  get AmountToCheckout() {
    if (this.discountedPrice !== null) {
      console.log("Discounted Price Applied:", this.discountedPrice);
      return this.discountedPrice; // Use the discounted price from the API response
    }
    this.initialAmountToCheckout = this.sabTotal - this.sabTotalSaving + this.totalTaxAmount;
    return this.sabTotal - this.sabTotalSaving + this.totalTaxAmount; // Original calculation if no coupon is applied
  }

  //  // Optionally, a setter for AmountToCheckout if needed
  //  set AmountToCheckout(value: number) {
  //   this._amountToCheckout = value;
  // }

  // applyCoupon(couponCode:any) {
  //   const userId = Number(localStorage.getItem('userId'));
  //   const couponId = Number(couponCode);
  //   const totalPrice = this.initialAmountToCheckout;

  //   const selectedCoupon = this.OfferAndCoupon.find((coupon: any) => coupon.couponId === couponId);

  //   this.cartService.addCoupon(userId, couponId, totalPrice).subscribe(
  //     (response) => {
  //       if(response){
  //         console.log('Coupon added successfully:', response);
  //         // this._amountToCheckout = response.data;
  //         if (selectedCoupon.amount <= totalPrice) {
  //         this.discountAmount = response.data.discountAmount;
  //         this.discountedPrice = response.data.discountedPrice; // Set discounted price from the response
  //         }
  //         // 100 - 60 =40 
  //         this.toastr.success(response.message)
  //       }
  //     },
  //     (error) => {
  //       console.error('Error adding coupon:', error);
  //       this.toastr.error(error.error.message)
  //     }
  //   );
  // }


  applyCoupon(couponCode: any) {
    const userId = Number(localStorage.getItem('userId'));
    const couponId = Number(couponCode);
    const totalPrice = this.initialAmountToCheckout;
  
    // Find the selected coupon from the available coupon list
    const selectedCoupon = this.OfferAndCoupon.find((coupon: any) => coupon.couponId === couponId);
  
    if (!selectedCoupon) {
      this.toastr.clear()
      this.toastr.error('Invalid coupon code.');
      return;
    }
  
    // Check if the coupon amount is less than or equal to the total price
    if (selectedCoupon.amount <= totalPrice) {
      this.cartService.addCoupon(userId, couponId, totalPrice).subscribe(
        (response) => {
          if (response) {
            console.log('Coupon added successfully:', response);
            this.discountAmount = response.data.discountAmount;
            this.discountedPrice = response.data.discountedPrice; // Set discounted price from the response
            this.toastr.success(response.message);
          }
        },
        (error) => {
          console.error('Error adding coupon:', error);
          this.toastr.error(error.error.message);
        }
      );
    } else {
      // If the coupon amount is greater than the total price
      this.toastr.error('Invalid coupon code.');
    }
  }
  
}
