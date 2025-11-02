import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { BookingRequest, AvailabilityResponse } from '../../models';

@Component({
  selector: 'app-booking-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-modal.component.html',
  styleUrls: ['./booking-modal.component.css']
})
export class BookingModalComponent {
  @Input() serviceId: number | null = null;
  @Input() isVisible = false;
  @Output() close = new EventEmitter<void>();
  @Output() bookingCreated = new EventEmitter<any>();

  bookingData: BookingRequest = {
    serviceId: 0,
    bookingTime: ''
  };
  availableSlots: string[] = [];
  selectedDate = '';
  loading = false;
  error = '';

  constructor(private userService: UserService) {}

  onDateChange() {
    if (this.selectedDate && this.serviceId) {
      this.loadAvailableSlots();
    }
  }

  loadAvailableSlots() {
    if (this.serviceId) {
      this.userService.checkAvailability(this.serviceId, this.selectedDate).subscribe({
        next: (response) => {
          this.availableSlots = response.availableSlots;
        },
        error: (error) => {
          console.error('Error loading available slots:', error);
        }
      });
    }
  }

  createBooking() {
    if (this.serviceId) {
      this.loading = true;
      this.error = '';
      
      this.bookingData.serviceId = this.serviceId;
      this.userService.createBooking(this.bookingData).subscribe({
        next: (booking) => {
          this.loading = false;
          this.bookingCreated.emit(booking);
          this.closeModal();
        },
        error: (error) => {
          this.loading = false;
          this.error = 'Failed to create booking. Please try again.';
          console.error('Error creating booking:', error);
        }
      });
    }
  }

  closeModal() {
    this.close.emit();
    this.resetForm();
  }

  private resetForm() {
    this.bookingData = { serviceId: 0, bookingTime: '' };
    this.selectedDate = '';
    this.availableSlots = [];
    this.error = '';
  }
}
