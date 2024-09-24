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
import { ServicesDetailService } from '../../../services/service/services-detail.service';

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
  submitted = false;
  readonly dialogRef = inject(MatDialogRef<LoginComponent>);

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private auth: AuthService,
    private toastr: ToastrService,
    private service: ServicesDetailService
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

  // handleValidation() {
  //   const input = this.loginForm.get('emailOrPhone');
  //   input?.setValidators([Validators.required]);
  //   // input?.clearValidators();
  //   if (isNaN(+input?.value)) {
  //     input?.addValidators(
  //       Validators.pattern(
  //         /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  //       )
  //     );
  //   } else {
  //     input?.addValidators([
  //       Validators.pattern('[0-9]*'),
  //       Validators.minLength(10),
  //       Validators.maxLength(10),
  //     ]);
  //   }
  // }


  handleValidation() {
    const input = this.loginForm.get('emailOrPhone');
    if (!input) return; // Check if input exists
  
    input.clearValidators(); // Clear any previous validators
  
    // Determine if the value is an email or phone number
    if (isNaN(+input.value)) {
      // If not a number, assume email
      input.setValidators([
        Validators.required,
        Validators.pattern(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/ // Email pattern
        ),
      ]);
    } else {
      // If it is a number, assume phone
      input.setValidators([
        Validators.required,
        Validators.pattern('^[0-9]*$'), // Only digits allowed
        Validators.minLength(10), // Minimum length for phone number
        Validators.maxLength(10), // Maximum length for phone number
      ]);
    }
  
    input.updateValueAndValidity(); // Update the validity status of the input
  }
  

  onSubmit() {
    this.submitted = true;
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {

// Extract form values
const emailOrPhone = this.loginForm.get('emailOrPhone')?.value;
const password = this.loginForm.get('password')?.value;

// Determine if the input is an email or a phone number
const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrPhone);


      // Prepare the data object
  const logInValue = {
    email: isEmail ? emailOrPhone : null,
    password: password,
    mobileNumber: isEmail ? null : '+91' + emailOrPhone
  };
      console.log('Form Submitted!', this.loginForm.value);
this.auth.logIn(logInValue).subscribe((response:any)=>{
  console.log(response,"88")
  if(response.success){
    const cartItems = JSON.parse(localStorage.getItem('myCartItem')!)
    const payload = cartItems.map((item:any) => ({
      itemId: item.itemid || 0,
      id: 0,
      itemName: item.itemName || item.specication || 'Unknown Item',
      itemRate: Number(item.rate?.replace(/[^\d.-]/g, "")) || 0,
      price: Number(item.rate?.replace(/[^\d.-]/g, "")) || 0,
      quantity: 1,
      userId: Number(response.data.userId) || 0,
      processStatus: '',
      discountPercent: 0,
      discountAmount: 0,
      tax: item.tax || 0,
      image: item.imagepath || ''
    }));
    
    // Assuming `addCartItem` accepts an array
    this.service.addCartItem(payload).subscribe((res: any) => {
      console.log(res, "149");
    });
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
    console.log("165")
    this.loginForm.reset();
    this.dialogRef.close(); // This will close the dialog
  }
}
