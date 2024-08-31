import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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


  constructor(private homeService: HomeService, public dialog: MatDialog, private service:ServicesDetailService,private scrollService:ScrollService, private router:Router){
    // this.initializeLocations();
  }
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
    nav: false
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

  ngAfterViewInit() {
    }

    ngOnInit(){
      this.locations = this.locations?.reduce((acc:any, city:any) => {
        const combinedAreas = city.areas.map((area:any) => `${city.cityName} - ${area.areaName}`);
        return acc.concat(combinedAreas);
      }, []);
     this.getBannerData();
     this.getItemlist();
     this.getLocations();
      
    // ServiceCategoryList
    this.homeService.getServiceList().subscribe((res:any)=>{
      console.log("SErviceList",res)
      this.serviceDataList = res.data;
      console.log(this.serviceDataList,"serviceDataListtt")
    })
    this.fetchCategories()

     // Subscribe to search control changes
     this.searchControl.valueChanges.subscribe(() => {
      this.applySearchFilter();
    });

  }


    onPrevClick() {
     console.log(this.owlElement,"previous")
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

    fetchCategories() {
      this.homeService.getAllCategorySubcategory().subscribe((res) => {
          this.categorySucategotyList = res.data;
  
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
      });
      
  }

    goCategory(subcategory: any){
      console.log(subcategory,178)
      this.router.navigate([`/services/category/${subcategory?.googleName?.trim()?.replace(/\s+/g, '-')?.toLowerCase()}`], {
        state: {
          serviceId: subcategory.mainId,
          subId: subcategory.subId
        }
      });
    }

    getItemlist(){
      this.homeService.getItemlist().subscribe((response:any)=>{
        this.itemList = response.data
      })
    }

    goToServiceDetail(item:any){
      const itemNameDetail = item?.subgroupname.split(',')[0]?.trim()?.replace(/\s+/g, '-')?.toLowerCase();
      this.router.navigate([`/services/service-Details/${itemNameDetail}`], {
        state: {
          card: item,
        }
      });
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
  
      
    // New
    // getLocations() {
    //   this.homeService.getLocation().subscribe((response: any) => {
    //     const uniqueLocations = new Set<string>();
    //     this.locations = response.data.reduce((acc: any, city: any) => {
    //       city.areas.forEach((area: any) => {
    //         area.subgroups.forEach((subgroup: any) => {
    //         const locationKey = `${city.cityName}|${area.areaName}`;
    //         if (!uniqueLocations.has(locationKey)) {
    //           uniqueLocations.add(locationKey);
    //           acc.push({
    //             cityName: city.cityName,
    //             areaName: area.areaName,
    //             subgroupName: subgroup.subgroupName
    //           });
    //         }
    //       })
    //       });
    //       return acc;
    //     }, []);
    //     this.allSubgroups = [...new Set(this.locations.map((loc: any) => loc.subgroupName))]; // Store unique subgroups
    //   });
    // }

    getLocations() {
      this.homeService.getLocation().subscribe((response: any) => {
        const uniqueLocations: any = {};
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
        console.log(uniqueLocations);
        this.allSubgroups = this.locations.reduce((acc: string[], loc: any) => {
          acc.push(...loc.subgroupName);
          return acc;
        }, []);
      }); // Store unique subgroups
    }
  

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
      console.log(searchValue,"searchValue")
      if (searchValue) {
        // Filter already filtered subgroups
        this.filteredSubgroups = this.filteredSubgroups.filter(subgroup =>
          subgroup.toLowerCase().includes(searchValue)
        );
      }
      console.log(this.filteredSubgroups,"filteredSubgroups")
    }
    
    onCityChange(event: Event) {
      const target = event.target as HTMLSelectElement;
      if (target) {
        const [cityName, areaName] = target.value.split('|');
        this.selectedCity = cityName;
        this.selectedArea = areaName;
        console.log("City,Area", this.selectedCity, this.selectedArea)
        this.getFilteredSubgroups(); // Trigger filtering when city changes
      }
    }
    
    getSearchedItemList(){
      console.log(this.filteredSubgroups,"filteredSubgroups")
      this.selectedSubGroupName = this.filteredSubgroups[0];
      console.log(this.selectedArea, this.selectedSubGroupName,"Area+Subgroup")

      this.homeService.getSearchedItemList(this.selectedSubGroupName,this.selectedArea).subscribe((res:any)=>{
        console.log(res,"SearchedItemList")
        this.navigatedCategoryItem = res.data;
        console.log(this.navigatedCategoryItem,"navigatedCategoryItem")
        // 
    
      const uniqueSubgroupIds = new Set(this.navigatedCategoryItem.map((item: any) => item.subgroupid));
      const uniqueMaingroupIds = new Set(this.navigatedCategoryItem.map((item: any) => item.maingroupid));
      
      // Assuming there's only one unique value
      this.navigatedSubGroupId = uniqueSubgroupIds.size === 1 ? Array.from(uniqueSubgroupIds)[0] : null;
      this.navigatedMainGroupId = uniqueMaingroupIds.size === 1 ? Array.from(uniqueMaingroupIds)[0] : null;
      
      console.log('Selected Subgroup ID:', this.navigatedSubGroupId);
      console.log('Selected Main Group ID:', this.navigatedMainGroupId);
      
      // Navigate
      this.router.navigate([`/services/category/${this.selectedSubGroupName?.trim()}`], {
        state: {
          serviceId: this.navigatedMainGroupId,
          subId: this.navigatedSubGroupId
        }
      });
      })
    }
}
