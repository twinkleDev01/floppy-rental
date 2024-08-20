import { Component } from '@angular/core';

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
  bookings: Booking[] = [
    {
      orderId: '#1001',
      date: '8 Jun, 2024',
      time: '09:00 am to 10:05 am',
      serviceImage: 'images/Service-detail-img/room_cleaning.png',
      serviceName: 'Niti Group Facility Services',
      paymentMethod: 'Paypal',
      status: 'Pending',
      total: 22.00
    },
    {
      orderId: '#1002',
      date: '8 Jun, 2024',
      time: '09:00 am to 10:05 am',
      serviceImage: 'images/Service-detail-img/room_cleaning.png',
      serviceName: 'Niti Group Facility Services',
      paymentMethod: 'Google Pay',
      status: 'Complete',
      total: 22.00
    },
    {
      orderId: '#1003',
      date: '8 Jun, 2024',
      time: '09:00 am to 10:05 am',
      serviceImage: 'images/Service-detail-img/room_cleaning.png',
      serviceName: 'Niti Group Facility Services',
      paymentMethod: 'Google Pay',
      status: 'Pending',
      total: 22.00
    }
  ];

  editBooking(booking: Booking): void {
    // Logic for editing the booking
    console.log('Editing booking:', booking);
  }

  deleteBooking(booking: Booking): void {
    // Logic for deleting the booking
    this.bookings = this.bookings.filter(b => b !== booking);
    console.log('Deleted booking:', booking);
  }

}
