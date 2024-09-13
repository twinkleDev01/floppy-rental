import { Component, Directive, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
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
  paginator$ = new BehaviorSubject<{pageIndex:number,pageSize:number}|null>({pageIndex:0,pageSize:12})

  constructor(private fb: FormBuilder, private router: Router, private service:ServicesDetailService, private homeService:HomeService, private sharedService:SharedService, private route:ActivatedRoute) {

    const urlSegments = this.router.url.split('/');
    this.selectedServiceCategoryId = urlSegments[urlSegments.length - 1];
    console.log(this.selectedServiceCategoryId, '85');


    // const navigation = this.router.getCurrentNavigation();
    // const state = navigation?.extras?.state ?? {};
    // // this.selectedServiceCategoryId = state?.['serviceId']; 
    // this.location = state['location'] ; // Provide a default value if needed
    // this.subCategory = state['subCategory'] ; // Provide a default value if needed
    // this.selectedServiceCategoryIdThroughLocationSearch = state['mainId']
    // this.selectedServiceSubCategoryIdThroughLocationSearch = state['subId']

    // Subscribe to route parameters
    this.route.paramMap.subscribe((params:any) => {
      console.log(params,"89")
     this.subCategoryName = params.get('categoryName');
      this.CategoryId = params.get('id');
      this.selectedServiceCategory = params.get('id');
    })

    this.route.queryParams.subscribe(params => {
      console.log(params,"97")
      this.latitude = params['latitude']?params['latitude']:0;
    this.longitude = params['longitude']?params['longitude']:0;
    this.searchLocation = params['locations'];
      console.log(this.latitude, this.longitude);
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
      ? selectedCategoryObj.mainId
      : null;
      console.log(this.selectedServiceCategory,"selectedServiceCategory 117")
  }
  ngOnInit(){
    this.autocompleteService = new google.maps.places.AutocompleteService();

    const storedData = localStorage.getItem('serviceDetails');
  if (storedData) {
    const data = JSON.parse(storedData);
    this.servicesDetails = data.items.map((itemWrapper:any) => ({
      ...itemWrapper.item, reviews: itemWrapper.reviews, vender:itemWrapper.vendor})); // Correctly map to items
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
    // this.getCurrentLocation()
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

  fetchItems(catId: any, subCatId: any) {
    this.service.getItemByCategory(catId, subCatId, this.latitude, this.longitude, this.startIndex, this.pageSize).subscribe((res) => {
      if (res.success) {
        this.servicesDetails = res.data.items.map((itemWrapper:any) => ({
          ...itemWrapper.item, reviews: itemWrapper.reviews, vender:itemWrapper.vendor})); // Correctly map to items
        this.totalItems = res.data.totalItems; // Correctly set the total items from the response

        // this.servicesDetails = this.servicesDetails.find((item:any)=>item.status === 'Aproved')
        // console.log(this.servicesDetails,"173")
  
        if (this.servicesDetails.length > 0) {
          this.vendorName = this.servicesDetails[0]; // Extract vendor name from the first item
        }
  
        this.paginator$.next({ pageIndex: 0, pageSize: 12 });
      } else {
        console.error('Failed to fetch items:', res.message); // Log any errors in fetching items
      }
    });
  }

    onCategoryChange(selectedValue: any) {
      console.log(selectedValue.value,"211")
      this.CategoryId = selectedValue.value
      // Remove previous service details from localStorage
      localStorage.removeItem('serviceDetails');
    
      // Reset all variables to null or default values
      this.selectedServiceCategoryIdThroughLocationSearch = null;
      this.location = null;
      this.subCategory = null;
      this.selectedServiceSubCategoryIdThroughLocationSearch = null;
    
      // Fetch the updated subcategory list based on the selected value
      this.service.getSubCategoryList(this.CategoryId).subscribe((res:any) => {
        this.categories = res.data; // Update the category list with new data
    
        if (this.categories && this.categories.length > 0) {
          const selectedSubCategoryName = this.categories[0].SubClassificationName;
    
          // Set navigation options
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
    
          // Navigate using updated category name and ID
          this.router.navigate([`/services/category/${selectedSubCategoryName}/${this.CategoryId}`]);
        } else {
          console.error('No categories found in response.');
        }
      }, (error:any) => {
        console.error('Error fetching subcategories:', error);
      });
    }
    
selectedSubCategoryId:any
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
        console.log('Matched Sub ID:', this.selectedSubCategoryId);

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
      } else {
        console.error('No matching subcategory found for name:', this.subCategoryName);
        // Handle the case where no match is found
      }
    } else {
      console.error('No subcategories available.');
    }
  });
}



