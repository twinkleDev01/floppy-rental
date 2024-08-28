import { Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BlogService } from '../service/blog.service';
import { Blog } from '../_models/blog.model';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.scss'
})
export class BlogListComponent {
  @Output() blogData = new EventEmitter();
  @Input()
  BlogNumber!: number;
  blog:Blog[]=[];
  @HostBinding('class.small-parent') isSmallParent = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkParentSize();
  }

  ngOnInit() {
    this.checkParentSize();
    this.getBlogList()
  }

  checkParentSize() {
    const parentWidth = (this.el.nativeElement as HTMLElement).parentElement?.clientWidth;
    this.isSmallParent = parentWidth ? parentWidth < 600 : false; // Example threshold
    console.log(parentWidth + 'px', this.isSmallParent);
  }


  constructor(private router: Router,private el: ElementRef, private blogService:BlogService){

  }

  getBlogList(){
this.blogService.getBlogList().subscribe((response:any)=>{
  console.log(response.data,"37")
  this.blog = response.data
})
  }

  // blog=[
  //   {
  //     id:1,
  //     "title":'First Floppy Journey: 9 Years in Making',
  //     "category":'Lifestyle',
  //     "author":{
  //       "name": "Tilak Dugar",
  //       "avatar": ""
  //   },
  //     "primaryImage": 'images/blog-img/blog1.png',
  //     "contentHtml": {
  //       para1:'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum The man, who is in a stable condition inhospital, has “potentia ly life-changing injuries” after the overnight attack in Garvagh, County Lonodonderry. He was shot in the arms and legs.”What sort of men would think it is accepttable to subject a young girl to this level of brutality and violence?”Every child has the right to feel safe and protected in their own home – how is this poor child going to sleep tonight or in coming nights? What are the long term effects on her going to be?” As a app web crawler expert, I help organizations adjust to the It is a long established fact that a reader will be distracted Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  //       para2:'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don’t look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn’t quite anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary.',
  //       img1:'images/blog-img/blog1.png',
  //        img2:'images/blog-img/blog3.png'
  //     },
  //   },
  //   {
  //     id:2,
  //     "title":'Top 7 Hair Removal Methods You Ought To Know!',
  //     "category":'Beauty',
  //     "author":{
  //       "name": "Tilak Dugar",
  //       "avatar": ""
  //   },
  //     "primaryImage": 'images/blog-img/blog2.png',
  //     "contentHtml": {
  //       para1:'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum The man, who is in a stable condition inhospital, has “potentia ly life-changing injuries” after the overnight attack in Garvagh, County Lonodonderry. He was shot in the arms and legs.”What sort of men would think it is accepttable to subject a young girl to this level of brutality and violence?”Every child has the right to feel safe and protected in their own home – how is this poor child going to sleep tonight or in coming nights? What are the long term effects on her going to be?” As a app web crawler expert, I help organizations adjust to the It is a long established fact that a reader will be distracted Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  //       para2:'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don’t look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn’t quite anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary.',
  //       img1:'images/blog-img/blog1.png',
  //        img2:'images/blog-img/blog3.png'
  //     },
  //   },
  //   {
  //     id:3,
  //     "title":'AC Repair Near Me Professional Company You Should Choose',
  //     "category":'Air Conditioning',
  //     "author":{
  //       "name": "Tilak Dugar",
  //       "avatar": ""
  //   },
  //     "primaryImage": 'images/blog-img/blog3.png',
  //     "contentHtml": {
  //       para1:'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum The man, who is in a stable condition inhospital, has “potentia ly life-changing injuries” after the overnight attack in Garvagh, County Lonodonderry. He was shot in the arms and legs.”What sort of men would think it is accepttable to subject a young girl to this level of brutality and violence?”Every child has the right to feel safe and protected in their own home – how is this poor child going to sleep tonight or in coming nights? What are the long term effects on her going to be?” As a app web crawler expert, I help organizations adjust to the It is a long established fact that a reader will be distracted Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  //       para2:'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don’t look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn’t quite anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary.',
  //       img1:'images/blog-img/blog1.png',
  //        img2:'images/blog-img/blog3.png'
  //     },
  //   },
  //   {
  //     id:4,
  //     "title":'The Ultimate Guide To Oil Massage For Your Healthy Hair',
  //     "category":'Beauty',
  //     "author":{
  //       "name": "Tilak Dugar",
  //       "avatar": ""
  //   },
  //     "primaryImage": 'images/blog-img/blog4.png',
  //     "contentHtml": {
  //       para1:'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum The man, who is in a stable condition inhospital, has “potentia ly life-changing injuries” after the overnight attack in Garvagh, County Lonodonderry. He was shot in the arms and legs.”What sort of men would think it is accepttable to subject a young girl to this level of brutality and violence?”Every child has the right to feel safe and protected in their own home – how is this poor child going to sleep tonight or in coming nights? What are the long term effects on her going to be?” As a app web crawler expert, I help organizations adjust to the It is a long established fact that a reader will be distracted Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  //       para2:'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don’t look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn’t quite anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary.',
  //       img1:'images/blog-img/blog1.png',
  //        img2:'images/blog-img/blog3.png'
  //     },
  //   },
  //   {
  //     id:5,
  //     "title":'Do It Yourself Bathroom cleaning Faridabad',
  //     "category":'Cleaning',
  //     "author":{
  //       "name": "Tilak Dugar",
  //       "avatar": ""
  //   },
  //     "primaryImage": 'images/blog-img/blog5.png',
  //    "contentHtml": {
  //       para1:'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum The man, who is in a stable condition inhospital, has “potentia ly life-changing injuries” after the overnight attack in Garvagh, County Lonodonderry. He was shot in the arms and legs.”What sort of men would think it is accepttable to subject a young girl to this level of brutality and violence?”Every child has the right to feel safe and protected in their own home – how is this poor child going to sleep tonight or in coming nights? What are the long term effects on her going to be?” As a app web crawler expert, I help organizations adjust to the It is a long established fact that a reader will be distracted Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  //       para2:'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don’t look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn’t quite anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary.',
  //       img1:'images/blog-img/blog1.png',
  //        img2:'images/blog-img/blog3.png'
  //     },
  //   },
  //   {
  //     id:6,
  //     "title":'How Often should you get an ac repair "category" in...',
  //     "category":'Air Conditioning',
  //     "author":{
  //       "name": "Tilak Dugar",
  //       "avatar": ""
  //   },
  //     "primaryImage": 'images/blog-img/blog6.png',
  //     "contentHtml": {
  //       para1:'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum The man, who is in a stable condition inhospital, has “potentia ly life-changing injuries” after the overnight attack in Garvagh, County Lonodonderry. He was shot in the arms and legs.”What sort of men would think it is accepttable to subject a young girl to this level of brutality and violence?”Every child has the right to feel safe and protected in their own home – how is this poor child going to sleep tonight or in coming nights? What are the long term effects on her going to be?” As a app web crawler expert, I help organizations adjust to the It is a long established fact that a reader will be distracted Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  //       para2:'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don’t look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn’t quite anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary.',
  //       img1:'images/blog-img/blog1.png',
  //        img2:'images/blog-img/blog3.png'
  //     },
  //   },
  //   {
  //     id:7,
  //     "title":'Get Rid of bed bugs with bed bugs pest control "category"s...',
  //     "category":'Pest Control',
  //     "author":{
  //       "name": "Tilak Dugar",
  //       "avatar": ""
  //   },
  //     "primaryImage": 'images/blog-img/blog7.png',
  //     "contentHtml": {
  //       para1:'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum The man, who is in a stable condition inhospital, has “potentia ly life-changing injuries” after the overnight attack in Garvagh, County Lonodonderry. He was shot in the arms and legs.”What sort of men would think it is accepttable to subject a young girl to this level of brutality and violence?”Every child has the right to feel safe and protected in their own home – how is this poor child going to sleep tonight or in coming nights? What are the long term effects on her going to be?” As a app web crawler expert, I help organizations adjust to the It is a long established fact that a reader will be distracted Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  //       para2:'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don’t look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn’t quite anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary.',
  //       img1:'images/blog-img/blog1.png',
  //        img2:'images/blog-img/blog3.png'
  //     },
  //   },
  //   {
  //     id:8,
  //     "title":'How to prevent split ends: easy steps to great hair',
  //     "category":'Beauty',
  //     "author":{
  //       "name": "Tilak Dugar",
  //       "avatar": ""
  //   },
  //     "primaryImage": 'images/blog-img/blog8.png',
  //     "contentHtml": {
  //       para1:'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum The man, who is in a stable condition inhospital, has “potentia ly life-changing injuries” after the overnight attack in Garvagh, County Lonodonderry. He was shot in the arms and legs.”What sort of men would think it is accepttable to subject a young girl to this level of brutality and violence?”Every child has the right to feel safe and protected in their own home – how is this poor child going to sleep tonight or in coming nights? What are the long term effects on her going to be?” As a app web crawler expert, I help organizations adjust to the It is a long established fact that a reader will be distracted Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  //       para2:'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don’t look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn’t quite anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary.',
  //       img1:'images/blog-img/blog1.png',
  //        img2:'images/blog-img/blog3.png'
  //     },
  //   },
  //   {
  //     id:9,
  //     "title":'What is a charcoal mask and what are its benefits?',
  //     "category":'Beauty',
  //     "author":{
  //       "name": "Tilak Dugar",
  //       "avatar": ""
  //   },
  //     "primaryImage": 'images/blog-img/blog9.png',
  //   "contentHtml": {
  //       para1:'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum The man, who is in a stable condition inhospital, has “potentia ly life-changing injuries” after the overnight attack in Garvagh, County Lonodonderry. He was shot in the arms and legs.”What sort of men would think it is accepttable to subject a young girl to this level of brutality and violence?”Every child has the right to feel safe and protected in their own home – how is this poor child going to sleep tonight or in coming nights? What are the long term effects on her going to be?” As a app web crawler expert, I help organizations adjust to the It is a long established fact that a reader will be distracted Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  //       para2:'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don’t look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn’t quite anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary.',
  //       img1:'images/blog-img/blog1.png',
  //        img2:'images/blog-img/blog3.png'
  //     },
  //   },
  //   {
  //     id:10,
  //     "title":'First Floppy Journey: 9 Years In Making',
  //     "category":'Beauty',
  //     "author":{
  //       "name": "Tilak Dugar",
  //       "avatar": ""
  //   },
  //     "primaryImage": 'images/blog-img/blog10.png',
  //     "contentHtml": {
  //       para1:'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum The man, who is in a stable condition inhospital, has “potentia ly life-changing injuries” after the overnight attack in Garvagh, County Lonodonderry. He was shot in the arms and legs.”What sort of men would think it is accepttable to subject a young girl to this level of brutality and violence?”Every child has the right to feel safe and protected in their own home – how is this poor child going to sleep tonight or in coming nights? What are the long term effects on her going to be?” As a app web crawler expert, I help organizations adjust to the It is a long established fact that a reader will be distracted Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  //       para2:'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don’t look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn’t quite anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary.',
  //       img1:'images/blog-img/blog1.png',
  //        img2:'images/blog-img/blog3.png'
  //     },
  //   },
  //   {
  //     id:11,
  //     "title":'First Floppy Journey: 9 Years In Making',
  //     "category":'Beauty',
  //     "author":{
  //       "name": "Tilak Dugar",
  //       "avatar": ""
  //   },
  //     "primaryImage": 'images/blog-img/blog11.png',
  //     "contentHtml": {
  //       para1:'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum The man, who is in a stable condition inhospital, has “potentia ly life-changing injuries” after the overnight attack in Garvagh, County Lonodonderry. He was shot in the arms and legs.”What sort of men would think it is accepttable to subject a young girl to this level of brutality and violence?”Every child has the right to feel safe and protected in their own home – how is this poor child going to sleep tonight or in coming nights? What are the long term effects on her going to be?” As a app web crawler expert, I help organizations adjust to the It is a long established fact that a reader will be distracted Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  //       para2:'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don’t look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn’t quite anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary.',
  //       img1:'images/blog-img/blog1.png',
  //        img2:'images/blog-img/blog3.png'
  //     },
  //   },
  //   {
  //     id:12,
  //     "title":'First Floppy Journey: 9 Years In Making',
  //     "category":'Beauty',
  //     "author":{
  //       "name": "Tilak Dugar",
  //       "avatar": ""
  //   },
  //     "primaryImage": 'images/blog-img/blog12.png',
  //     "contentHtml": {
  //       para1:'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum The man, who is in a stable condition inhospital, has “potentia ly life-changing injuries” after the overnight attack in Garvagh, County Lonodonderry. He was shot in the arms and legs.”What sort of men would think it is accepttable to subject a young girl to this level of brutality and violence?”Every child has the right to feel safe and protected in their own home – how is this poor child going to sleep tonight or in coming nights? What are the long term effects on her going to be?” As a app web crawler expert, I help organizations adjust to the It is a long established fact that a reader will be distracted Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  //       para2:'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don’t look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn’t quite anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary.',
  //       img1:'images/blog-img/blog1.png',
  //        img2:'images/blog-img/blog3.png'
  //     },
  //   },
  // ]
  NavigateToBlockDetail(blog:any){
    const navigationExtras = {
      state: {
        blog: blog,
      }
    };
    console.log('navigate to blog detail');
    this.router.navigate(['blog/blog-detail'],navigationExtras)
  }

  changeBlogView(blog:any):void{
    console.log(blog,"251");
    this.blogData.emit(blog);
    
  }
}
