import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }
  getHomeDetails(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // "Authorization": 'Bearer ' + localStorage.getItem('token')
    });
    const httpOptions = {
      headers: headers
    };
    const url = environment.ApiBaseUrl.concat(`Home/fetch-all-dynamic-data`);
    return this.http.get<any>(url, httpOptions)
      .pipe(map((response:any) => {
        return response;
      }),
        catchError(error => this.handleError(error)));
  }

  getServiceList():Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // "Authorization": 'Bearer ' + localStorage.getItem('token')
    });
    const httpOptions = {
      headers: headers
    };
    const url = environment.ApiBaseUrl.concat(`Service/ServicesList`);
    return this.http.get<any>(url, httpOptions)
      .pipe(map((response:any) => {
        return response;
      }),
        catchError(error => this.handleError(error)));
  }

  handleError(error: any): any {
    throw new Error('Method not implemented.');
  }
}
