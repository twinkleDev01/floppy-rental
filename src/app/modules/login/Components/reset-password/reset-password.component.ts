import { ChangeDetectorRef, Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmPasswordValidator } from '../../confirm-password.validator';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, interval, Observable, Subscription } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';

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
  timer: number = 60; // Initial timer value in seconds
  countdown: string = "01:00"; // Initial countdown display
  timerSubscription!: Subscription;
  showPassword:boolean = false;
  // showOtp = new BehaviorSubject<boolean>(false);
  // showOtpOb = this.showOtp?.asObservable();
  showOtp:boolean=false
  isVerifyingOtp:boolean = false
  isResenOtp:boolean = false

  readonly dialogRef = inject(MatDialogRef<ResetPasswordComponent>);
  constructor(private fb: FormBuilder, private http:HttpClient,private cdr:ChangeDetectorRef, private auth:AuthService, private toastr:ToastrService,) {
    this.loginForm = this.fb.group({
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
      otp:[''],
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
    this.confirmPasswordType = 'text';
   }else{
      this.confirmPasswordType = 'confirmPassword';
    }  ;
  }

  noSpace(event:any) {
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
  password: this.loginForm.value.password,
  mobile:this.loginForm.value.selectedCountry.code + this.loginForm.value.contactNumber,
      }
this.auth.resetPassword(resetpwd).subscribe((response:any)=>{
  if(response.success){
    this.toastr.success("Successfully Password Reset")
    this.dialogRef.close();
  }
},
(error: any) => {
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

  startTimer() {
    this.timer = 60;
    this.timerSubscription = interval(1000).subscribe(() => {
      this.timer--;
      if (this.timer === 0) {
        this.stopTimer();
        this.isResenOtp = true;
      }
      this.countdown = this.formatTimer(this.timer);
      this.cdr.detectChanges();  // Manually trigger change detection
    });
  }
  stopTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      // this.timer = 60; // Reset timer
      // this.countdown = this.formatTimer(this.timer); // Reset countdown display
    }
  }
  formatTimer(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const displayMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const displaySeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
    return `${displayMinutes}:${displaySeconds}`;
  }
  // Method to call the sendOtp method from the service
  sendOtp() {
    const mobileNumber = this.loginForm.value.contactNumber;

    if (mobileNumber) {
      this.isResenOtp = false
      this.auth.sendOtp(mobileNumber).subscribe(
        (response) => {
          if (response.success) {
            // this.showOtp?.next(true);
            this.showOtp = true;
            this.isVerifyingOtp = true
            this.startTimer()
            this.toastr.success('OTP sent successfully!');
            this.cdr.detectChanges()
          } else {
            this.toastr.error('Failed to send OTP. Please try again.');
          }
        },
        (error) => {
          this.toastr.error('Error sending OTP. Please check the mobile number and try again.');
          console.error('Error sending OTP:', error);
        }
      );
    } else {
      this.toastr.error('Please enter a valid mobile number.');
    }
  }

  verifyOtp() {
    const mobilenumber = this.loginForm.get('contactNumber')?.value;
    const otp = this.loginForm.get('otp')?.value;
  
  
    // Disable the Verify button to prevent multiple requests
    // this.isVerifyingOtp = true;
  
    this.auth.verifyOtp(mobilenumber, otp).subscribe(
      (response:any) => {
        // Assuming the response has a 'success' flag for API success
        if (response.success) {
          this.toastr.success('OTP verified successfully!');
          // this.showOtp = false;
          this.showPassword = true  // Hide OTP input after successful verification
          this.isVerifyingOtp = false;
          this.isResenOtp = false
          this.stopTimer();  
          this.cdr.detectChanges()    // Stop the timer when OTP is verified
          // Add any other actions, such as routing to another page
        } else {
          this.toastr.error('Failed to verify OTP. Please try again.');
        }
  
        // Re-enable the Verify button after the request
        // this.isVerifyingOtp = false;
      },
      (error) => {
        this.toastr.error('Error verifying OTP. Please try again.');
        // this.stopTimer()
        // this.isResenOtp = true;
        this.loginForm.get('otp')?.setValue('');
        // this.isVerifyingOtp = false;  // Hide verify OTP button since it's failed
        this.cdr.detectChanges();
      }
    );
  }
  }