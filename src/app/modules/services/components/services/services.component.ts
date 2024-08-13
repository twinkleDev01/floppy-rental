import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent {
  constructor(
    private router: Router
  ){}

  goToRental(){
    this.router.navigate(['/services/category']);
  }
  goToPatientCare(){
    this.router.navigate(['/services/category']);
  }
  goToApplianceRepair(){
    this.router.navigate(['/services/category']);
  }
  goToProfessionals(){
    this.router.navigate(['/services/category']);
  }
  goToHouseKeeping(){
    this.router.navigate(['/services/category']);
  }
  goToSecurityServices(){
    this.router.navigate(['/services/category']);
  }
  goToFurniture(){
    this.router.navigate(['/services/category']);
  }
}
