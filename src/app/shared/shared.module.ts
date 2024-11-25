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
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { StylePaginatorDirective } from './directives/style-paginator.directive';
import { PageBreadcrumbComponent } from './components/page-breadcrumb/page-breadcrumb.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DatePickerDialogComponent } from './components/date-picker-dialog/date-picker-dialog.component';
import { LocationDialogComponent } from './components/location-dialog/location-dialog.component';
import { PaginatePipe } from './components/Pipe/paginate.pipe';
import {MatBadgeModule} from '@angular/material/badge';
import { GoogleMapsModule } from '@angular/google-maps';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { TermsComponent } from './components/terms/terms.component';
import { ReturnPolicyComponent } from './components/return-policy/return-policy.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle'; // Add this import
import { MatNativeDateModule } from '@angular/material/core';
import { ServicesCategoryComponent } from '../modules/services/components/services-category/services-category.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AntiDiscriminationPolicyComponent } from './components/anti-discrimination-policy/anti-discrimination-policy.component';
@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    AdPlacementComponent,
    TestimonialComponent,
    RatingStarComponent,
    StylePaginatorDirective,
    PageBreadcrumbComponent,
    DatePickerDialogComponent,
    LocationDialogComponent,
    PaginatePipe,
    PrivacyPolicyComponent,
    TermsComponent,
    ReturnPolicyComponent,
    ServicesCategoryComponent,
    AntiDiscriminationPolicyComponent,
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
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatBadgeModule,
    GoogleMapsModule,
    MatButtonToggleModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatTabsModule,
    MatPaginatorModule,
    MatAutocompleteModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    AdPlacementComponent,
    TestimonialComponent,
    RatingStarComponent,
    StylePaginatorDirective,
    PageBreadcrumbComponent,
    DatePickerDialogComponent,
    LocationDialogComponent,
    PaginatePipe
  ]
})
export class SharedModule { }
