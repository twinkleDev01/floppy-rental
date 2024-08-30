import { Component, inject } from '@angular/core';
import { LoginComponent } from '../../../../modules/login/Components/login/login.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../../../modules/cart/services/cart.service';
declare var bootstrap: any;  
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  cartLength:any;
  
  isLoggedIn$ = inject(AuthService).isLoggedIn$;
  readonly dialog = inject(MatDialog)
  constructor(private route:Router, private auth:AuthService, private toastr:ToastrService, private cartService:CartService) {
   console.log(this.cartLength,"20") 
  }
  ngOnInit() { 
   let length = localStorage.getItem('cartItems')
     console.log(localStorage.getItem('cartItems'));

    this.cartService.cartLength.subscribe((val)=>{
      this.cartLength = val || length;
    })
   }
  ngAfterViewInit() {
    // Initialize Bootstrap components manually if needed
    var myCollapse = document.getElementById('navbarNav');
    var bsCollapse = new bootstrap.Collapse(myCollapse, {
      toggle: false
    });
    this.cartService.cartLength.subscribe((val)=>{
      this.cartLength = val || length;
    })
    console.log(this.cartLength,"39")
  }

  openDialog(): void {
    console.log("hhhhhh")
    this.dialog.open(LoginComponent, {
      width: '450',
      disableClose: true
    });
  }

  goToMyCart(){
    if(localStorage.getItem("userId")){
      this.route.navigate(['cart'])
    }else {
      alert("Please log in before accessing your cart.");
      this.dialog.open(LoginComponent, {
        width: '450',
        disableClose: true
      });
     }
  }

  logOut(){
    const userId = localStorage.getItem('userId');
    if(userId){
      this.auth.logout(userId).subscribe((response:any)=>{
        console.log(response)
        if(response.success){
          localStorage.removeItem('token')
          localStorage.removeItem('userId')
          this.toastr.success('Successfully Logout')
          this.route.navigateByUrl('')
          this.auth.updateLoginStatus(false);
        }
      },
      (error: any) => {
        console.error('Registration error', error);
        this.toastr.error('An error occurred. Please try again later.');
      }
    )
    }
  }
}
