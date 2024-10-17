import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../../../modules/login/Components/login/login.component';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit{
  footerList:any[] = [];
  widthPerSection = 3
  readonly sharedService = inject(SharedService)
  readonly dialog = inject(MatDialog)
  
  ngOnInit(): void {
    this.sharedService.getFooterList().subscribe((res:any)=>{
      this.footerList = res.data
      this.widthPerSection = Math.floor(12/this.footerList.length)
    })
  }

  openDialog(): void {
    this.dialog.open(LoginComponent, {
      width: '450',
      disableClose: true
    });
  }

  getChunkSize(): number {
    const screenWidth = window.innerWidth;
    return screenWidth <= 768 ? 4 : 6;  // 4 for mobile, 6 for larger screens
  }
  
  // Method to chunk an array into smaller arrays of a given size
  chunkArray(array: any[]): any[][] {
    const chunkSize = this.getChunkSize();
    const result: any[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  }
getColumnClass(index: number): string {
  if (index === 0 || index === 2) {
    return 'col-lg-4'; // Apply col-lg-4 to 1st and 3rd columns
  } else {
    return 'col-lg-2'; // Apply col-lg-2 to other columns
  }
}

openPartnerLink() {
  window.open('https://play.google.com/store/apps/details?id=com.ffvendor.app', '_blank');
}
}