onCheckboxChange(subCategoryId: any, event: MatCheckboxChange) {
  if (event.checked) {
    console.log(event,"221")
    // Set the selectedCategory to the newly checked checkbox's value

       // Uncheck all other checkboxes by setting the selectedCategory as the only selected one
    this.categories.forEach((category) => {
      category.isChecked = category.SubId === subCategoryId;
    }); 

     // Navigate
     this.router.routeReuseStrategy.shouldReuseRoute = () => false;
     this.router.onSameUrlNavigation = "reload";
   this.router.navigate([`/services/category/${subCategoryId.SubClassificationName}/${subCategoryId.MainId}`])

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
      console.log(this.predictions,"539")
    } else {
      this.predictions = [];
    }
  });
}

selectPrediction(event: any) {
  // Get selected prediction from the dropdown
  const selectedDescription = event.target.value;
  this.searchInput = selectedDescription;
  // this.predictions = []; // Clear predictions after selection
  console.log('Selected Description:', selectedDescription);

  // Log predictions to verify their content
  console.log('Available Predictions:', this.predictions);

  // Find the selected place
  const selectedPrediction = this.predictions.find(prediction => prediction.description === selectedDescription);

  if (selectedPrediction) {
    const placeId = selectedPrediction.place_id; // Ensure 'place_id' is available in predictions
    console.log('Place ID:', placeId, "562");

    // Fetch place details
    const request = {
      placeId: placeId,
      fields: ['geometry'] // Request geometry to get latitude and longitude
    };

    this.placesService.getDetails(request, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && place && place.geometry) {
        const location = place.geometry.location;
        if (location) {
          console.log('Latitude:', location.lat());
          console.log('Longitude:', location.lng());
          this.placeDetails = {
            lat: location.lat(),
            lng: location.lng()
          };
          this.predictions = [];
          console.log('Location:', location, 'Place Details:', this.placeDetails);

           // Optionally, trigger a change event to ensure dropdown closes
           const selectElement = document.querySelector('select.select-location') as HTMLSelectElement;
           if (selectElement) {
             selectElement.dispatchEvent(new Event('change'));
           }
        } else {
          console.error('Place geometry is not available.');
        }
      } else {
        console.error('Error fetching place details:', status);
      }
    });
  } else {
    console.error('Selected prediction not found.');
  }
}

getItemByLocation(){
  this.service.getServiceLocationWise(this.selectedSubCategoryId,this.searchLocation,this.latitude,this.longitude).subscribe((response:any)=>{
    console.log(response,"585")
    if (response.success) {
      this.servicesDetails = response.data.items.map((itemWrapper:any) => ({
        ...itemWrapper.item, reviews: itemWrapper.reviews, vender:itemWrapper.vendor})); // Correctly map to items
      this.totalItems = response.data.totalItems; // Correctly set the total items from the response
console.log(this.servicesDetails,"590")
      // this.servicesDetails = this.servicesDetails.filter((item:any)=>item.vender.status === 'Approved')
      // console.log(this.servicesDetails,"173")

      if (this.servicesDetails.length > 0) {
        this.vendorName = this.servicesDetails[0]; // Extract vendor name from the first item
      }

      this.paginator$.next({ pageIndex: 0, pageSize: 12 });
    } else {
      console.error('Failed to fetch items:', response.message); // Log any errors in fetching items
    }
  })
}

}

