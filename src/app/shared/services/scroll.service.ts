import { isPlatformBrowser } from '@angular/common';
import { EventEmitter, Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  public contentVisible = new EventEmitter<void>();
  isBrowser!: boolean;
  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if(this.isBrowser){
    window.addEventListener('scroll', this.onScroll.bind(this));
    }
  }

  private onScroll() {
    if(this.isBrowser){
    const element = document.getElementById('lazy-load-target');
    if (element) {
      const rect = element.getBoundingClientRect();
      if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
        this.contentVisible.emit(); // Emit an event when the element is visible
      }
    }
  }
  }
}