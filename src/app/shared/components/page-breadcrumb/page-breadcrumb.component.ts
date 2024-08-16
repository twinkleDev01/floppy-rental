import { Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { routes } from '../../../app.routes';

@Component({
  selector: 'app-page-breadcrumb',
  templateUrl: './page-breadcrumb.component.html',
  styleUrl: './page-breadcrumb.component.scss'
})
export class PageBreadcrumbComponent {

  public routes = routes;
  base = '';
  page = '';
  last = '';
  constructor(private srevice:SharedService) {
    this.srevice.base.subscribe((res: string) => {
      this.base = res?.replaceAll('-', ' ');
    });
    this.srevice.page.subscribe((res: string) => {
      if (res === 'services') {
        this.page = 'services';
      } else if (res === 'AboutUs') {
        this.page = 'AboutUs';
      } else if (res === 'blog') {
        this.page = 'blog';
      } else if (res === 'profile') {
        this.page = 'profile';
      }
      else {
        this.last = this.page;
        this.page = res?.replaceAll('-', ' ');
      }
    });
    this.srevice.last.subscribe((res: string) => {
      this.last = res?.replaceAll('-', ' ');
    });
  }
}


