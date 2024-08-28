import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BlogService } from '../service/blog.service';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.scss'
})
export class BlogDetailComponent {
  number=4
  selectedBlog: any;

  constructor(private router: Router, private blogService:BlogService) {
    const navigation = this.router.getCurrentNavigation();
    this.selectedBlog = navigation?.extras?.state?.['blog']; 
    console.log(this.selectedBlog);
  }

  Categories=[
    'Housekeeping Staff','Beauty','Air Conditioning','Lifestyle','Electrician/ Plumber/ Carpenter','Horticulture And Landscaping Service'
  ]

  getBlogDetail(){
this.blogService.getBlogDetails(this.selectedBlog.page).subscribe((response:any)=>{
  console.log(response,"26")
})
  }

}
