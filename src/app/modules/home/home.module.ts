import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { HomeComponent } from './components/home/home.component';
import { CarouselModule } from 'ngx-owl-carousel-o';


@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
    CarouselModule
  ]
})
export class HomeModule { }
