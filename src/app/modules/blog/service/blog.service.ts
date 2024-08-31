import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  blogListUrl = 'https://cicd.asptask.in/api/' + 'Blog/BlogList';
  blogDetailUrl = 'https://cicd.asptask.in/api/' + 'Blog/blog_details_by_id';
  saveBlogUrl = environment.ApiBaseUrl + 'Blog/saveBlogReview'

  constructor(private http: HttpClient) { }

  getBlogList(startIndex: number, pageSize: number): Observable<any> {
    const url = `${this.blogListUrl}?startIndex=${startIndex}&PageSize=${pageSize}`;  // Construct URL with query parameters
    return this.http.get<any>(url);  // Make the GET request
  }  

    // Method to get blog details by pageName
  getBlogDetails(pageId: string): Observable<any> {
      const url = `${this.blogDetailUrl}/${pageId}`;  // Construct the API URL
      return this.http.get(url);  // Make the GET request
    }


    // Method to save the blog review
  saveBlogReview(blogReviewData: any): Observable<any> {
    return this.http.post(this.saveBlogUrl, blogReviewData);
  }

}
