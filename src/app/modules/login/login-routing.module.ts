import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { ResetPasswordComponent } from './Components/reset-password/reset-password.component';
import { SignupComponent } from './Components/signup/signup.component';

const routes: Routes = [
  {
    path: '',
    component:LoginComponent,
    //  outlet: 'dialog'
  },
  {
    path: 'reset',
    component:ResetPasswordComponent,
    // outlet: 'dialog'
  },
  {
    path: 'signup',
    component:SignupComponent,
    // outlet: 'dialog'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
