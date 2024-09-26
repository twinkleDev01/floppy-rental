import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ServicesDetailService } from '../../service/services-detail.service';
import { environment } from '../../../../../environments/environment.development';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginComponent } from '../../../login/Components/login/login.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Review } from '../_models/serivece.model';
import { isPlatformBrowser, ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-services-details',
  templateUrl: './services-details.component.html',
  styleUrl: './services-details.component.scss'
})
export class ServicesDetailsComponent implements OnInit {
  apiUrl: string = environment.ApiBaseUrl;
  currentRating = 0;
  selectedCard: any;
  serviceDetailId:any;
  serviceDetail:any;
  allSimilarServices:any;
  vendorId:any;
  vendorDetail:any;
  subgroupid:any;
  maingroupid:any;
  latitude = 0;
  longitude = 0;
  reviews: Review[] = [];
  reviewForm:any =FormGroup;
  startIndex=0;
  pageSize=0;
  isBrowser!: boolean;

  constructor(private router: Router,private service:ServicesDetailService, private fb:FormBuilder, private dialog:MatDialog, private toastr:ToastrService, private route:ActivatedRoute, @Inject(PLATFORM_ID) platformId: object, private viewportScroller: ViewportScroller) {

    this.isBrowser = isPlatformBrowser(platformId);

    this.route.paramMap.subscribe(params => {
      this.serviceDetailId = params.get('id');
    });
    this.reviewForm = fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]], // Required and no special characters
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]], // Required and valid email format with stricter pattern
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // Required and must be a 10-digit number
      review: ['', [Validators.required, Validators.maxLength(50)]], // Required and minimum length of 10
      rating: [''], // Required validation
      type: [''] // Required validation
    });
  }

  ngOnInit(){
    this.viewportScroller.scrollToPosition([0, 0]); // Scroll to the top of the page
    this.getCurrentLocation()
    this.onRatingUpdated(this.currentRating)
    this.getServiceDetailById(this.serviceDetailId)
  }


  getServiceDetailById(id:any){
    this.service.getServiceDetailsById(id).subscribe((res)=>{
      this.serviceDetail = res.data;
      this.getRatingByItemId(res.data.item.itemid)
      this.vendorId = this.serviceDetail.item.vendorid;

      // Similar Services
      this.maingroupid = this.serviceDetail?.item?.maingroupid;
      this.subgroupid = this.serviceDetail?.item?.subgroupid;

      this.service.getItemByCategory(this.maingroupid, this.subgroupid,this.latitude, this.longitude).subscribe((SimilarItems:any)=>{
    
        // this.allSimilarServices = SimilarItems.data;
        this.allSimilarServices = SimilarItems.data.items;

      })
     
       // SellerInfo
    this.service.getSellerInfo(this.vendorId).subscribe((info:any)=>{
      this.vendorDetail = info.data;
    })
    })
  }
  

  // get ratings
  getRatingByItemId(id: string) {
    this.service.getRatingByItemId(id).subscribe(
      (res: any) => {
        // Check for successful response
        if (res.success && res.data) {
          // If data is present, set reviews and calculate average rating
          this.reviews = res.data;
          this.calculateAverageRating(this.reviews, true);
        } else {
          // If no data or unsuccessful response, reset reviews and average rating
          this.reviews = [];
          this.calculateAverageRating([], true); // Pass empty array for no ratings
        }
      },
      (error) => {
        this.reviews = [];
        this.calculateAverageRating([], true); // Pass empty array for error case
      }
    );
  }
  

// Rating
addReview(){
  if (this.reviewForm.invalid) {
    this.reviewForm.markAllAsTouched(); // Mark all fields as touched to trigger validation messages
    return;
  }
  const payload = {
    ...this.reviewForm.value,
    itemId:this.serviceDetail.item.id,
    type: this.serviceDetail?.item.subgroupname,
    rating:this.currentRating.toString(),
    ratingValue:this.serviceDetail?.item.ratingReview | 0,
  }
this.service.addNewReview(payload).subscribe((res:any)=>{
  if(res.success){
    this.getRatingByItemId(this.serviceDetail.item.id);
    this.reviewForm.reset();
    this.currentRating = 0; // Reset currentRating to its default value
    this.toastr.success(res.message)
  }
},
(error: any) => {
 this.toastr.error(error.error.message);
}
)
}

