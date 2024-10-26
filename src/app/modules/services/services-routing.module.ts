import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServicesComponent } from './components/services/services.component';

import { ServicesDetailsComponent } from './components/services-details/services-details.component';
import { ServiceRateComponent } from './components/services-rate/service-rate/service-rate.component';

const routes: Routes = [
  {
    path: '',
    component: ServicesComponent,
  },
  {
    path: 'service-Details/:serviceName/:id',
    component: ServicesDetailsComponent,
  },
  {
    path: 'service-rate/:id',
    component: ServiceRateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicesRoutingModule { }
