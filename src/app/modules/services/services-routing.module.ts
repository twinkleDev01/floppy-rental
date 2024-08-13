import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServicesComponent } from './components/services/services.component';
import { ServicesCategoryComponent } from './components/services-category/services-category.component';

const routes: Routes = [
  {
    path: '',
    component: ServicesComponent,
  },
  {
    path: 'category',
    component:ServicesCategoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicesRoutingModule { }
