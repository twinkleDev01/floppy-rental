import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { HttpOptions } from '../../../shared/components/common/cache';
import { CacheStorage } from  '../../../shared/components/common/cache';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  subcategoryUrl = environment.ApiBaseUrl + 'Category/SubCategories'
  ctegorySubcategoryUrl =  environment.ApiBaseUrl + 'Home/Category-with-subcategory-list';
  itemlistUrl = environment.ApiBaseUrl + 'Home/item-list';
  locationUrl = environment.ApiBaseUrl + 'Home/Locations';
  locationSearchRes: any;
  constructor(private http: HttpClient) { }

  get locationSearchResGetter(){
    return this.locationSearchRes;
  }

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
  // getLocation(){
  //   return this.http.get<any>(this.locationUrl);
  // }
  getSearchedItemList(subgroupname:string,location:any,latitude:any,longitude:any ){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // "Authorization": 'Bearer ' + localStorage.getItem('token')
    });
    const httpOptions = {
      headers: headers
    };
    const url = 'https://cicd.asptask.in/api/'.concat(`Service/searchItems/${subgroupname}/${location}/${latitude}/${longitude}`);
    return this.http.get<any>(url, httpOptions)
      .pipe(map((response:any) => {
        this.locationSearchRes = response.data;
        localStorage.setItem('serviceDetails', JSON.stringify(this.locationSearchRes));
        return response;
      }),
        catchError(error => this.handleError(error)));
  }

  locations$ = new CacheStorage('id');
  getLocation(httpOptions: HttpOptions = {}) {
    const locations$ = this.http.get<any>(this.locationUrl);
    return this.locations$.loadData(locations$, httpOptions);
  }
}
