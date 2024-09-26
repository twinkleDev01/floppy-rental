import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Inject, inject, Output, PLATFORM_ID, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../shared/services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { isPlatformBrowser } from '@angular/common';
import { CountryModel, RegistrationResponse } from '../../_model/login.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit {
  // @Output() handleNavigationSignup = new EventEmitter<'login'>()
  @Output() handleNavigationSignup = new EventEmitter()
  passwordType = 'password';
  selectedCountry!:CountryModel;
  selectedCountryFlag!: string;
  signup: FormGroup;
   countries :CountryModel[]= [];
   private apiUrl = 'https://restcountries.com/v3.1/all';
   readonly dialogRef = inject(MatDialogRef<SignupComponent>);
   isBrowser!: boolean;
  constructor(
    private fb: FormBuilder,
    private http:HttpClient,
    private cdr:ChangeDetectorRef,
    private auth:AuthService,
    private router:Router,
    private toaster:ToastrService,
    @Inject(PLATFORM_ID) platformId: object
  ) {

    this.isBrowser = isPlatformBrowser(platformId);

    console.log("Signup")
    this.signup = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            // eslint-disable-next-line no-useless-escape
            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
          ),
        ],
      ],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(14),
        // Validators.pattern('^[A-Z](?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,14}$')
        // Validators.pattern('^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,14}$')
        Validators.pattern('^[A-Z](?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{7,14}$')
      ]],
      firstName: ['',[Validators.required,Validators.maxLength(50),
        Validators.pattern('^[A-Za-z ]+$')]],
      lastName: ['',[Validators.required,Validators.maxLength(50),
        Validators.pattern('^[A-Za-z ]+$')]],
      contactNumber : ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(10), Validators.maxLength(10)]],
      // country: [this.selectedCountry],
      selectedCountry: [this.selectedCountry],
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getCountries(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
  ngOnInit(){
    this.getCountries().subscribe((data) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.countries = data.map((country: any) => ({
        name: country.name.common,
        code: country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : ''),
        flag: country.flags.svg
      }));
      // Sort countries alphabetically by name
    this.countries.sort((a, b) => a.name.localeCompare(b.name));
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

  onSubmit() {
    if(this.isBrowser){
    console.log(this.signup.value);
    this.signup?.markAllAsTouched();
    if(this.signup?.invalid)return;
  
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
        (response: RegistrationResponse) => {
  console.log(response,"135")
          if (response.success) {
            this.toaster.success('Registration successful!');
            localStorage.setItem("token",response.data.token);
            localStorage.setItem("userId",response.data.userId)
            this.auth.updateLoginStatus(true);
            this.dialogRef.close(); 
          } 
        },
        (error: HttpErrorResponse) => {
          console.error('Registration error', error);
          this.toaster.error(error?.error?.message);
        }
      );
    } else {
      // Handle form errors
      console.log('Form is invalid');
    }
  }
  }
  
   // closeLogin
   closeDialog(): void {
    console.log("CloseLogin")
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
