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
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTabsModule} from '@angular/material/tabs';
import { CarouselModule } from 'ngx-owl-carousel-o';
import {MatPaginatorModule} from '@angular/material/paginator';
import { ServiceRateComponent } from './components/services-rate/service-rate/service-rate.component';
@NgModule({
  declarations: [
    ServicesComponent,
    ServicesCategoryComponent,
    ServicesDetailsComponent,
    ServiceRateComponent
  ],
  imports: [
    CommonModule,
    ServicesRoutingModule,
    SharedModule,
    MatRadioModule,
    FormsModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatTabsModule,
    CarouselModule,
    MatPaginatorModule,
    MatCheckboxModule
    ]
})
export class ServicesModule { }
