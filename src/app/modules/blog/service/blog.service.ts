import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  blogListUrl = environment.ApiBaseUrl + 'Blog/BlogList';
  blogDetailUrl = environment.ApiBaseUrl + 'Blog/blog_details_by_id';
  saveBlogUrl = environment.ApiBaseUrl + 'Blog/saveBlogReview'
  blogReviewUrl = environment.ApiBaseUrl + 'Blog/GetReviewListByBlogId'

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

  private searchTermSource = new BehaviorSubject<string>(''); // Default empty search term
  currentSearchTerm = this.searchTermSource.asObservable();

  updateSearchTerm(term: string) {
    this.searchTermSource.next(term); // Update the search term
  }

  getReviewsByBlogId(blogId: number): Observable<any> {
    const url = `${this.blogReviewUrl}/${blogId}`;
    return this.http.get<any>(url);
  }

}
