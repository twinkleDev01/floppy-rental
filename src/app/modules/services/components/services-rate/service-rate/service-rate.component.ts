import { Component } from '@angular/core';
import { ServicesDetailService } from '../../../service/services-detail.service';

@Component({
  selector: 'app-service-rate',
  templateUrl: './service-rate.component.html',
  styleUrl: './service-rate.component.scss'
})
export class ServiceRateComponent {

  constructor(private serviceDetail:ServicesDetailService){

  }

  ngOnInit(){
    this.serviceRateList()
  }

  serviceRateList(){
    this.serviceDetail.getServicePage().subscribe((response:any)=>{
      console.log(response)
    })
  }
}