// add to cart 
addToCart(serviceDetail:any){
  if(this.isBrowser){
  const payload = {
    itemId:this.serviceDetail.item.itemid||0,
    id:0,
    itemName:this.serviceDetail.item.itemName?this.serviceDetail.item.itemName:this.serviceDetail.item.specication,
    itemRate:Number(this.serviceDetail?.item.rate.replace(/[^0-9.-]+/g, "")),
    price:Number(this.serviceDetail?.item.rate.replace(/[^0-9.-]+/g, "")),
    quantity: 1,
    userId:Number(localStorage.getItem("userId")),
    processStatus:'',
    discountPercent: 0,
    discountAmount: 0,
    tax: 0,
    image:this.serviceDetail.item.imagepath?this.serviceDetail.item.imagepath:''
  }
 
  this.service.addCartItem([payload]).subscribe((res:any)=>{
  if(res.success)
    this.toastr.success(res.message)

 // For guest users, manage cart in localStorage
 const localCart = localStorage.getItem('myCartItem')
 ? JSON.parse(localStorage.getItem('myCartItem')!)
 : [];

// Find the existing item in the cart
const existingItemIndex = localCart.findIndex((item: any) => item.itemid === serviceDetail.item.itemid);
if (existingItemIndex > -1) {
 // If item exists, update its quantity
 localCart[existingItemIndex].quantity += 1;
} else {
 // If item doesn't exist, add new item with quantity 1
 serviceDetail.item.quantity = 1;
 localCart.push(serviceDetail.item);
}
// Update the cart in localStorage
localStorage.setItem('myCartItem', JSON.stringify(localCart));

if(localStorage.getItem('userId')){
this.updateCartDetails('myCartItem')
}
// Navigate to the cart page
this.router.navigate(['cart']);
  })
 
  }
}

updateCartDetails (storageKey: string){
  const items = JSON.parse(localStorage[storageKey] || '[]');
  localStorage[storageKey] = JSON.stringify(
      items.map((d:any)=> ({...d, cartUpdated: true}))
  )
}

onRatingUpdated(newRating: number) {
  this.currentRating = newRating;
}

// location
getCurrentLocation(){
  // Check if the browser supports Geolocation API
if (navigator.geolocation) {
navigator.geolocation.getCurrentPosition(
    (position) => {
        // Success callback
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
    },
    (error) => {
        // Error callback
        console.error('Error getting location: ', error);
    },
    {
        // Optional settings
        enableHighAccuracy: true, // Use high accuracy mode if available
        timeout: 10000, // Set a timeout in milliseconds
        maximumAge: 0 // Do not use a cached position
    }
);
} 
}

  public doctorSlider: OwlOptions = {
    loop: true,
      margin: 10,
      nav: false,
      dots: false,
      autoplay: false,
      autoplayTimeout: 1500, 
      autoplayHoverPause: true,
      navText: [
        '<i class="fas fa-chevron-left"></i>',
        '<i class="fas fa-chevron-right"></i>',
      ],
      responsive: {
        0: {
          items: 1,
        },
        500: {
          items: 1,
        },
        768: {
          items: 2,
        },
        1000: {
          items: 4,
        },
        1200: {
          items: 4,
        },
      },
    };
// reviews=[
//   {
//     name:'Floyd Miles',
//     address:'London,UK',
//     description:'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.',
//     profileImg:'images/Service-detail-img/profile-icon.png'
//   },
//   {
//     name:'Floyd Miles',
//     address:'London,UK',
//     description:'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.',
//     profileImg:'images/Service-detail-img/profile-icon.png'
//   },
//  ]


isImageUrl(url: string): boolean {
  // Regular expression to check if the URL ends with common image extensions
  const imageRegex = /\.(jpeg|jpg|gif|png|svg|webp|jfif)$/i;
  // Check if the URL starts with 'http' or 'https' and ends with an image file extension
  return url.startsWith('http') && imageRegex.test(url);
}
averageRating:any
calculateAverageRating(reviews:any, assign?:boolean): any {
  if (reviews && reviews.length > 0) {
    const ratingReview = reviews;

    // Filter out invalid ratings and calculate the average
    const validRatings = ratingReview
      .map((review: any) => parseFloat(review.rating))
      .filter((rating: number) => !isNaN(rating));

    const totalRating = validRatings.reduce((sum:any, rating:any) => sum + rating, 0);
    const averageRating = Math.round((totalRating / validRatings.length) * 10) / 10 || 0; // Calculate average rating
   if(assign){
    this.averageRating  = averageRating;
   }

    return averageRating;
  }
 else {
  // Handle case where there are no reviews
  if (assign) {
    this.averageRating = 0; // Reset to 0 if there are no reviews
  }
  return 0;
}
}


similarProductDetail(card:any){
  this.getServiceDetailById(card.itemid);
  this.scrollToTop();
}

// Function to scroll to the top of the page
scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // This adds a smooth scrolling effect
  });
}

displayedReviewsCount = 3; // Initially display 3 reviews

  // Function to handle "Load More" click
  loadMoreReviews() {
    if (this.displayedReviewsCount < this.reviews.length) {
      // If there are more reviews to display, load the next 3 reviews
      this.displayedReviewsCount += 3;
    } else {
      // If all reviews are displayed, reset to show only 3
      this.displayedReviewsCount = 3;
    }
  }

  // Getter to check if "Load More" button should be visible
  get shouldShowLoadMore() {
    return this.displayedReviewsCount < this.reviews.length;
  }

  navigateToServiceRate() {
    this.router.navigate([`/services/service-rate/${this.serviceDetail.item.maingroupid}`])
  }

   // Prevent leading whitespace
   preventLeadingWhitespace(event: KeyboardEvent): void {
    const input = (event.target as HTMLInputElement).value;
    // Prevent a space if the input is empty or has only leading whitespace
    if (event.key === ' ' && input.trim().length === 0) {
      event.preventDefault();
    }
  }

  // goToCheckout(){
  //   this.router.navigate(['cart/checkout'])
  // }

}
