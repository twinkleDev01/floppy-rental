import { Component, ElementRef, ViewChild } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HomeService } from '../../services/home.service';
import { environment } from '../../../../../environments/environment.development';
import { MatDialog } from '@angular/material/dialog';
import { ServiceDialogComponent } from './service-dialog.component';
import { ServicesDetailService } from '../../../services/service/services-detail.service';
import { ScrollService } from '../../../../shared/services/scroll.service';
import { Router } from '@angular/router';
import { Item, SubCategories } from '../../_models/home.model';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
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
  locations: any;

   
  constructor(private homeService: HomeService, public dialog: MatDialog, private service:ServicesDetailService,private scrollService:ScrollService, private router:Router){}
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
  
  
  private prevButton!: HTMLButtonElement;
  private nextButton!: HTMLButtonElement;
  private owl!: any; // Adjust the type if needed
  @ViewChild('owlElement') owlElement!: any;
  @ViewChild('prev') prev!: ElementRef<HTMLButtonElement>;
  @ViewChild('next') next!: ElementRef;

  ngAfterViewInit() {
    }

    ngOnInit(){

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
      this.router.navigate(['/services/category'], {
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
      this.router.navigate(['/services/service-Details'], {
        state: {
          card: item,
        }
      });
    }

    searchText: string = '';
    searchServices() {
      // Check if search text is provided
      if (this.searchText.trim()) {
        const matchedSubcategory = this.findSubcategoryBySearch(this.searchText.trim());
        console.log(matchedSubcategory.mainId)
        if (matchedSubcategory) {
  
          // Navigate to the desired route with the selected location and subId
          const location = (document.getElementById('location') as HTMLSelectElement).value;
          this.router.navigate(['/services/category'], {
            state: {
              location: location,
              subCategory: this.searchText,
              subId: matchedSubcategory.subId,  // Pass the found subId as state
              mainId: matchedSubcategory.mainId,  // Pass the mainId as state
            }
          });
        } else {
          console.log('No matching subcategory found.');
        }
      } else {
        console.log('Please enter a search term.');  // Handle empty input scenario
      }
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
  
  getLocations(){
    this.homeService.getLocation().subscribe((response:any)=>{
      this.locations = response.data;
    })
  }

}
