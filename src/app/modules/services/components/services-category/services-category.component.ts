import { Component, Directive, ElementRef, EventEmitter, Inject, inject, Input, Output, PLATFORM_ID, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicesDetailService } from '../../service/services-detail.service';
import { environment } from '../../../../../environments/environment.development';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { BehaviorSubject, Subscription, take } from 'rxjs';
import { HomeService } from '../../../home/services/home.service';
import { SharedService } from '../../../../shared/services/shared.service';
import { isPlatformBrowser, ViewportScroller } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-services-category',
  templateUrl: './services-category.component.html',
  styleUrl: './services-category.component.scss'
})
export class ServicesCategoryComponent implements OnInit {
  apiUrl: string = environment.ApiBaseUrl;
  searchControl: FormControl = new FormControl('');
  servicesDetails:any[]=[];
  private readonly _formBuilder = inject(FormBuilder);
  currentRating:any;
  showFilter = false;
  selectedCategory:any;
  selectedServiceCategory!:number
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
  subCategoryName:any;
  CategoryId:any
  predictions: any[] = [];
  searchInput: string = '';
  placeDetails: any; 
  placesService!: google.maps.places.PlacesService;
  autocompleteService: any;
  searchLocation: string = '';

selectedSubCategoryId:any
categorySeoUrl:any
  // toppings: FormGroup;
  // Paginator
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('selectDropdown') selectDropdown!: ElementRef;


  @Output() page = new EventEmitter<PageEvent>()
  @Input() length = 0;
  @Input() pageIndex = 0;
  @Input() pageSize = 12; //default page size
  @Input() pageSizeOptions: number[] = [5, 10, 25, 100];
  @Input() showPageSizeField = true;
  isBrowser!: boolean;
  paginator$ = new BehaviorSubject<{pageIndex:number,pageSize:number}|null>({pageIndex:0,pageSize:12})
  myState: boolean | undefined;
  locationSubscription$!:Subscription;
  constructor(private fb: FormBuilder, private router: Router, private service:ServicesDetailService, private homeService:HomeService, private sharedService:SharedService, private route:ActivatedRoute, @Inject(PLATFORM_ID) platformId: Object, private viewportScroller: ViewportScroller, private metaService: Meta,
  private titleService: Title) {
    this.isBrowser = isPlatformBrowser(platformId);
    if(this.isBrowser){
    this.placesService = new google.maps.places.PlacesService(document.createElement('div'));
    }

    const navigation = this.router.getCurrentNavigation();
    console.log(navigation,"90")
    if (navigation?.extras.state) {
      this.myState = navigation.extras.state['myState'];
      this.subCategoryName = navigation.extras.state['subcategory']
      console.log('State from navigation:', this.myState, this.subCategoryName);
    }

    const urlSegments = this.router.url.split('/');
    this.selectedServiceCategoryId = urlSegments[urlSegments.length - 1];

  // Subscribe to route parameters
this.route.paramMap.subscribe((params: any) => {
  console.log(params,"101", params?.params?.categorySeoUrl)
  this.categorySeoUrl = params?.params?.categorySeoUrl
  // this.subCategoryName = decodeURIComponent(params.get('categoryName'));
  // this.subCategoryName = this.subCategoryName.replaceAll('$', '/');
  // this.CategoryId = params.get('id');
   // Convert string to number
  this.selectedServiceCategory = this.CategoryId; // Set the selected category to match the id
});

// Subscribe to query parameters
this.route.queryParams.subscribe(params => {
  this.latitude = params['latitude'] ? params['latitude'] : 0;
  this.longitude = params['longitude'] ? params['longitude'] : 0;
  this.searchLocation = params['locations'];
});

    if(this.searchLocation){
      this.searchInput = this.searchLocation
    }

    // if (this.CategoryId) {
    //   // Call the API to fetch subcategories and match the name
    //   // this.getFilterSubCategory(this.CategoryId);
    // }
}

