import { Component, Directive, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ServicesDetailService } from '../../service/services-detail.service';
import { environment } from '../../../../../environments/environment.development';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { BehaviorSubject } from 'rxjs';
import { HomeService } from '../../../home/services/home.service';
import { SharedService } from '../../../../shared/services/shared.service';

@Component({
  selector: 'app-services-category',
  templateUrl: './services-category.component.html',
  styleUrl: './services-category.component.scss'
})
export class ServicesCategoryComponent {
  apiUrl: string = environment.ApiBaseUrl;
  searchControl: FormControl = new FormControl('');
  servicesDetails:any[]=[];
  private readonly _formBuilder = inject(FormBuilder);
  currentRating:any;
  showFilter: boolean = false;
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
  couponList:any;
  locations: any[] = [];
  selectedCity: string = '';
  selectedArea: string = '';
  filteredSubgroups: string[] = [];
  allSubgroups: string[] = [];
  originalList:any[]=[];
  selectedSubCategoyId:any;
  // toppings: FormGroup;
  // Paginator
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Output() page = new EventEmitter<PageEvent>()
  @Input() length = 0;
  @Input() pageIndex = 0;
  @Input() pageSize = 12; //default page size
  @Input() pageSizeOptions: number[] = [5, 10, 25, 100];
  @Input() showPageSizeField = true;
  paginator$ = new BehaviorSubject<{pageIndex:number,pageSize:number}|null>({pageIndex:0,pageSize:12})

  constructor(private fb: FormBuilder, private router: Router, private service:ServicesDetailService, private homeService:HomeService, private sharedService:SharedService) {

    const urlSegments = this.router.url.split('/');
    this.selectedServiceCategoryId = urlSegments[urlSegments.length - 1];
    console.log(this.selectedServiceCategoryId, '85');


    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state ?? {};
    // this.selectedServiceCategoryId = state?.['serviceId']; 
    this.location = state['location'] ; // Provide a default value if needed
    this.subCategory = state['subCategory'] ; // Provide a default value if needed
    this.selectedServiceCategoryIdThroughLocationSearch = state['mainId']
    this.selectedServiceSubCategoryIdThroughLocationSearch = state['subId']
  }
// private filteringThroughSubcategory(selectedServiceCategoryId:any):void{
//   const selectedCategoryObj = this.categoriesList.find(
//     (category) => category.mainId === this.selectedServiceCategoryId
//   );
//   this.selectedServiceCategory = selectedCategoryObj
//     ? selectedCategoryObj.mainId
//     : null;
// }

 private filteringThroughSubcategory(selectedServiceCategoryId: any): void {
    const selectedCategoryObj = this.categoriesList.find(
      (category) => category.mainId == this.selectedServiceCategoryId
    );
    console.log(
      '98',
      selectedCategoryObj,
      this.categoriesList,
      this.selectedServiceCategoryId
    );
    this.selectedServiceCategory = selectedCategoryObj
      ? selectedCategoryObj.mainId
      : null;
  }
  ngOnInit(){
    const storedData = localStorage.getItem('serviceDetails');
  if (storedData) {
    const data = JSON.parse(storedData);
    this.servicesDetails = data.items.map((itemWrapper:any) => ({
      ...itemWrapper.item, reviews: itemWrapper.reviews})); // Correctly map to items
      this.totalItems = data.totalItems; 
      console.log(this.servicesDetails,this.servicesDetails[0].reviews,this.totalItems, "service deyails 88")
  }

  this.locations = this.locations?.reduce((acc:any, city:any) => {
    const combinedAreas = city.areas.map((area:any) => `${city.cityName} - ${area.areaName}`);
    return acc.concat(combinedAreas);
  }, []);

    // Subscribe to value changes of the search control
    this.searchControl.valueChanges.subscribe(value => {
      console.log(value,"97");
      this.filteredSubgroups[0] = value;
     
      this.getSearchedItemList();
    });

  this.getLocations()
    this.getCouponList()
    this.getCurrentLocation()
    // getCategoryList
    this.service.getCategoryList().subscribe((res)=>{
      this.categoriesList = res.data;
      this.originalList = [...res?.data];
      this.categoriesList = this.categoriesList?.filter((iterable:any)=> iterable?.status === 1);

         // Set the selectedCategory based on selectedServiceCategoryId
         if (this.selectedServiceCategoryId) {
          this.filteringThroughSubcategory(this.selectedServiceCategoryId);
        }else if(this.selectedServiceCategoryIdThroughLocationSearch){
          this.filteringThroughSubcategory(this.selectedServiceCategoryIdThroughLocationSearch);

        }
    })
    // this.onRatingUpdated(this.currentRating);
    this.selectedServiceCategoryId =  this.selectedServiceCategoryId? this.selectedServiceCategoryId:this.selectedServiceCategoryIdThroughLocationSearch;
   this.getFilterSubCategory(this.selectedServiceCategoryId);
  
}

