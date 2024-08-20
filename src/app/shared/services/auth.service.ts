import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  registerUrl = environment.ApiBaseUrl + 'Auth/register';
  loginUrl = environment.ApiBaseUrl + 'Auth/login';
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
    updateLoginStatus(status: boolean){
      this.isLoggedInSubject.next(status)
    }
}
