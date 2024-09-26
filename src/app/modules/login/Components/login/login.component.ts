import { ChangeDetectionStrategy, Component, Inject, inject, PLATFORM_ID } from '@angular/core';
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
import { ServicesDetailService } from '../../../services/service/services-detail.service';
import { isPlatformBrowser } from '@angular/common';
import { LoginPayload, LoginResponse } from '../../_model/login.model';
import { HttpErrorResponse } from '@angular/common/http';
import { AddCartItemResponse, CartItemPayload } from '../../../services/components/_models/serivece.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  passwordType = 'password';
  loginForm: FormGroup;
  stage : 'login'|'signup'|'reset'='login'
  submitted = false;
  readonly dialogRef = inject(MatDialogRef<LoginComponent>);
  isBrowser!: boolean;
  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private auth: AuthService,
    private toastr: ToastrService,
    private service: ServicesDetailService,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    console.log("login")

    this.loginForm = this.fb.group({
      emailOrPhone: [
        '',
        [
          Validators.required,
          Validators.pattern(
            // eslint-disable-next-line no-useless-escape
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
          // eslint-disable-next-line no-useless-escape
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
    if(this.isBrowser){
    this.submitted = true;
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {

// Extract form values
const emailOrPhone = this.loginForm.get('emailOrPhone')?.value;
const password = this.loginForm.get('password')?.value;

// Determine if the input is an email or a phone number
const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrPhone);


      // Prepare the data object
  const logInValue:LoginPayload = {
    email: isEmail ? emailOrPhone : null,
    password: password,
    mobileNumber: isEmail ? null : '+91' + emailOrPhone
  };
      console.log('Form Submitted!', this.loginForm.value);
this.auth.logIn(logInValue).subscribe((response:LoginResponse)=>{
  console.log(response,"88")
  if(response.success){
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cartItems = JSON.parse(localStorage.getItem('myCartItem')!)?.filter((item:any)=>!item?.cartUpdated);
 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: CartItemPayload[]= cartItems?.map((item:any) => ({
      itemId: item.itemid || 0,
      id: item.itemid,
      itemName: item.itemName || item.specication || 'Unknown Item',
      itemRate: Number(item.rate?.replace(/[^\d.-]/g, "")) || 0,
      price: Number(item.rate?.replace(/[^\d.-]/g, "")) || 0,
      quantity: item.quantity,
      userId: Number(response.data.userId) || 0,
      processStatus: '',
      discountPercent: 0,
      discountAmount: 0,
      tax: item.tax || 0,
      image: item.imagepath || ''
    }));
    
    this.updateCartDetails('myCartItem')
    console.log("163")

    // Assuming `addCartItem` accepts an array
    this.service.addCartItem(payload).subscribe((res: AddCartItemResponse) => {
      console.log(res, "149");
    });
    localStorage.setItem("token",response.data.token)
    localStorage.setItem("userId",response.data.userId)
    this.auth.updateLoginStatus(true);
    this.toastr.success('Successfully Login')
    this.dialogRef.close();
  }
},
 (error: HttpErrorResponse) => {
  console.error('Login error', error);
  this.toastr.error(error.error.message);
}
)
    } else {
      // Handle form errors
      console.log('Form is invalid');
    }
  }
  }

  updateCartDetails (storageKey: string){
    console.log("206", storageKey)
    const items = JSON.parse(localStorage[storageKey] || '[]');
    localStorage[storageKey] = JSON.stringify(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items.map((d:any)=> ({...d, cartUpdated: true}))
    )
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

  // Prevent leading whitespace
  preventLeadingWhitespace(event: KeyboardEvent): void {
    const input = (event.target as HTMLInputElement).value;
    // Prevent a space if the input is empty or has only leading whitespace
    if (event.key === ' ' && input.trim().length === 0) {
      event.preventDefault();
    }
  }
}
