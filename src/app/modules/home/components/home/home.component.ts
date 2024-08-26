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

     this.getBannerData()
     this.getItemlist()
      
    // ServiceCategoryList
    this.homeService.getServiceList().subscribe((res:any)=>{
      console.log("SErviceList",res)
      this.serviceDataList = res.data;
      console.log(this.serviceDataList,"serviceDataListtt")
    })
    this.fetchCategories()
    // this.fetchSubCategories(this.categoryId)
    // this.scrollService.contentVisible.subscribe(() => {
    //   this.contentLoaded = true; // Show the content
    //   console.log('content')

    // });
  }
    onPrevClick() {
     console.log(this.owlElement,"previous")
        this.owlElement.nativeElement.trigger('prev.owl.carousel');; // Move to previous slide
      
    }
  
    onNextClick() {
      if (this.owl && this.owl.next) {
        console.log("58")
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
          console.log(this.sortedTopData, "Sorted Top Data");
        } else {
          console.error('Top data not found:', this.homeBannerData);
        }
      
        // Accessing the Middle section and sorting
        const middleData = this.homeBannerData['Middle'];
        if (middleData) {
          this.sortedMiddleData = middleData.sort((a: any, b: any) => a.Seqno - b.Seqno);
          console.log(this.sortedMiddleData, "Sorted Middle Data");
        } else {
          console.error('Middle data not found:', this.homeBannerData);
        }
      
        // Accessing the Bottom section and sorting
        const bottomData = this.homeBannerData['Bottom'];
        if (bottomData) {
          this.sortedBottomData = bottomData.sort((a: any, b: any) => a.Seqno - b.Seqno);
          console.log(this.sortedBottomData, "Sorted Bottom Data");
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

    searchServices() {
      // Get the selected location
      const location = (document.getElementById('location') as HTMLSelectElement).value;
  
      // Get the search term
      const searchTerm = (document.getElementById('searchBox') as HTMLInputElement).value;
  
      // Navigate to the desired route with the selected location and search term
      this.router.navigate(['/services/category'], {
          state: {
              location: location,
              subCategory: searchTerm
          }
      });
  }
  

}
