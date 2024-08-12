import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.scss'
})
export class BlogListComponent {

  constructor(private router: Router){

  }
  blog=[
    {
      id:1,
      "title":'First Floppy Journey: 9 Years in Making',
      "category":'Lifestyle',
      "author":{
        "name": "Tilak Dugar",
        "avatar": ""
    },
      "primaryImage": 'images/blog-img/blog1.png',
      "contentHtml": "",
    },
    {
      id:2,
      "title":'Top 7 Hair Removal Methods You Ought To Know!',
      "category":'Beauty',
      "author":{
        "name": "Tilak Dugar",
        "avatar": ""
    },
      "primaryImage": 'images/blog-img/blog2.png',
      "contentHtml": "",
    },
    {
      id:3,
      "title":'AC Repair Near Me Professional Company You Should Choose',
      "category":'Air Conditioning',
      "author":{
        "name": "Tilak Dugar",
        "avatar": ""
    },
      "primaryImage": 'images/blog-img/blog3.png',
      "contentHtml": "",
    },
    {
      id:4,
      "title":'The Ultimate Guide To Oil Massage For Your Healthy Hair',
      "category":'Beauty',
      "author":{
        "name": "Tilak Dugar",
        "avatar": ""
    },
      "primaryImage": 'images/blog-img/blog4.png',
      "contentHtml": "",
    },
    {
      id:5,
      "title":'Do It Yourself Bathroom cleaning Faridabad',
      "category":'Cleaning',
      "author":{
        "name": "Tilak Dugar",
        "avatar": ""
    },
      "primaryImage": 'images/blog-img/blog5.png',
      "contentHtml": "",
    },
    {
      id:6,
      "title":'How Often should you get an ac repair "category" in...',
      "category":'Air Conditioning',
      "author":{
        "name": "Tilak Dugar",
        "avatar": ""
    },
      "primaryImage": 'images/blog-img/blog6.png',
      "contentHtml": "",
    },
    {
      id:7,
      "title":'Get Rid of bed bugs with bed bugs pest control "category"s...',
      "category":'Pest Control',
      "author":{
        "name": "Tilak Dugar",
        "avatar": ""
    },
      "primaryImage": 'images/blog-img/blog7.png',
      "contentHtml": "",
    },
    {
      id:8,
      "title":'How to prevent split ends: easy steps to great hair',
      "category":'Beauty',
      "author":{
        "name": "Tilak Dugar",
        "avatar": ""
    },
      "primaryImage": 'images/blog-img/blog8.png',
      "contentHtml": "",
    },
    {
      id:9,
      "title":'What is a charcoal mask and what are its benefits?',
      "category":'Beauty',
      "author":{
        "name": "Tilak Dugar",
        "avatar": ""
    },
      "primaryImage": 'images/blog-img/blog9.png',
      "contentHtml": "",
    },
    {
      id:10,
      "title":'First Floppy Journey: 9 Years In Making',
      "category":'Beauty',
      "author":{
        "name": "Tilak Dugar",
        "avatar": ""
    },
      "primaryImage": 'images/blog-img/blog10.png',
      "contentHtml": "",
    },
    {
      id:11,
      "title":'First Floppy Journey: 9 Years In Making',
      "category":'Beauty',
      "author":{
        "name": "Tilak Dugar",
        "avatar": ""
    },
      "primaryImage": 'images/blog-img/blog11.png',
      "contentHtml": "",
    },
    {
      id:12,
      "title":'First Floppy Journey: 9 Years In Making',
      "category":'Beauty',
      "author":{
        "name": "Tilak Dugar",
        "avatar": ""
    },
      "primaryImage": 'images/blog-img/blog12.png',
      "contentHtml": "",
    },
  ]
  NavigateToBlockDetail(blog:any){
    const navigationExtras = {
      state: {
        blog: blog,
      }
    };
    console.log('navigate to blog detail');
    this.router.navigate(['blog/blog-detail'],navigationExtras)
  }
}
