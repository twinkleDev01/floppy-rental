import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from '../../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ProfileService } from '../service/profile.service';
import { Country, State, City } from 'country-state-city';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  @Output() handleNavigationSignup = new EventEmitter();
  passwordType: string = 'password';
  selectedCountry: any; 
  selectedCountryFlag: string | undefined;
  profileForm: FormGroup;
  countries: any;
  states: any;
  cities: any;
  selectedState: any;
  selectedCity: any;
  private apiUrl = 'https://restcountries.com/v3.1/all';
  
  @ViewChild('country') country!: ElementRef;
  @ViewChild('city') city!: ElementRef;
  @ViewChild('state') state!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private auth: AuthService,
    private toastr: ToastrService,
    private route: Router,
    private profileService: ProfileService,
  ) {
    this.profileForm = this.fb.group({
      name: [''],
      phone: [''],
      selectedCountry: [''],
      state: [''],
      pincode: [''],
      locality: [''],
      city: [''],
      address: [''],
      profilePicture: [null]
    });
  }

  getCountries(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  async ngOnInit(): Promise<void> {
    try {
      await this.fetchCountries();
      this.getUserDetailById();
    } catch (error) {
      console.error('Error during initialization:', error);
    }
  }

  togglePassword(): void {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }

  handleNavigation(): void {
    this.handleNavigationSignup.emit('login');
  }
  
  onCountryChange(event: MatSelectChange): void {
    const selectedCountry = event.value;
    console.log(selectedCountry, "selectedCountry");
    
    if (selectedCountry) {
      this.selectedCountry = selectedCountry;
      this.selectedCountryFlag = selectedCountry.flag;
      this.profileForm.get("selectedCountry")?.setValue(selectedCountry);
      this.profileForm.get("selectedCountry")?.updateValueAndValidity();
      this.states = State.getStatesOfCountry(selectedCountry.iso2);
      this.cities = City.getCitiesOfState(this.selectedCountry.iso2, this.states?.[0].isoCode);
      console.log(this.states,"87");
      if(this.states?.length){
        this.profileForm?.get("state")?.setValue(this.states?.[0]?.isoCode);
      }
      if(this.cities?.length){
        this.profileForm?.get("city")?.setValue(this.cities?.[0]?.name);
      }
      // this.cities = [];
    } else {
      this.selectedCountryFlag = undefined;
    }
  }

  onStateChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedIsoCode = target.value;
  
    // Find the selected state object based on isoCode
    this.selectedState = this.states.find((state:any) => state.isoCode === selectedIsoCode);
  console.log(this.selectedState,"100")
    if (this.selectedState) {
      // Set the state name in the form control
      this.profileForm.get('state')?.setValue(this.selectedState.isoCode);
      // Fetch cities based on the selected state
      if (this.selectedCountry && this.selectedState) {
        this.cities = City.getCitiesOfState(this.selectedCountry.iso2, this.selectedState.isoCode);
      }
    } else {
      console.warn('State not found for ISO code:', selectedIsoCode);
    }
  }
  
  

  onCityChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedCity = JSON.parse(target.value);
    this.selectedCity = selectedCity;
    this.profileForm.get('city')?.setValue(selectedCity.name);
  }

  noSpace(event: KeyboardEvent): boolean {
    if (event.key === ' ' && !((event.target as HTMLInputElement).value)) return false;
    return true;
  }

  formatPhoneNumber(phoneNumber: string, countryCode: string): string {
    return `${countryCode}${phoneNumber}`;
  }

  onProfileSubmit(): void {
    if (this.profileForm.valid) {
      const id = Number(localStorage.getItem('userId'));
      const formValue = this.profileForm.value;
      const selectedCountry = formValue.selectedCountry;
  
      // Format the phone number
      const formattedPhoneNumber = this.formatPhoneNumber(formValue.phone, selectedCountry?.code || '');
      this.selectedState = this.states.find((state:any) => state.isoCode === formValue?.state);
      const payload = {
        userId: id,
        name: formValue.name,
        phone: formattedPhoneNumber,
        pincode: formValue.pincode,
        locality: formValue.locality,
        address: formValue.address,
        state: this.selectedState.name,
        city: formValue.city,
        image: formValue.profilePicture
      };
  
      this.profileService.updateUserProfile(payload).subscribe(
        response => {
          console.log('Profile updated successfully', response);
        },
        error => {
          console.error('Error updating profile', error);
          this.toastr.error('Failed to update profile');
        }
      );
    } else {
      this.toastr.error('Form is invalid');
    }
  }  

  logOut(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.auth.logout(userId).subscribe(
        (response: any) => {
          if (response.success) {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('cartItems');
            this.toastr.success('Successfully Logged Out');
            this.route.navigateByUrl('');
            this.auth.updateLoginStatus(false);
          }
        },
        (error: any) => {
          console.error('Logout error', error);
          this.toastr.error('An error occurred. Please try again later.');
        }
      );
    }
  }

  fetchCountries(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.getCountries().subscribe(
        (data) => {
          this.countries = data.map((country: any) => ({
            name: country.name.common,
            code: country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : ''),
            flag: country.flags.svg,
            iso2: country.cca2,
          }));
          resolve();
          
        },
        (error) => {
          console.error('Error fetching countries:', error);
          reject(error);
        }
      );
    });
  }

  getUserDetailById(): void {
    const id = localStorage.getItem('userId');
    if (id) {
      this.profileService.getProfileDetailsById(Number(id)).subscribe(
        (response: any) => {
          if (response.success) {
            const fullMobileNumber = response.data.mobileNo;
            console.log('Full Mobile Number:', fullMobileNumber);
            console.log('Available Countries:', this.countries);

            const countryCodeObj = this.countries.find((c:any) => fullMobileNumber.startsWith(c.code));
            const countryCode = countryCodeObj?.code || '';

            console.log('Country Code:', countryCode);

            if (countryCode) {
              console.error('Country code not found for the mobile number.');
              this.states = State.getStatesOfCountry(countryCodeObj?.iso2);
             
            }

            const escapedCountryCode = countryCode.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const phone = fullMobileNumber.replace(new RegExp(`^${escapedCountryCode}`), '').trim();
            console.log('Contact Number:', phone);
const patchedState = this.states?.find((state:any)=> state?.name === response?.data?.state)?.isoCode;

this.cities = City.getCitiesOfState(countryCodeObj?.iso2, patchedState);
const patchedCity = this.cities?.find((city:any)=> city?.name === response?.data?.city)?.name;
            this.profileForm.patchValue({
              name: response.data.name || '',
              selectedCountry: countryCodeObj || null,
              phone: phone || '',
              state: patchedState || '',
              pincode: response.data.pincode || '',
              locality: response.data.locality || '',
              city: patchedCity || '',
              address: response.data.address || '',
              profilePicture: response.data.image
            });
            console.log(this.profileForm.value);
          } else {
            this.toastr.error('Failed to load profile details');
          }
        },
        (error) => {
          console.error('Error fetching profile details:', error);
          this.toastr.error('Failed to load profile details');
        }
      );
    }
  }

  onProfilePictureChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        console.error('Selected file is not an image.');
        this.toastr.error('Selected file is not an image.');
        return;
      }

      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        console.error('Selected file is too large.');
        this.toastr.error('Selected file is too large.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileForm.get('profilePicture')?.setValue(e.target.result);
        console.log('File data URL:', e.target.result);
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
      };
      reader.readAsDataURL(file);
    }
  }
}
