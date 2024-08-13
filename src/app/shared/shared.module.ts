import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedRoutingModule } from './shared-routing.module';
import { HeaderComponent } from './components/Header/header/header.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FooterComponent } from './components/footer/footer.component';
import { AdPlacementComponent } from './components/ad-placement/ad-placement.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { TestimonialComponent } from './components/testimonial/testimonial.component';
import {MatRadioModule} from '@angular/material/radio';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    AdPlacementComponent,
    TestimonialComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    MatDialogModule,
    CarouselModule,
    MatRadioModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    AdPlacementComponent,
    TestimonialComponent
  ]
})
export class SharedModule { }
