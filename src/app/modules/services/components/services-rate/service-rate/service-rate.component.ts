import { Component } from '@angular/core';
import { ServicesDetailService } from '../../../service/services-detail.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-service-rate',
  templateUrl: './service-rate.component.html',
  styleUrl: './service-rate.component.scss'
})
export class ServiceRateComponent {
serviceListRate:any;
selectedServiceCategory:any
  constructor(private serviceDetail:ServicesDetailService, private router:Router){
     // Retrieve state data
     const navigation = this.router.getCurrentNavigation();
     if (navigation && navigation.extras.state) {
       this.selectedServiceCategory = navigation.extras.state['selectedServiceCategory'];
       console.log('Selected Service Category:', this.selectedServiceCategory);
     }
   }
  

  ngOnInit(){
    this.serviceRateList()
  }

  serviceRateList(){
    this.serviceDetail.getServicePage(this.selectedServiceCategory).subscribe((response:any)=>{
      console.log(response)
      this.serviceListRate = response.data
    })
  }
}
