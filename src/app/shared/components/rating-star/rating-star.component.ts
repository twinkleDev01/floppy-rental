import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-rating-star',
  templateUrl: './rating-star.component.html',
  styleUrl: './rating-star.component.scss'
})
export class RatingStarComponent {
  @Input() rating: number = 0; // Initialize the rating
  @Input() starCount: number = 5; // Default to 5 stars
  @Input() color: string = 'warn'; // Set the default color
  @Output() ratingUpdated = new EventEmitter<number>();

  ratingArr: number[] = [];
  selectedCategory: string = 'Housekeeping Staff';
  categories: string[] = ['Housekeeping Staff', 'Pantry Boy', 'Supervisor/Floor Manager', 'Multitasking Staff', 'Electrician/Plumber/Carpenter', 'Horticulture And Landscaping Service'];
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

  ngOnInit() {
    // console.log("Star count: " + this.starCount);
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
  }

  onClick(rating: number) {
    console.log("Selected rating: " + rating);
    this.rating = rating; // Update the current rating
    this.ratingUpdated.emit(rating); // Emit the new rating value
    return false;
  }

  showIcon(index: number) {
    if (this.rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }
}
