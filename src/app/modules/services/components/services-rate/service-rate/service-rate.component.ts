import { Component, OnInit } from '@angular/core';
import { ServicesDetailService } from '../../../service/services-detail.service';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-service-rate',
  templateUrl: './service-rate.component.html',
  styleUrl: './service-rate.component.scss'
})
export class ServiceRateComponent implements OnInit {
serviceListRate:any;
selectedServiceCategory:any
  constructor(private serviceDetail:ServicesDetailService, private route:ActivatedRoute){
     // Retrieve state data
    this.route.paramMap.subscribe(params => {
      this.selectedServiceCategory = params.get('id'); // 'maingroupid' is the name you used in the route
    });
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
