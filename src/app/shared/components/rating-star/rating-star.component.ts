import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-rating-star',
  templateUrl: './rating-star.component.html',
  styleUrl: './rating-star.component.scss'
})
export class RatingStarComponent implements OnInit {
  
  @Input() rating = 0; // Initialize the rating
  @Input() starCount = 5; // Default to 5 stars
  @Input() color = 'warn'; // Set the default color
  @Input() needReview = false;
  @Output() ratingUpdated = new EventEmitter<number>();

  ratingArr: number[] = [];
  selectedCategory = 'Housekeeping Staff';
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
   
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
  }

  onClick(rating: number) {
    console.log("Selected rating: " + rating);
    if(!this.needReview)return;
    this.rating = rating; // Update the current rating
    this.ratingUpdated.emit(rating); // Emit the new rating value
    return false;
  }

  showIcon(index: number) {
    if (this.rating >= index + 1) {
      return 'star';
    } else if (this.rating > index && this.rating < index + 1) {
      return 'star_half'; // For fractional stars
    } else {
      return 'star_border';
    }
  }
}
