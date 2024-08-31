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
  Categories:any;
  savedItem:any
  comment:any;

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
  const userId = localStorage.getItem("userId");

  if (this.blogDetail && this.blogDetail.blogTrans && userId) {
    // Find the matching item based on userId
    const matchingItem = this.blogDetail.blogTrans.find((item: any) => item.userid === Number(userId));

    if (matchingItem && matchingItem.isSaveNameEmailandWebsite === 1) {
      // Store in a variable if isSaveNameEmailandWebsite is 1
      this.savedItem = matchingItem; 
      console.log(this.savedItem, "Saved Item");
    } else {
      console.log("No item with isSaveNameEmailandWebsite status 1 found.");
    }
  } else {
    console.log("No matching items found or invalid data.");
  }
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

  goToCategory(serviceDetail:any){
    console.log(serviceDetail,"serviceId")
    const navigationExtras = {
      state: {
        serviceId: serviceDetail?.mainId,
      }
    };
    this.router.navigate([`/services/category/${serviceDetail?.classificationName?.trim()?.replace(/\s+/g, '-')?.toLowerCase()}`], navigationExtras);
  }

  saveReview() {
    const blogReviewData = {
      blogid: this.selectedBlog.id, // Assuming the blog ID is available from blogDetail
      name: this.savedItem.name,
      email: this.savedItem.email,
      website: this.savedItem.website,
      userReview: 5, // Example rating value, adjust as needed
      comment: this.comment, // Adjust or bind to your form input
      isSaveNameEmailandWebsite: this.savedItem.isSaveNameEmailandWebsite
    };

    this.blogService.saveBlogReview(blogReviewData).subscribe(
      (response) => {
        console.log('Blog review saved successfully:', response);
        // Handle success, like showing a success message or resetting the form
      },
      (error) => {
        console.error('Error saving blog review:', error);
        // Handle error, like showing an error message
      }
    );
  }

}
