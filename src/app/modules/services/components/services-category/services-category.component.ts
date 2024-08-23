import { Component, Directive, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ServicesDetailService } from '../../service/services-detail.service';
import { environment } from '../../../../../environments/environment.development';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-services-category',
  templateUrl: './services-category.component.html',
  styleUrl: './services-category.component.scss'
})
export class ServicesCategoryComponent {
  apiUrl: string = environment.ApiBaseUrl;
  // servicesDetails:any = [
  //   {
  //     "title":"Niti Group Facility Services",
  //     "image":"images/nitiGroup.svg",
  //     "staff":"Housekepping Lady",
  //     "price" : "20 Hrs.INR 14000",
  //     "distance":"5",
  //     "rate":6
  //   },
  //   {
  //     "title":"A.P.Securitas Pvt.Ltd.",
  //     "image":"images/apSecurity.svg",
  //     "staff":"Housekepping Lady",
  //     "price" : "20 Hrs.INR 9500",
  //     "distance":"6",
  //     "rate":3
  //   },
  //   {
  //     "title":"Addbiv Securer Pvt.Ltd.",
  //     "image":"images/addbivSecurer.svg",
  //     "staff":"Housekepping Lady",
  //     "price" : "20 Hrs.INR 14000",
  //     "distance":"7",
  //     "rate":4.2
  //   },
  //   // ----
  //   {
  //     "title":"Ahon Security Services Pvt.Ltd",
  //     "image":"images/Ahon.svg",
  //     "staff":"Housekepping Lady",
  //     "price" : "20 Hrs.INR 14000",
  //     "distance":"5",
  //     "rate":4
  //   },
  //   {
  //     "title":"Aman Security Service(Regd.)",
  //     "image":"images/Aman.svg",
  //     "staff":"Housekepping Lady",
  //     "price" : "20 Hrs.INR 9500",
  //     "distance":"6",
  //     "rate":3
  //   },
  //   {
  //     "title":"Bujrang Security Service",
  //     "image":"images/Bajrang.svg",
  //     "staff":"Housekepping Lady",
  //     "price" : "20 Hrs.INR 14000",
  //     "distance":"7",
  //     "rate":4.2
  //   },
  //   // ----
  //   {
  //     "title":"BCS Security Group",
  //     "image":"images/bcs.svg",
  //     "staff":"Housekepping Lady",
  //     "price" : "20 Hrs.INR 14000",
  //     "distance":"5",
  //     "rate":4
  //   },
  //   {
  //     "title":"Bhartiya Security Services",
  //     "image":"images/bhartiya.svg",
  //     "staff":"Housekepping Boy",
  //     "price" : "20 Hrs.INR 9500",
  //     "distance":"6",
  //     "rate":3
  //   },
  //   {
  //     "title":"Black Valk Security Pvt.Ltd.",
  //     "image":"images/blackValk.svg",
  //     "staff":"Housekepping Boy",
  //     "price" : "20 Hrs.INR 14000",
  //     "distance":"7",
  //     "rate":4.2
  //   },
  //   // ----
  //   {
  //     "title":"Bvg India Ltd.",
  //     "image":"images/bvgIndia.svg",
  //     "staff":"Housekepping Lady",
  //     "price" : "20 Hrs.INR 14000",
  //     "distance":"5",
  //     "rate":4
  //   },
  //   {
  //     "title":"Clean Way",
  //     "image":"images/cleanWay.svg",
  //     "staff":"Housekepping Lady",
  //     "price" : "20 Hrs.INR 9500",
  //     "distance":"6",
  //     "rate":3
  //   },
  //   {
  //     "title":"Com Security Services Pvt.Ltd.",
  //     "image":"images/comSecurity.svg",
  //     "staff":"Housekepping Lady",
  //     "price" : "20 Hrs.INR 14000",
  //     "distance":"7",
  //     "rate":4.2
  //   },
  //   // ---Repeate for Paginator
  //   {
  //     "title":"Niti Group Facility Services",
  //     "image":"images/nitiGroup.svg",
  //     "staff":"Housekepping Lady",
  //     "price" : "20 Hrs.INR 14000",
  //     "distance":"5",
  //     "rate":4
  //   },
  //   {
  //     "title":"A.P.Securitas Pvt.Ltd.",
  //     "image":"images/apSecurity.svg",
  //     "staff":"Housekepping Lady",
  //     "price" : "20 Hrs.INR 9500",
  //     "distance":"6",
  //     "rate":3
  //   },
  //   {
  //     "title":"Addbiv Securer Pvt.Ltd.",
  //     "image":"images/addbivSecurer.svg",
  //     "staff":"Housekepping Lady",
  //     "price" : "20 Hrs.INR 14000",
  //     "distance":"7",
  //     "rate":4.2
  //   },
  // ]
  servicesDetails:any[]=[];
  private readonly _formBuilder = inject(FormBuilder);
  // currentRating = this.servicesDetails[0].rate; // Initial rating value
  currentRating:any;
  showFilter: boolean = false;
  // selectedCategory: string = 'Housekeeping Staff';
  selectedCategory:any;
  selectedServiceCategory:any
  selectedServiceCategoryId:any;

