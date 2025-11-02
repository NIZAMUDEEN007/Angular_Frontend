import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { BookingView, PaymentRequest } from '../../../models';

@Component({
  selector: 'app-booking-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-payment.component.html',
  styleUrls: ['./booking-payment.component.css']
})
export class BookingPaymentComponent implements OnInit {
  bookingId: number | null = null;
  booking: BookingView | null = null;
  loading = false;
  processing = false;
  error = '';
  success = '';
  atSymbol = '@';

  paymentData: PaymentRequest = {
    fromUpiId: '',
    toUpiId: '',
    toAccountNumber: '',
    amount: 0,
    remarks: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    const bookingIdParam = this.route.snapshot.paramMap.get('bookingId');
    if (bookingIdParam) {
      this.bookingId = +bookingIdParam;
      this.loadBookingDetails();
    } else {
      this.error = 'Invalid booking ID.';
      this.router.navigate(['/user/my-bookings']);
    }
  }

  loadBookingDetails() {
    if (!this.bookingId) return;

    this.loading = true;
    this.userService.getMyBookings().subscribe({
      next: (bookings) => {
        this.booking = bookings.find(b => b.id === this.bookingId!) || null;
        if (this.booking) {
          this.paymentData.amount = this.booking.finalPrice;
        } else {
          this.error = 'Booking not found.';
          setTimeout(() => {
            this.router.navigate(['/user/my-bookings']);
          }, 2000);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading booking:', error);
        this.error = 'Failed to load booking details.';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/user/my-bookings']);
        }, 2000);
      }
    });
  }

  submitPayment() {
    if (!this.bookingId || !this.validateForm()) {
      return;
    }

    this.processing = true;
    this.error = '';
    this.success = '';

    this.userService.processPayment(this.paymentData).subscribe({
      next: (response) => {
        console.log('Payment response:', response);
        
        // If payment is successful, confirm the payment on the booking
        if (response === 'Transaction Successful' || response.includes('Successful')) {
          this.confirmPayment();
        } else {
          this.processing = false;
          this.error = 'Payment failed. Please try again.';
        }
      },
      error: (error) => {
        this.processing = false;
        this.error = error.error || 'Payment failed. Please try again.';
        console.error('Payment error:', error);
      }
    });
  }

  confirmPayment() {
    if (!this.bookingId) return;

    this.userService.confirmBookingPayment(this.bookingId).subscribe({
      next: (updatedBooking) => {
        this.processing = false;
        this.success = 'Payment successful! Your booking payment has been confirmed.';
        setTimeout(() => {
          this.router.navigate(['/user/my-bookings']);
        }, 2000);
      },
      error: (error) => {
        this.processing = false;
        this.error = 'Payment processed but failed to update booking. Please contact support.';
        console.error('Error confirming payment:', error);
      }
    });
  }

  validateForm(): boolean {
    if (!this.paymentData.fromUpiId || !this.paymentData.fromUpiId.trim()) {
      this.error = 'Please enter your UPI ID.';
      return false;
    }
    if (!this.paymentData.toUpiId || !this.paymentData.toUpiId.trim()) {
      this.error = 'Please enter receiver UPI ID.';
      return false;
    }
    if (!this.paymentData.toAccountNumber || !this.paymentData.toAccountNumber.trim()) {
      this.error = 'Please enter receiver account number.';
      return false;
    }
    if (!this.paymentData.amount || this.paymentData.amount <= 0) {
      this.error = 'Invalid amount.';
      return false;
    }
    return true;
  }

  goBack() {
    this.router.navigate(['/user/my-bookings']);
  }
}

