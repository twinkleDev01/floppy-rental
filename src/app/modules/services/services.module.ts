import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServicesRoutingModule } from './services-routing.module';
import { ServicesComponent } from './components/services/services.component';
import { ServicesCategoryComponent } from './components/services-category/services-category.component';
import { ServicesDetailsComponent } from './components/services-details/services-details.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    ServicesComponent,
    ServicesCategoryComponent,
    ServicesDetailsComponent
  ],
  imports: [
    CommonModule,
    ServicesRoutingModule,
    SharedModule
  ]
})
export class ServicesModule { }
