import { Component, Inject, PLATFORM_ID, OnInit } from "@angular/core";
import { CartService } from "../../services/cart.service";
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { SharedService } from "../../../../shared/services/shared.service";
import { AuthService } from "../../../../shared/services/auth.service";
import { LoginComponent } from "../../../login/Components/login/login.component";
import { MatDialog } from "@angular/material/dialog";
import { ServicesDetailService } from "../../../services/service/services-detail.service";
import { isPlatformBrowser } from "@angular/common";


@Component({
  selector: 'app-my-cart',
  templateUrl: './my-cart.component.html',
  styleUrl: './my-cart.component.scss'
})
export class MyCartComponent implements OnInit {
  cartItems: any[] = []
  OfferAndCoupon: any
  isUpdate = false
  userId: any;
  noCouponAvailable = false
  couponCode!:number;
  discountedPrice: number | null = null; 
  initialAmountToCheckout = 0
  discountAmount: number | null = null;
  isBrowser!: boolean;

  constructor(private cartService: CartService, private router:Router, private toastr: ToastrService, private sharedService:SharedService, private auth:AuthService, private dialog: MatDialog, private service:ServicesDetailService, @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if(this.isBrowser){
    this.userId = localStorage.getItem("userId"); 
    }
  }

  ngOnInit(){
    if(this.isBrowser){
      // Subscribe to login status
      if(this.auth.isLoggedIn$){
      this.auth.isLoggedIn$.subscribe(isLoggedIn => {
       if(isLoggedIn){
this.updateCartItemsFromApi();
       }else{
        if(localStorage.getItem('userId')){
          this.updateCartItemsFromApi();
                }
                else{
                  this.cartItems = JSON.parse(localStorage.getItem('myCartItem')!)
                  this.cartService.cartLength.next(this.cartItems.length)
                }
       }
    })
  }
      // this.getCartItems()
      
    this.getCouponList()
    }
  }


  updateCartItemsFromApi() {
    this.cartService.getCartItems().subscribe(
      (cartItems: any) => {
        this.syncCartWithLocalStorage(cartItems.data);
        this.cartItems = cartItems?.data;
        this.cartService.cartLength.next(this.cartItems.length);
      },
      (error) => {
        console.error('Error fetching cart items from API:', error);
      }
    );
  }
  
  syncCartWithLocalStorage(apiCartItems: any[]) {
    // Get the cart items from localStorage
    let localCartItems = JSON.parse(localStorage.getItem('myCartItem') || '[]');
  
    // Update localStorage `id` based on matching `itemid`
    localCartItems = localCartItems.map((localItem: any) => {
      const matchedApiItem = apiCartItems.find(apiItem => apiItem.itemId === localItem.itemid);
  
      if (matchedApiItem) {
        localItem.id = matchedApiItem.id; // Update the id in the localStorage item
      }
  
      return localItem;
    });
  
    // Save the updated cart items back to localStorage
    localStorage.setItem('myCartItem', JSON.stringify(localCartItems));
  }


    
    updateCart() {
      if(this.isBrowser){
        this.isUpdate = true;
      if(localStorage.getItem('userId')){
      const payload = [
          ...this.cartItems
        ]
        this.cartService.UpdateCartDetails(payload).subscribe(
          (res:any)=>{
            // this.isUpdate = true;
            if(localStorage.getItem('userId')){
            this.cartService.getCartItems().subscribe(
              (cartItems:any) => {
                this.cartItems = cartItems?.data;

                 
              },
              (error) => {
                // Handle error here
              }
            );
          }
          // Update the localStorage based on the latest cart items and their quantities
          const localCartItems = JSON.parse(localStorage.getItem('myCartItem') || '[]');
          this.cartItems.forEach((updatedItem: any) => {
            const localItem = localCartItems.find((item: any) => item.id === updatedItem.id);
            if (localItem) {
              localItem.quantity = updatedItem.quantity; // Update the quantity
            }
          });
          localStorage.setItem('myCartItem', JSON.stringify(localCartItems));
             this.toastr.success(res.message)
          },
          (err)=>{
            // this.toastr.error(err.message)
          }
        )
      }else{
        this.isUpdate = true;
        localStorage.setItem('myCartItem',JSON.stringify(this.cartItems))
        if(this.cartItems.length){

          this.toastr.success('Item Update Successfully')
        }else{
          this.toastr.warning("Please add Item before update the cart")
        }
      }
    }
    }
 

