import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-services-category',
  templateUrl: './services-category.component.html',
  styleUrl: './services-category.component.scss'
})
export class ServicesCategoryComponent {
  private readonly _formBuilder = inject(FormBuilder);

  selectedCategory!: string;
  categories: string[] = ['Housekeeping Staff', 'Pantry Boy', 'Supervisor/Floor Manager', 'Multitasking Staff', 'Electrician/Plumber/Carpenter', 'Horticulter And Landscaping Service'];
  readonly toppings = this._formBuilder.group({
    DryClean: false,
    MechanisedWaterTankCleaning: false,
    EcoFriendlyHousekeeping: false,
    IndustrialWaterTankCleaning:false
  });
}