 private filteringThroughSubcategory(selectedServiceCategoryId: any): void {
    const selectedCategoryObj = this.categoriesList.find(
      (category) => category.mainId == this.selectedServiceCategoryId
    );
    this.selectedServiceCategory = selectedCategoryObj
      ? +selectedCategoryObj.mainId
      : +this.CategoryId;
  }
  ngOnInit(){
    if(this.isBrowser){

  // Subscribe to the change detection event
  this.locationSubscription$ = this.service.locationChanged$?.subscribe(() => {
    console.log('Location changed detected in category component');
    // Perform actions when the location changes
    setTimeout(()=>{
      this.latitude = sessionStorage.getItem('latitude');
      this.longitude = sessionStorage.getItem('longitude')
      console.log(this.latitude, this.longitude, "140")
    this.getFilterSubCategory(this.CategoryId);
    }, 1000)
 
  });

      const selectedCategoriesString = localStorage.getItem('selectedCategories');
      this.selectedCategories = selectedCategoriesString ? JSON.parse(selectedCategoriesString) : [];

      const selectedServicesName = localStorage.getItem('serviceName');
      this.servicesName = selectedServicesName ? JSON.parse(selectedServicesName) : [];

      this.myState = JSON.parse(localStorage.getItem('myState') || 'false');
    
    this.viewportScroller.scrollToPosition([0, 0]); 

    if (this.categorySeoUrl) {
      // Fetch meta tags from the API for the current page
      this.sharedService.getMetaTags(this.categorySeoUrl).subscribe((res: any) => {
        if (res?.success) {
          const metaData = res.data;

          // Update the title
          this.titleService.setTitle(metaData.title || 'Default Title');
          console.log('Updating meta tags with:', metaData);
          // Update meta tags
          this.metaService.addTags([
            { name: 'description', content: metaData.description || 'Default description' },
            { name: 'keywords', content: metaData.keywords || 'default, keywords' },
            { property: 'og:title', content: metaData.ogTitle || metaData.title },
            { property: 'og:description', content: metaData.ogDescription || metaData.description },
            { property: 'og:image', content: metaData.ogImage || 'default-image-url.jpg' }
          ]);
          console.log('Meta tags updated');
        }
      });
    }


    this.autocompleteService = new google.maps.places.AutocompleteService();

    // Subscribe to value changes of the search control
    this.searchControl.valueChanges.subscribe(value => {
      this.filteredSubgroups[0] = value;
     
      // this.getSearchedItemList();
    });

  // this.getLocations()
    this.getCouponList()
    this.getBannerData()
    if(!sessionStorage.getItem('latitude')){
      this.getCurrentLocation()
    }else{
      this.latitude = sessionStorage.getItem('latitude');
      this.longitude = sessionStorage.getItem('longitude')
    }
    // getCategoryList
    this.service.getCategoryList().subscribe((res)=>{
      this.categoriesList = res.data;
      console.log(this.categoriesList,"203")
      this.originalList = [...res?.data];
      this.categoriesList = this.categoriesList?.filter((iterable:any)=> iterable?.status === 1);
      const selectedService = this.categoriesList?.find(record => record?.categoryseourl === this.categorySeoUrl);
      this.CategoryId = selectedService ? selectedService.mainId : null;      
if(this.CategoryId){
  this.getFilterSubCategory(this.CategoryId);
}
console.log(selectedService, this.CategoryId, "210", this.categorySeoUrl)
         // Set the selectedCategory based on selectedServiceCategoryId
         if (this.selectedServiceCategoryId) {
          this.filteringThroughSubcategory(this.selectedServiceCategoryId);
        }else if(this.selectedServiceCategoryIdThroughLocationSearch){
          this.filteringThroughSubcategory(this.selectedServiceCategoryIdThroughLocationSearch);

        }
    })
    // this.onRatingUpdated(this.currentRating);
    this.selectedServiceCategoryId =  this.selectedServiceCategoryId? this.selectedServiceCategoryId:this.selectedServiceCategoryIdThroughLocationSearch;
  //  this.getFilterSubCategory(this.selectedServiceCategoryId);
  
}
  }

