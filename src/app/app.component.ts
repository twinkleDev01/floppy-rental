import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { SharedService } from './shared/services/shared.service';
import { LocationService } from './shared/services/location.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'firstFloppyRentalApp';
  isBrowser!: boolean;
  
  constructor(private router: Router, private sharedService: SharedService, private location: LocationService, @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.sharedService.updateBreadcrumb(event.urlAfterRedirects);
      }
    });
 
    
  }
  ngAfterViewInit(){
    if(this.isBrowser){
    if(!this.router.url?.includes('services/category')){
      localStorage.removeItem('selectedCategories');
      localStorage.removeItem('serviceName');
      localStorage.removeItem('myState');
    }
  }
  }
  
}
