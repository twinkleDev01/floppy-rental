import { Component, Directive, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-services-category',
  templateUrl: './services-category.component.html',
  styleUrl: './services-category.component.scss'
})
export class ServicesCategoryComponent {
  servicesDetails:any = [
    {
      "title":"Niti Group Facility Services",
      "image":"images/nitiGroup.svg",
      "staff":"Housekepping Lady",
      "price" : "20 Hrs.INR 14000",
      "distance":"5",
      "rate":6
    },
    {
      "title":"A.P.Securitas Pvt.Ltd.",
      "image":"images/apSecurity.svg",
      "staff":"Housekepping Lady",
      "price" : "20 Hrs.INR 9500",
      "distance":"6",
      "rate":3
    },
    {
      "title":"Addbiv Securer Pvt.Ltd.",
      "image":"images/addbivSecurer.svg",
      "staff":"Housekepping Lady",
      "price" : "20 Hrs.INR 14000",
      "distance":"7",
      "rate":4.2
    },
    // ----
    {
      "title":"Ahon Security Services Pvt.Ltd",
      "image":"images/Ahon.svg",
      "staff":"Housekepping Lady",
      "price" : "20 Hrs.INR 14000",
      "distance":"5",
      "rate":4
    },
    {
      "title":"Aman Security Service(Regd.)",
      "image":"images/Aman.svg",
      "staff":"Housekepping Lady",
      "price" : "20 Hrs.INR 9500",
      "distance":"6",
      "rate":3
    },
    {
      "title":"Bujrang Security Service",
      "image":"images/Bajrang.svg",
      "staff":"Housekepping Lady",
      "price" : "20 Hrs.INR 14000",
      "distance":"7",
      "rate":4.2
    },
    // ----
    {
      "title":"BCS Security Group",
      "image":"images/bcs.svg",
      "staff":"Housekepping Lady",
      "price" : "20 Hrs.INR 14000",
      "distance":"5",
      "rate":4
    },
    {
      "title":"Bhartiya Security Services",
      "image":"images/bhartiya.svg",
      "staff":"Housekepping Boy",
      "price" : "20 Hrs.INR 9500",
      "distance":"6",
      "rate":3
    },
    {
      "title":"Black Valk Security Pvt.Ltd.",
      "image":"images/blackValk.svg",
      "staff":"Housekepping Boy",
      "price" : "20 Hrs.INR 14000",
      "distance":"7",
      "rate":4.2
    },
    // ----
    {
      "title":"Bvg India Ltd.",
      "image":"images/bvgIndia.svg",
      "staff":"Housekepping Lady",
      "price" : "20 Hrs.INR 14000",
      "distance":"5",
      "rate":4
    },
    {
      "title":"Clean Way",
      "image":"images/cleanWay.svg",
      "staff":"Housekepping Lady",
      "price" : "20 Hrs.INR 9500",
      "distance":"6",
      "rate":3
    },
    {
      "title":"Com Security Services Pvt.Ltd.",
      "image":"images/comSecurity.svg",
      "staff":"Housekepping Lady",
      "price" : "20 Hrs.INR 14000",
      "distance":"7",
      "rate":4.2
    },
    // ---Repeate for Paginator
    {
      "title":"Niti Group Facility Services",
      "image":"images/nitiGroup.svg",
      "staff":"Housekepping Lady",
      "price" : "20 Hrs.INR 14000",
      "distance":"5",
      "rate":4
    },
    {
      "title":"A.P.Securitas Pvt.Ltd.",
      "image":"images/apSecurity.svg",
      "staff":"Housekepping Lady",
      "price" : "20 Hrs.INR 9500",
      "distance":"6",
      "rate":3
    },
    {
      "title":"Addbiv Securer Pvt.Ltd.",
      "image":"images/addbivSecurer.svg",
      "staff":"Housekepping Lady",
      "price" : "20 Hrs.INR 14000",
      "distance":"7",
      "rate":4.2
    },
  ]
  private readonly _formBuilder = inject(FormBuilder);
  currentRating = this.servicesDetails[0].rate; // Initial rating value
  showFilter: boolean = false;
  selectedCategory: string = 'Housekeeping Staff';
  categories: string[] = ['Housekeeping Staff', 'Pantry Boy', 'Supervisor/Floor Manager', 'Multitasking Staff', 'Electrician/Plumber/Carpenter', 'Horticulter And Landscaping Service'];
  toppings: FormGroup;
  // Paginator
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Output() page = new EventEmitter<PageEvent>()
  @Input() length = 0;
  @Input() pageIndex = 0;
  @Input() pageSize = 10; //default page size
  @Input() pageSizeOptions: number[] = [5, 10, 25, 100];
  @Input() showPageSizeField = true

  constructor(private fb: FormBuilder, private router: Router) {
    // Initialize the FormGroup with default values
    this.toppings = this.fb.group({
      DryClean: [true], // Default selected
      MechanisedWaterTankCleaning: [false],
      EcoFriendlyHousekeeping: [false],
      IndustrialWaterTankCleaning: [false]
    });
  }
  ngOnInit(){
    this.onRatingUpdated(this.currentRating);
  }

  onRatingUpdated(newRating: number) {
    console.log(this.currentRating, "currentRating")
    console.log("New Rating: ", newRating);
    this.currentRating = newRating;
  }

  toggleViewMobile() {
    this.showFilter = !this.showFilter;
  }
  goToDetail(card:{}){
    const navigationExtras = {
      state: {
        card: card,
      }
    };
    console.log(card,"CardDetail")
    this.router.navigate(['services/serviceDetails'], navigationExtras);
  }
  // Paginator
  itemsPerPage() {
  }
  setPageSize(event: KeyboardEvent) : void{
    const value = (event.target as HTMLInputElement).value;
    if(value){
      this.pageSize = Number(value)
      this.paginator._changePageSize(this.pageSize);
    }
  }

  setPageSizeOnInputEvent(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    if(value){
      this.pageSize = Number(value)
      this.paginator._changePageSize(this.pageSize);
    }
  }
  checkPageSize(event: FocusEvent):void{
    const value = (event.target as HTMLInputElement).value;
    if(!value){
      this.pageSize = 10
      this.paginator._changePageSize(this.pageSize);
    }
  }

  onPageEvent(event: any) {
    this.page.emit(event);
    if (this.pageSize !== event.pageSize) {
      console.log(event.pageSize);
      this.pageSize = event.pageSize;
    }
  }
}

