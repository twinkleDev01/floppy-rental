import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  public contentVisible = new EventEmitter<void>();

  constructor() {
    window.addEventListener('scroll', this.onScroll.bind(this));
    console.log("service")
  }

  private onScroll() {
    console.log('scroll')
    const element = document.getElementById('lazy-load-target');
    if (element) {
      const rect = element.getBoundingClientRect();
      if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
        this.contentVisible.emit(); // Emit an event when the element is visible
      }
    }
  }
}