  fetchItems(catId: any, subCatId: any, servicesName:any) {
    this.service.getItemByCategory(catId, subCatId, servicesName, this.latitude, this.longitude, this.startIndex, this.pageSize).subscribe((res) => {
      if (res.success) {
        this.servicesDetails = res.data.items.map((itemWrapper:any) => ({
          ...itemWrapper.item, reviews: itemWrapper.reviews, vender:itemWrapper.vendor})); // Correctly map to items
        this.totalItems = res.data.totalItems; // Correctly set the total items from the response
  
        if (this.servicesDetails.length > 0) {
          this.vendorName = this.servicesDetails[0]; // Extract vendor name from the first item
        }
  
        this.paginator$.next({ pageIndex: 0, pageSize: 12 });
      } 
    });
  }

    // onCategoryChange(selectedValue: any) {
    //   this.CategoryId = selectedValue.value
    
    //   // Reset all variables to null or default values
    //   this.selectedServiceCategoryIdThroughLocationSearch = null;
    //   this.location = null;
    //   this.subCategory = null;
    //   this.selectedServiceSubCategoryIdThroughLocationSearch = null;
    
    //   // Fetch the updated subcategory list based on the selected value
    //   this.service.getSubCategoryList(this.CategoryId).subscribe((res:any) => {
    //     this.categories = res.data; // Update the category list with new data
    
    //     if (this.categories && this.categories.length > 0) {
    //       this.subCategoryName = this.categories[0].SubClassificationName;
    
    //       // Set navigation options
    //       this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    //       this.router.onSameUrlNavigation = 'reload';
    
    //       if(!this.searchLocation){
    //      // Navigate using updated category name and ID
    //         this.router.navigate([`/services/category/${this.subCategoryName?.replaceAll("/","$")}/${this.CategoryId}`]);
    //       }else{
    //         this.router.navigate([
    //           `/services/category/${this.subCategoryName?.replaceAll("/","$")}/${this.CategoryId}`
    //         ], {
    //           queryParams: {
    //             latitude: this.latitude,
    //             longitude: this.longitude,
    //             locations: this.searchLocation
    //           }
    //         });
    //       }


