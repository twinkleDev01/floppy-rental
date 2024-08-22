import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./modules/home/home.module').then(r=> r.HomeModule)
      },
      {
        path: 'login',
        loadChildren: () => import('./modules/login/login.module').then(r=> r.LoginModule)
      },
      {
        path: 'blog',
        loadChildren: () => import('./modules/blog/blog.module').then(r=> r.BlogModule)
      },
      {
        path: 'services',
        loadChildren: () => import('./modules/services/services.module').then(r=> r.ServicesModule)
      },
      {
        path: 'cart',
        loadChildren: () => import('./modules/cart/cart.module').then(r=> r.CartModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./modules/profile/profile.module').then(r=> r.ProfileModule)
      },
      {
        path: 'about',
        loadChildren: () => import('./modules/about-us/about-us.module').then(r=> r.AboutUSModule)
      }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: "reload",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}