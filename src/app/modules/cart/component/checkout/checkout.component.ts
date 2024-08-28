import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DatePickerDialogComponent } from '../../../../shared/components/date-picker-dialog/date-picker-dialog.component';
import { LocationDialogComponent } from '../../../../shared/components/location-dialog/location-dialog.component';
import { CartService } from '../../services/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
   cities = [
    { value: "", text: "Select a city", disabled: true, selected: true },
    { value: "newYork", text: "New York" },
    { value: "losAngeles", text: "Los Angeles" },
    { value: "chicago", text: "Chicago" },
    { value: "houston", text: "Houston" },
    { value: "miami", text: "Miami" },
    // Add more cities as needed
  ];

  States = [
    { value: '', text: 'Select a Continent', disabled: true, selected: true },
    { value: 'northAmerica', text: 'North America' },
    { value: 'southAmerica', text: 'South America' },
    { value: 'europe', text: 'Europe' },
    { value: 'asia', text: 'Asia' },
    { value: 'africa', text: 'Africa' },
    { value: 'australia', text: 'Australia' },
    { value: 'antarctica', text: 'Antarctica' }
  ];

  checkout: FormGroup;
  selectedPaymentOption: string = 'option5'; 
  sabTotalSaving:any
  AmountToCheckout:any
   sabTotal:any
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private cartService:CartService,
    private toaster:ToastrService
  ){
    this.checkout = this.fb.group({
    fullName: ['',[Validators.required]],
    address: ['',[Validators.required]],
    state : [''],
    city : [''],
    zipCode : [''],
    date : [''],
    paymentMethod:[],
    nameOnCard : ['',[Validators.required]],
    cardNumber : ['',[Validators.required,Validators.pattern('^[0-9]{16}$')]],
    expiryDate: ['', [Validators.required, Validators.pattern('(0[1-9]|1[0-2])\\/(\\d{2})')]],
    cvc: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]],
    phone : ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(10), Validators.maxLength(10)]],
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
  this.sabTotal = navigation?.extras?.state?.['sabTotal']; 
  this.sabTotalSaving = navigation?.extras?.state?.['sabTotalSaving']; 
  this.AmountToCheckout = navigation?.extras?.state?.['AmountToCheckout']; 
  console.log(this.sabTotal,this.sabTotalSaving,this.AmountToCheckout);
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
    console.log(this.checkout.value);
    const payload = {
      ...this.checkout.value,
      userId: localStorage.getItem('userId'),
      totalAmount: this.sabTotal,
      totalQuantity: this.AmountToCheckout,
      slot: null,
      paymentStatus: null ||'',
      coupon: null || '',
      productId: []
    }
    this.cartService.saveOrderDetails(payload).subscribe(
      (res:any)=>{
        this.toaster.success(res.message)
      },
      (err)=>{
        this.toaster.error(err.message)
      }
    )
  }
  // dateDialog
  openDateTimePicker(): void {
    console.log("OpenDateDialog")
    const dialogRef = this.dialog.open(DatePickerDialogComponent, {
      disableClose: true, // Prevent closing the dialog by clicking outside or pressing ESC
       width: '80%'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Selected date and time:', result);
        this.checkout.get('date')?.setValue(result.date);

      }
    });
  }
  // LocationDialog
  openLocationDialog(): void {
    const dialogRef = this.dialog.open(LocationDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Selected Location:', result);
      }
    });
  }
}
