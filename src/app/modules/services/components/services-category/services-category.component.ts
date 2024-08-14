import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-services-category',
  templateUrl: './services-category.component.html',
  styleUrl: './services-category.component.scss'
})
export class ServicesCategoryComponent {
  servicesDetails = [
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
  ]
  private readonly _formBuilder = inject(FormBuilder);
  rating = 8;
  showFilter: boolean = false;
  selectedCategory: string = 'Housekeeping Staff';
  categories: string[] = ['Housekeeping Staff', 'Pantry Boy', 'Supervisor/Floor Manager', 'Multitasking Staff', 'Electrician/Plumber/Carpenter', 'Horticulter And Landscaping Service'];
  toppings: FormGroup;

  constructor(private fb: FormBuilder) {
    // Initialize the FormGroup with default values
    this.toppings = this.fb.group({
      DryClean: [true], // Default selected
      MechanisedWaterTankCleaning: [false],
      EcoFriendlyHousekeeping: [false],
      IndustrialWaterTankCleaning: [false]
    });
  }
  currentRating = 3; // Initial rating value

  onRatingUpdated(newRating: number) {
    console.log("New Rating: ", newRating);
    this.currentRating = newRating;
  }

  toggleViewMobile() {
    this.showFilter = !this.showFilter;
  }
}

