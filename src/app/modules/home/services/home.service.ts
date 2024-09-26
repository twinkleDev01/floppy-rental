import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { HttpOptions } from '../../../shared/components/common/cache';
import { CacheStorage } from  '../../../shared/components/common/cache';
import { isPlatformBrowser } from '@angular/common';
import { SliderResponse } from '../_models/home.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  subcategoryUrl = environment.ApiBaseUrl + 'Category/SubCategories'
  ctegorySubcategoryUrl =  environment.ApiBaseUrl + 'Home/Category-with-subcategory-list';
  itemlistUrl = environment.ApiBaseUrl + 'Home/item-list';
  locationUrl = environment.ApiBaseUrl + 'Home/Locations';
  isBrowser!: boolean;
  locations$ = new CacheStorage('id');
  constructor(private http: HttpClient, @Inject(PLATFORM_ID) platformId: object) { 
    this.isBrowser = isPlatformBrowser(platformId);
  }

  getHomeDetails(): Observable<SliderResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // "Authorization": 'Bearer ' + localStorage.getItem('token')
    });
    const httpOptions = {
      headers: headers
    };
    const url = environment.ApiBaseUrl.concat(`Home/fetch-all-dynamic-data`);
    return this.http.get<SliderResponse>(url, httpOptions)
  }

  getServiceList():Observable<any>{
    if(this.isBrowser){
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
    }else{
      return of([])
    }
  }

  getSubCategories(categoryId: number): Observable<any> {
    const url = `${this.subcategoryUrl}/${categoryId}`;
    return this.http.get(url);
  }

  handleError(error: any): any {
    throw new Error('Method not implemented.');
  }
  getAllCategorySubcategory(): Observable<any> {
    return this.http.get<any>(this.ctegorySubcategoryUrl);
  }
  getItemlist(){
    return this.http.get<any>(this.itemlistUrl);
  }
  
  getLocation(httpOptions: HttpOptions = {}) {
    const locations$ = this.http.get<any>(this.locationUrl);
    return this.locations$.loadData(locations$, httpOptions);
  }
}
