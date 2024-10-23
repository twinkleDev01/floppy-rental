import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HomeService } from '../../services/home.service';
import { environment } from '../../../../../environments/environment.development';
import { MatDialog } from '@angular/material/dialog';
import { ServiceDialogComponent } from './service-dialog.component';
import { ServicesDetailService } from '../../../services/service/services-detail.service';
import { ScrollService } from '../../../../shared/services/scroll.service';
import { Router } from '@angular/router';
import { Item, SubCategories } from '../../_models/home.model';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  searchControl: FormControl = new FormControl('');
  navigatedMainGroupId:any;
  navigatedSubGroupId:any;
  navigatedCategoryItem:any;
  locations: any[] = [];
  filteredSubgroups: string[] = [];
  allSubgroups: string[] = [];
  selectedCity: string = '';
  selectedArea: string = '';
  selectedSubGroupName: string = '';
  homeBannerData: any;
sortedTopData:any[]=[];
sortedMiddleData:any[]=[];
sortedBottomData:any[]=[];
  serviceDataList:any[]=[];
  categorySucategotyList:any[]=[]
  subcategoryData:any;
  categoryId:any
  contentLoaded = false;
   apiUrl: string = environment.ApiBaseUrl;
   section1Subcategories: any[] = [];
section2Subcategories: any[] = [];
section3Subcategories: any[] = [];
firstCategory!:SubCategories;
secondCategory!:SubCategories;
thirdCategory!:SubCategories
  itemList: Item[]=[];
  backgroundImage:any;
  filteredLocation:any;
  newLocationId:any;
  selectedSubGroupId:any;
  latitude:any;
  longitude:any
  originalSubgroups: string[]= [];
  error= false;
  itemError =  false;
  originalList: any[] = [];
  locationSearchItem:any
 
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    autoplay: true,
    autoWidth: false,
    autoplaySpeed: 1000,
    navSpeed: 700,
    navText: ['<', '>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 4
      },
      940: {
        items: 4
      },

      1200: {
        items: 4
      },
    },
    nav: true
  }
  
  customOptions1: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    autoplay: true,
    autoWidth: false,
    autoplaySpeed: 1000,
    navSpeed: 700,
    navText: ['<', '>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 4
      },
      940: {
        items: 4
      },

      1200: {
        items: 4
      },
    },
    nav: true
  }
  
  private prevButton!: HTMLButtonElement;
  private nextButton!: HTMLButtonElement;
  private owl!: any; // Adjust the type if needed
  @ViewChild('owlElement') owlElement!: any;
  @ViewChild('prev') prev!: ElementRef<HTMLButtonElement>;
  @ViewChild('next') next!: ElementRef;
  locationSelected = false;
  showError = false;
  autocompleteService: any;
  predictions: any[] = [];
  searchInput= '';
  placeDetails: any; // For storing selected place details
  filteredSubgroupsName: Observable<any[]> = new Observable();
  placesService!: google.maps.places.PlacesService;
  isBrowser!: boolean;
  constructor(private homeService: HomeService, public dialog: MatDialog, private service:ServicesDetailService,private scrollService:ScrollService, private router:Router,private http: HttpClient, @Inject(PLATFORM_ID) platformId: Object){
    // this.initializeLocations();
    this.isBrowser = isPlatformBrowser(platformId);
    if(this.isBrowser){
    this.placesService = new google.maps.places.PlacesService(document.createElement('div'));
    }
  }

  ngAfterViewInit() {
    }

    ngOnInit(){
      if(this.isBrowser){
      // / Initialize the Google Places Autocomplete service
      this.autocompleteService = new google.maps.places.AutocompleteService();

     this.getBannerData();
     this.getItemlist();
     this.getCurrentLocation();
      
    // ServiceCategoryList
    this.homeService.getServiceList().subscribe((res:any)=>{
      this.serviceDataList = res.data;
      this.originalList = [...res?.data];
      this.serviceDataList = this.serviceDataList?.filter((iterable:any)=> iterable?.status === 1);
    })
    this.fetchSubCategories()
  }
  }


    onPrevClick() {
        this.owlElement.nativeElement.trigger('prev.owl.carousel');; // Move to previous slide
      
    }
  
    onNextClick() {
      if (this.owl && this.owl.next) {
        this.owlElement.next(); // Move to next slide
      }
    }

    openDialog(item: any){
      this.dialog.open(ServiceDialogComponent, {
        minWidth: '300px', // Minimum width of the dialog
    maxWidth: '70vw', // Maximum width set to 90% of the viewport width
    maxHeight: '95vh',
        data: { item },// Pass the clicked card data to the dialog
        panelClass: 'custom-dialog-container' // Optional: custom class for additional styling
      });
    }

    getBannerData(){
      this.homeService.getHomeDetails().subscribe((res: any) => {
        // Treat res.data as an object with dynamic keys
        this.homeBannerData = res.data as { [key: string]: any };
      
        // Accessing the Top section and sorting
        const topData = this.homeBannerData['Top'];
        if (topData) {
          this.sortedTopData = topData.sort((a: any, b: any) => a.Seqno - b.Seqno);
          console.log("199",this.sortedTopData)
        } else {
          console.error('Top data not found:', this.homeBannerData);
        }
      
        // Accessing the Middle section and sorting
        const middleData = this.homeBannerData['Middle'];
        if (middleData) {
          this.sortedMiddleData = middleData.sort((a: any, b: any) => a.Seqno - b.Seqno);
          this.backgroundImage = this.sortedMiddleData[0]?.Image
        } else {
          console.error('Middle data not found:', this.homeBannerData);
        }
      
        // Accessing the Bottom section and sorting
        const bottomData = this.homeBannerData['Bottom'];
        if (bottomData) {
          this.sortedBottomData = bottomData.sort((a: any, b: any) => a.Seqno - b.Seqno);
        } else {
          console.error('Bottom data not found:', this.homeBannerData);
        }
      });

      
    }

    allSubCategotyList:any
    fetchSubCategories() {
      this.homeService.getAllCategorySubcategory().subscribe((res) => {
          this.categorySucategotyList = res.data;
          this.allSubCategotyList = res.data
          // Filter categories to only include those that should be shown on the dashboard
          const filteredCategories = this.categorySucategotyList
              .filter(category => category.showOnDashboard === 1)
              .map(category => {
                  // Filter subcategories to only include those that should be shown on the dashboard
                  const filteredSubcategories = category.subcategories.filter((subcategory:any) => subcategory.showOnDashboard === 1);
  
                  // Return the complete category object with subcategories included
                  return {
                      classificationName: category.classificationName,
                      subcategories: filteredSubcategories // Keep all properties here
                  };
              });
  
          // Assign categories to section variables
          this.firstCategory = filteredCategories[0];
          this.secondCategory = filteredCategories[1];
          this.thirdCategory = filteredCategories[2];

          this.allSubCategotyList = this.allSubCategotyList.flatMap((category:any) =>
            category.subcategories.map((subcategory:any) => ({
              subId: subcategory.subId,
              subClassificationName: subcategory.subClassificationName,
              mainId: subcategory.mainId
            }))
          );
      
          // Initialize filteredSubgroupsName observable after data is loaded
      this.filteredSubgroupsName = this.searchControl.valueChanges.pipe(
        startWith(''),
        // map(value => this._filter(value))
        map(value => value ? this._filter(value) : [])
      );
          console.log(this.allSubCategotyList); 
      });
      
  }

    goCategory(subcategory: any) {
      console.log(subcategory,"253")
      // this.router.navigate(
      //   [
      //     `/services/category/${subcategory?.SubClassificationName
      //       ?.trim()
      //       ?.replace(/\s+/g, '-')
      //       ?.toLowerCase()}/${subcategory.mainId}`,
      //   ]
      // );
      // this.router.navigate([`/services/category/${subcategory?.subClassificationName.replaceAll("/","$")}/${subcategory?.mainId}`],
      localStorage.setItem('myState', JSON.stringify(true));

      this.router.navigate([`/services/category/${subcategory?.subId}/${subcategory?.mainId}`],
      {
        state: { myState: true }  // You can pass any state if required
      }
    );
    }

    getItemlist(){
      this.homeService.getItemlist().subscribe((response:any)=>{
        this.itemList = response.data
      })
    }

    // goToServiceDetail(item:any){
    //   const itemNameDetail = item?.subgroupname.split(',')[0]?.trim()?.replace(/\s+/g, '-')?.toLowerCase();
    //   this.router.navigate([`/services/service-Details/${itemNameDetail}`], {
    //     state: {
    //       card: item,
    //     }
    //   });
    // }

    goToServiceDetail(card: any) {
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
  
    findSubcategoryBySearch(searchTerm: string) {
      for (const category of this.categorySucategotyList) {
        const matchedSubcategory = category.subcategories.find(
          (subcategory: any) =>
            subcategory.subClassificationName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (matchedSubcategory) {
          return matchedSubcategory;
        }
      }
      return null;
    }
  
    getCurrentLocation(){
      console.log("called")
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
        this.originalSubgroups = this.allSubgroups;
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
      this.originalSubgroups = filteredLocations.subgroupName;
  
      // Apply search filtering
      this.applySearchFilter(); // Apply search filter if applicable
    }
    
    applySearchFilter() {
     
      const searchValue = this.searchControl.value.trim().toLowerCase();
      if (searchValue) {
       
  this.error = false;
  const searchWords = searchValue.toLowerCase().split(' ').filter((word:any) => word.trim() !== '');

// Filter the subgroups to check if any search word is included in the subgroup name
this.filteredSubgroups = searchValue
  ? this.originalSubgroups.filter(subgroup =>
      searchWords.some((word:any) => subgroup.toLowerCase().includes(word))
    )
  : [...this.originalSubgroups]; // Reset to the cloned list if searchValue is empty

// If no matches are found, reset to the original list
if (this.filteredSubgroups.length === 0 && searchValue) {
  this.filteredSubgroups = [...this.originalSubgroups];
}
    }}
    
    onCityChange(event: Event) {
      const target = event.target as HTMLSelectElement;
      if (target) {
        const [cityName, areaName] = target.value.split('|');
        this.selectedCity = cityName;
        this.selectedArea = areaName;
        this.locationSelected = !!target.value; // Update flag based on selected value
      this.showError = !this.locationSelected; 
        this.getFilteredSubgroups(); // Trigger filtering when city changes
      }
    }
    
    getSearchedItemList() {
      this.searchInput= this.searchInput = sessionStorage.getItem('address') as string || '';
      this.findCoordinates(this.searchInput)
      if(!this.searchInput){
        this.locationSelected = true;
        this.homeService.triggerFunction('Data from Component A')
      }else if(!this.locationSearchItem){
        this.error = true;
      }else{ // Navigate with query parameters
        console.log(this.locationSearchItem,"455")
        localStorage.setItem('myState', JSON.stringify(true));
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = "reload";
        this.router.navigate([
          `/services/category/${this.locationSearchItem.subId}/${this.locationSearchItem.mainId}`
        ], {
          queryParams: {
            latitude: this.latitude,
            longitude: this.longitude,
            locations: this.searchInput
          },
          
            state: { myState: true }  // You can pass any state if required
          
        });
      }
    }

    onSearchFocus(): void {
      if (!this.locationSelected) {
        this.showError = true; // Show error message if no location is selected
      }
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
      if(this.searchInput){
        this.locationSelected = false;
      }
      console.log(this.searchInput,"489")
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
    
    

    // private _filter(value: string): any[] {
    //   console.log(value,"602")
    //   const filterValue = value.toLowerCase();
    //   console.log(this.allSubCategotyList.filter((subgroup:any) =>
    //     subgroup.subClassificationName.toLowerCase().includes(filterValue)
    //   ),"560")
    //   return this.allSubCategotyList.filter((subgroup:any) =>
    //     subgroup.subClassificationName.toLowerCase().includes(filterValue)
    //   );
    // }

    private _filter(value: string): any[] {
      const filterValue = value.toLowerCase();
      return this.allSubCategotyList.filter((subgroup:any) =>
        subgroup.subClassificationName.toLowerCase().includes(filterValue)
      );
    }
  
    onOptionSelected(event: any): void {
      console.log(event, "633");
      console.log('Selected Option:', event.option.value);
      this.locationSearchItem = event.option.value;
      this.error = false
    }
    findCoordinates(location:any) {
      const apiKey = 'AIzaSyARIDLGBcFWWC5HltY1_t5iZcXuoXz08bo';
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`;
      
      this.http.get<any>(url).subscribe(
        (response) => {
          if (response.status === 'OK') {
            const result = response.results[0];
            this.latitude = result.geometry.location.lat;
            this.longitude = result.geometry.location.lng;
            sessionStorage.setItem('latitude', result.geometry.location.lat);
            sessionStorage.setItem('longitude',result.geometry.location.lng);
            console.log('Latitude:', this.latitude, 'Longitude:', this.longitude);
          } else {
            console.error('Geocoding failed:', response.status);
          }
        },
        (error) => {
          console.error('Error fetching coordinates:', error);
        }
      );
    }
    displaySubgroupName(subgroup: any): string {
      return subgroup ? subgroup.subClassificationName : '';
    }
}
