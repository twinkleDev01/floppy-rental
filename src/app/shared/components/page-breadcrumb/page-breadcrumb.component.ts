import { Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { routes } from '../../../app.routes';

@Component({
  selector: 'app-page-breadcrumb',
  templateUrl: './page-breadcrumb.component.html',
  styleUrls: ['./page-breadcrumb.component.scss'] // Corrected styleUrl to styleUrls
})
export class PageBreadcrumbComponent {
  base = '';
  page = '';
  last = '';

  constructor(private sharedService: SharedService) {
    this.sharedService.base.subscribe((res: string) => {
      this.base = res?.replaceAll('-', ' ');
    });
    this.sharedService.page.subscribe((res: string) => {
      this.page = res?.replaceAll('-', ' ');
    });
    this.sharedService.last.subscribe((res: string) => {
      this.last = res?.replaceAll('-', ' ');
    });
  }
}
