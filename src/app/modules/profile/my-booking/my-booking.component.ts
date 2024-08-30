import { Component } from '@angular/core';
import { ProfileService } from '../service/profile.service';

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
  // bookings: Booking[] = [
  //   {
  //     orderId: '#1001',
  //     date: '8 Jun, 2024',
  //     time: '09:00 am to 10:05 am',
  //     serviceImage: 'images/Service-detail-img/room_cleaning.png',
  //     serviceName: 'Niti Group Facility Services',
  //     paymentMethod: 'Paypal',
  //     status: 'Pending',
  //     total: 22.00
  //   },
  //   {
  //     orderId: '#1002',
  //     date: '8 Jun, 2024',
  //     time: '09:00 am to 10:05 am',
  //     serviceImage: 'images/Service-detail-img/room_cleaning.png',
  //     serviceName: 'Niti Group Facility Services',
  //     paymentMethod: 'Google Pay',
  //     status: 'Complete',
  //     total: 22.00
  //   },
  //   {
  //     orderId: '#1003',
  //     date: '8 Jun, 2024',
  //     time: '09:00 am to 10:05 am',
  //     serviceImage: 'images/Service-detail-img/room_cleaning.png',
  //     serviceName: 'Niti Group Facility Services',
  //     paymentMethod: 'Google Pay',
  //     status: 'Pending',
  //     total: 22.00
  //   }
  // ];

  bookings:any;
  constructor(private profileService:ProfileService){}

ngOnInit(){
  this.getUserBooking();
}

getUserBooking() {
  const userId = localStorage.getItem('userId');
  // Ensure that userId is not null or undefined
  if (userId) {
    this.profileService.getUserBooking(+userId).subscribe(
      (response: any) => {
        this.bookings = response.data
        console.log(response.data, "62");
      },
      (error: any) => {
        console.error('Error fetching user bookings:', error);
      }
    );
  } else {
    console.error('User ID not found in local storage.');
  }
}

  editBooking(booking: Booking): void {
    // Logic for editing the booking
    console.log('Editing booking:', booking);
  }

  deleteBooking(booking: Booking): void {
    // Logic for deleting the booking
    this.bookings = this.bookings.filter((b:any) => b !== booking);
    console.log('Deleted booking:', booking);
  }

  calculateTotal(booking: any): number {
    if (!booking.items || booking.items.length === 0) {
      return 0; // No items, return 0
    }
    
    // Calculate total by summing up the price of all items
    return booking.items.reduce((total: number, item: any) => total + (item.price || 0), 0);
  }
  

}
