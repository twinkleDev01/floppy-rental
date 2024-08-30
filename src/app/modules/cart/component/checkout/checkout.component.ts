import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DatePickerDialogComponent } from '../../../../shared/components/date-picker-dialog/date-picker-dialog.component';
import { LocationDialogComponent } from '../../../../shared/components/location-dialog/location-dialog.component';
import { CartService } from '../../services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
  providers: [DatePipe]  // Add DatePipe to providers
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
    private toaster:ToastrService,
    private datePipe: DatePipe
  ){
    this.checkout = this.fb.group({
    firstName: ['',[Validators.required]],
    lastName : [''],
    address: ['',[Validators.required]],
    state : [''],
    country : ['india'],
    city : [''],
    zipCode : [''],
    date : [''],
    productId : [''],
    slot : [''],
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
  const productIdFromState = navigation?.extras?.state?.['productId'];
  this.checkout.get('productId')?.setValue(productIdFromState);
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
      paymentStatus: null ||'',
      coupon: null || '',
    }
    this.cartService.saveOrderDetails(payload).subscribe(
      (res:any)=>{
        this.toaster.success(res.message)
        this.cartService.cartLength.next(0);
        localStorage.removeItem('cartItems')
        this.router.navigate(['profile/my-booking']);
      },
      (err)=>{
        this.toaster.error(err.message)
      }
    )
  }
  // dateDialog
  openDateTimePicker(): void {
    console.log('Selected date and time:',this.checkout.get('date')?.value,"130");
    const dialogRef = this.dialog.open(DatePickerDialogComponent, {
      disableClose: true, // Prevent closing the dialog by clicking outside or pressing ESC
       width: '80%'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Selected date and time:',this.checkout.get('date')?.value, result,"130");
        result.date = this.convertDate(result.date)
        this.checkout.get('date')?.setValue(result.date);
        this.checkout.get('slot')?.setValue(result.time);
        console.log(result.date);
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

  convertDate(dateString: string): string | null {
    const parsedDate = new Date(dateString);

    // Check if the date is valid
    if (isNaN(parsedDate.getTime())) {
      console.error("Invalid date format");
      return null;
    }

    // Format the date using DatePipe in ISO format
    return this.datePipe.transform(parsedDate, 'yyyy-MM-ddTHH:mm:ss.SSSZ');
  }
}
