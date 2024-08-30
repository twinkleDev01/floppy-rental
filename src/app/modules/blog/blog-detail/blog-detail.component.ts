import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BlogService } from '../service/blog.service';
import { ServicesDetailService } from '../../services/service/services-detail.service';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.scss'
})
export class BlogDetailComponent {
  number=4
  selectedBlog: any;
  Categories:any

  constructor(private router: Router, private blogService:BlogService, private serviceDetail:ServicesDetailService) {
    const navigation = this.router.getCurrentNavigation();
    this.selectedBlog = navigation?.extras?.state?.['blog']; 
    console.log(this.selectedBlog);
  }

  blogDetail:any

  // Categories=[
  //   'Housekeeping Staff','Beauty','Air Conditioning','Lifestyle','Electrician/ Plumber/ Carpenter','Horticulture And Landscaping Service'
  // ]

  ngOnInit(){
    this.getBlogDetail();
    this.getCategoryList();
  }

  getBlogDetail(){
this.blogService.getBlogDetails(this.selectedBlog.id).subscribe((response:any)=>{
  console.log(response,"26")
  this.blogDetail = response.data
})
  }

  getCategoryList(){
this.serviceDetail.getCategoryList().subscribe((response:any)=>{
  console.log(response)
  this.Categories = response.data
})
  }
  blogDataEvent(event:any):void{
    if(event){
      console.log(event,"event")
      this.blogDetail = event;
    }
  }

  goToCategory(serviceId:any){
    console.log(serviceId,"serviceId")
    const navigationExtras = {
      state: {
        serviceId: serviceId,
      }
    };
    this.router.navigate(['/services/category'], navigationExtras);
  }

}
