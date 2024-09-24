import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DatePickerDialogComponent } from '../../../../shared/components/date-picker-dialog/date-picker-dialog.component';
import { LocationDialogComponent } from '../../../../shared/components/location-dialog/location-dialog.component';
import { CartService } from '../../services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import axios from 'axios';
import {load} from '@cashfreepayments/cashfree-js';
import { City, Country, State } from 'country-state-city';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
  providers: [DatePipe]  // Add DatePipe to providers
})
export class CheckoutComponent {
   cities:any[] =  [];

  states: any = [];

  checkout: FormGroup;
  selectedPaymentOption: string = 'option5'; 
  sabTotalSaving:any
  AmountToCheckout:any
   sabTotal:any;
   selectedCountryCode:any;
   selectedStateCode:any;
   isBrowser!: boolean;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private cartService:CartService,
    private toaster:ToastrService,
    private datePipe: DatePipe,
    @Inject(PLATFORM_ID) platformId: Object
  ){
    this.checkout = this.fb.group({
    firstName: ['',[Validators.required]],
    lastName : [''],
    address: ['',[Validators.required]],
    state : ['',[Validators.required]],
    country : ['',[Validators.required]],
    city : ['',[Validators.required]],
    zipCode : ['',[Validators.required,Validators.maxLength(8)]],
    date : ['',[Validators.required]],
    productId : ['',[Validators.required]],
    slot : ['',[Validators.required]],
    paymentMethod:['Cash Free'],
    // nameOnCard : ['',[Validators.required]],
    // cardNumber : ['',[Validators.required,Validators.pattern('^[0-9]{16}$')]],
    // expiryDate: ['', [Validators.required, Validators.pattern('(0[1-9]|1[0-2])\\/(\\d{2})')]],
    // cvc: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]],
    nameOnCard : [''],
    cardNumber : [''],
    expiryDate: [''],
    cvc: [''],
    phone : ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(10), Validators.maxLength(10)]],
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(
          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
        ),
      ],
    ],
  
  })

  // CartItems
  // const navigation = this.router.getCurrentNavigation();
  // this.sabTotal = navigation?.extras?.state?.['sabTotal']; 
  // this.sabTotalSaving = navigation?.extras?.state?.['sabTotalSaving']; 
  // this.AmountToCheckout = navigation?.extras?.state?.['AmountToCheckout']; 
  // const productIdFromState = navigation?.extras?.state?.['productId'];
  // this.checkout.get('productId')?.setValue(productIdFromState);
  // console.log(this.sabTotal,this.sabTotalSaving,this.AmountToCheckout);
  if(this.isBrowser){
  const myCartData = localStorage.getItem('myCartData');
  if (myCartData) {
    const data = JSON.parse(myCartData);
    this.sabTotal = data.sabTotal;
    this.sabTotalSaving = data.sabTotalSaving;
    this.AmountToCheckout = data.AmountToCheckout;
    this.checkout.get('productId')?.setValue(data.productId);
  }
}
}


  noSpace(event: any) {
    if (event.keyCode === 32 && !event.target.value) return false;
    return true;
  }
  get cardNumber() {
    return this.checkout.get('cardNumber');
  }

  get expiryDate() {
    return this.checkout.get('expiryDate');
  }

  get cvc() {
    return this.checkout.get('cvc');
  }
  onSubmit(){
    this.checkout?.markAllAsTouched();
    if(this.checkout?.invalid)return;
    console.log(this.checkout.value);
    // const payload = {
    //   ...this.checkout.value,
    //   userId: localStorage.getItem('userId'),
    //   totalAmount: this.sabTotal,
    //   totalQuantity: this.AmountToCheckout,
    //   paymentStatus: null ||'',
    //   coupon: null || '',
    // }
    // this.cartService.saveOrderDetails(payload).subscribe(
    //   (res:any)=>{
    //     this.toaster.success(res.message)
    //     this.cartService.cartLength.next(0);
    //     localStorage.removeItem('cartItems')
    //     this.router.navigate(['profile/my-booking']);
    //   },
    //   (err)=>{
    //     this.toaster.error(err.message)
    //   }
    // )
  }
  // dateDialog
  openDateTimePicker(): void {
    console.log('Selected date and time:',this.checkout.get('date')?.value,"130");
    const dialogRef = this.dialog.open(DatePickerDialogComponent, {
      disableClose: true, // Prevent closing the dialog by clicking outside or pressing ESC
       width: '80%'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Selected date and time:',this.checkout.get('date')?.value, result,"130");
        const selectedDate = result.date
        result.date = this.convertDate(result.date)
        this.checkout.get('date')?.setValue(selectedDate);
        this.checkout.get('slot')?.setValue(result.time);
        console.log(result.date);
      }
    });
  }
  // LocationDialog
  openLocationDialog(): void {
    const dialogRef = this.dialog.open(LocationDialogComponent, {
      // width: '500px',
      panelClass: 'location-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Selected Location:', result);
        this.selectedCountryCode = result.countryCode
        this.selectedStateCode = result.selectedStateCode || result.stateCode
        // Patch form with the returned location data
      this.checkout.patchValue({
        address: result.address || result.location,
        city: result.area,
        country: result.country,
        state: result.state,
        zipCode: result.zipCode || result.pinCode, // Assuming zipCode is part of the result
        // Add more fields here as needed
      });
      this.loadStates(result.countryCode)
       console.log(this.checkout.value,"166")
      }
      if(this.selectedStateCode){
        this.loadCities(this.selectedStateCode);
      }
    });
  }

  loadStates(countryCode: string) {
    const allStates = State.getStatesOfCountry(countryCode);
    this.states = allStates.map(state => state.name);
    this.cities = []; // Clear cities when the country changes
  }

  onStateChange() {
    const selectedState = State.getStatesOfCountry(this.selectedCountryCode || '').find(s => s.name === this.checkout.value.state);
    if (selectedState) {
      this.selectedStateCode = selectedState.isoCode;
      this.loadCities(this.selectedStateCode);
    }
  }

  loadCities(stateCode: string) {
    if (this.selectedCountryCode) {
      const allCities = City.getCitiesOfState(this.selectedCountryCode, stateCode);
      this.cities = allCities.map(city => city.name);
    }
    console.log(this.cities,"179")
  }

  convertDate(dateString: string): string | null {
    const parsedDate = new Date(dateString);

    // Check if the date is valid
    if (isNaN(parsedDate.getTime())) {
      console.error("Invalid date format");
      return null;
    }

    // Format the date using DatePipe in ISO format
    return this.datePipe.transform(parsedDate, 'yyyy-MM-ddTHH:mm:ss.SSSZ');
  }

  // async initiatePayment() {
  //   try {
  //     // Define Cashfree credentials and order details
  //     const clientId = '173592e56931e47e86504eeae4295371';
  //     const clientSecret = 'a6b80fb453866ee05b17ab02f65d72fa7bea8d4a';
  //     const orderDetails = {
  //       orderId: 'unique_order_id',
  //       orderAmount: 1000, // Example amount
  //       orderCurrency: 'INR',
  //       orderNote: 'Payment for Order',
  //       customerEmail: 'customer@example.com',
  //       customerPhone: '1234567890'
  //     };

  //     // Create an order with Cashfree
  //     const response = await axios.post('https://api.cashfree.com/api/v2/checkout/orders', {
  //       ...orderDetails
  //     }, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${clientSecret}`
  //       }
  //     });

  //     const { orderId, orderToken } = response.data;

  //     // Initialize Cashfree Checkout
  //     const cf = (window as any).CashfreeCheckout();

  //     cf.initPayment({
  //       order_id: orderId,
  //       order_token: orderToken,
  //       // Add other necessary parameters
  //       callback: ((response:any) => {
  //         if (response.success) {
  //           console.log('Payment successful', response);
  //           // Handle success scenario here
  //         } else {
  //           console.error('Payment failed', response);
  //           // Handle failure scenario here
  //         }
  //       })
  //     });
  //   } catch (error) {
  //     console.error('Error initiating payment:', error);
  //   }
  // }

  // createNewOrder() {
  //   const payload = {
  //     customerId: localStorage.getItem('userId'),
  //     phone: '9876543210',
  //     orderId: 'ORD001',
  //     amount: 1,
  //     currency: 'INR',
  //     returnUrl: 'http://localhost:4200/profile/my-booking'
  //   };

  //   this.cartService.createOrder(payload).subscribe(
  //     async (response) => {
  //       console.log('Order created successfully', response?.payment_session_id);

  //       // Ensure that Cashfree SDK is loaded properly
  //       try {
  //         const cashfree = await load({
  //           mode: 'sandbox' // or 'production'
  //         });

  //         // Ensure that paymentSessionId is correctly obtained
  //         const checkoutOptions = {
  //           paymentSessionId: response.payment_session_id, // Use cf_order_id for the payment session ID
  //           redirectTarget: "_self" ,// optional (_self, _blank, or _top),
  //           appearance: {
  //             width: "425px",
  //             height: "700px",
  //         },
  //         };

  //         console.log('Cashfree SDK loaded', cashfree);

  //         // Use the correct method from Cashfree SDK to initiate checkout
  //         // cashfree.checkout(checkoutOptions);
  //         cashfree.checkout(checkoutOptions).then((result:any) => {
  //           console.log(result, localStorage.setItem('result', JSON.stringify(result)))
  //           if (result.error) {
  //             // This will be true when there is any error during the payment
  //             console.log("There is some payment error, Check for Payment Status");
  //             console.log(result.error);
  //           }
  //           if (result.redirect) {
  //             // This will be true when the payment redirection page couldnt be opened in the same window
  //             // This is an exceptional case only when the page is opened inside an inAppBrowser
  //             // In this case the customer will be redirected to return url once payment is completed
  //             console.log("Payment will be redirected");
  //              // Save necessary information for handling after redirect
  //   localStorage.setItem('paymentRedirect', 'true');
  //           }
  //           if (result.paymentDetails) {
  //              // Capture the payment status
  //         const paymentStatus = result.paymentDetails.paymentMessage;
  //             // This will be called whenever the payment is completed irrespective of transaction status
  //             console.log("Payment has been completed, Check for Payment Status");
  //             console.log(result.paymentDetails.paymentMessage);
  //             // Prepare payload with payment details
  //         const payload = {
  //           ...this.checkout.value,
  //           userId: localStorage.getItem('userId'),
  //           totalAmount: this.sabTotal,
  //           totalQuantity: this.AmountToCheckout,
  //           paymentStatus: paymentStatus || '',
  //           coupon: null || '',
  //         };

  //          // Save the order details after successful payment
  //         this.cartService.saveOrderDetails(payload).subscribe(
  //           (res: any) => {
  //             this.toaster.success(res.message);
  //             this.cartService.cartLength.next(0);
  //             localStorage.removeItem('cartItems');
  //             this.router.navigate(['profile/my-booking']);
  //           },
  //           (err) => {
  //             this.toaster.error(err.message);
  //           }
  //         );
  //           }
  //      });
  //         console.log(cashfree.version(),"version");
  //       } catch (error) {
  //         console.error('Error loading Cashfree SDK', error);
  //       }
  //     },
  //     (error) => {
  //       console.error('Error creating order', error);
  //     }
  //   );
  // }

  createNewOrder() {
    if(this.isBrowser){
    const orderId = `ord_id_${Date.now()}`; 
    // const payload = {
    //   customerId: localStorage.getItem('userId'),
    //   phone: '9876543210',
    //   orderId,
    //   amount: 1,
    //   currency: 'INR',
    //   returnUrl: `${window.location.origin}/profile/my-booking?orderId=${this.order_id}`
    // };
    console.log(this.checkout.value,)
    this.checkout?.markAllAsTouched();
    if(this.checkout?.invalid)return;
    const payload = {
      userId: localStorage.getItem('userId') || 0, // Ensure userId is a number or default to 0
      totalAmount: this.sabTotal || 0, // Ensure totalAmount is a number or default to 0
      totalQuantity:  0, // Ensure totalQuantity is a number or default to 0
      firstName: this.checkout.value.firstName || 'string', // Assuming checkout form has firstName
      lastName: this.checkout.value.lastName || 'string',  // Assuming checkout form has lastName
      address: this.checkout.value.address || 'string',  // Assuming checkout form has address
      email: this.checkout.value.email || 'string',  // Assuming checkout form has email
      phone: this.checkout.value.phone,  // Phone from the original second payload
      state: this.checkout.value.state || 'string',  // Assuming checkout form has state
      city: this.checkout.value.city || 'string',  // Assuming checkout form has city
      zipCode: this.checkout.value.zipCode || 'string',  // Assuming checkout form has zipCode
      country: this.checkout.value.country || 'string',  // Assuming checkout form has country
      date: new Date().toISOString(),  // Current date and time in ISO format
      slot: this.checkout.value.slot || 'string',  // Assuming checkout form has slot
      coupon: this.checkout.value.coupon || '',  // Assuming checkout form has coupon
      productId: this.checkout.value.productId,  // Assuming you need to map productId(s) here
      currency: 'INR',  // Currency from the original second payload
      returnUrl: `${window.location.origin}/profile/my-booking` // returnUrl from the original second payload
      // returnUrl: `${window.location.origin}/profile/my-booking?orderId=${this.order_id}`
    };
    
    // localStorage.setItem('payement', JSON.stringify(payload))

    this.cartService.createOrder(payload).subscribe(
      async (response) => {
        console.log('Order created successfully', response?.paymentSessionId);
        localStorage.setItem('orderId', response?.orderId)
        // Ensure that Cashfree SDK is loaded properly
        try {
          const cashfree = await load({
            mode: 'sandbox' // or 'production'
          });

          // Ensure that paymentSessionId is correctly obtained
          const checkoutOptions = {
            paymentSessionId: response.paymentSessionId, // Use cf_order_id for the payment session ID
            redirectTarget: "_self" ,// optional (_self, _blank, or _top),
            appearance: {
              width: "425px",
              height: "700px",
          },
          };

          console.log('Cashfree SDK loaded', cashfree);

          // Use the correct method from Cashfree SDK to initiate checkout
          // cashfree.checkout(checkoutOptions);
          cashfree.checkout(checkoutOptions).then((result:any) => {
            if (result.error) {
              // This will be true when there is any error during the payment
              console.log("There is some payment error, Check for Payment Status");
              console.log(result.error);
            }
            if (result.redirect) {
              // This will be true when the payment redirection page couldnt be opened in the same window
              // This is an exceptional case only when the page is opened inside an inAppBrowser
              // In this case the customer will be redirected to return url once payment is completed
              console.log("Payment will be redirected");
            }
       });
          console.log(cashfree.version(),"version");
        } catch (error) {
          console.error('Error loading Cashfree SDK', error);
        }
      },
      (error) => {
        console.error('Error creating order', error);
      }
    );
  }
  }
}
