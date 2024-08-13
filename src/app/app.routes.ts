import { Routes } from '@angular/router';

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
];