  fetchItems(catId: any, subCatId: any) {
    this.service.getItemByCategory(catId, subCatId, this.latitude, this.longitude, this.startIndex, this.pageSize).subscribe((res) => {
      if (res.success) {
        this.servicesDetails = res.data.items.map((itemWrapper:any) => ({
          ...itemWrapper.item, reviews: itemWrapper.reviews, vender:itemWrapper.vendor})); // Correctly map to items
        this.totalItems = res.data.totalItems; // Correctly set the total items from the response
  
        if (this.servicesDetails.length > 0) {
          this.vendorName = this.servicesDetails[0]; // Extract vendor name from the first item
        }
  
        this.paginator$.next({ pageIndex: 0, pageSize: 12 });
      } else {
        console.error('Failed to fetch items:', res.message); // Log any errors in fetching items
      }
    });
  }
  
 
    // Handle category change
    onCategoryChange(selectedValue: any) {
      localStorage.removeItem('serviceDetails')
      // Reset all variables to null or default values
      this.selectedServiceCategoryIdThroughLocationSearch = null;
      this.location = null;  // Provide a default value if needed
      this.subCategory = null;  // Provide a default value if needed
      this.selectedServiceSubCategoryIdThroughLocationSearch = null;
      // this.getFilterSubCategory(selectedValue.value);
      // this.subCatId = this.categories.filter(a=>a.SubId);
      // this.catId = this.categories.filter((a)=>a.MainId);
      // console.log(this.subCatId, this.catId, selectedValue.value,this.categories[0].SubClassificationName,"181")

      const selectedSubCategoryId = this.categories?.[0]?.SubId;

        // Navigate
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = "reload";
      this.router.navigate([`/services/category/${this.categories[0].SubClassificationName}/${selectedValue.value}`], {
        state: {
         serviceId: selectedValue.value,
         subId: selectedSubCategoryId,
        }
      });
    }

 getFilterSubCategory(id:any){
  this.service.getSubCategoryList(id).subscribe((res)=>{
    this.categories = res.data;

     // Set the first category as the default selected
  if (this.categories && this.categories.length > 0) {
    this.selectedCategory = this.selectedServiceSubCategoryIdThroughLocationSearch?this.selectedServiceSubCategoryIdThroughLocationSearch:this.categories[0].SubId;
    
    this.categories.forEach((category) => {
      category.isChecked = category.SubId === this.selectedCategory;
    });
    // this.subCatId = this.categories[0].SubId;
    this.selectedSubCategoyId = this.categories[0].SubId;
    this.catId = this.categories[0].MainId;
    this.subCatId = this.selectedCategory;

    // Fetch items for the default category
    if(!this.location)
    this.fetchItems(this.catId, this.subCatId);
  }
  })
 }



onCheckboxChange(subCategoryId: any, event: MatCheckboxChange) {
  if (event.checked) {
    console.log(event,"221")
    // Set the selectedCategory to the newly checked checkbox's value

       // Uncheck all other checkboxes by setting the selectedCategory as the only selected one
    this.categories.forEach((category) => {
      category.isChecked = category.SubId === subCategoryId;
    });

    // this.selectedSubCategoyId = subCategoryId;
    // this.selectedCategory = subCategoryId;
    // console.log(this.selectedSubCategoyId,"231")
    // 
    console.log(subCategoryId,"224")
    // this.fetchItems(this.selectedServiceCategory, subCategoryId);

     // Navigate
     this.router.routeReuseStrategy.shouldReuseRoute = () => false;
     this.router.onSameUrlNavigation = "reload";
   this.router.navigate([`/services/category/${subCategoryId.SubClassificationName}/${subCategoryId.MainId}`], {
     state: {
      serviceId: subCategoryId.MainId,
      subId: subCategoryId.SubId,
      //  location: this.selectedArea
     }
   });

  }
}

  onRatingUpdated(newRating: number) {
    this.currentRating = newRating;
  }

  toggleViewMobile() {
    this.showFilter = !this.showFilter;
  }
  // goToDetail(card:any){
  //   const itemNameDetail = card?.subgroupname?.trim()?.replace(/\s+/g, '-')?.toLowerCase();
  //   const navigationExtras = {
  //     state: {
  //       card: card
  //     }
  //   };
  //   this.router.navigate([`services/service-Details/${itemNameDetail}`], navigationExtras);
  // }

