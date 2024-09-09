import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ServicesDetailService {
  locationServiceWiseUrl = environment.ApiBaseUrl + 'Service/searchItems'
   url = environment.ApiBaseUrl;
   serviceListUrl = `${environment.ApiBaseUrl}Service/service_page`;
  constructor(private http: HttpClient) { }

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
  getCategoryList():Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // "Authorization": 'Bearer ' + localStorage.getItem('token')
    });
    const httpOptions = {
      headers: headers
    };
    const url = environment.ApiBaseUrl.concat(`Category/CategoryList`);
    return this.http.get<any>(url, httpOptions)
      .pipe(map((response:any) => {
        return response;
      }),
        catchError(error => this.handleError(error)));
  }
  getSubCategoryList(id:string):Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // "Authorization": 'Bearer ' + localStorage.getItem('token')
    });
    const httpOptions = {
      headers: headers
    };
    const url = environment.ApiBaseUrl.concat(`Category/SubCategories/${id}`);
    return this.http.get<any>(url, httpOptions)
      .pipe(map((response:any) => {
        return response;
      }),
        catchError(error => this.handleError(error)));
  }

  getItemByCategory(catId: string, subCategoriesId: string, latitude: any, longitude: any, startIndex?: any, pageSize?: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // "Authorization": 'Bearer ' + localStorage.getItem('token')
    });
    const httpOptions = { headers: headers };
  
    // Base URL
    let url = environment.ApiBaseUrl.concat(`Service/GetItemsByCategory/${catId}/${subCategoriesId}/${latitude}/${longitude}`);
  
    // Add optional query parameters if they are provided
    if (startIndex !== undefined && pageSize !== undefined) {
      url += `?startIndex=${startIndex}&pageSize=${pageSize}`;
    }
  
    return this.http.get<any>(url, httpOptions)
      .pipe(
        map((response: any) => response),
        catchError(error => this.handleError(error))
      );
  }
  

  getServiceDetailsById(ServiceDetailId:string):Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // "Authorization": 'Bearer ' + localStorage.getItem('token')
    });
    const httpOptions = {
      headers: headers
    };
    const url = environment.ApiBaseUrl.concat(`Service/ServiceDeatailsById/${ServiceDetailId}`);
    return this.http.get<any>(url, httpOptions)
      .pipe(map((response:any) => {
        return response;
      }),
        catchError(error => this.handleError(error)));
  }

  getServicePage(CategoryId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // "Authorization": 'Bearer ' + localStorage.getItem('token')
    });
    const httpOptions = {
      headers: headers
    };

    // Correct URL construction
    const url = `${this.serviceListUrl}?CategoryId=${CategoryId}`;

    return this.http.get<any>(url, httpOptions).pipe(
      map((response: any) => response),
      catchError(error => this.handleError(error))
    );
  }

 
  getRatingByItemId(id:string){
    const header = new Headers({'Content-Type': 'application/json'});
    const httpOptions = { headers: header}
    return this.http.get(this.url+`Rating/GetRatingByItemId/${id}`)
  }

  addNewReview(data:any){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // "Authorization": 'Bearer ' + localStorage.getItem('token')
    });
    const httpOptions = {
      headers: headers
    };
    const url = environment.ApiBaseUrl.concat(`Rating/insert-rating-review`);
    return this.http.post<any>(url,data, httpOptions)
      .pipe(map((response:any) => {
        return response;
      }),
        catchError(error => this.handleError(error)));
  }

  // SellerInfo
  getSellerInfo(id:string){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // "Authorization": 'Bearer ' + localStorage.getItem('token')
    });
    const httpOptions = {
      headers: headers
    };
    const url = environment.ApiBaseUrl.concat(`SellerInfo/GetsellerInfoDetailsById/${id}`);
    return this.http.get<any>(url, httpOptions)
      .pipe(map((response:any) => {
        return response;
      }),
        catchError(error => this.handleError(error)));
  }

  handleError(error: any): any {
    throw new Error('Method not implemented.');
  }

  getServiceLocationWise(subgroupName: string, location: string): Observable<any> {
    // Construct the URL with the provided parameters
    const url = `${this.locationServiceWiseUrl}/${subgroupName}/${location}`;
    
    // Make the GET request and return the observable
    return this.http.get<any>(url);
  }
  addCartItem(data:any){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // "Authorization": 'Bearer ' + localStorage.getItem('token')
    });
    const httpOptions = {
      headers: headers
    };
    return this.http.post(this.url+'Cart/add-cart-items',data, httpOptions)
      .pipe(map((response:any) => {
        return response;
      }),
        catchError(error => this.handleError(error)));
  }

}
