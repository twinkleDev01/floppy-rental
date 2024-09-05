import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  passwordType: string = 'password';
  loginForm: FormGroup;
  keyChar: any;
  stage : 'login'|'signup'|'reset'='login'

  readonly dialogRef = inject(MatDialogRef<LoginComponent>);

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private auth: AuthService,
    private toastr: ToastrService
  ) {
    console.log("login")

    this.loginForm = this.fb.group({
      emailOrPhone: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
          ),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(8),
        // Validators.pattern('^[A-Z](?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,14}$')]],
        Validators.pattern('^[A-Z](?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{7,14}$')]]
    });
  }

  togglePassword(): void {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    console.log(this.passwordType);
  }

  noSpace(event: any) {
    // if (event.keyCode === 32 && !event.target.value) return false;
    if (event.key === ' ' && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  handleValidation() {
    const input = this.loginForm.get('emailOrPhone');
    input?.setValidators([Validators.required]);
    // input?.clearValidators();
    if (isNaN(+input?.value)) {
      input?.addValidators(
        Validators.pattern(
          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
        )
      );
    } else {
      input?.addValidators([
        Validators.pattern('[0-9]*'),
        Validators.minLength(10),
        Validators.maxLength(10),
      ]);
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const logInValue = {
        email: this.loginForm.value.emailOrPhone,
  password: this.loginForm.value.password
      }
      console.log('Form Submitted!', this.loginForm.value);
this.auth.logIn(logInValue).subscribe((response:any)=>{
  console.log(response,"88")
  if(response.success){
    localStorage.setItem("token",response.data.token)
    localStorage.setItem("userId",response.data.userId)
    this.auth.updateLoginStatus(true);
    this.toastr.success('Successfully Login')
    this.dialogRef.close();
  }
},
 (error: any) => {
  console.error('Login error', error);
  this.toastr.error(error.error.message);
}
)
    } else {
      // Handle form errors
      console.log('Form is invalid');
    }
  }
  //
  openResetPasswordDialog(): void {
    this.stage = 'reset';
    console.log("ResetPassword",this.stage)
  }
  openSignupDialog() {
    this.stage = 'signup';
    console.log("SIGNUP COMP",this.stage)
  }
  // closeLogin
  closeDialog(): void {
    console.log("CloseLogin")
    this.dialogRef.close(); // This will close the dialog
  }
}
