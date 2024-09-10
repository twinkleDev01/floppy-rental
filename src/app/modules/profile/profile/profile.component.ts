import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from '../../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ProfileService } from '../service/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  @Output() handleNavigationSignup = new EventEmitter()
  passwordType: string = 'password';
  selectedCountry!: string ; 
  // countries: any;
  selectedCountryFlag: any;
  // signup: FormGroup;
  profileForm: FormGroup
  keyChar: any;
  // countries: any;
   countries: any[] = [];
   private apiUrl = 'https://restcountries.com/v3.1/all';

  constructor(
    private fb: FormBuilder,
    private http:HttpClient,
    private cdr:ChangeDetectorRef,
    private auth:AuthService,
    private toastr:ToastrService,
    private route:Router,
    private profileService:ProfileService
  ) {
    console.log("Signup")
    // this.signup = this.fb.group({
    //   email: [
    //     '',
    //     [
    //       Validators.required,
    //       Validators.pattern(
    //         /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    //       ),
    //     ],
    //   ],
    //   password: ['', [Validators.required, Validators.minLength(6)]],
    //   firstName: ['',[Validators.required]],
    //   lastName: ['',[Validators.required]],
    //   contactNumber : ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(10), Validators.maxLength(10)]],
    //   // country: [this.selectedCountry],
    //   selectedCountry: [this.selectedCountry],
    // });

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
    return this.http.get(this.apiUrl);
  }
  // ngOnInit(){
  //   this.getCountries().subscribe((data) => {
  //     this.countries = data.map((country: any) => ({
  //       name: country.name.common,
  //       code: country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : ''),
  //       flag: country.flags.svg
  //     }));
  //     this.signup?.get("selectedCountry")?.setValue(this.countries.find(d=> d.name == "India"));
  //   });
  //   this.getUserDetailById()
  // }

  async ngOnInit(): Promise<void> {
    try {
      // Wait for the countries to be fetched
      await this.fetchCountries();
      
      // Once countries are fetched, proceed to get user details
      this.getUserDetailById();
    } catch (error) {
      console.error('Error during initialization:', error);
    }
  }
  

  togglePassword(): void {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }

  handleNavigation(){
    console.log('login signup')
    this.handleNavigationSignup.emit('login')
  }

  // onCountryChange(selectedCountry: any) {
  //   console.log(selectedCountry,"selectedCountry")
  //   if (selectedCountry) {
  //     this.selectedCountryFlag = selectedCountry.flag;
  //     this.signup?.get("selectedCountry")?.setValue(this.selectedCountry);
  //     this.signup?.get("selectedCountry")?.updateValueAndValidity();
      
  //   } else {
  //     this.selectedCountryFlag = null;
  //   }
   
  // }
  
  onCountryChange(selectedCountry: any): void {
    console.log(selectedCountry, "selectedCountry");
    
    if (selectedCountry) {
      this.selectedCountryFlag = selectedCountry.flag;
      this.profileForm?.get("selectedCountry")?.setValue(selectedCountry);
      this.profileForm?.get("selectedCountry")?.updateValueAndValidity();
    } else {
      this.selectedCountryFlag = null;
    }
  }
  

  noSpace(event: any) {
    console.log(event, 'keyyyy');
    if (event.keyCode === 32 && !event.target.value) return false;
    return true;
  }

  // onSubmit() {
  //   console.log(this.signup.value);
  //   if (this.signup.valid) {
  //     // Handle successful login
  //     console.log('Form Submitted!', this.signup.value);
  //   } else {
  //     // Handle form errors
  //     console.log('Form is invalid');
  //   }
  // }

  formatPhoneNumber(phoneNumber: string, countryCode: string): string {
    // Format the phone number with the country code
    return `${countryCode}${phoneNumber}`;
  }

  onProfileSubmit() {
    if (this.profileForm.valid) {
      const id = Number(localStorage.getItem('userId'));
      const formValue = this.profileForm.value;
      const selectedCountry = formValue.selectedCountry;
  
      // Format the phone number
      const formattedPhoneNumber = this.formatPhoneNumber(formValue.phone, selectedCountry?.code || '');
  
      // Map form controls to payload structure
      const payload = {
        userId: id,
        name: formValue.name,
        phone: formattedPhoneNumber, // Use the formatted phone number
        pincode: formValue.pincode,
        locality: formValue.locality,
        address: formValue.address,
        state: formValue.state,
        city: formValue.city,
        image: formValue.profilePicture // Map profilePicture to image
      };
  
      this.profileService.updateUserProfile(payload).subscribe(
        response => {
          console.log('Profile updated successfully', response);
        },
        error => {
          console.error('Error updating profile', error);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }  
  

  logOut(){
    const userId = localStorage.getItem('userId');
    if(userId){
      this.auth.logout(userId).subscribe((response:any)=>{
        console.log(response)
        if(response.success){
          localStorage.removeItem('token')
          localStorage.removeItem('userId')
          localStorage.removeItem('cartItems')
          this.toastr.success('Successfully Logout')
          this.route.navigateByUrl('')
          this.auth.updateLoginStatus(false);
        }
      },
      (error: any) => {
        console.error('Registration error', error);
        this.toastr.error('An error occurred. Please try again later.');
      }
    )
    }
  }

  // Method to fetch countries and return a Promise
fetchCountries(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    this.getCountries().subscribe(
      (data) => {
        this.countries = data.map((country: any) => ({
          name: country.name.common,
          code: country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : ''),
          flag: country.flags.svg
          
        }));
    
        // Resolve the promise once countries are successfully fetched
        resolve();
      },
      (error) => {
        console.error('Error fetching countries:', error);
        reject(error); // Reject the promise on error
      }
    );
  });
}


 // Method to get user details, will only be called after countries are fetched
 getUserDetailById(): void {
  const id = localStorage.getItem('userId');
  if (id) {
    this.profileService.getProfileDetailsById(Number(id)).subscribe(
      (response: any) => {
        if (response.success) {
          const fullMobileNumber = response.data.mobileNo;
          console.log('Full Mobile Number:', fullMobileNumber);
          console.log('Available Countries:', this.countries);

          // Find the country code object from the list of countries
          const countryCodeObj = this.countries.find(c => fullMobileNumber.startsWith(c.code));
          const countryCode = countryCodeObj?.code || ''; // Extract the country code or use an empty string if not found

          console.log('Country Code:', countryCode);

          if (countryCode === '') {
            console.error('Country code not found for the mobile number.');
          }

          // Correctly escape the '+' character in the regular expression
          const escapedCountryCode = countryCode.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special characters
          const phone = fullMobileNumber.replace(new RegExp(`^${escapedCountryCode}`), '').trim();
          console.log('Contact Number:', phone);

          // Patch the form with the values received from the API response
          this.profileForm.patchValue({
            name: response.data.name || '', // Use empty string as fallback for null values
            selectedCountry: countryCodeObj || null, // Use null if countryCodeObj is not found
            phone: phone || '', // Use empty string as fallback
            state: response.data.state || '', // Handle potential null values
            pincode: response.data.pincode || '',
            locality: response.data.locality || '',
            city: response.data.city || '',
            address: response.data.address || '',
            profilePicture:response.data.image
          });
          console.log(this.profileForm.value)
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
    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.error('Selected file is not an image.');
      return;
    }

    // Validate file size (e.g., 2MB max)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      console.error('Selected file is too large.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.profileForm.get('profilePicture')?.setValue(e.target.result);
      console.log('File data URL:', e.target.result); // Check if result is correct
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
    };
    reader.readAsDataURL(file);
  }
}



  
}
