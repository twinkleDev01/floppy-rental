import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, Subject } from 'rxjs';
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


  getItemByCategory(
    catId: number, 
    subCategoryIds: number[], 
    servicesName:[],
    latitude: number, 
    longitude: number, 
    startIndex: number = 0, 
    pageSize: number = 0
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // "Authorization": 'Bearer ' + localStorage.getItem('token')
    });
    
    const httpOptions = { headers: headers };
  
    // Construct payload object as per the API requirements
    const payload = {
      categoryId: catId,
      subCategoryIds: Array.isArray(subCategoryIds) ? subCategoryIds.filter(id => id != null) : [subCategoryIds].filter(id => id != null), // Force array
      servicesName: Array.isArray(servicesName) ? servicesName.filter(name => name != null) : [servicesName].filter(name => name != null),
      latitude: latitude,
      longitude: longitude,
      pageSize: pageSize,
      startIndex: startIndex
    };
  
    // Make a POST request to the API with the payload
    return this.http.post<any>(environment.ApiBaseUrl + 'Service/GetItemsByCategory', payload, httpOptions)
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

  getServiceLocationWise(subgroupId: number[],serviceNames:string[],location: string, latitude: number, longitude: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // "Authorization": 'Bearer ' + localStorage.getItem('token') // Uncomment if needed
    });
  
    const httpOptions = { headers: headers };
  
    // Construct the payload as required by the API
    const payload = {
      subgroupIds : Array.isArray(subgroupId) ? subgroupId.filter(id => id != null) : [subgroupId].filter(id => id != null),
      serviceNames: Array.isArray(serviceNames) ? serviceNames.filter(name => name != null) : [serviceNames].filter(name => name != null),
      location: location,
      latitude: latitude,
      longitude: longitude
    };
    // Make the POST request to the API with the payload
    return this.http.post<any>(this.locationServiceWiseUrl, payload, httpOptions)
      .pipe(
        map((response: any) => response), // Handle the response data
        catchError(error => this.handleError(error)) // Handle any errors
      );
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
        // catchError(error => this.handleError(error))
      );
  }

  private locationChangedSource = new Subject<void>();  // Emits when location changes
  locationChanged$ = this.locationChangedSource.asObservable();

  // Method to trigger the change event
  notifyLocationChange() {
    this.locationChangedSource.next();  // Emit a notification of change
  }

  getSubCategoryBySpecificationName(id:string):Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // "Authorization": 'Bearer ' + localStorage.getItem('token')
    });
    const httpOptions = {
      headers: headers
    };
    const url = environment.ApiBaseUrl.concat(`Service/GetServicesListByIds/${id}`);
    return this.http.get<any>(url, httpOptions)
      .pipe(map((response:any) => {
        return response;
      }),
        catchError(error => this.handleError(error)));
  }

  getAllItemListsByVendorId(vendorId: number, latitude: number, longitude: number, ItemId:any): Observable<any> {
    const url = environment.ApiBaseUrl + `SellerInfo/GetAllItemListsByVendorId?vendorId=${vendorId}&latiude=${latitude}&longitude=${longitude}&ItemId=${ItemId}`;
  
    const headers = new HttpHeaders({
      // 'Authorization': `Bearer ${this.authService.getToken()}` // Replace with your token logic
    });
  
    return this.http.get(url, { headers });
  }
  

}