  serviceCatId :any;
  catId:any;
  subCatId:any;
  itemDetails: any;
  vendorName:any
  // categories: string[] = ['Housekeeping Staff', 'Pantry Boy', 'Supervisor/Floor Manager', 'Multitasking Staff', 'Electrician/Plumber/Carpenter', 'Horticulter And Landscaping Service'];
  categories:any[]=[];
  categoriesList:any[]=[];
  subCategories:any[]=[];
  latitude:any;
  longitude:any;
  // toppings: FormGroup;
  // Paginator
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Output() page = new EventEmitter<PageEvent>()
  @Input() length = 0;
  @Input() pageIndex = 0;
  @Input() pageSize = 10; //default page size
  @Input() pageSizeOptions: number[] = [5, 10, 25, 100];
  @Input() showPageSizeField = true

  constructor(private fb: FormBuilder, private router: Router, private service:ServicesDetailService) {

    const navigation = this.router.getCurrentNavigation();
    this.selectedServiceCategoryId = navigation?.extras?.state?.['serviceId']; 
    console.log(this.selectedServiceCategoryId,"selectedServiceCategoryId");
  }

  ngOnInit(){
    this.getCurrentLocation()
    // getCategoryList
    this.service.getCategoryList().subscribe((res)=>{
      console.log(res,"categoryList")
      this.categoriesList = res.data;

         // Set the selectedCategory based on selectedServiceCategoryId
         if (this.selectedServiceCategoryId) {
          const selectedCategoryObj = this.categoriesList.find(
            (category) => category.mainId === this.selectedServiceCategoryId
          );
          this.selectedServiceCategory = selectedCategoryObj
            ? selectedCategoryObj.mainId
            : null;
        }
        console.log(this.selectedServiceCategory,"selectedServiceCategory")
    })
    // this.onRatingUpdated(this.currentRating);
   this.getFilterSubCategory(this.selectedServiceCategoryId);
  }
  // Fetch items based on selected category
  fetchItems(catId: any, subCatId: any) {
    console.log(catId,"catId",subCatId,"subCatId")
    this.service.getItemByCategory(catId, subCatId, this.latitude, this.longitude).subscribe((res) => {
      this.servicesDetails = res.data;
      console.log(this.servicesDetails)
      // this.currentRating = this.servicesDetails.reviews
      if (this.servicesDetails.length > 0) {
        this.vendorName = this.servicesDetails[0]?.item?.vendorname;
      }
    });
  }

    // Handle category change
    onCategoryChange(selectedValue: any) {
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
    this.selectedCategory = this.categories[0].SubId;
    console.log(this.selectedCategory,"selectedCategory")
    this.subCatId = this.categories[0].SubId;
    this.catId = this.categories[0].MainId;

    // Fetch items for the default category
    this.fetchItems(this.catId, this.subCatId);
  }
  })
 }

 onCheckboxChange(event: MatCheckboxChange) {
  console.log('Checkbox changed:', event.checked);

  // Handle checkbox change logic here
   this.fetchItems(this.selectedServiceCategory, event);
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
        card: card,
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

  onPageEvent(event: any) {
    this.page.emit(event);
    if (this.pageSize !== event.pageSize) {
      console.log(event.pageSize);
      this.pageSize = event.pageSize;
    }
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
}

