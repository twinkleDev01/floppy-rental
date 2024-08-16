import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutComponent } from './component/checkout/checkout.component';

const routes: Routes = [
  {
    path: '',
    component: CheckoutComponent,
  },
  // {
  //   path: '',
  //   component: ,
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartRoutingModule { }
