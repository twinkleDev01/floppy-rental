import { Component, Directive, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ServicesDetailService } from '../../service/services-detail.service';
import { environment } from '../../../../../environments/environment.development';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-services-category',
  templateUrl: './services-category.component.html',
  styleUrl: './services-category.component.scss'
})
export class ServicesCategoryComponent {
  apiUrl: string = environment.ApiBaseUrl;
 
  servicesDetails:any[]=[];
  private readonly _formBuilder = inject(FormBuilder);
  // currentRating = this.servicesDetails[0].rate; // Initial rating value
  currentRating:any;
  showFilter: boolean = false;
  // selectedCategory: string = 'Housekeeping Staff';
  selectedCategory:any;
  selectedServiceCategory:any
  selectedServiceCategoryId:any;
  selectedServiceCategoryIdThroughLocationSearch:any;
  selectedServiceSubCategoryIdThroughLocationSearch:any

  serviceCatId :any;
  catId:any;
  subCatId:any;
  itemDetails: any;
  vendorName:any
  // categories: string[] = ['Housekeeping Staff', 'Pantry Boy', 'Supervisor/Floor Manager', 'Multitasking Staff', 'Electrician/Plumber/Carpenter', 'Horticulter And Landscaping Service'];
  categories:any[]=[];
  categoriesList:any[]=[];
  subCategories:any[]=[];
  latitude:any = 0;
  longitude:any = 0;
  location:any;
  subCategory:any;
  startIndex:number=0
  totalItems: number = 0; // Total number of items for paginator
  // toppings: FormGroup;
  // Paginator
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Output() page = new EventEmitter<PageEvent>()
  @Input() length = 0;
  @Input() pageIndex = 0;
  @Input() pageSize = 10; //default page size
  @Input() pageSizeOptions: number[] = [5, 10, 25, 100];
  @Input() showPageSizeField = true;
  paginator$ = new BehaviorSubject<{pageIndex:number,pageSize:number}|null>({pageIndex:0,pageSize:10})

  constructor(private fb: FormBuilder, private router: Router, private service:ServicesDetailService) {

    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state ?? {};
    this.selectedServiceCategoryId = state?.['serviceId']; 
    this.location = state['location'] ; // Provide a default value if needed
    this.subCategory = state['subCategory'] ; // Provide a default value if needed
    this.selectedServiceCategoryIdThroughLocationSearch = state['mainId']
    this.selectedServiceSubCategoryIdThroughLocationSearch = state['subId']
    
    console.log(this.selectedServiceCategoryId,"57")
    console.log(this.selectedServiceCategoryIdThroughLocationSearch,"64");
        console.log('Location:', this.location);
        console.log('SubCategory:', this.subCategory);
  }
private filteringThroughSubcategory(selectedServiceCategoryId:any):void{
  const selectedCategoryObj = this.categoriesList.find(
    (category) => category.mainId === this.selectedServiceCategoryId
  );
  this.selectedServiceCategory = selectedCategoryObj
    ? selectedCategoryObj.mainId
    : null;
}
  ngOnInit(){
    if(this.location && this.subCategory){
      console.log("is location")
      this.getLocationwiseService(this.subCategory, this.location)
    }


    this.getCurrentLocation()
    // getCategoryList
    this.service.getCategoryList().subscribe((res)=>{
      console.log(res,"categoryList")
      this.categoriesList = res.data;

         // Set the selectedCategory based on selectedServiceCategoryId
         if (this.selectedServiceCategoryId) {
          this.filteringThroughSubcategory(this.selectedServiceCategoryId);
        }else if(this.selectedServiceCategoryIdThroughLocationSearch){
          this.filteringThroughSubcategory(this.selectedServiceCategoryIdThroughLocationSearch);

        }
        console.log(this.selectedServiceCategory,"selectedServiceCategory")
    })
    // this.onRatingUpdated(this.currentRating);
    this.selectedServiceCategoryId =  this.selectedServiceCategoryId? this.selectedServiceCategoryId:this.selectedServiceCategoryIdThroughLocationSearch;
   this.getFilterSubCategory(this.selectedServiceCategoryId);
  
}
  // Fetch items based on selected category
  fetchItems(catId: any, subCatId: any) {
    console.log(catId,"catId",subCatId,"subCatId")
    this.service.getItemByCategory(catId, subCatId, this.latitude, this.longitude, this.startIndex, this.pageSize).subscribe((res) => {
      this.servicesDetails = res.data;
      this.servicesDetails  = this.servicesDetails.map((iterable)=>iterable.item);
      console.log(this.servicesDetails)
      this.totalItems = this.estimateTotalItems();;
      // this.currentRating = this.servicesDetails.reviews
      if (this.servicesDetails.length > 0) {
        this.vendorName = this.servicesDetails[0]?.item?.vendorname;
      }
      this.paginator$.next({pageIndex:0,pageSize:10});
    });

  }
 
    // Handle category change
    onCategoryChange(selectedValue: any) {
      // Reset all variables to null or default values
      this.selectedServiceCategoryIdThroughLocationSearch = null;
      this.location = null;  // Provide a default value if needed
      this.subCategory = null;  // Provide a default value if needed
      this.selectedServiceSubCategoryIdThroughLocationSearch = null;
      console.log(selectedValue.value,"Selected Value")
      this.getFilterSubCategory(selectedValue.value);
      this.subCatId = this.categories.filter(a=>a.SubId);
      this.catId = this.categories.filter((a)=>a.MainId);
      console.log(this.subCatId, this.catId)
    }

 getFilterSubCategory(id:any){
  this.service.getSubCategoryList(id).subscribe((res)=>{
    console.log(res,"res")
    this.categories = res.data;
    console.log(this.categories,"categories")

     // Set the first category as the default selected
  if (this.categories && this.categories.length > 0) {
    this.selectedCategory = this.selectedServiceSubCategoryIdThroughLocationSearch?this.selectedServiceSubCategoryIdThroughLocationSearch:this.categories[0].SubId;
    
    this.categories.forEach((category) => {
      category.isChecked = category.SubId === this.selectedCategory;
    });

    console.log(this.selectedCategory,"selectedCategory")
    this.subCatId = this.categories[0].SubId;
    this.catId = this.categories[0].MainId;

    // Fetch items for the default category
    if(!this.location && !this.subCategory)
    this.fetchItems(this.catId, this.subCatId);
  }
  })
 }

//  onCheckboxChange(event: any) {
//   console.log('Checkbox changed:', event.checked);

//   // Handle checkbox change logic here
//    this.fetchItems(this.selectedServiceCategory, event);
// }

onCheckboxChange(subCategoryId: any, event: MatCheckboxChange) {
  if (event.checked) {
    // Set the selectedCategory to the newly checked checkbox's value

       // Uncheck all other checkboxes by setting the selectedCategory as the only selected one
    this.categories.forEach((category) => {
      category.isChecked = category.SubId === subCategoryId;
    });
    // 
    this.fetchItems(this.selectedServiceCategory, subCategoryId);
  }
}

  onRatingUpdated(newRating: number) {
    console.log(this.currentRating, "currentRating")
    console.log("New Rating: ", newRating);
    this.currentRating = newRating;
  }

  toggleViewMobile() {
    this.showFilter = !this.showFilter;
  }
  goToDetail(card:{}){
    const navigationExtras = {
      state: {
        card: card
      }
    };
    console.log(card,"CardDetail")
    this.router.navigate(['services/service-Details'], navigationExtras);
  }
  // Paginator
  itemsPerPage() {
  }
  setPageSize(event: KeyboardEvent) : void{
    const value = (event.target as HTMLInputElement).value;
    if(value){
      this.pageSize = Number(value)
      this.paginator._changePageSize(this.pageSize);
    }
  }

  setPageSizeOnInputEvent(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    if(value){
      this.pageSize = Number(value)
      this.paginator._changePageSize(this.pageSize);
    }
  }
  checkPageSize(event: FocusEvent):void{
    const value = (event.target as HTMLInputElement).value;
    if(!value){
      this.pageSize = 10
      this.paginator._changePageSize(this.pageSize);
    }
  }

  // onPageEvent(event: any) {
  //   this.page.emit(event);
  //   if (this.pageSize !== event.pageSize) {
  //     console.log(event.pageSize);
  //     this.pageSize = event.pageSize;
  //   }
  // }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;  // Update current page index
    this.pageSize = event.pageSize;  // Update page size
    this.startIndex = this.pageIndex * this.pageSize;  // Calculate new startIndex
    this.fetchItems(this.catId, this.subCatId);  // Fetch new items based on updated page
  }
  

  getCurrentLocation(){
    // Check if the browser supports Geolocation API
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
      (position) => {
          // Success callback
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;

          console.log(`Latitude: ${this.latitude}, Longitude: ${this.longitude}`);
      },
      (error) => {
          // Error callback
          console.error('Error getting location: ', error);
      },
      {
          // Optional settings
          enableHighAccuracy: true, // Use high accuracy mode if available
          timeout: 10000, // Set a timeout in milliseconds
          maximumAge: 0 // Do not use a cached position
      }
  );
} else {
  console.error("Geolocation is not supported by this browser.");
}
  }

  getLocationwiseService(subCategory: string, location: string){
    this.service.getServiceLocationWise(subCategory, location).subscribe((response:any)=>{
      this.servicesDetails = response.data;
      console.log(this.servicesDetails,"238")
      
      console.log(this.servicesDetails,"233")
    })
  }

  estimateTotalItems(): number {
    // Estimate based on data or set to a default value
    return 100;  // Placeholder for your logic or approximation
  }

}

