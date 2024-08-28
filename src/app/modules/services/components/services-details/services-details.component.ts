import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ServicesDetailService } from '../../service/services-detail.service';
import { environment } from '../../../../../environments/environment.development';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoginComponent } from '../../../login/Components/login/login.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-services-details',
  templateUrl: './services-details.component.html',
  styleUrl: './services-details.component.scss'
})
export class ServicesDetailsComponent {
  apiUrl: string = environment.ApiBaseUrl;
  currentRating:any
  selectedCard: any;
  serviceDetailId:any;
  serviceDetail:any;
  allSimilarServices:any;
  vendorId:any;
  vendorDetail:any;
  subgroupid:any;
  maingroupid:any;
  latitude:any;
  longitude:any;
  reviews:any;
  reviewForm:any =FormGroup

  constructor(private router: Router,private service:ServicesDetailService, private fb:FormBuilder, private dialog:MatDialog, private toastr:ToastrService) {
    const navigation = this.router.getCurrentNavigation();
    this.selectedCard = navigation?.extras?.state?.['card']; 
    this.serviceDetailId = this.selectedCard.item?this.selectedCard.item.id:this.selectedCard.id;
    this.reviewForm = fb.group({
      name: [],
      email: [],
      phone: [],
      review:[],
      type: "string"
    })
  }

  ngOnInit(){
    this.getCurrentLocation()
    // 
    this.currentRating = this.selectedCard.rate;
    console.log(this.currentRating,"currentRating")
    this.onRatingUpdated(this.currentRating)
    this.service.getServiceDetailsById(this.serviceDetailId).subscribe((res)=>{
      this.serviceDetail = res.data;
      this.getRatingByItemId(res.data.item.itemid)
      this.vendorId = this.serviceDetail.item.vendorid;

      // Similar Services
      this.maingroupid = this.serviceDetail?.item?.maingroupid;
      this.subgroupid = this.serviceDetail?.item?.subgroupid;

      this.service.getItemByCategory(this.maingroupid, this.subgroupid,this.latitude, this.longitude).subscribe((SimilarItems:any)=>{
        console.log(SimilarItems,"SimilarItems")
        this.allSimilarServices = SimilarItems.data;
        console.log(this.allSimilarServices, "allSimilarServices")
      })
     
       // SellerInfo
    this.service.getSellerInfo(this.vendorId).subscribe((info:any)=>{
      console.log(info,"SellerInfo-ServideDetail")
      this.vendorDetail = info.data;
      console.log(this.vendorDetail,"vendorDetail")
    })
    })

  }
  // get ratings
  getRatingByItemId(id:string){
    this.service.getRatingByItemId(id).subscribe((res:any)=>{
      console.log(res)
      this.reviews = res.data;
    })
  }

// Rating
addReview(){
  const payload = {
    ...this.reviewForm.value,
    itemId:this.serviceDetail.item.id,
    rating:this.serviceDetail?.item.rate,
    ratingValue:this.serviceDetail?.item.ratingReview | 0,
  }
this.service.addNewReview(payload).subscribe((res:any)=>{
  if(res.success){
    this.getRatingByItemId(this.serviceDetail.item.id)
  }
})
}

// add to cart 
addToCart(){
 if(localStorage.getItem("userId")){
  const payload = {
    itemId:this.serviceDetail.item.productid||0,
    id:this.serviceDetail.item.id,
    itemName:this.serviceDetail.item.itemName,
    itemRate:this.serviceDetail?.item.price,
    price:this.serviceDetail?.item.price,
    quantity: 1,
    userId:localStorage.getItem("userId"),
    processStatus:'',
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
  console.log("New Rating: ", newRating);
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
      autoplay: true,
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
Products=[
  {
    "title":"Niti Group Facility Services",
    "image":"images/nitiGroup.svg",
    "staff":"Housekepping Lady",
    "price" : "20 Hrs.INR 14000",
    "distance":"5",
    "rate":4
  },
  {
    "title":"A.P.Securitas Pvt.Ltd.",
    "image":"images/apSecurity.svg",
    "staff":"Housekepping Lady",
    "price" : "20 Hrs.INR 9500",
    "distance":"6",
    "rate":3
  },
  {
    "title":"Addbiv Securer Pvt.Ltd.",
    "image":"images/addbivSecurer.svg",
    "staff":"Housekepping Lady",
    "price" : "20 Hrs.INR 14000",
    "distance":"7",
    "rate":4.2
  },
  {
    "title":"Niti Group Facility Services",
    "image":"images/nitiGroup.svg",
    "staff":"Housekepping Lady",
    "price" : "20 Hrs.INR 14000",
    "distance":"5",
    "rate":4
  },
  {
    "title":"A.P.Securitas Pvt.Ltd.",
    "image":"images/apSecurity.svg",
    "staff":"Housekepping Lady",
    "price" : "20 Hrs.INR 9500",
    "distance":"6",
    "rate":3
  },
  {
    "title":"Addbiv Securer Pvt.Ltd.",
    "image":"images/addbivSecurer.svg",
    "staff":"Housekepping Lady",
    "price" : "20 Hrs.INR 14000",
    "distance":"7",
    "rate":4.2
  },
]
}