  goToDetail(card: any) {
    const itemNameDetail = card?.subgroupname
      ?.trim()
      ?.replace(/\s+/g, '-')
      ?.toLowerCase();
    const navigationExtras = {
      state: {
        card: card,
      },
    };

    this.router.navigate(
      [`services/service-Details/${itemNameDetail}/${card?.id}`],
      navigationExtras
    );
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


  estimateTotalItems(): number {
    // Estimate based on data or set to a default value
    return 100;  // Placeholder for your logic or approximation
  }

  getCouponList(){
    this.sharedService.getCouponList().subscribe((response:any)=>{
      this.couponList = response.data
    })
  }

  newLocationId:any
  getLocations() {
    this.homeService.getLocation().subscribe((response: any) => {
      const uniqueLocations: any = {};
      this.newLocationId = response.data
      response.data.reduce((acc: any, city: any) => {
        city.areas.forEach((area: any) => {
          area.subgroups.forEach((subgroup: any) => {
            const locationKey = `${city.cityName}|${area.areaName}`;
            if (!uniqueLocations[locationKey]) {
              uniqueLocations[locationKey] = {
                cityName: city.cityName,
                areaName: area.areaName,
                subgroupName: [subgroup.subgroupName],
              };
            } else {
              uniqueLocations[locationKey].subgroupName.push(
                subgroup.subgroupName
              );
            }
          });
        });
        return acc;
      }, []);
      this.locations = Object.values(uniqueLocations);
      this.allSubgroups = this.locations.reduce((acc: string[], loc: any) => {
        acc.push(...loc.subgroupName);
        return acc;
      }, []);
    }); // Store unique subgroups
  }
  

  onCityChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target) {
      const [cityName, areaName] = target.value.split('|');
      this.selectedCity = cityName;
      this.selectedArea = areaName;
      // this.getFilteredSubgroups(); // Trigger filtering when city changes
      // this.fetchItems(this.selectedServiceCategory,this.selectedSubCategoyId)
      this.getSearchedItemList()
    }
  }

  getFilteredSubgroups() {
    if (!this.selectedCity || !this.selectedArea) {
      this.filteredSubgroups = this.allSubgroups;
      console.log(this.filteredSubgroups,'331')
      this.applySearchFilter(); // Apply search filter if applicable
      return;
    }

    const filteredLocations = this.locations.find(
      (location: any) =>
        location.cityName === this.selectedCity &&
        location.areaName === this.selectedArea
    );
    // Extract unique subgroup names
    this.filteredSubgroups = filteredLocations.subgroupName;
    console.log(this.filteredSubgroups,'343')
    // Apply search filtering
    this.applySearchFilter(); // Apply search filter if applicable
  }
  
  applySearchFilter() {
   
    const searchValue = this.searchControl.value.trim().toLowerCase();
    if (searchValue) {
      // Filter already filtered subgroups
      this.filteredSubgroups = this.filteredSubgroups.filter(subgroup =>
        subgroup.toLowerCase().includes(searchValue)
      );
    }
    console.log(this.filteredSubgroups,'357')
  }


  selectedSubGroupId:any;
  selectedSubGroupName:any;
  navigatedCategoryItem:any;
  navigatedSubGroupId:any;
  navigatedMainGroupId:any
  getSearchedItemList(){

    this.selectedSubGroupName = this.selectedCategory;

console.log(this.selectedCategory,this.selectedArea, "370")
// Loop through each city in the response
for (const city of this.newLocationId) {
  // Loop through each area within the current city
  for (const area of city.areas) {
    // Find the subgroup with the matching name
    const subgroup = area.subgroups.find(
      (sub:any) => {return sub.subgroupName === this.selectedSubGroupName  && area?.areaName === this.selectedArea}
    );

    // If found, store the subgroupId and exit both loops
    if (subgroup) {
    this.selectedSubGroupId = subgroup.subgroupId;
      // return this.selectedSubGroupId; // Return immediately once found
    }

    
  }
}

    this.homeService.getSearchedItemList(this.selectedSubGroupName,this.selectedArea,this.latitude,this.longitude).subscribe((res:any)=>{
      
      this.navigatedCategoryItem = res.data.item;
      this.navigatedCategoryItem = res.data.items.map((itemWrapper:any) => itemWrapper.item)
      // 
  
    const uniqueSubgroupIds = new Set(this.navigatedCategoryItem.map((item: any) => item.subgroupid));
    const uniqueMaingroupIds = new Set(this.navigatedCategoryItem.map((item: any) => item.maingroupid));
    
    // Assuming there's only one unique value
    this.navigatedSubGroupId = uniqueSubgroupIds.size === 1 ? Array.from(uniqueSubgroupIds)[0] : null;
    this.navigatedMainGroupId = uniqueMaingroupIds.size === 1 ? Array.from(uniqueMaingroupIds)[0] : null;
    
    
    console.log(this.navigatedMainGroupId,this.navigatedSubGroupId,"453",`/services/category/${this.selectedSubGroupName}/${this.navigatedMainGroupId}`)
    // Navigate
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = "reload";
    this.router.navigate([`/services/category/${this.selectedSubGroupName}/${this.navigatedMainGroupId}`], {
      state: {
        serviceId: this.navigatedMainGroupId,
        subId: this.navigatedSubGroupId,
        location: this.selectedArea
      }
    });
    })
  }

  averageRating:any
calculateAverageRating(reviews:any): any {
  if (reviews) {
    const ratingReview = reviews;

    // Filter out invalid ratings and calculate the average
    const validRatings = ratingReview
      .map((review: any) => parseFloat(review.rating))
      .filter((rating: number) => !isNaN(rating));

    const totalRating = validRatings.reduce((sum:any, rating:any) => sum + rating, 0);
    const averageRating = Math.round((totalRating / validRatings.length) * 10) / 10 || 0; // Calculate average rating
   
    this.averageRating  = averageRating;
  

    return averageRating;
  }
}

navigateToServiceRate() {
  this.router.navigate([`/services/service-rate/${this.selectedServiceCategory}`]);
}


}

