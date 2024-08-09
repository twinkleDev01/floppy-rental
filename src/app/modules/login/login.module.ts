import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './Components/login/login.component';
import { SharedModule } from '../../shared/shared.module';
import { ResetPasswordComponent } from './Components/reset-password/reset-password.component';
import { MatDialogModule } from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    LoginComponent,
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    LoginRoutingModule,
    MatDialogModule,
    MatFormFieldModule,
    NgSelectModule
  ]
})
export class LoginModule { }
