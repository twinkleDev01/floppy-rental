import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-ad-placement',
  templateUrl: './ad-placement.component.html',
  styleUrl: './ad-placement.component.scss'
})
export class AdPlacementComponent {
  @Input() sortedBottomData: any;
  constructor(private router:Router){}
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
}
