import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DatePickerDialogComponent } from '../../../../shared/components/date-picker-dialog/date-picker-dialog.component';
import { LocationDialogComponent } from '../../../../shared/components/location-dialog/location-dialog.component';
import { CartService } from '../../services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import axios from 'axios';
import {load} from '@cashfreepayments/cashfree-js';
import { City, Country, State } from 'country-state-city';
import { ProfileService } from '../../../profile/service/profile.service';
import { HttpClient } from '@angular/common/http';
import { response } from 'express';
import { LoginComponent } from '../../../login/Components/login/login.component';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
  providers: [DatePipe]  // Add DatePipe to providers
})
export class CheckoutComponent {
   cities:any[] =  [];

  states: any = [];
  latitude:any =0;
  longitude:any =0;

  checkout: FormGroup;
  selectedPaymentOption = 'option5'; 
  sabTotalSaving:any
  AmountToCheckout:any
   sabTotal:any;
   selectedCountryCode:any;
   selectedStateCode:any;
   isBrowser!: boolean;
   isCashOnDelivery:boolean = false;
   selectedDateIst:any
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private cartService:CartService,
    private toastr:ToastrService,
    private datePipe: DatePipe,
    @Inject(PLATFORM_ID) platformId: object,
    private profileService:ProfileService,
    private http:HttpClient
  ){
    this.isBrowser = isPlatformBrowser(platformId);
    this.checkout = this.fb.group({
    firstName: ['',[Validators.required]],
    lastName : [''],
    address: ['',[Validators.required]],
    state : ['',[Validators.required]],
    country : ['India',[Validators.required]],
    city : ['',[Validators.required]],
    zipCode : ['',[Validators.required,Validators.maxLength(8)]],
    date : ['',[Validators.required]],
    productId : [''],
    vendorId : [''],
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
}

products:any;
ngOnInit(){
  if(this.isBrowser){
    const myCartData = localStorage.getItem('myCartData');
    if (myCartData) {
      const data = JSON.parse(myCartData);
      this.sabTotal = data.sabTotal;
      this.sabTotalSaving = data.sabTotalSaving;
      this.AmountToCheckout = data.AmountToCheckout;
      this.products = data.products
      this.checkout.get('productId')?.setValue(data.productId);
      this.checkout.get('vendorId')?.setValue(data.venderId);
    }

     // Optional: listen to changes
     this.checkout.get('paymentMethod')?.valueChanges.subscribe(value => {
      console.log('Selected Payment Method:', value);
      if(value === 'Cash On Delivery'){
        this.isCashOnDelivery = true
        console.log(this.isCashOnDelivery,"105")
      }else{
        this.isCashOnDelivery = false;
        console.log(this.isCashOnDelivery,"108")
      }
    });

    this.getUserDetailById();
    this.getCurrentLocation();
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
  slot:any
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
        const selectedDate = result.date;
        this.slot = result.time
        const formattedDate = this.formatDate(selectedDate);
        console.log(selectedDate,"136")
        result.date = this.convertDate(result.date)

        const slotArray = [this.slot]; // Wrap the single time slot in an array

        // Now combine the formatted date and the time slots
        const dateWithSlots = `${formattedDate}, ${slotArray.join(', ')}`;

        this.checkout.get('date')?.setValue(dateWithSlots);
        this.checkout.get('slot')?.setValue(result.time);
        this.selectedDateIst = result.date
       // Assuming this.selectedDateIst is a date string in IST (e.g., "2024-11-30T00:00:00")
this.selectedDateIst = new Date(this.selectedDateIst);

// Get the components of the date manually
const year = this.selectedDateIst.getFullYear();
const month = String(this.selectedDateIst.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JS
const day = String(this.selectedDateIst.getDate()).padStart(2, '0');
const hours = String(this.selectedDateIst.getHours()).padStart(2, '0');
const minutes = String(this.selectedDateIst.getMinutes()).padStart(2, '0');
const seconds = String(this.selectedDateIst.getSeconds()).padStart(2, '0');

// Construct the desired "YYYY-MM-DDTHH:mm:ss" format
this.selectedDateIst = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

console.log('Formatted Date:', this.selectedDateIst);

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
      this.loadStates(result.countryCode);
      }
      if(this.selectedStateCode){
        this.loadCities(this.selectedStateCode);
      }
    });
  }

  loadStates(countryCode: string) {
    const allStates = State.getStatesOfCountry(countryCode);
    this.states = allStates.map(state => state.name);
    console.log(this.states,"190")
    this.cities = []; // Clear cities when the country changes
  }

  onStateChange() {
    const selectedState = State.getStatesOfCountry(this.selectedCountryCode || '').find(s => s.name === this.checkout.value.state);
    if (selectedState) {
      this.selectedStateCode = selectedState.isoCode;
      this.loadCities(this.selectedStateCode);
    }
  }

  // loadCities(stateCode: string) {
  //   console.log(this.selectedCountryCode, stateCode,"204")
  //   if (this.selectedCountryCode) {
  //     const allCities = City.getCitiesOfState(this.selectedCountryCode, stateCode);
  //     this.cities = allCities.map(city => city.name);
  //     console.log(this.cities,"208")
  //   }
  // }


  loadCities(stateCode: string) {
    console.log(`Selected Country Code: ${this.selectedCountryCode}, State Code: ${stateCode}`, "204");
    this.selectedCountryCode = this.selectedCountryCode?this.selectedCountryCode:'IN'
    if (this.selectedCountryCode) {
      const allCities = City.getCitiesOfState(this.selectedCountryCode, stateCode);
      console.log(`All Cities Retrieved: `, allCities); // Log the raw cities data
  
      if (allCities.length === 0) {
        console.warn(`No cities found for country code: ${this.selectedCountryCode}, state code: ${stateCode}`);
      }
      
      this.cities = allCities.map(city => city.name);
      console.log(this.cities, "208"); // Log the mapped cities
    } else {
      console.error('Selected country code is missing.');
    }
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

  createNewOrder() {
    if(this.isBrowser){
 
    const orderId = `ord_id_${Date.now()}`;
    this.checkout?.markAllAsTouched();
    if(this.checkout?.invalid)return;

    
    const payload = {
      userId: localStorage.getItem('userId') || 0, // Ensure userId is a number or default to 0
      totalAmount: parseFloat(this.sabTotal.toFixed(2)) || 0, // Ensure totalAmount is a number or default to 0
      totalQuantity:  0, // Ensure totalQuantity is a number or default to 0
      firstName: this.extractFirstName(this.checkout.value.firstName) || 'string', // Assuming checkout form has firstName
      lastName: this.extractLastName(this.checkout.value.firstName) || 'string',  // Assuming checkout form has lastName
      address: this.checkout.value.address || 'string',  // Assuming checkout form has address
      email: this.checkout.value.email || 'string',  // Assuming checkout form has email
      phone: this.checkout.value.phone,  // Phone from the original second payload
      state: this.checkout.value.state || 'string',  // Assuming checkout form has state
      city: this.checkout.value.city || 'string',  // Assuming checkout form has city
      zipCode: this.checkout.value.zipCode || 'string',  // Assuming checkout form has zipCode
      country: 'India',  // Assuming checkout form has country
      date: this.selectedDateIst,  // Current date and time in ISO format
      slot: this.checkout.value.slot || 'string',  // Assuming checkout form has slot
      coupon: this.checkout.value.coupon || '',  // Assuming checkout form has coupon
      products: this.products,  // Assuming you need to map productId(s) here
      currency: 'INR',  // Currency from the original second payload
      returnUrl: `${window.location.origin}/profile/my-booking`, // returnUrl from the original second payload
      isCashOnDelivery:this.isCashOnDelivery,
      latitude: this.latitude.toString(),
      longitude: this.longitude.toString(),
    };
    
    localStorage.setItem('isCashOnDelivery', JSON.stringify(this.isCashOnDelivery));

    this.cartService.createOrder(payload).subscribe(
      async (response) => {
        console.log(response,"294")
        if (response?.paymentMode === 'Cash on Delivery') {
          localStorage.setItem('orderId', response.orderId)
          localStorage.setItem('paymentMode', response.paymentMode)
          localStorage.setItem('paymentOrderReferenceId', response.paymentOrderReferenceId)
          this.router.navigateByUrl('/profile/my-booking');
          localStorage.removeItem('myCartItem')
          console.log(this.checkout.value)
          this.cartService.cartLength.next(0);
          return;
        }
        console.log('Order created successfully', response?.paymentSessionId);
        localStorage.setItem('orderId', response?.orderId)
        localStorage.setItem('paymentMode', response.paymentMode)
          localStorage.setItem('paymentOrderReferenceId', response.paymentOrderReferenceId)
          localStorage.removeItem('myCartItem')
          console.log(this.checkout.value)
          this.cartService.cartLength.next(0);
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
          // Check if status code is 401 and show toastr
    if (error.status === 401) {
      // this.toastr.error('Unauthorized: Please log in again.');
      this.dialog.open(LoginComponent, {
        width: '450',
        disableClose: true
      });
    } else {
      this.toastr.error('An error occurred while creating the order.', 'Error');
    }
      }
    );
  }
  }

  getUserDetailById(): void {
    if(this.isBrowser){
    const id = localStorage.getItem('userId');
    if (id) {
      this.profileService.getProfileDetailsById(Number(id)).subscribe(
        (response: any) => {
       console.log(response.data,"306")
       const formValue = response.data
       this.checkout.patchValue({
        firstName: formValue.name,  // Assuming the first name is derived from the full name
        // lastName: formValue.name,   // Assuming the last name is derived from the full name
        address: formValue.address,
        state: formValue.state,
        country: this.selectedCountry||'India',  // You can hardcode the country or map it if available in the API
        city: formValue.city,
        zipCode: formValue.pincode,
        phone: formValue.mobileNo.slice(-10),  
        email: formValue.emailId
      });
      console.log(this.checkout.value, formValue.city, "369")
        },
        (error) => {
          console.error('Error fetching profile details:', error);
          // this.toastr.error('Failed to load profile details');
        }
      );
    }
  }
  }

  extractFirstName(fullName: string): string {
    return fullName ? fullName.split(' ')[0] : '';  // Extract first name
  }
  
  extractLastName(fullName: string): string {
    const nameParts = fullName ? fullName.split(' ') : [];
    return nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';  // Extract last name
  }

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.latitude = position.coords.latitude;
this.longitude = position.coords.longitude;
        // Call reverse geocoding API to convert lat, lng to address
        this.getCountryFromCoordinates(lat, lng);
      }, (error) => {
        this.loadStates('IN')
        const selectedState = State.getStatesOfCountry('IN');
        if (selectedState) {
          console.log("424")
          const  isoCode = selectedState[0].isoCode;
                this.loadCities(isoCode);
              }
        console.error('Error fetching location: ', error);
      });
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }

  selectedCountry:any
  getCountryFromCoordinates(lat: number, lng: number) {
    const apiKey = 'AIzaSyARIDLGBcFWWC5HltY1_t5iZcXuoXz08bo'; // Add your API key here
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
  
    this.http.get(geocodeUrl).subscribe((response: any) => {
      if (response.status === 'OK' && response.results.length > 0) {
        const addressComponents = response.results[0].address_components;
  
        let country = '';
        let isoCode = '';
        let state = '';
        let stateIsoCode = '';
        let city = '';
  
        // Loop through address components to find the country, state, state ISO code, and city
        addressComponents.forEach((component: any) => {
          if (component.types.includes('country')) {
            this.selectedCountry = component.long_name; // Country name
            isoCode = component.short_name; // ISO code (e.g., US, IN)
            this.selectedCountryCode = isoCode;
          }
          if (component.types.includes('administrative_area_level_1')) {
            state = component.long_name; // State name
            stateIsoCode = component.short_name; // State ISO code (e.g., CA for California)
          }
          if (component.types.includes('locality')) {
            city = component.long_name; // City name
          }
        });

        setTimeout(() => {
        if (this.checkout.value.state) {
          const selectedState = State.getStatesOfCountry(this.selectedCountryCode || '').find(s => s.name === this.checkout.value.state);
          if (selectedState) {
              isoCode = selectedState.isoCode;
                  this.loadCities(isoCode);
                }
              }
            }, 1000); // Delay of 1000 milliseconds (1 second)
      
  
      
      this.loadStates(isoCode); // Load states based on country
      this.selectedStateCode = stateIsoCode; // Set the selected state code
      this.loadCities(this.selectedStateCode); // Load cities based on the selected state code
      console.log(country, state, city, stateIsoCode, "382");
  
      } else {
        console.log('No country information found for the provided coordinates.');
      }
    }, (error: any) => {
      console.error('Error reverse geocoding: ', error);
    });
  }
  
    // Method to format the date
    formatDate(date: Date): string {
      const day = date.getDate().toString().padStart(2, '0'); // Add leading zero if needed
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
  
}