    //     } 
    //   }, (error:any) => {
    //     console.error('Error fetching subcategories:', error);
    //   });
    // }

    
getFilterSubCategory(id: any) {
  console.log(id,'category id')
//   this.service.getSubCategoryList(id).subscribe((res) => {
//     this.categories = res.data;
//     if (this.categories && this.categories.length > 0) {
//       // Attempt to find the category by name
//       const matchedCategory = this.categories.filter(
//         (category) => category.SubClassificationName.toLowerCase() === this.subCategoryName.toLowerCase()
//       );
//       console.log(matchedCategory,'256',this.subCategoryName);
//       // if(this.searchLocation){
//       //   console.log('location', matchedCategory[0]?.SubId)
//       //  this.selectedCategories.push(matchedCategory[0]?.SubId)
//       // }
//        // Run your logic here based on the state
//        if (this.myState) {
//         // Your code to run when myState is true
//         this.selectedCategories.push(matchedCategory[0]?.SubId)
//       }
//       if (matchedCategory) {
//         // this.selectedSubCategoryId = this.selectedCategories;
//         // Mark the matched category as checked
//         this.selectedCategories?.forEach((subCategory) => {
//           this.categories.forEach((category) => {
//             if (category.SubId === subCategory) {
//               category.isChecked = true;
//             }
//           });
//         });
//       console.log(this.CategoryId,this.selectedCategories)
// if(!this.searchLocation){
//   // this.fetchItems(this.CategoryId, this.selectedSubCategoryId);
//   this.fetchItems(this.CategoryId, this.selectedCategories);
// }else{
//   this.getItemByLocation()
// }
//         // Fetch items for the matched category
//       }
     
//     } 
//   });



this.service.getSubCategoryBySpecificationName(id).subscribe((res) => {
  this.categories = res.data;
  if (this.categories && this.categories.length > 0) {

    console.log(this.categories, this.subCategoryName,"322")
    // Attempt to find the category by name
    if(!this.myState){
    const matchedCategory = this.categories.filter(
      (category) => category.serviceName.toLowerCase() === this.subCategoryName?.toLowerCase()
    );
    console.log(matchedCategory,"343")
  }
    console.log('342',this.subCategoryName);
    // if(this.searchLocation){
    //   console.log('location', matchedCategory[0]?.SubId)
    //  this.selectedCategories.push(matchedCategory[0]?.SubId)
    // }
     // Run your logic here based on the state
     if (this.myState) {
      // Your code to run when myState is true
      const categoryNumber = Number(this.subCategoryName); // Convert the subcategory name to a number

      if (!this.selectedCategories.includes(categoryNumber)) {
        this.selectedCategories.push(categoryNumber);
        }  // Only push if it's not already in the array
      localStorage.setItem('selectedCategories', JSON.stringify(this.selectedCategories));
    }
    // if (matchedCategory) {
      // this.selectedSubCategoryId = this.selectedCategories;
      // Mark the matched category as checked
      this.servicesName?.forEach((serviceName:string) => {
        this.categories.forEach((category) => {
          if (category.serviceName === serviceName) {
            category.isChecked = true;
          }
        });
      });
    console.log(this.CategoryId,this.selectedCategories, this.servicesName)
if(!this.searchLocation){
// this.fetchItems(this.CategoryId, this.selectedSubCategoryId);
this.fetchItems(this.CategoryId, this.selectedCategories, this.servicesName);
}else{
this.getItemByLocation()
}
      // Fetch items for the matched category
    // }
   
  } 
});


}



// onCheckboxChange(subCategoryId: any, event: MatCheckboxChange) {
//   if (event.checked) {
//     // Set the selectedCategory to the newly checked checkbox's value

//        // Uncheck all other checkboxes by setting the selectedCategory as the only selected one
//     this.categories.forEach((category) => {
//       category.isChecked = category.SubId === subCategoryId;
//     }); 

//     this.subCategoryName = subCategoryId.SubClassificationName
//     this.CategoryId = subCategoryId.MainId
//      // Navigate
//      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
//      this.router.onSameUrlNavigation = "reload";
//      if(!this.searchLocation){
//        this.router.navigate([`/services/category/${this.subCategoryName?.replaceAll("/","$")}/${this.CategoryId}`])
//      }else{
//       this.router.navigate([
//         `/services/category/${this.subCategoryName?.replaceAll("/","$")}/${this.CategoryId}`
//       ], {
//         queryParams: {
//           latitude: this.latitude,
//           longitude: this.longitude,
//           locations: this.searchLocation
//         }
//       });
//      }

//   }
// }

selectedCategories!: number[] // This array will hold the selected SubIds.
servicesName:any = [];

// onCheckboxChange(subCategory: any, event: MatCheckboxChange) {
  
//   subCategory.isChecked = event.checked;
// console.log(subCategory,"338",this.selectedCategories);

//   if (event.checked) {
//     console.log('checkedddddddd')
//         this.categories.forEach((category) => {
//           console.log(category,subCategory)
//       category.isChecked = category.serviceName === subCategory.serviceName;
//     }); 

//     this.servicesName.push(subCategory.serviceName)
//     console.log(subCategory.SubIds?.split(",")?.map(Number),this.selectedCategories);
//     // Add the checked SubId to the selectedCategories array
//     if(!this.myState){
//     if (!this.selectedCategories?.includes(subCategory.SubIds)) {
//       console.log(this.selectedCategories,"344");
//       let arr :number[]= [];
//       subCategory.SubIds?.split(",")?.map((id:string)=> {if(id){arr?.push(Number(id))}});
//       this.selectedCategories = arr;
//       console.log(this.selectedCategories,arr);
//     }}
//   } else {
//     console.log('uncheckedddddddddddd')
//     // Remove the unchecked SubId from the selectedCategories array
//     const index = this.selectedCategories?.indexOf(subCategory.SubIds);
//     if (index > -1) {
      
//       this.selectedCategories?.splice(index, 1); // Remove by index
//       console.log(this.selectedCategories,"this.selectedCategories")
//     }

//     const serviceIndex = this.servicesName?.indexOf(subCategory.serviceName);
//     if (serviceIndex > -1) {
      
//       this.servicesName?.splice(serviceIndex, 1); // Remove by index
//       console.log(this.servicesName,"this.servicesName")
//     }
  
//   }

//   console.log('Selected Categories:', this.selectedCategories);
//   if(!this.myState){
//   localStorage.setItem('selectedCategories', JSON.stringify(this.selectedCategories));
//   }
//   localStorage.setItem('serviceName', JSON.stringify(this.servicesName));
//   // Constructing the navigation URL based on the selected subcategories
//   const subCategoryParam = this.selectedCategories?.join(','); // Create a string with selected subCategoryIds

//   // Navigation logic
//   this.router.routeReuseStrategy.shouldReuseRoute = () => false; // Prevent route reuse
//   this.router.onSameUrlNavigation = 'reload'; // Reload the same URL

//   if (!this.selectedCategories.length) {
//     this.selectedCategories = [];
//     this.selectedCategories?.push(1);
//   }

//   // Check if any subcategories are selected
//   // if (this.selectedCategories.length > 0) {
//     this.router.navigate([
//       `/services/category/${this.selectedCategories?.join(',')?.replaceAll('/', '$')}/${this.CategoryId}`
//     ], {
//       queryParams: {
//         subCategories: this.selectedCategories, // Pass the selected subcategories as query parameters
//         latitude: this.latitude,
//         longitude: this.longitude,
//         locations: this.searchLocation
//       }
//     });
//   // }
// }


onCheckboxChange(subCategory: any, event: MatCheckboxChange) {
if( localStorage.getItem('selectedCategories')){
  const selectedCategoriesString = localStorage.getItem('selectedCategories');
  this.selectedCategories = selectedCategoriesString ? JSON.parse(selectedCategoriesString) : [];
}
if( localStorage.getItem('serviceName')){
  const selectedServicesName = localStorage.getItem('serviceName');
  this.servicesName = selectedServicesName ? JSON.parse(selectedServicesName) : [];
}
  subCategory.isChecked = event.checked;
console.log(subCategory,"338",this.selectedCategories);

  if (event.checked) {
    console.log('checkedddddddd')
    //     this.categories.forEach((category) => {
    //       console.log(category,subCategory)
    //   category.isChecked = category.serviceName === subCategory.serviceName;
    // }); 

    this.servicesName?.forEach((serviceName:string) => {
      this.categories.forEach((category) => {
        if (category.serviceName === serviceName) {
          category.isChecked = true;
        }
      });
    });

    this.servicesName.push(subCategory.serviceName)
    console.log(subCategory.SubIds?.split(",")?.map(Number),this.selectedCategories);
    // Add the checked SubId to the selectedCategories array
    if(!this.myState){
    if (!this.selectedCategories?.includes(subCategory.SubIds)) {
      console.log(this.selectedCategories,"344");
      let arr :number[]= [];
      subCategory.SubIds?.split(",")?.map((id:string)=> {if(id){arr?.push(Number(id))}});
      this.selectedCategories = arr;
      console.log(this.selectedCategories,arr);
    }}
  } else {
    console.log('uncheckedddddddddddd')
    // Remove the unchecked SubId from the selectedCategories array
    const index = this.selectedCategories?.indexOf(subCategory.SubIds);
    if (index > -1) {
      
      this.selectedCategories?.splice(index, 1); // Remove by index
      console.log(this.selectedCategories,"this.selectedCategories")
    }

    const serviceIndex = this.servicesName?.indexOf(subCategory.serviceName);
    if (serviceIndex > -1) {
      
      this.servicesName?.splice(serviceIndex, 1); // Remove by index
      console.log(this.servicesName,"this.servicesName")
    }
  
  }

  console.log('Selected Categories:', this.selectedCategories);
  if(!this.myState){
  localStorage.setItem('selectedCategories', JSON.stringify(this.selectedCategories));
  }
  localStorage.setItem('serviceName', JSON.stringify(this.servicesName));
  // Constructing the navigation URL based on the selected subcategories
  const subCategoryParam = this.selectedCategories?.join(','); // Create a string with selected subCategoryIds

  // Navigation logic
  this.router.routeReuseStrategy.shouldReuseRoute = () => false; // Prevent route reuse
  this.router.onSameUrlNavigation = 'reload'; // Reload the same URL

  if (!this.selectedCategories.length) {
    this.selectedCategories = [];
    this.selectedCategories?.push(1);
  }

  // Check if any subcategories are selected
  // if (this.selectedCategories.length > 0) {
    // this.router.navigate([
    //   `/services/category/${this.selectedCategories?.join(',')?.replaceAll('/', '$')}/${this.CategoryId}`
    // ], {
    //   queryParams: {
    //     subCategories: this.selectedCategories, // Pass the selected subcategories as query parameters
    //     latitude: this.latitude,
    //     longitude: this.longitude,
    //     locations: this.searchLocation
    //   }
    // });
  // }
  this.fetchItems(this.CategoryId, this.selectedCategories, this.servicesName); 
}


