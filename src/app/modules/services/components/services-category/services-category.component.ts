import { Component, Directive, ElementRef, EventEmitter, Inject, inject, Input, Output, PLATFORM_ID, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicesDetailService } from '../../service/services-detail.service';
import { environment } from '../../../../../environments/environment.development';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { BehaviorSubject } from 'rxjs';
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
  searchLocation!:''
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

  constructor(private fb: FormBuilder, private router: Router, private service:ServicesDetailService, private homeService:HomeService, private sharedService:SharedService, private route:ActivatedRoute, @Inject(PLATFORM_ID) platformId: Object, private viewportScroller: ViewportScroller, private metaService: Meta,
  private titleService: Title) {
    this.isBrowser = isPlatformBrowser(platformId);
    if(this.isBrowser){
    this.placesService = new google.maps.places.PlacesService(document.createElement('div'));
    }
    const urlSegments = this.router.url.split('/');
    this.selectedServiceCategoryId = urlSegments[urlSegments.length - 1];

  // Subscribe to route parameters
this.route.paramMap.subscribe((params: any) => {
  this.subCategoryName = decodeURIComponent(params.get('categoryName'));
  this.subCategoryName = this.subCategoryName.replaceAll('$', '/');
  this.CategoryId = params.get('id'); // Convert string to number
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

    if (this.CategoryId) {
      // Call the API to fetch subcategories and match the name
      this.getFilterSubCategory(this.CategoryId);
    }
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
    this.viewportScroller.scrollToPosition([0, 0]); 

console.log(this.subCategoryName,"126")

    if (this.subCategoryName) {
      // Fetch meta tags from the API for the current page
      this.sharedService.getMetaTags(this.subCategoryName).subscribe((res: any) => {
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
  //  this.getFilterSubCategory(this.selectedServiceCategoryId);
  
}
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
      } 
    });
  }

    onCategoryChange(selectedValue: any) {
      this.CategoryId = selectedValue.value
    
      // Reset all variables to null or default values
      this.selectedServiceCategoryIdThroughLocationSearch = null;
      this.location = null;
      this.subCategory = null;
      this.selectedServiceSubCategoryIdThroughLocationSearch = null;
    
      // Fetch the updated subcategory list based on the selected value
      this.service.getSubCategoryList(this.CategoryId).subscribe((res:any) => {
        this.categories = res.data; // Update the category list with new data
    
        if (this.categories && this.categories.length > 0) {
          this.subCategoryName = this.categories[0].SubClassificationName;
    
          // Set navigation options
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
    
          if(!this.searchLocation){
         // Navigate using updated category name and ID
            this.router.navigate([`/services/category/${this.subCategoryName?.replaceAll("/","$")}/${this.CategoryId}`]);
          }else{
            this.router.navigate([
              `/services/category/${this.subCategoryName?.replaceAll("/","$")}/${this.CategoryId}`
            ], {
              queryParams: {
                latitude: this.latitude,
                longitude: this.longitude,
                locations: this.searchLocation
              }
            });
          }


        } 
      }, (error:any) => {
        console.error('Error fetching subcategories:', error);
      });
    }
    
selectedSubCategoryId:any
// selectedSubCategoryName:any
getFilterSubCategory(id: any) {
  this.service.getSubCategoryList(id).subscribe((res) => {
    this.categories = res.data;
    if (this.categories && this.categories.length > 0) {
      // Attempt to find the category by name
      const matchedCategory = this.categories.find(
        (category) => category.SubClassificationName.toLowerCase() === this.subCategoryName.toLowerCase()
      );
      this.CategoryId = matchedCategory.MainId

      if (matchedCategory) {
        this.selectedSubCategoryId = matchedCategory.SubId;
        // Mark the matched category as checked
        this.categories.forEach((category) => {
          category.isChecked = category.SubId === this.selectedSubCategoryId;
        });
if(!this.searchLocation){
  this.fetchItems(this.CategoryId, this.selectedSubCategoryId);
}else{
  this.getItemByLocation()
}
        // Fetch items for the matched category
      } 
    } 
  });
}



onCheckboxChange(subCategoryId: any, event: MatCheckboxChange) {
  if (event.checked) {
    // Set the selectedCategory to the newly checked checkbox's value

       // Uncheck all other checkboxes by setting the selectedCategory as the only selected one
    this.categories.forEach((category) => {
      category.isChecked = category.SubId === subCategoryId;
    }); 

    this.subCategoryName = subCategoryId.SubClassificationName
    this.CategoryId = subCategoryId.MainId
     // Navigate
     this.router.routeReuseStrategy.shouldReuseRoute = () => false;
     this.router.onSameUrlNavigation = "reload";
     if(!this.searchLocation){
       this.router.navigate([`/services/category/${this.subCategoryName?.replaceAll("/","$")}/${this.CategoryId}`])
     }else{
      this.router.navigate([
        `/services/category/${this.subCategoryName?.replaceAll("/","$")}/${this.CategoryId}`
      ], {
        queryParams: {
          latitude: this.latitude,
          longitude: this.longitude,
          locations: this.searchLocation
        }
      });
     }

  }
}

  onRatingUpdated(newRating: number) {
    this.currentRating = newRating;
  }

  toggleViewMobile() {
    this.showFilter = !this.showFilter;
  }

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
    this.fetchItems(this.CategoryId, this.selectedSubCategoryId);  // Fetch new items based on updated page
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
  this.service.getServiceLocationWise(this.selectedSubCategoryId,this.searchLocation,this.latitude,this.longitude).subscribe((response:any)=>{
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

}

