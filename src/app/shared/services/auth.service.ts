import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  registerUrl = environment.ApiBaseUrl + 'Auth/register';
  loginUrl = environment.ApiBaseUrl + 'Auth/login';
  logoutUrl = environment.ApiBaseUrl + 'Auth/logout';
  resetPwdUrl = environment.ApiBaseUrl + 'Auth/passwordreset';

  private isLoggedInSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  constructor(private http: HttpClient) { }

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
      this.isLoggedInSubject.next(status)
    }

}
