import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../../../modules/login/Components/login/login.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  readonly dialog = inject(MatDialog)
  
  openDialog(): void {
    this.dialog.open(LoginComponent, {
      width: '450',
      disableClose: true
    });
  }
}
