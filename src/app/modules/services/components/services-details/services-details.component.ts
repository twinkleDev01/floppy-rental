import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ServicesDetailService } from '../../service/services-detail.service';
import { environment } from '../../../../../environments/environment.development';

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

  constructor(private router: Router,private service:ServicesDetailService) {
    const navigation = this.router.getCurrentNavigation();
    this.selectedCard = navigation?.extras?.state?.['card']; 
    console.log(this.selectedCard,"selectedCard");
    this.serviceDetailId = this.selectedCard.item.id;
    console.log(this.serviceDetailId,"serviceDetailId")
  }

  ngOnInit(){
    this.getCurrentLocation()
    // 
    this.currentRating = this.selectedCard.rate;
    console.log(this.currentRating,"currentRating")
    this.onRatingUpdated(this.currentRating)
    this.service.getServiceDetailsById(this.serviceDetailId).subscribe((res)=>{
      console.log(res.data,"res")
      this.serviceDetail = res.data;
      console.log(this.serviceDetail,"serviceDetail")
      this.vendorId = this.serviceDetail.item.vendorid;
      console.log(this.vendorId,"vendorId");

      // Similar Services
      this.maingroupid = this.serviceDetail?.item?.maingroupid;
      this.subgroupid = this.serviceDetail?.item?.subgroupid;
      console.log(this.maingroupid, this.subgroupid)

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
// Rating
addReview(){
this.service.addNewReview().subscribe((res:any)=>{
  console.log(res,"res")
})
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
reviews=[
  {
    name:'Floyd Miles',
    address:'London,UK',
    description:'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.',
    profileImg:'images/Service-detail-img/profile-icon.png'
  },
  {
    name:'Floyd Miles',
    address:'London,UK',
    description:'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.',
    profileImg:'images/Service-detail-img/profile-icon.png'
  },
 ]
// Products=[
//   {
//     "title":"Niti Group Facility Services",
//     "image":"images/nitiGroup.svg",
//     "staff":"Housekepping Lady",
//     "price" : "20 Hrs.INR 14000",
//     "distance":"5",
//     "rate":4
//   },
//   {
//     "title":"A.P.Securitas Pvt.Ltd.",
//     "image":"images/apSecurity.svg",
//     "staff":"Housekepping Lady",
//     "price" : "20 Hrs.INR 9500",
//     "distance":"6",
//     "rate":3
//   },
//   {
//     "title":"Addbiv Securer Pvt.Ltd.",
//     "image":"images/addbivSecurer.svg",
//     "staff":"Housekepping Lady",
//     "price" : "20 Hrs.INR 14000",
//     "distance":"7",
//     "rate":4.2
//   },
//   {
//     "title":"Niti Group Facility Services",
//     "image":"images/nitiGroup.svg",
//     "staff":"Housekepping Lady",
//     "price" : "20 Hrs.INR 14000",
//     "distance":"5",
//     "rate":4
//   },
//   {
//     "title":"A.P.Securitas Pvt.Ltd.",
//     "image":"images/apSecurity.svg",
//     "staff":"Housekepping Lady",
//     "price" : "20 Hrs.INR 9500",
//     "distance":"6",
//     "rate":3
//   },
//   {
//     "title":"Addbiv Securer Pvt.Ltd.",
//     "image":"images/addbivSecurer.svg",
//     "staff":"Housekepping Lady",
//     "price" : "20 Hrs.INR 14000",
//     "distance":"7",
//     "rate":4.2
//   },
// ]
}
