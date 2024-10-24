import { Component, ElementRef, EventEmitter, HostBinding, Inject, PLATFORM_ID } from '@angular/core';
import { ProfileService } from '../service/profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../cart/services/cart.service';
import { MatDialog } from '@angular/material/dialog';
import { DatePickerDialogComponent } from '../../../shared/components/date-picker-dialog/date-picker-dialog.component';
import { ServicesDetailService } from '../../services/service/services-detail.service';
import { LoginComponent } from '../../login/Components/login/login.component';
import { ToastrService } from 'ngx-toastr';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../../shared/services/auth.service';
import { PageEvent } from '@angular/material/paginator';
import { BehaviorSubject } from 'rxjs';

interface Booking {
  orderId: string;
  date: string;
  time: string;
  serviceImage: string;
  serviceName: string;
  paymentMethod: string;
  status: string;
  total: number;
}

@Component({
  selector: 'app-my-booking',
  templateUrl: './my-booking.component.html',
  styleUrl: './my-booking.component.scss'
})
export class MyBookingComponent {
  isBrowser!: boolean;
  bookings:any;
  constructor(private profileService:ProfileService, private route: ActivatedRoute, private cartService:CartService, private router:Router, private dialog: MatDialog, private service:ServicesDetailService, private toastr:ToastrService, @Inject(PLATFORM_ID) platformId: Object, private auth:AuthService, private el: ElementRef){

    this.isBrowser = isPlatformBrowser(platformId);

    // this.route.queryParams.subscribe(params => {
    //   // const paymentStatus = params['paymentStatus'];
    //   const orderId = params['orderId'];
    //   console.log(orderId)
    // })
  }

  showPaginator: boolean = true;
   @HostBinding('class.small-parent') isSmallParent = false;
 page = new EventEmitter<PageEvent>()
  length = 0;
  startIndex:number=0;
   pageIndex = 0;
   pageSize = 5; //default page size
   pageSizeOptions: number[] = [5, 10, 25, 100];
   showPageSizeField = true;
  paginator$ = new BehaviorSubject<{pageIndex:number,pageSize:number}>({pageIndex:0,pageSize:10})
  onResize(event: Event) {
    this.checkParentSize();
  }

ngOnInit(){
  this.getUserDetailById();
  this.updatePayment()
  this.getUserBooking();
  this.auth.isLoggedIn$?.subscribe(isLoggedIn=>{
    if(isLoggedIn){
      this.getUserBooking(); 
    }
  })

  this.paginator$.subscribe(({pageIndex, pageSize})=>{
    // const start = pageSize * pageIndex;
    // const end = (pageSize * (pageIndex + 1));
    // this.filteredBookings = this.bookings.slice(start, end )
    this.updatePaginatedBookings(pageIndex, pageSize);
  })

}

onPageChange(event: PageEvent): void {
  this.pageIndex = event.pageIndex;  // Update current page index
  this.pageSize = event.pageSize;  // Update page size
  // this.startIndex = this.pageIndex * this.pageSize;  // Calculate new startIndex
  // this.getUserBooking() // Fetch new items based on updated page
  this.updatePaginatedBookings(this.pageIndex, this.pageSize);
}
updatePaginatedBookings(pageIndex: number, pageSize: number) {
  const start = pageIndex * pageSize;
  const end = start + pageSize;
  this.filteredBookings = this.bookings.slice(start, end);  // Slice the already loaded bookings data
}
checkParentSize() {
  const parentWidth = (this.el.nativeElement as HTMLElement).parentElement?.clientWidth;
  this.isSmallParent = parentWidth ? parentWidth < 600 : false; // Example threshold
  console.log(parentWidth + 'px', this.isSmallParent);
}
filteredBookings: any[] = []

getUserBooking() {
  if(this.isBrowser){
  const userId = localStorage.getItem('userId');
  // Ensure that userId is not null or undefined
  if (userId) {
    this.profileService.getUserBooking(+userId).subscribe(
      (response: any) => {
        this.bookings = response.data
        console.log(response.data, "62");
        this.paginator$.next({ pageIndex: this.pageIndex, pageSize: this.pageSize });
      },
      (error: any) => {
        console.error('Error fetching user bookings:', error);
      }
    );
  } else {
    console.error('User ID not found in local storage.');
  }
}
}

openDateTimePicker(booking:any): void {
  const data = booking.leadEntryId
  const dialogRef = this.dialog.open(DatePickerDialogComponent, {
    disableClose: true, // Prevent closing the dialog by clicking outside or pressing ESC
     width: '80%',
    //  data:{id:booking.leadEntryId}
  });
  dialogRef.afterClosed().subscribe(result => {
    if (result) {
     console.log(result,"97");
     this.updateOrder(data, result.date, result.time)
    }
  });
}

