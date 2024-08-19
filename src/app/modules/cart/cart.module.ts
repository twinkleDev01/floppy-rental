import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import { MyCartComponent } from './component/my-cart/my-cart.component';
import { CheckoutComponent } from './component/checkout/checkout.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatRadioModule} from '@angular/material/radio';
import { MatNativeDateModule } from '@angular/material/core'; // Import this
import { MatDatepickerModule } from '@angular/material/datepicker'; // Import this
import { MatDialogModule } from '@angular/material/dialog'; //

@NgModule({
  declarations: [
    MyCartComponent,
    CheckoutComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CartRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatDialogModule
  ]
})
export class CartModule { }
