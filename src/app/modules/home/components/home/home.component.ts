import { Component, ElementRef, ViewChild } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HomeService } from '../../services/home.service';
import { environment } from '../../../../../environments/environment.development';
import { MatDialog } from '@angular/material/dialog';
import { ServiceDialogComponent } from './service-dialog.component';
import { ServicesDetailService } from '../../../services/service/services-detail.service';
import { ScrollService } from '../../../../shared/services/scroll.service';
import { Router } from '@angular/router';
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
  categoryList:any[]=[]
  subcategoryData:any;
  categoryId:any
  contentLoaded = false;
   apiUrl: string = environment.ApiBaseUrl;
   section1Subcategories: any[] = [];
section2Subcategories: any[] = [];
section3Subcategories: any[] = [];

   
  constructor(private homeService: HomeService, public dialog: MatDialog, private service:ServicesDetailService,private scrollService:ScrollService, private router:Router){}
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    autoplay: true,
    autoWidth: true,
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
        items: 8
      },

      1200: {
        items: 8
      },
    },
    nav: false
  }
  customOptions2: OwlOptions = {
    loop: true,
    margin: 10,
    nav: true,
    autoWidth: true, // Adjust this based on your needs
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 3
      },
      1000: {
        items: 5
      }
    }
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
      
      
    // ServiceCategoryList
    this.homeService.getServiceList().subscribe((res:any)=>{
      console.log("SErviceList",res)
      this.serviceDataList = res.data;
      console.log(this.serviceDataList,"serviceDataListtt")
    })
    this.fetchCategories()
    // this.fetchSubCategories(this.categoryId)
    this.scrollService.contentVisible.subscribe(() => {
      this.contentLoaded = true; // Show the content
      console.log('content')

    this.fetchSubCategoriesForSections();

    });
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
  
    // fetchCategories(){
    //   this.service.getCategoryList().subscribe((res)=>{
    //     console.log(res,"categoryList")
    //     this.categoryList = res.data;
    //   })
    // }

    // fetchSubCategories(categoryId: number) {
    //   this.homeService.getSubCategories(categoryId).subscribe(
    //     (response: any) => {
    //       this.subcategoryData = response.data; // Adjust according to your API's response structure
    //       console.log(this.subcategoryData)
    //     },
    //     (error) => {
    //       console.error('Error fetching subcategories', error);
    //     }
    //   );
    // }


    fetchCategories() {
      this.service.getCategoryList().subscribe((res) => {
        this.categoryList = res.data;
        // Call subcategory fetch methods for specific categories after fetching categories
        // this.fetchSubCategoriesForSections();
      });
    }
  
    fetchSubCategories(categoryId: number, section: 'section1Subcategories' | 'section2Subcategories' | 'section3Subcategories') {
      console.log('Fetching subcategories for:', section);
      this.homeService.getSubCategories(categoryId).subscribe(
        (response: any) => {
          (this as any)[section] = (this as any)[section] = Array.isArray(response.data) ? response.data : []; // Adjust according to your API's response structure
          console.log((this as any)[section]);
        },
        (error) => {
          console.error('Error fetching subcategories', error);
        }
      );
    }
  
    fetchSubCategoriesForSections() {
      if (this.categoryList.length > 1) {
        // Fetch subcategories for Section 1
        this.fetchSubCategories(this.categoryList[2].mainId, 'section1Subcategories');
      }
      if (this.categoryList.length > 11) {
        // Fetch subcategories for Section 2
        this.fetchSubCategories(this.categoryList[12].mainId, 'section2Subcategories');
      }
      if (this.categoryList.length > 3) {
        // Fetch subcategories for Section 3
        this.fetchSubCategories(this.categoryList[4].mainId, 'section3Subcategories');
      }
    }
  
    getSectionId(index: number): string {
      return this.categoryList[index]?.classificationName.toLowerCase().replace(/ /g, '-') + '-section';
    } 

    goCategory(subcategory: any){
      this.router.navigate(['/services/category'], {
        state: {
          serviceId: subcategory.MainId,
          subId: subcategory.SubId
        }
      });
    }
    
  //   sectionCarouselOptions: { [key: string]: any } = {
  //     section1Subcategories: {},
  //     section2Subcategories: {},
  //     section3Subcategories: {}
  // };
  

//   adjustCarouselOptions() {
//     const sections = ['section1Subcategories', 'section2Subcategories', 'section3Subcategories'];
//     // const minItemsForAutoplay = 2; // Minimum number of items needed to enable autoplay

//     sections.forEach((section) => {
//         const subcategories = (this as any)[section] || [];
//         if (subcategories.length <= 1) {
//             this.sectionCarouselOptions[section] = {
//                 loop: false,
//                 margin: 10,
//                 nav: false,
//                 autoplay: false,
//                 responsive: {
//                     0: {
//                         items: 1
//                     }
//                 }
//             };
//         } else {
//             this.sectionCarouselOptions[section] = {
//                 loop: true,
//                 margin: 10,
//                 nav: false,
//                 autoplay: true,
//                 autoplayTimeout: 3000,
//                 autoplayHoverPause: true,
//                 autoplaySpeed: 1000,
//                 responsive: {
//                     0: {
//                         items: 1
//                     },
//                     600: {
//                         items: 2
//                     },
//                     1000: {
//                         items: 4
//                     }
//                 }
//             };
//         }
//     });
// }




}
