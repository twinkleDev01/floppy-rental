import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogRoutingModule } from './blog-routing.module';
import { BlogComponent } from './blog/blog.component';
import { SharedModule } from '../../shared/shared.module';
import { BlogListComponent } from './blog-list/blog-list.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [BlogComponent, BlogListComponent, BlogDetailComponent],
  imports: [
    CommonModule,
    BlogRoutingModule,
    SharedModule,
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class BlogModule { }
