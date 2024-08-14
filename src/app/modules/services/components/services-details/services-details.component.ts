import { Component } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-services-details',
  templateUrl: './services-details.component.html',
  styleUrl: './services-details.component.scss'
})
export class ServicesDetailsComponent {
  currentRating = 3; 
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
  {
    name:'Floyd Miles',
    address:'London,UK',
    description:'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.',
    profileImg:'images/Service-detail-img/profile-icon.png'
  },
]
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
