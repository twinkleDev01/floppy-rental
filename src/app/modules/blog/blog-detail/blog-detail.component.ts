import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../service/blog.service';
import { ServicesDetailService } from '../../services/service/services-detail.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { noWhitespaceValidator } from '../../../shared/components/common/no-whitespace.validator';
import { BlogReview } from '../_models/blog.model';
import { isPlatformBrowser, ViewportScroller } from '@angular/common';

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
  commentForm!:FormGroup;
  maxCommentLength = 50;
  selectedCategory: string = '';
  blogReview:BlogReview[]=[];
  orignalCategories:any[]=[];
  isBrowser!: boolean;
  constructor(private router: Router, private blogService:BlogService, private serviceDetail:ServicesDetailService,private fb:FormBuilder,private toastrService:ToastrService, private route:ActivatedRoute, @Inject(PLATFORM_ID) platformId: Object, private viewportScroller: ViewportScroller) {
    this.viewportScroller.scrollToPosition([0, 0]); // Scroll to the top of the page
    this.isBrowser = isPlatformBrowser(platformId);
    // const navigation = this.router.getCurrentNavigation();
    // this.selectedBlog = navigation?.extras?.state?.['blog']; 
    // console.log(this.selectedBlog);
    this.route.paramMap.subscribe(params => {
      this.selectedBlog = params.get('id'); // 'maingroupid' is the name you used in the route
      console.log(params,"31", this.selectedBlog)
    });
    this.commentForm = fb.group({
      comment: ["", [Validators.required, noWhitespaceValidator(), Validators.maxLength(this.maxCommentLength)]],
      name: ["", [Validators.required, noWhitespaceValidator(), Validators.pattern('^[a-zA-Z\\s]*$')]],
      email: ["", [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/), noWhitespaceValidator()]], // Email also includes email format validation
      webSite: ["", [Validators.pattern(/^(https?:\/\/)?([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})([\/\w .-]*)*\/?$/)]], // Website validation
      saveWebsiteInfo: [""]
    });
    
  }

  blogDetail:any

  // Categories=[
  //   'Housekeeping Staff','Beauty','Air Conditioning','Lifestyle','Electrician/ Plumber/ Carpenter','Horticulture And Landscaping Service'
  // ]

  ngOnInit(){
    this.viewportScroller.scrollToPosition([0, 0]); // Scroll to the top of the page
    this.getBlogDetail();
    this.getCategoryList();
  }

  getBlogDetail(){
this.blogService.getBlogDetails(this.selectedBlog).subscribe((response:any)=>{
  this.blogDetail = response.data
  this.getReviewsByBlogId(this.blogDetail.blogId)
  if(this.isBrowser){
  const userId = localStorage.getItem("userId");
  
  if (this.blogDetail && this.blogDetail.blogTrans && userId) {
    // Find the matching item based on userId
    const matchingItem = this.blogDetail.blogTrans.find((item: any) => item.userid === Number(userId));

    if (matchingItem && matchingItem.isSaveNameEmailandWebsite === 1) {
      // Store in a variable if isSaveNameEmailandWebsite is 1
      this.savedItem = matchingItem; 
      console.log(this.savedItem, "Saved Item");
      this.commentForm?.patchValue({
        name:this.savedItem?.name,
        email:this.savedItem?.email,
        webSite:this.savedItem?.website,
        saveWebsiteInfo:this.savedItem?.isSaveNameEmailandWebsite
      })
    } else {
      console.log("No item with isSaveNameEmailandWebsite status 1 found.");
    }
  } else {
    console.log("No matching items found or invalid data.");
  }
}
})
  }

  getCategoryList(){
this.serviceDetail.getCategoryList().subscribe((response:any)=>{
  console.log(response)
  this.Categories = response.data
  this.orignalCategories = [...this.Categories]
  this.Categories = this.Categories.filter((category:any)=>category.status === 1)
})
  }
  blogDataEvent(event:any):void{
    if(event){
      console.log(event,"event")
      this.blogDetail = event;
      this.getReviewsByBlogId(this.blogDetail.id)
    }
  }

  // goToCategory(serviceDetail:any){
  //   console.log(serviceDetail,"serviceId")
  //   const navigationExtras = {
  //     state: {
  //       serviceId: serviceDetail?.mainId,
  //     }
  //   };
  //   this.router.navigate([`/services/category/${serviceDetail?.classificationName?.trim()?.replace(/\s+/g, '-')?.toLowerCase()}`], navigationExtras);
  // }

  saveReview() {
    if(this.isBrowser){
    this.commentForm?.markAllAsTouched();
    if(this.commentForm?.invalid)return;
    const blogReviewData = {
      blogid: this.selectedBlog, // Assuming the blog ID is available from blogDetail
      userId: localStorage.getItem('userId'),
      name: this.commentForm?.get("name")?.value,
      email: this.commentForm?.get("email")?.value,
      website: this.commentForm?.get("webSite")?.value,
      userReview: 0, // Example rating value, adjust as needed
      comment: this.commentForm?.get("comment")?.value, // Adjust or bind to your form input
      isSaveNameEmailandWebsite: this.commentForm?.get("saveWebsiteInfo")?.value?"1":"0",
      request: ''
    };

    this.blogService.saveBlogReview(blogReviewData).subscribe(
      (response) => {
        // console.log('Blog review saved successfully:', response);
        this.getReviewsByBlogId(this.blogDetail.blogId)
        this.commentForm?.reset();
        this.toastrService.success(response?.message);
        // Handle success, like showing a success message or resetting the form
      },
      (error) => {
        console.error('Error saving blog review:', error);
        this.toastrService.error(error?.error?.message);
        // Handle error, like showing an error message
      }
    );
  }
  }

  // Prevent leading whitespace
  preventLeadingWhitespace(event: KeyboardEvent): void {
    const input = (event.target as HTMLInputElement).value;
    // Prevent a space if the input is empty or has only leading whitespace
    if (event.key === ' ' && input.trim().length === 0) {
      event.preventDefault();
    }
  }

  sanitizeInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const formControlName = inputElement.getAttribute('formControlName');
    
    if (formControlName) {
      // Trim only leading whitespace
      const sanitizedValue = inputElement.value.replace(/^\s+/g, '');
      inputElement.value = sanitizedValue;
      this.commentForm.get(formControlName)?.setValue(sanitizedValue); // Update the form control value
    }
  }

  // Helper method to calculate remaining characters
  getRemainingCharacters(): number {
    const commentValue = this.commentForm.get('comment')?.value || '';
    return this.maxCommentLength - commentValue.length;
  }

    // Method to filter by category and navigate to blog list
  filterByCategory(category: any): void {
    this.selectedCategory = category.classificationName;
    this.router.navigate(['/blog'], { state: { category: this.selectedCategory } });
  }

  onSearch(event: Event) {
    const inputElement = event.target as HTMLInputElement; // Safely cast to HTMLInputElement
    const searchTerm = inputElement ? inputElement.value : ''; // Get value or default to an empty string
    this.blogService.updateSearchTerm(searchTerm); // Update the search term in the service
  }

  getReviewsByBlogId(id:number){
    this.blogService.getReviewsByBlogId(id).subscribe((response:any)=>{
this.blogReview = response.data
console.log(this.blogReview,"181")
    })
  }

  displayedReviewsCount = 3; // Initially display 3 reviews

  // Function to handle "Load More" click
  loadMoreReviews() {
    if (this.displayedReviewsCount < this.blogReview.length) {
      // If there are more reviews to display, load the next 3 reviews
      this.displayedReviewsCount += 3;
    } else {
      // If all reviews are displayed, reset to show only 3
      this.displayedReviewsCount = 3;
    }
  }

   // Getter to check if "Load More" button should be visible
   get shouldShowLoadMore() {
    return this.displayedReviewsCount < this.blogReview.length;
  }
}


