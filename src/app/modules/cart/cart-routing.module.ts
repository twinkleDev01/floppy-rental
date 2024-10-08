import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyCartComponent } from './component/my-cart/my-cart.component';
import { CheckoutComponent } from './component/checkout/checkout.component';

const routes: Routes = [
  {
    path:'',
    component:MyCartComponent
  },
  {
    path:'checkout',
    component:CheckoutComponent
  }
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartRoutingModule { }
