import { Component, Inject, inject, PLATFORM_ID } from '@angular/core';
import { LoginComponent } from '../../../../modules/login/Components/login/login.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../../../modules/cart/services/cart.service';
import { isPlatformBrowser } from '@angular/common';
declare var bootstrap: any;  
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  cartLength:any;
  isBrowser!: boolean;
  isLoggedIn$ = inject(AuthService).isLoggedIn$;
  readonly dialog = inject(MatDialog)
  constructor(private route:Router, private auth:AuthService, private toastr:ToastrService, private cartService:CartService, @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  get cartBadge(){
    return this.cartLength;
  }
  ngOnInit() { 
    if(this.isBrowser){
   let length = localStorage.getItem('cartItems')

    this.cartService.cartLength.subscribe((val)=>{
      this.cartLength = val || length;
    });
    if(this.auth.isLoggedIn$){
    this.auth.isLoggedIn$.subscribe(isLoggedIn => {
      console.log('Login status changed:', isLoggedIn); // Log status changes
      if (isLoggedIn) {
        // If the user is logged in, call the API to fetch cart items
        this.cartService.getCartItems().subscribe(
          (cartItems:any) => {
            console.log(cartItems,"37")
           this.cartLength = cartItems?.data?.length;
          },
          (error) => {
            // Handle error here
          }
        );
      }
    });
  }
  }
   }
   
  ngAfterViewInit() {
    if(this.isBrowser){
    // Initialize Bootstrap components manually if needed
    var myCollapse = document.getElementById('navbarNav');
    var bsCollapse = new bootstrap.Collapse(myCollapse, {
      toggle: false
    });
    this.cartService.cartLength.subscribe((val)=>{
      this.cartLength = val || length;
    })
  }
  }

  openDialog(): void {
    this.dialog.open(LoginComponent, {
      width: '450',
      disableClose: true
    });
  }

  goToMyCart(){
    // if(localStorage.getItem("userId")){
    //   this.route.navigate(['cart'])
    // }else {
    //   alert("Please log in before accessing your cart.");
    //   this.dialog.open(LoginComponent, {
    //     width: '450',
    //     disableClose: true
    //   });
    //  }
    this.route.navigate(['cart'])
  }

  logOut(){
    if(this.isBrowser){
    const userId = localStorage.getItem('userId');
    if(userId){
      this.auth.logout(userId).subscribe((response:any)=>{
        if(response.success){
          localStorage.removeItem('token')
          localStorage.removeItem('userId')
          this.toastr.success('Successfully Logout')
          this.route.navigateByUrl('')
          this.auth.updateLoginStatus(false);
        }
      },
      (error: any) => {
        this.toastr.error('An error occurred. Please try again later.');
      }
    )
    }
  }
  }
}
