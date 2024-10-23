import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicesDetailService } from '../../service/services-detail.service';
import { environment } from '../../../../../environments/environment.development';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent implements OnInit {
  serviceDataList:any[]=[];
  originalList:any[]=[];
  apiUrl: string = environment.ApiBaseUrl;
  subSategories:any
//   services = [
//     {
//       "title":"IT-Rental",
//       "image":"images/rental.png"
//     },
//     {
//     "title":"Patient Care At Home & Physiotherapy",
//     "image":"images/patient-care.png"
//   },
//   {
//     "title":"Appliance Repair & Services",
//     "image":"images/appliance-repair.png"
//   },
//   {
//     "title":"Professionals",
//     "image":"images/professionals.png"
//   },
//   {
//     "title":"House Keeping",
//     "image":"images/houseKeeping.svg"
//   }
// ]
// services2 = [
//   {
//     "title":"Security Services",
//     "image":"images/securityServices.png"
//   },
//   {
//   "title":"Furniture On Hire",
//   "image":"images/furniture.svg"
// },
// {
//   "title":"Transport Services",
//   "image":"images/transport.svg"
// },
// {
//   "title":"Wedding Services",
//   "image":"images/weddingServices.png"
// },
// {
//   "title":"Web Developer & Designer",
//   "image":"images/webDeveloper.svg"
// }
// ]
// services3 = [
//   {
//     "title":"Professional Cleaning Expert",
//     "image":"images/professionals.svg"
//   },
//   {
//   "title":"Co-Working Space & Estate Agent",
//   "image":"images/co-workingSpace.svg"
// },
// {
//   "title":"Salon At Home",
//   "image":"images/Salon.svg"
// },
// {
//   "title":"Home Painting",
//   "image":"images/HomePainting.svg"
// }
// ]
  constructor(
    private router: Router,
    private service:ServicesDetailService,
    private viewportScroller: ViewportScroller
  ){}
ngOnInit(){
  this.viewportScroller.scrollToPosition([0, 0]); // Scroll to the top of the page
   // ServiceCategoryList
   this.service.getServiceList().subscribe((res:any)=>{
    this.serviceDataList = res.data;
    this.originalList = [...res?.data];
      this.serviceDataList = this.serviceDataList?.filter((iterable:any)=> iterable?.status === 1);
   })
}

  goToCategory(card: any) {

 // Fetch the updated subcategory list based on the selected value
 this.service.getSubCategoryBySpecificationName(card.mainId).subscribe((res:any) => {
  this.subSategories = res.data; // Update the category list with new data

  if (this.subSategories && this.subSategories.length > 0) {
    const selectedSubCategoryName = this.subSategories[0].serviceName;

    // Set navigation options
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';

    // Navigate using updated category name and ID
    this.router.navigate([`/services/category/${selectedSubCategoryName?.replaceAll("/","$")}/${card.mainId}`]);
  } 
}, (error:any) => {
  console.error('Error fetching subcategories:', error);
});


  }
  
}
