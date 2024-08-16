import { Component } from "@angular/core";
import { CartService } from "../../../../shared/services/cart.service";


@Component({
  selector: 'app-my-cart',
  templateUrl: './my-cart.component.html',
  styleUrl: './my-cart.component.scss'
})
export class MyCartComponent {
  cartItems:any[]= [];
 constructor(private cartService:CartService){
  cartService.getAllCartItems().subscribe((data)=>{
    console.log(data)
    this.cartItems = data
  })
 }
}
