import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isBrowser!: boolean;
  registerUrl = environment.ApiBaseUrl + 'Auth/register';
  loginUrl = environment.ApiBaseUrl + 'Auth/login';
  logoutUrl = environment.ApiBaseUrl + 'Auth/logout';
  resetPwdUrl = environment.ApiBaseUrl + 'Auth/passwordreset';

  private isLoggedInSubject;

  isLoggedIn$;
  constructor(private http: HttpClient, @Inject(PLATFORM_ID) platformId: Object) { 
    this.isBrowser = isPlatformBrowser(platformId);
    if(this.isBrowser){
      this.isLoggedInSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
      this.isLoggedIn$ = this.isLoggedInSubject.asObservable();
    }
  }

    // Method to register a new user
    register(userData: any): Observable<any> {
      return this.http.post<any>(this.registerUrl, userData);
    }

    logIn(userData: any): Observable<any> {
      return this.http.post<any>(this.loginUrl, userData);
    }

   logout(userId: string): Observable<any> {
    const url = `${this.logoutUrl}/${userId}`;

    return this.http.post(url,{id:userId});
  }

  resetPassword(userData: any): Observable<any> {
    return this.http.post<any>(this.resetPwdUrl, userData);
  }

    updateLoginStatus(status: boolean){
  console.log(status,"40")
  if(this.isLoggedInSubject)
      this.isLoggedInSubject.next(status)
    }

    getLoginStatus(): Observable<boolean> {
      if(this.isLoggedInSubject){
      this.isLoggedInSubject.asObservable().subscribe((res:any)=>{
        console.log(res,"res");
            })
      return this.isLoggedInSubject.asObservable();
          }else{
            return of(false)
          }
    }

    // Method to send OTP to the mobile number
  sendOtp(mobileNumber: string): Observable<any> {
    const url = environment.ApiBaseUrl + `Auth/sendotp/${mobileNumber}`;
    
    // You can add any necessary headers if required
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    // Sending a GET request to the API to send OTP
    return this.http.post<any>(url, { headers });
  }

  verifyOtp(mobileNumber: string, otp: string): Observable<any> {
    const url = environment.ApiBaseUrl + `Auth/verifyotp?mobilenumber=${mobileNumber}&otp=${otp}`;
     // The payload for the POST request
  const payload = {
    mobilenumber: mobileNumber,
    otp: otp
  };

    return this.http.post<any>(url, payload).pipe(
      catchError((error) => {
        console.error('Error verifying OTP:', error);
        return throwError(error);
      })
    );
  }
  
  

}
