import { Component, ElementRef, ViewChild } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HomeService } from '../../services/home.service';
import { environment } from '../../../../../environments/environment.development';
import { MatDialog } from '@angular/material/dialog';
import { ServiceDialogComponent } from './service-dialog.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  homeData:any[]=[];
  sortedTopData:any[]=[];
  serviceDataList:any[]=[];
   apiUrl: string = environment.ApiBaseUrl;
   
  constructor(private homeService: HomeService, public dialog: MatDialog){}
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
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
  private prevButton!: HTMLButtonElement;
  private nextButton!: HTMLButtonElement;
  private owl!: any; // Adjust the type if needed
  @ViewChild('owlElement') owlElement!: any;
  @ViewChild('prev') prev!: ElementRef<HTMLButtonElement>;
  @ViewChild('next') next!: ElementRef;

  ngAfterViewInit() {
    }

    ngOnInit(){
      console.log("Home")
      this.homeService.getHomeDetails().subscribe((res:any)=>{
        console.log(res,"res");
        this.homeData = res.data;
        console.log(this.homeData,"AAAA")
      
      console.log(this.homeData,"BBBB")
     // Assuming `this.homeData` contains the array you posted
    const topData = this.homeData?.filter((item: any) => item.type === "Top");
    console.log(topData, "topImages");
    this.sortedTopData = topData.sort((a: any, b: any) => a.seqno - b.seqno);
    console.log(this.sortedTopData,"sortedTopData")
  })
    // ServiceCategoryList
    this.homeService.getServiceList().subscribe((res:any)=>{
      console.log("SErviceList",res)
      this.serviceDataList = res.data;
      console.log(this.serviceDataList,"serviceDataListtt")
    })
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
        // width: '300px', // Adjust dialog size if needed
        // height: ''
        data: { item } // Pass the clicked card data to the dialog
      });
    }
  
}
