import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServicesRoutingModule } from './services-routing.module';
import { ServicesComponent } from './components/services/services.component';
import { ServicesCategoryComponent } from './components/services-category/services-category.component';
import { ServicesDetailsComponent } from './components/services-details/services-details.component';
import { SharedModule } from '../../shared/shared.module';
import {MatRadioModule} from '@angular/material/radio';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTabsModule} from '@angular/material/tabs';
import { CarouselModule } from 'ngx-owl-carousel-o';
@NgModule({
  declarations: [
    ServicesComponent,
    ServicesCategoryComponent,
    ServicesDetailsComponent
  ],
  imports: [
    CommonModule,
    ServicesRoutingModule,
    SharedModule,
    MatRadioModule,
    FormsModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatTabsModule,
    CarouselModule
    
    ]
})
export class ServicesModule { }
