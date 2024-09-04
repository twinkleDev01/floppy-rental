import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ServicesDetailService } from '../../service/services-detail.service';
import { environment } from '../../../../../environments/environment.development';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginComponent } from '../../../login/Components/login/login.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Review } from '../_models/serivece.model';

@Component({
  selector: 'app-services-details',
  templateUrl: './services-details.component.html',
  styleUrl: './services-details.component.scss'
})
export class ServicesDetailsComponent {
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
  latitude:number = 0;
  longitude:number = 0;
  reviews: Review[] = [];
  reviewForm:any =FormGroup;
  startIndex:number=0;
  pageSize:number=0

  constructor(private router: Router,private service:ServicesDetailService, private fb:FormBuilder, private dialog:MatDialog, private toastr:ToastrService) {
    const navigation = this.router.getCurrentNavigation();
    this.selectedCard = navigation?.extras?.state?.['card']; 
    this.serviceDetailId = this.selectedCard.item?this.selectedCard.item.id:this.selectedCard.id;
    this.reviewForm = fb.group({
      name: ['', Validators.required], // Required validation
      email: ['', [Validators.required, Validators.email]], // Required and valid email format
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // Required and must be a 10-digit number
      review: ['', [Validators.required, Validators.minLength(10)]], // Required and minimum length of 10
      rating: [''], // Required validation
      type: [''] // Required validation
    });
  }

  ngOnInit(){
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
  getRatingByItemId(id:string){
    this.service.getRatingByItemId(id).subscribe((res:any)=>{
      this.reviews = res.data;
      this.calculateAverageRating(this.reviews,true);
    })
  }

// Rating
addReview(){
  if (this.reviewForm.invalid) {
    console.log("92")
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
  }
})
}

// add to cart 
addToCart(){
 if(localStorage.getItem("userId")){
  const payload = {
    itemId:this.serviceDetail.item.itemid||0,
    id:0,
    itemName:this.serviceDetail.item.itemName,
    itemRate:this.serviceDetail?.item.price,
    price:this.serviceDetail?.item.price,
    quantity: 1,
    userId:Number(localStorage.getItem("userId")),
    processStatus:'',
    discountPercent: 0,
    discountAmount: 0,
    tax: 0,
    image:this.serviceDetail.item.imagepath
  }
  this.service.addCartItem([payload]).subscribe((res:any)=>{
  if(res.success)
    this.toastr.success(res.message)
    this.router.navigate(['cart'])
  })
 }else {
  alert("Please log in before adding items to your cart.")
  this.dialog.open(LoginComponent, {
    width: '450',
    disableClose: true
  });
 }

}

onRatingUpdated(newRating: number) {
  this.currentRating = newRating;
  console.log("New Rating: ", this.currentRating);
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

        console.log(`Latitude: ${this.latitude}, Longitude: ${this.longitude}`);
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
} else {
console.error("Geolocation is not supported by this browser.");
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
  if (reviews) {
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

}
