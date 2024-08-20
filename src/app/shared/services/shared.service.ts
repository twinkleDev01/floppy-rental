import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public base: BehaviorSubject<string> = new BehaviorSubject<string>('home');
  public page: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public last: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor() {}

  // Method to update the full breadcrumb path
  updateBreadcrumb(url: string) {
    const segments = url.split('/').filter(Boolean); // Split the URL and remove empty segments
    this.base.next(segments[0] || 'home');
    if (segments.length > 1) {
      this.page.next(segments[1]);
      this.last.next(segments.slice(2).join(' ') || ''); // Join the remaining segments if they exist
    } else {
      this.page.next('');
      this.last.next('');
    }
  }
}