  onRatingUpdated(newRating: number) {
    this.currentRating = newRating;
  }

  toggleViewMobile() {
    this.showFilter = !this.showFilter;
  }

  goToDetail(card: any) {
    const itemNameDetail = card?.serviceSeoUrl
      ?.trim()
      ?.replace(/\s+/g, '-')
      ?.toLowerCase();
    const navigationExtras = {
      state: {
        card: card,
      },
    };

    this.router.navigate(
      [`services/service-Details/${itemNameDetail}/${card?.id}`]
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
    if(!this.searchLocation){
    // this.fetchItems(this.CategoryId, this.selectedSubCategoryId);  // Fetch new items based on updated page
    this.fetchItems(this.CategoryId, this.selectedCategories, this.servicesName); 
    }else{
      this.getItemByLocation()
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
          console.log(this.latitude, this.longitude,"373")
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

  // newLocationId:any
  // getLocations() {
  //   this.homeService.getLocation().subscribe((response: any) => {
  //     const uniqueLocations: any = {};
  //     this.newLocationId = response.data
  //     response.data.reduce((acc: any, city: any) => {
  //       city.areas.forEach((area: any) => {
  //         area.subgroups.forEach((subgroup: any) => {
  //           const locationKey = `${city.cityName}|${area.areaName}`;
  //           if (!uniqueLocations[locationKey]) {
  //             uniqueLocations[locationKey] = {
  //               cityName: city.cityName,
  //               areaName: area.areaName,
  //               subgroupName: [subgroup.subgroupName],
  //             };
  //           } else {
  //             uniqueLocations[locationKey].subgroupName.push(
  //               subgroup.subgroupName
  //             );
  //           }
  //         });
  //       });
  //       return acc;
  //     }, []);
  //     this.locations = Object.values(uniqueLocations);
  //     this.allSubgroups = this.locations.reduce((acc: string[], loc: any) => {
  //       acc.push(...loc.subgroupName);
  //       return acc;
  //     }, []);
  //   }); // Store unique subgroups
  // }

  getFilteredSubgroups() {
    if (!this.selectedCity || !this.selectedArea) {
      this.filteredSubgroups = this.allSubgroups;
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

onInputChange() {
  // Fetch predictions when the user types
  if (this.searchInput) {
    this.getPlacePredictions(this.searchInput);
  } else {
    this.predictions = []; // Clear predictions if the input is empty
  }
}

getPlacePredictions(input: string) {
  const request = {
    input,
    types: ['(regions)'], // Fetch regions, cities, countries, etc.
  };

  // Use Google's AutocompleteService to get place predictions
  this.autocompleteService.getPlacePredictions(request, (predictions: any[], status: any) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
      this.predictions = predictions;
    } else {
      this.predictions = [];
    }
  });
}

selectPrediction(event: any) {
  // Get selected prediction from the dropdown
  const selectedDescription = event.target.value;
  this.searchInput = selectedDescription;

  // Find the selected place
  const selectedPrediction = this.predictions.find(prediction => prediction.description === selectedDescription);

  if (selectedPrediction) {
    const placeId = selectedPrediction.place_id; // Ensure 'place_id' is available in predictions

    // Fetch place details
    const request = {
      placeId: placeId,
      fields: ['geometry'] // Request geometry to get latitude and longitude
    };

    this.placesService?.getDetails(request, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && place && place.geometry) {
        const location = place.geometry.location;
        if (location) {
          this.placeDetails = {
            lat: location.lat(),
            lng: location.lng()
          };
          // Clear predictions after selection to close the dropdown
          this.predictions = []; 

          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = "reload";
          this.router.navigate([
              `/services/category/${this.subCategoryName?.replaceAll("/","$")}/${this.CategoryId}`
            ], {
              queryParams: {
                latitude: this.placeDetails.lat,
                longitude: this.placeDetails.lng,
                locations: this.searchInput
              }
            });
        }
      } 
    });
  } 
}


getItemByLocation(){
  this.searchLocation = (sessionStorage.getItem('address') as string | null) || '';
this.latitude=sessionStorage.getItem('latitude')
this.longitude=sessionStorage.getItem('longitude')

  this.selectedCategories = this.selectedCategories?.filter((c)=>c !== null);
  this.service.getServiceLocationWise(this.selectedCategories,this.servicesName,this.searchLocation,this.latitude,this.longitude).subscribe((response:any)=>{
    if (response.success) {
      this.servicesDetails = response.data.items.map((itemWrapper:any) => ({
        ...itemWrapper.item, reviews: itemWrapper.reviews, vender:itemWrapper.vendor})); // Correctly map to items
      this.totalItems = response.data.totalItems; // Correctly set the total items from the response

      if (this.servicesDetails.length > 0) {
        this.vendorName = this.servicesDetails[0]; // Extract vendor name from the first item
      }

      this.paginator$.next({ pageIndex: 0, pageSize: 12 });
    } 
  })
}
offerData:any;
offerListData:any
getBannerData(){
  this.homeService.getHomeDetails().subscribe((res: any) => {
    // Treat res.data as an object with dynamic keys
    this.offerData = res.data as Record<string, any>;
    // Accessing the Bottom section and sorting
    const ServiceSideImage = this.offerData['ServiceSideImage'];
    if (ServiceSideImage) {
      this.offerListData = ServiceSideImage.sort((a: any, b: any) => a.Seqno - b.Seqno);
    } 
  });

  
}

ngOnDestroy(): void {
  if(this.isBrowser){
  //Called once, before the instance is destroyed.
  //Add 'implements OnDestroy' to the class.
  if(!this.router.url?.includes('services/category')){
    localStorage.removeItem('selectedCategories');
    localStorage.removeItem('serviceName');
    localStorage.removeItem('myState');
  }
  this.locationSubscription$?.unsubscribe();
}
}

}

