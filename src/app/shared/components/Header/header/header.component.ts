import { Component, Inject, inject, PLATFORM_ID } from '@angular/core';
import { LoginComponent } from '../../../../modules/login/Components/login/login.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../../../modules/cart/services/cart.service';
import { isPlatformBrowser } from '@angular/common';
declare var bootstrap: any;  
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  cartLength:any;
  searchInput: string = '';
  predictions: any[] = [];
  autocompleteService: any;
  latitude:any;
  longitude:any;
  address=''
  isBrowser!: boolean;
  city!: string;
  showLocationPopup: boolean = false;
  isLoggedIn$ = inject(AuthService).isLoggedIn$;
  readonly dialog = inject(MatDialog)
  constructor(private route:Router, private auth:AuthService, private toastr:ToastrService, private cartService:CartService, @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  get cartBadge(){
    return this.cartLength;
  }
  ngOnInit() { 

    if(this.isBrowser){
      const storedCity = sessionStorage.getItem('city');
      const storedAddress = sessionStorage.getItem('address');
      console.log(storedCity,storedAddress,'kk')
      if (storedCity && storedAddress) {
        this.address=storedAddress;
        this.city=storedCity;
         console.log(storedCity,storedAddress,'kk')
      }else{
        this.getCurrentLocation();
        console.log(storedCity,storedAddress,'kk')
      }
      this.autocompleteService = new google.maps.places.AutocompleteService();
   let length = localStorage.getItem('cartItems')

    this.cartService.cartLength.subscribe((val)=>{
      this.cartLength = val || length;
    });
    if(this.auth.isLoggedIn$){
      
    this.auth.isLoggedIn$.subscribe(isLoggedIn => {
      console.log('Login status changed:', isLoggedIn); // Log status changes
      if (isLoggedIn) {
        // If the user is logged in, call the API to fetch cart items
// Delay the API call by a specified timeout (e.g., 500 milliseconds)
setTimeout(() => {
        this.cartService.getCartItems().subscribe(
          (cartItems:any) => {
            console.log(cartItems,"37")
           this.cartLength = cartItems?.data?.length;
          },
          (error) => {
            // Handle error here
          }
        );
      }, 500); // Adjust the timeout as needed (e.g., 500 milliseconds)
      }
    });
  }
  }
   }
   
  ngAfterViewInit() {
    if(this.isBrowser){
    // Initialize Bootstrap components manually if needed
    var myCollapse = document.getElementById('navbarNav');
    var bsCollapse = new bootstrap.Collapse(myCollapse, {
      toggle: false
    });
    this.cartService.cartLength.subscribe((val)=>{
      this.cartLength = val || length;
    })
  }
  }

  openDialog(): void {
    this.dialog.open(LoginComponent, {
      width: '450',
      disableClose: true
    });
  }

  goToMyCart(){
    // if(localStorage.getItem("userId")){
    //   this.route.navigate(['cart'])
    // }else {
    //   alert("Please log in before accessing your cart.");
    //   this.dialog.open(LoginComponent, {
    //     width: '450',
    //     disableClose: true
    //   });
    //  }
    this.route.navigate(['cart'])
  }

  logOut(){
    if(this.isBrowser){
    const userId = localStorage.getItem('userId');
    if(userId){
      this.auth.logout(userId).subscribe((response:any)=>{
        if(response.success){
          localStorage.removeItem('token')
          localStorage.removeItem('userId')
          this.toastr.success('Successfully Logout')
          this.route.navigateByUrl('')
          this.auth.updateLoginStatus(false);
        }
      },
      (error: any) => {
        this.toastr.error('An error occurred. Please try again later.');
      }
    )
    }
  }
  }
  onInputChange() {
    // Fetch predictions when the user types
    if (this.searchInput) {
      console.log(this.searchInput)
      this.getPlacePredictions(this.searchInput);
    } else {
      this.predictions = []; // Clear predictions if the input is empty
    }
  }
  getPlacePredictions(input: string) {
    const request = {
      input,
      types: ['(regions)'], // Fetch regions, cities, countries, etc.
    };

    // Use Google's AutocompleteService to get place predictions
    this.autocompleteService.getPlacePredictions(request, (predictions: any[], status: any) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
        console.log(predictions)
        this.predictions = predictions;
        console.log(this.predictions,"539")
      } else {
        this.predictions = [];
      }
      console.log(this.predictions)
    });
  }

  selectPrediction(event: any) {
    console.log(event.target.value);
    this.address = event.target.value;
    this.city = this.extractCity(this.address);
    sessionStorage.setItem('city', this.city);
    sessionStorage.setItem('address', this.address);
    this.searchInput=''
    this.predictions = [];
    this.closeLocationPopup()
  }
  // getCurrentLocation() {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       const lat = position.coords.latitude;
  //       const lng = position.coords.longitude;
  //       this.latitude = lat;
  //       this.longitude = lng;
  
  //       // Fetch the exact location (address) using Google Geocoding API
  //       this.getExactLocation(lat, lng);
  //     }, (error) => {
  //       console.error('Error fetching location: ', error);
  //     });
  //   } else {
  //     console.log('Geolocation is not supported by this browser.');
  //   }
  // }

  getCurrentLocation(closeModal?: boolean) {
    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true, // Use high accuracy for better location results
        timeout: 10000, // Set a timeout for fetching the location (optional)
        maximumAge: 0 // Prevent caching of the location
      };
  
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.latitude = lat;
        this.longitude = lng;
  
        console.log(`Latitude: ${lat}, Longitude: ${lng}`);
        
        // Fetch the exact location (address) using Google Geocoding API
        this.getExactLocation(lat, lng);

        // Close the dialog if the flag is true
        if (closeModal) {
          this.showLocationPopup = false // Close the dialog
        }
      }, (error) => {
        console.error('Error fetching location: ', error);
      }, options);
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }
  
  
  getExactLocation(lat: number, lng: number) {
    const apiKey = 'AIzaSyARIDLGBcFWWC5HltY1_t5iZcXuoXz08bo'; // Add your API key here
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
  
    // Fetch the address using the Geocoding API
    fetch(geocodeUrl)
      .then(response => response.json())
      .then(data => {
        if (data.status === 'OK') {
          const address = data.results[0]?.formatted_address;
          console.log('Exact Location (Address): ', address);
          // You can store the address if needed
          this.address = address;
      this.city = this.extractCity(this.address);
      sessionStorage.setItem('city', this.city);
      sessionStorage.setItem('address', this.address);
        } else {
          console.error('Geocoding API error: ', data.status);
        }
      })
      .catch(error => {
        console.error('Error fetching address: ', error);
      });
  }
  extractCity(address: string): string {
    const parts = address.split(','); // Split the address by commas
    if (parts.length >= 3) {
      return parts[parts.length - 3].trim(); // City is usually the third last part before state and country
    }
    if (parts.length >= 2) {
      return parts[parts.length - 2].trim(); // City is usually the third last part before state and country
    }
    if (parts.length >= 1) {
      return parts[parts.length - 1].trim(); // City is usually the third last part before state and country
    }
    return 'City not found'; // Fallback if city is not properly parsed
  }

  openLocationPopup() {
    this.showLocationPopup = true;
  }

  closeLocationPopup() {
    this.showLocationPopup = false;
  }
}
