import { ChangeDetectorRef, Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmPasswordValidator } from '../../confirm-password.validator';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  @Output() handleNavigation = new EventEmitter<'login'>()

  selectedCountry: string = '+91'; 
  // countries: any;
  selectedCountryFlag: any;
   countries: any[] = [];
  passwordType: string = 'password';
  confirmPasswordType: string ='confirmPassword'
  loginForm: FormGroup;
  keyChar:any;
  private apiUrl = 'https://restcountries.com/v3.1/all';

  readonly dialogRef = inject(MatDialogRef<ResetPasswordComponent>);
  constructor(private fb: FormBuilder, private http:HttpClient,private cdr:ChangeDetectorRef) {
    this.loginForm = this.fb.group({
      emailOrPhone : ['', [Validators.required, Validators.pattern(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)]],
      contactNumber : ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(10), Validators.maxLength(10)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
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
    this.confirmPasswordType = this.confirmPasswordType === 'confirmPassword' ? 'text' : 'confirmPassword';
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
    console.log(this.loginForm.value);
    if (this.loginForm.valid) {
      // Handle successful login
      console.log('Form Submitted!', this.loginForm.value);
    } else {
      // Handle form errors
      console.log('Form is invalid');
    }
  }
   // closeLogin
   closeDialog(): void {
    console.log("CloseLogin")
    this.dialogRef.close(); // This will close the dialog
  }
  }