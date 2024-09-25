import { Component, Inject, PLATFORM_ID } from "@angular/core";
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
export class MyCartComponent {
  cartItems: any[] = []
  OfferAndCoupon: any
  isUpdate: boolean = false
  userId: any;
  couponCode!:number;
  discountedPrice: number | null = null; 
  initialAmountToCheckout: number = 0
  discountAmount: number | null = null;
  isBrowser!: boolean;

  constructor(private cartService: CartService, private router:Router, private toastr: ToastrService, private sharedService:SharedService, private auth:AuthService, private dialog: MatDialog, private service:ServicesDetailService, @Inject(PLATFORM_ID) platformId: Object
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
        console.log('Login status changed:', isLoggedIn); // Log status changes
       if(isLoggedIn){
//         this.cartService.getCartItems().subscribe(
//           (cartItems:any) => {

// // Get the cart items from localStorage
// let localCartItems = JSON.parse(localStorage.getItem('myCartItem') || '[]');

// // Update localStorage `id` based on matching `itemid`
// localCartItems = localCartItems.map((localItem: any) => {
//  // Find matching item in the API response based on `itemId`
//  const matchedApiItem = cartItems.data.find((apiItem:any) => apiItem.itemId === localItem.itemid);

//  if (matchedApiItem) {
//    // Update the `id` in the local storage item with the API `id`
//    localItem.id = matchedApiItem.id;
//  }

//  return localItem; // Return the updated local item
// });

// // Save the updated cart items back to localStorage
// localStorage.setItem('myCartItem', JSON.stringify(localCartItems));
// console.log("Updated localStorage:", localCartItems);

//            console.log(cartItems.data)
//             this.cartItems = cartItems?.data;
//             this.cartService.cartLength.next(this.cartItems.length)
//           },
//           (error) => {
//             // Handle error here
//           }
//         )
this.updateCartItemsFromApi();
       }
    })
  }
      // this.getCartItems()
      if(localStorage.getItem('userId')){
//        this.cartService.getCartItems().subscribe(
//            (cartItems:any) => {

// // Get the cart items from localStorage
// let localCartItems = JSON.parse(localStorage.getItem('myCartItem') || '[]');

// // Update localStorage `id` based on matching `itemid`
// localCartItems = localCartItems.map((localItem: any) => {
//   // Find matching item in the API response based on `itemId`
//   const matchedApiItem = cartItems.data.find((apiItem:any) => apiItem.itemId === localItem.itemid);

//   if (matchedApiItem) {
//     // Update the `id` in the local storage item with the API `id`
//     localItem.id = matchedApiItem.id;
//   }

//   return localItem; // Return the updated local item
// });

// // Save the updated cart items back to localStorage
// localStorage.setItem('myCartItem', JSON.stringify(localCartItems));
// console.log("Updated localStorage:", localCartItems);

//             console.log(cartItems.data)
//              this.cartItems = cartItems?.data;
//              this.cartService.cartLength.next(this.cartItems.length)
//            },
//            (error) => {
//              // Handle error here
//            }
//          )
this.updateCartItemsFromApi();
      }
      else{
        this.cartItems = JSON.parse(localStorage.getItem('myCartItem')!)
        console.log(this.cartItems,"48")
        this.cartService.cartLength.next(this.cartItems.length)
      }
    this.getCouponList()
    }
  }


  updateCartItemsFromApi() {
    this.cartService.getCartItems().subscribe(
      (cartItems: any) => {
        this.syncCartWithLocalStorage(cartItems.data);
        this.cartItems = cartItems?.data;
        this.cartService.cartLength.next(this.cartItems.length);
        console.log('Cart items from API:', this.cartItems);
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
    console.log('Updated localStorage:', localCartItems);
  }


    
    updateCart() {
      if(this.isBrowser){
      if(localStorage.getItem('userId')){
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
            // this.toastr.error(err.message)
          }
        )
      }else{
        this.isUpdate = true;
        localStorage.setItem('myCartItem',JSON.stringify(this.cartItems))
        this.toastr.success('Item Update Successfully')
      }
    }
    }
 

  removeCartItems(item: any) {
    if(this.isBrowser){
    console.log(item);
  
    const index = this.cartItems.findIndex(cartItem => cartItem.id === item.id);
  
    if (index !== -1) {
        console.log("Item found in cartItems");

        // Remove the item from cartItems
        this.cartItems.splice(index, 1);
  
        // Update local storage after removing the item
        let localCart = JSON.parse(localStorage.getItem('myCartItem') || '[]');
        console.log(localCart, "Local Cart Before Removal");
        const localIndex = localCart.find((localItem: any) => localItem.id === item.id);
        console.log(localIndex,item.itemId, "Local Index of Item to Remove");

        if (localIndex !== -1) {
            console.log("Removing item from localCart");
            localCart.splice(localIndex, 1);
            localStorage.setItem('myCartItem', JSON.stringify(localCart));
        } else {
            console.log("Item not found in localCart");
        }
  
        this.cartService.cartLength.next(localCart.length);
    }
  console.log(item.id,"143")
    this.cartService.deleteCart(item.id).subscribe(
        (res: any) => {
            this.toastr.success(res.message);
        },
        (err: any) => {
            this.toastr.error(err.message);
        }
    );
  }
}

  
 
  // proceedToCheckout(item: any) {
  //   console.log(item)
  //   alert('Are you sure you want to checkout this item')
  //   if (this.isUpdate) {
  //     const navigationExtras = {
  //       state: {
  //         sabTotal: this.sabTotal,
  //         sabTotalSaving: this.sabTotalSaving,
  //         AmountToCheckout: this.AmountToCheckout,
  //         productId: this.cartItems.map((item: any) => item.id),
  //       }
  //     };
  //     this.router.navigate(['cart/checkout'], navigationExtras);
  //   }
  // }

  proceedToCheckout(item: any) {
    if(this.isBrowser){
    console.log(JSON.stringify(this.cartItems), "127");
    if (this.isUpdate) {
      if(localStorage.getItem("userId")){ 
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


  applyCoupon(couponCode: any) {
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

  
  
}