  // deleteBooking(booking: Booking): void {
  //   // Logic for deleting the booking
  //   this.bookings = this.bookings.filter((b:any) => b !== booking);
  //   console.log('Deleted booking:', booking);
  // }

  calculateTotal(booking: any): number {
    if (!booking.items || booking.items.length === 0) {
      return 0; // No items, return 0
    }
    
    // Calculate total by summing up the price of all items
    return booking.items.reduce((total: number, item: any) => total + (item.price || 0), 0);
  }
  
  // updatePayment() {
  //   if(this.isBrowser){
  //     const orderId = localStorage.getItem('orderId'); // Default to empty string if orderId is null;
  //   const userIdString = localStorage.getItem('userId');
  //   const isCashOnDelivery = JSON.parse(localStorage.getItem('isCashOnDelivery') || 'false');
  //   const paymentReferenceOrderId = localStorage.getItem('paymentOrderReferenceId') || '';
    
  //   // Handle cases where localStorage might return null
  //   if (!orderId || !userIdString) {
  //     console.error('Order ID or User ID is missing');
  //     return;
  //   }
  
  //   // Convert userId to a number
  //   const userId = Number(userIdString);
  
  //   // Ensure userId is a valid number
  //   if (isNaN(userId)) {
  //     console.error('User ID is invalid');
  //     return;
  //   }
  
  //   setTimeout(() => {
  //   // Call the service method
  //   console.log(this.userEmail,"121")
  //   this.cartService.updatePaymentStatus(paymentReferenceOrderId, orderId, userId, isCashOnDelivery, this.userEmail).subscribe(
  //     response => {
  //       this.toastr.success('Your order has been placed successfully')
  //       localStorage.removeItem('orderId')
  //       localStorage.removeItem('isCashOnDelivery')
  //       localStorage.removeItem('myCartData');
  //       console.log('Payment status updated successfully', response);
  //       this.getUserBooking();
  //     },
  //     error => {
  //       console.error('Error updating payment status', error);
  //     }
  //   );
  // }, 1000); // Delay of 2 seconds (2000 milliseconds)
  // }
  // }

  updatePayment() {
    if (this.isBrowser) {
      const orderId = localStorage.getItem('orderId'); 
      const userIdString = localStorage.getItem('userId');
      const isCashOnDelivery = JSON.parse(localStorage.getItem('isCashOnDelivery') || 'false');
      const paymentReferenceOrderId = localStorage.getItem('paymentOrderReferenceId') || '';
  
      // Check if orderId or userId is missing
      if (!orderId || !userIdString) {
        console.error('Order ID or User ID is missing');
        return;
      }
  
      const userId = Number(userIdString);
  
      // Check if userId is valid
      if (isNaN(userId)) {
        console.error('User ID is invalid');
        return;
      }
  
      setTimeout(() => {
        this.cartService.updatePaymentStatus(paymentReferenceOrderId, orderId, userId, isCashOnDelivery, this.userEmail).subscribe(
          response => {
            if (response.success === true) {
              // Handle success case
              this.toastr.success('Your order has been placed successfully.');
              localStorage.removeItem('orderId');
              localStorage.removeItem('isCashOnDelivery');
              localStorage.removeItem('myCartData');
              console.log('Payment status updated successfully:', response);
              this.getUserBooking();
            } else if (response.message.includes('Transaction canceled.')){
              // Handle order canceled case
              localStorage.removeItem('orderId');
              localStorage.removeItem('isCashOnDelivery');
              localStorage.removeItem('myCartData');
              this.toastr.warning('Your order has been canceled.');
              console.log('Order was canceled:', response);
            } 
            else {
              // Handle any other cases
              this.toastr.error('Something went wrong with your order.');
            }
          },
          error => {
            console.error('Error updating payment status:', error);
          }
        );
      }, 1000); // Delay of 1 second (1000 milliseconds)
    }
  }
  