  removeCartItems(item: any) {
    if(this.isBrowser){
  
    const index = this.cartItems.findIndex(cartItem => cartItem.id === item.id);
  
    if (index !== -1) {

        // Remove the item from cartItems
        this.cartItems.splice(index, 1);
  
        // Update local storage after removing the item
        const localCart = JSON.parse(localStorage.getItem('myCartItem') || '[]');
        const localIndex = localCart.find((localItem: any) => localItem.id === item.id);

        if (localIndex !== -1) {
            localCart.splice(localIndex, 1);
            localStorage.setItem('myCartItem', JSON.stringify(localCart));
            this.toastr.success("Cart item deleted successfully");
        } 
  
        this.cartService.cartLength.next(localCart.length);
    }
    this.cartService.deleteCart(item.id).subscribe(
        (res: any) => {
            this.toastr.success(res.message);
        },
        (err: any) => {
            // this.toastr.error(err.message);
        }
    );
  }
}


  proceedToCheckout(item: any) {
    if(this.isBrowser){
    if (this.isUpdate) {
      if(localStorage.getItem("userId")){ 
        this.updateCart()
        alert('Are you sure you want to checkout this item');
      // Store the necessary data in localStorage
      localStorage.setItem('myCartData', JSON.stringify({
        sabTotal: this.AmountToCheckout,
        sabTotalSaving: this.sabTotalSaving,
        AmountToCheckout: this.AmountToCheckout,
        productId: this.cartItems.map((item: any) => item.itemId ? item.itemId : item.itemid)
      }));
  
      // Navigate to the checkout page without navigation extras
      this.router.navigate(['cart/checkout']);
    }else{
      alert("Please log in before adding items to your cart.")
  this.dialog.open(LoginComponent, {
    width: '450',
    disableClose: true
  });
    }
    }
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
 
  get sabTotalSaving() {
    // Check if discountAmount is available (not null or undefined)
    if (this.discountAmount !== null && this.discountAmount !== undefined) {
      return this.discountAmount; // Use the discount amount from the API response
    }
  
    // Calculate the savings from the cart items if no API discount is available
    return this.cartItems.reduce((totalAmount, cart) => {
      return totalAmount + ((cart.itemRate * cart.quantity) * cart.discountPercent / 100);
    }, 0);
  }
  
  get totalTaxAmount() {
    return this.cartItems.reduce((totalAmount, cart) => {
      return totalAmount + (((cart.itemRate * cart.quantity)-((cart.itemRate * cart.quantity)*cart.discountPercent/100))  * cart.tax / 100);
    }, 0);
  }
  

  // Getter for total amount to checkout
  get AmountToCheckout() {
    if (this.discountedPrice !== null) {
      return this.discountedPrice; // Use the discounted price from the API response
    }
    this.initialAmountToCheckout = this.sabTotal - this.sabTotalSaving + this.totalTaxAmount;
    return this.sabTotal - this.sabTotalSaving + this.totalTaxAmount; // Original calculation if no coupon is applied
  }


  applyCoupon(couponCode: any) {
    if(couponCode== undefined){
      this.noCouponAvailable = true; return
    }
    if(this.isBrowser){
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
            this.discountAmount = response.data.discountAmount;
            this.discountedPrice = response.data.discountedPrice; // Set discounted price from the response
            this.toastr.success(response.message);
          }
        },
        (error) => {
          this.toastr.error(error.error.message);
        }
      );
    } else {
      // If the coupon amount is greater than the total price
      this.toastr.error('Invalid coupon code.');
    }
  }
  }

  OnCouponFilled() {
    this.noCouponAvailable=false
  }

  // Prevent leading whitespace
  preventLeadingWhitespace(event: KeyboardEvent): void {
    const input = (event.target as HTMLInputElement).value;
    // Prevent a space if the input is empty or has only leading whitespace
    if (event.key === ' ' && input.trim().length === 0) {
      event.preventDefault();
    }
  }
  
}
