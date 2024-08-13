import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServicesRoutingModule } from './services-routing.module';
import { ServicesComponent } from './components/services/services.component';
import { ServicesCategoryComponent } from './components/services-category/services-category.component';
import { ServicesDetailsComponent } from './components/services-details/services-details.component';
import { SharedModule } from '../../shared/shared.module';
import {MatRadioModule} from '@angular/material/radio';
import {FormsModule} from '@angular/forms';
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
    FormsModule
    ]
})
export class ServicesModule { }