  goToDetail(card: any) {
    console.log(card,"139")
    const itemNameDetail = card?.subCategoryName
      ?.trim()
      ?.replace(/\s+/g, '-')
      ?.toLowerCase();

    this.router.navigate(
      [`services/service-Details/${itemNameDetail}/${card?.[0]?.itemId}`]
    );
  }
  
  // Method to call delete service
  deleteBooking(item: any) {
console.log(item,"161")
const token = localStorage.getItem('token');
    this.profileService.deleteOrder(item.leadEntryId, localStorage?.getItem('userEmail')??'', token || '').subscribe({
      next: () => {
        this.getUserBooking()
        this.closeLocationPopup(); // Close the modal after confirmation
        console.log('Order deleted successfully');
        // Handle success (e.g., update UI or notify the user)
      },
      error: (err) => {
        console.error('Error deleting order', err);
        // Handle error (e.g., notify the user)
      }
    });
  }

  updateOrder(orderId: number, newDateTime: string, newSlot: string) {
 // Convert the newDateTime from local format to UTC format
 const localDate = new Date(newDateTime); // Assuming the format is recognized by JavaScript Date parser
  
 if (isNaN(localDate.getTime())) {
   console.error('Invalid date format');
   return;
 }

 // Convert to UTC format
 const year = localDate.getFullYear();
const month = String(localDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
const day = String(localDate.getDate()).padStart(2, '0');
const hours = String(localDate.getHours()).padStart(2, '0');
const minutes = String(localDate.getMinutes()).padStart(2, '0');
const seconds = String(localDate.getSeconds()).padStart(2, '0');
const milliseconds = String(localDate.getMilliseconds()).padStart(3, '0');
const userId = localStorage.getItem('userId');
// Format it to match the desired ISO string format (without time zone conversion)
const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
const token = localStorage.getItem('token');

    const orderData = {
      orderId: orderId,
      newDateTime: formattedDate,
      newSlot: newSlot,
      userId: userId
    };

    this.profileService.updateOrder(orderData, token || '').subscribe({
      next: () => {
        this.getUserBooking();
        console.log('Order updated successfully');
        // Handle success (e.g., update UI or notify the user)
      },
      error: (err) => {
        console.error('Error updating order', err);
        // Handle error (e.g., notify the user)
      }
    });
  }

  // add to cart 
reAddToCart(item:any){
  if(this.isBrowser){
  console.log(item,"214")
  if(localStorage.getItem("userId")){
   const payload = {
     itemId:item.itemid||0,
     id:0,
     itemName:item.itemName,
     itemRate:Number(item.itemRate),
     price:Number(item.price),
     quantity: 1,
     userId:Number(localStorage.getItem("userId")),
     processStatus:'',
     discountPercent: 0,
     discountAmount: 0,
     tax: 0,
     image:item.image,
   }
   this.service.addCartItem([payload]).subscribe((res:any)=>{
   if(res.success)
     this.toastr.success(res.message)
     this.router.navigate(['cart'])
   })
  }else {
   alert("Please log in before adding items to your cart.")
   this.dialog.open(LoginComponent, {
     width: '450',
     disableClose: true
   });
  }
}
 }

 userEmail:any;
 getUserDetailById(): void {
  if(this.isBrowser){
  const id = localStorage.getItem('userId');
  if (id) {
    this.profileService.getProfileDetailsById(Number(id)).subscribe(
      (response: any) => {
     console.log(response.data,"306")
    this.userEmail = response.data.emailId
      },
      (error) => {
        console.error('Error fetching profile details:', error);
        // this.toastr.error('Failed to load profile details');
      }
    );
  }
}
}
showLocationPopup: boolean = false;
selectedBookingToDelete:any
openLocationPopup(booking:any) {
  this.showLocationPopup = true; // Open the modal
  this.selectedBookingToDelete=booking;
}

closeLocationPopup() {
  this.showLocationPopup = false; // Close the modal
}

onBackdropClick(event: MouseEvent): void {
  // Check if the click is outside the modal content
  if (event.target === event.currentTarget) {
    this.closeLocationPopup();
  }
}

confirmDelete() {
  console.log('User clicked Yes to delete');
  this.deleteBooking(this.selectedBookingToDelete);
  
}
}
