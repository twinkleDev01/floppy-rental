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
import { RatingStarComponent } from './components/rating-star/rating-star.component';
import {MatIconModule} from '@angular/material/icon';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    AdPlacementComponent,
    TestimonialComponent,
    RatingStarComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    MatDialogModule,
    CarouselModule,
    MatRadioModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    AdPlacementComponent,
    TestimonialComponent,
    RatingStarComponent
  ]
})
export class SharedModule { }
