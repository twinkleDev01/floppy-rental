import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { HomeComponent } from './components/home/home.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ServiceDialogComponent } from './components/home/service-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
@NgModule({
  declarations: [HomeComponent,ServiceDialogComponent],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
    CarouselModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule
  ]
})
export class HomeModule { }
