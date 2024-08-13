import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

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

  constructor(
    private fb: FormBuilder,
    private http:HttpClient,
    private cdr:ChangeDetectorRef
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
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['',[Validators.required]],
      lastName: ['',[Validators.required]],
      contactNumber : ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(10), Validators.maxLength(10)]],
      country: ['', Validators.required],
      selectedCountry: [],
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
    console.log(event, 'keyyyy');
    if (event.keyCode === 32 && !event.target.value) return false;
    return true;
  }

  onSubmit() {
    console.log(this.signup.value);
    if (this.signup.valid) {
      // Handle successful login
      console.log('Form Submitted!', this.signup.value);
    } else {
      // Handle form errors
      console.log('Form is invalid');
    }
  }
}
