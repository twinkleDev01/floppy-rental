import { ChangeDetectorRef, Component, EventEmitter, inject, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmPasswordValidator } from '../../confirm-password.validator';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {
  @Output() handleNavigation = new EventEmitter<'login'>()

  selectedCountry = '+91'; 
  // countries: any;
  selectedCountryFlag: any;
   countries: any[] = [];
  passwordType = 'password';
  confirmPasswordType ='confirmPassword'
  loginForm: FormGroup;
  keyChar:any;
  private apiUrl = 'https://restcountries.com/v3.1/all';

  readonly dialogRef = inject(MatDialogRef<ResetPasswordComponent>);
  constructor(private fb: FormBuilder, private http:HttpClient,private cdr:ChangeDetectorRef, private auth:AuthService, private toastr:ToastrService) {
    this.loginForm = this.fb.group({
      emailOrPhone : ['', [Validators.required, Validators.pattern(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)]],
      contactNumber : ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(10), Validators.maxLength(10)]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(14),
        // Validators.pattern('^[A-Z](?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,14}$')
        // Validators.pattern('^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,14}$')
        Validators.pattern('^[A-Z](?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{7,14}$')
      ]],
      confirmPassword: ['',[Validators.required, Validators.minLength(6)]],
      // country: ['', Validators.required],
      selectedCountry: [this.selectedCountry],
    }, {
      validator: ConfirmPasswordValidator('password', 'confirmPassword')
    });
  }
  
  getCountries(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
ngOnInit(){
  this.getCountries().subscribe((data) => {
    this.countries = data.map((country: any) => ({
      name: country.name.common,
      code: country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : ''),
      flag: country.flags.svg
    }));
    this.loginForm?.get("selectedCountry")?.setValue(this.countries.find(d=> d.name == "India"));
  });
}


onCountryChange(selectedCountry: any) {
  console.log(selectedCountry,"selectedCountry")
  if (selectedCountry) {
    this.selectedCountryFlag = selectedCountry.flag;
    this.loginForm?.get("selectedCountry")?.setValue(this.selectedCountry);
    this.loginForm?.get("selectedCountry")?.updateValueAndValidity();
    
  } else {
    this.selectedCountryFlag = null;
  }
 
}

  togglePassword(): void {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    // this.confirmPasswordType = this.confirmPasswordType === 'confirmPassword' ? 'text' : 'confirmPassword';
  }
  toggleConfirmPassword(): void {
   if(this.confirmPasswordType === 'confirmPassword') {
    console.log("82")
    this.confirmPasswordType = 'text';
   }else{
    console.log("85")
      this.confirmPasswordType = 'confirmPassword';
    }  ;
  }

  noSpace(event:any) {
    console.log(event,"keyyyy");
    // if (event.keyCode === 32 && !event.target.value) return false;
    if (event.key === ' ' && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      return false;
    }
    return true;
  }
  
  onSubmit() {
    this.loginForm?.markAllAsTouched();
    if(this.loginForm?.invalid)return;
    if (this.loginForm.valid) {
      const resetpwd = {
        email: this.loginForm.value.emailOrPhone,
  password: this.loginForm.value.password,
  confirmPassword:this.loginForm.value.confirmPassword,
  mobile:this.loginForm.value.selectedCountry.code + this.loginForm.value.contactNumber,
      }
this.auth.resetPassword(resetpwd).subscribe((response:any)=>{
  if(response.success){
    this.toastr.success("Successfully Password Reset")
    this.dialogRef.close();
  }
},
(error: any) => {
  console.error('Registration error', error);
  this.toastr.error(error.error.message);
})
    } else {
      // Handle form errors
      console.log('Form is invalid');
    }
  }
   // closeLogin
   closeDialog(): void {
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