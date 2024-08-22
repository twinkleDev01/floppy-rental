import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutUSRoutingModule } from './about-us-routing.module';
import { AboutUsComponent } from './about-us/about-us/about-us.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    AboutUsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AboutUSRoutingModule
  ]
})
export class AboutUSModule { }
