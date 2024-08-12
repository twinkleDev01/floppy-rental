import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.scss'
})
export class BlogDetailComponent {
  selectedBlog: any;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.selectedBlog = navigation?.extras?.state?.['blog']; 
    console.log(this.selectedBlog);
  }

}
