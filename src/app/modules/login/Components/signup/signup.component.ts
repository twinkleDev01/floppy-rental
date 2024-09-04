import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../shared/services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  // @Output() handleNavigationSignup = new EventEmitter<'login'>()
  @Output() handleNavigationSignup = new EventEmitter()
  passwordType: string = 'password';
  selectedCountry!: string ; 
  // countries: any;
  selectedCountryFlag: any;
  signup: FormGroup;
  keyChar: any;
  // countries: any;
   countries: any[] = [];
   private apiUrl = 'https://restcountries.com/v3.1/all';
   readonly dialogRef = inject(MatDialogRef<SignupComponent>);

  constructor(
    private fb: FormBuilder,
    private http:HttpClient,
    private cdr:ChangeDetectorRef,
    private auth:AuthService,
    private router:Router,
    private toaster:ToastrService
  ) {
    console.log("Signup")
    this.signup = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
          ),
        ],
      ],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(14),
        // Validators.pattern('^[A-Z](?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{5,}$')
        Validators.pattern('^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,14}$')
      ]],
      firstName: ['',[Validators.required]],
      lastName: ['',[Validators.required]],
      contactNumber : ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(10), Validators.maxLength(10)]],
      // country: [this.selectedCountry],
      selectedCountry: [this.selectedCountry],
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
      this.signup?.get("selectedCountry")?.setValue(this.countries.find(d=> d.name == "India"));
    });
  }

  togglePassword(): void {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }

  handleNavigation(){
    console.log('login signup')
    this.handleNavigationSignup.emit('login')
  }

  onCountryChange(selectedCountry: any) {
    console.log(selectedCountry,"selectedCountry")
    if (selectedCountry) {
      this.selectedCountryFlag = selectedCountry.flag;
      this.signup?.get("selectedCountry")?.setValue(this.selectedCountry);
      this.signup?.get("selectedCountry")?.updateValueAndValidity();
      
    } else {
      this.selectedCountryFlag = null;
    }
   
  }
  
  noSpace(event: any) {
    if (event.keyCode === 32 && !event.target.value) return false;
    return true;
  }

  onSubmit() {
    console.log(this.signup.value);
  
    if (this.signup.valid) {
      // Handle successful form submission
      console.log('Form Submitted!', this.signup.value);
  
      const registerValue = {
        firstName: this.signup.value.firstName,
        lastName: this.signup.value.lastName,
        email: this.signup.value.email,
        mobileNumber: this.signup.value.selectedCountry.code + this.signup.value.contactNumber,
        password: this.signup.value.password
      };
  
      // Call the register method from AuthService
      this.auth.register(registerValue).subscribe(
        (response: any) => {
  
          if (response.success) {
            this.toaster.success('Registration successful!');
            localStorage.setItem("token",response.data.token);
            localStorage.setItem("userId",response.data.userId)
            this.auth.updateLoginStatus(true);
            this.dialogRef.close(); 
          } 
        },
        (error: any) => {
          console.error('Registration error', error);
          this.toaster.error(error?.error?.message);
        }
      );
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
