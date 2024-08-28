import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  blogListUrl = environment.ApiBaseUrl + 'Blog/BlogList';
  blogDetailUrl = environment.ApiBaseUrl + 'Blog/blog_details_by_id';

  constructor(private http: HttpClient) { }

  getBlogList(limit: number): Observable<any> {
    const url = `${this.blogListUrl}/${limit}`;  // Construct URL with the limit
    return this.http.get<any>(url);  // Make the GET request
  }

    // Method to get blog details by pageName
  getBlogDetails(pageName: string): Observable<any> {
      const url = `${this.blogDetailUrl}/${pageName}`;  // Construct the API URL
      return this.http.get(url);  // Make the GET request
    }

}