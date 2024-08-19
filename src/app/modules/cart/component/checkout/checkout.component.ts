import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  checkout: FormGroup;
  cartItems: any;
  selectedPaymentOption: string = 'option5'; 
  
  constructor(
    private fb: FormBuilder,
    private router: Router
  ){
    this.checkout = this.fb.group({
    fullName: ['',[Validators.required]],
    address: ['',[Validators.required]],
    region : [''],
    city : [''],
    zip : [''],
    date : [''],
    nameOnCard : ['',[Validators.required]],
    cardNumber : ['',[Validators.required,Validators.pattern('^[0-9]{16}$')]],
    expiryDate: ['', [Validators.required, Validators.pattern('(0[1-9]|1[0-2])\\/(\\d{2})')]],
    cvc: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]],
    contactNumber : ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(10), Validators.maxLength(10)]],
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(
          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
        ),
      ],
    ],
  
  })

  // CartItems
  const navigation = this.router.getCurrentNavigation();
  this.cartItems = navigation?.extras?.state?.['item']; 
  console.log(this.cartItems);
}


  noSpace(event: any) {
    console.log(event, 'keyyyy');
    if (event.keyCode === 32 && !event.target.value) return false;
    return true;
  }
  get cardNumber() {
    return this.checkout.get('cardNumber');
  }

  get expiryDate() {
    return this.checkout.get('expiryDate');
  }

  get cvc() {
    return this.checkout.get('cvc');
  }
  onSubmit(){
    if (this.checkout.valid) {
      console.log(this.checkout.value);
      // Proceed with form submission logic
    } else {
      // Handle form errors
    }
  }
}
