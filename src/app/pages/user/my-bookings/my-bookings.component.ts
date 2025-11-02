import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { BookingView, BookingStatus, PaymentStatus } from '../../../models';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css']
})
export class MyBookingsComponent implements OnInit {
  bookings: BookingView[] = [];
  loading = false;
  BookingStatus = BookingStatus;
  PaymentStatus = PaymentStatus;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.loading = true;
    this.userService.getMyBookings().subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.loading = false;
      }
    });
  }

  cancelBooking(bookingId: number) {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.userService.cancelBooking(bookingId).subscribe({
        next: () => {
          this.loadBookings(); // Reload bookings
        },
        error: (error) => {
          console.error('Error cancelling booking:', error);
        }
      });
    }
  }

  canPayForBooking(booking: BookingView): boolean {
    // Handle both enum and string values from API
    const status = String(booking.status || '').trim().toUpperCase();
    
    // Check if status is CONFIRMED
    const isConfirmed = status === 'CONFIRMED' || status === BookingStatus.CONFIRMED || booking.status === BookingStatus.CONFIRMED;
    
    // If not confirmed, cannot pay
    if (!isConfirmed) {
      return false;
    }
    
    // Handle paymentStatus - if missing, assume PENDING (can pay)
    let paymentStatusStr = '';
    if (booking.paymentStatus !== undefined && booking.paymentStatus !== null) {
      paymentStatusStr = String(booking.paymentStatus).trim().toUpperCase();
    } else {
      // If paymentStatus is missing, assume it's PENDING and allow payment
      paymentStatusStr = 'PENDING';
    }
    
    // Check if payment is not completed
    const isNotCompleted = paymentStatusStr !== 'COMPLETED' && 
                           paymentStatusStr !== PaymentStatus.COMPLETED &&
                           booking.paymentStatus !== PaymentStatus.COMPLETED;
    
    // Can pay only if confirmed and payment not completed
    return isConfirmed && isNotCompleted;
  }

  goToPayment(bookingId: number) {
    this.router.navigate(['/user/bookings', bookingId, 'payment']);
  }
}
