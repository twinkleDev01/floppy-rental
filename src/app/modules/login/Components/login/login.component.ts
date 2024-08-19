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
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  togglePassword(): void {
    console.log('hiii')
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    console.log(this.passwordType);
  }

  noSpace(event: any) {
    console.log(event, 'keyyyy');
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
    console.log(this.loginForm.value);
    if (this.loginForm.valid) {
      // Handle successful login
      console.log('Form Submitted!', this.loginForm.value);
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
