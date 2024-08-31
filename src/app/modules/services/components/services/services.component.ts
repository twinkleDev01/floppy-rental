import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ServicesDetailService } from '../../service/services-detail.service';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent {
  serviceDataList:any=[]=[];
  apiUrl: string = environment.ApiBaseUrl;
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
    private service:ServicesDetailService
  ){}
ngOnInit(){
   // ServiceCategoryList
   this.service.getServiceList().subscribe((res:any)=>{
    console.log("SErviceList",res)
    this.serviceDataList = res.data;
    console.log(this.serviceDataList,"serviceDataListtt")
   })
}
  goToRental(serviceId:any){
    console.log(serviceId,"serviceId")
    const navigationExtras = {
      state: {
        serviceId: serviceId?.mainId,
      }
    };
    this.router.navigate([`/services/category/${serviceId?.classificationName?.trim()?.replace(/\s+/g, '-')?.toLowerCase()}`], navigationExtras);
  }
  
}
