import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor(private spinner: NgxSpinnerService) {}

  show() {
    console.log("spinner")
    this.spinner.show();
  }

  hide() {
    this.spinner.hide();
  }
}
