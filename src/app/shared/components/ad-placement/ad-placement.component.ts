import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HomeService } from '../../../modules/home/services/home.service';

@Component({
  selector: 'app-ad-placement',
  templateUrl: './ad-placement.component.html',
  styleUrl: './ad-placement.component.scss'
})
export class AdPlacementComponent {
  // @Input() sortedBottomData: any;
  sortedBottomData:any[]=[];
  homeBannerData:any
  constructor(private router:Router, private homeService:HomeService){}
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    // navText: ['<', '>'],
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
    },
    nav: false
  }
  ngOnInit(){
    this.getBannerData()
  }

  ngOnChanges(changes: any): void {
    if (changes['sortedBottomData'] && this.sortedBottomData.length > 0) {
      // Data is available, perform actions with sortedBottomData
      console.log('Data received in child component:', this.sortedBottomData);
    }
  }
  

  goToService(){
    this.router.navigate(['services'])
  }
  // Check if the current route is the home page
  isOnHomePage(): boolean {
    return this.router.url === '/';
  }
  handleError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'images/No_Image_Available.jpg'; // Replace with your default image path
  }
  getBannerData(){
    this.homeService.getHomeDetails().subscribe((res: any) => {
      // Treat res.data as an object with dynamic keys
      this.homeBannerData = res.data as { [key: string]: any };
    
    
      // Accessing the Bottom section and sorting
      const bottomData = this.homeBannerData['Bottom'];
      if (bottomData) {
        this.sortedBottomData = bottomData.sort((a: any, b: any) => a.Seqno - b.Seqno);
      } else {
        console.error('Bottom data not found:', this.homeBannerData);
      }
    });

    
  }
}
