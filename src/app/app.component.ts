import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { SharedService } from './shared/services/shared.service';

@Component({
  selector: 'app-root',
  
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'firstFloppyRentalApp';
  
  constructor(private router: Router, private sharedService: SharedService) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.sharedService.updateBreadcrumb(event.urlAfterRedirects);
      }
    });
  }
}
