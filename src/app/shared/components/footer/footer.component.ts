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
  readonly sharedService = inject(SharedService)
  readonly dialog = inject(MatDialog)
  
  ngOnInit(): void {
    this.sharedService.getFooterList().subscribe((res:any)=>{
      console.log(res)
      this.footerList = res.data
    })
  }

  openDialog(): void {
    this.dialog.open(LoginComponent, {
      width: '450',
      disableClose: true
    });
  }
}
