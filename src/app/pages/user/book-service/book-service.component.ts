import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { AvailabilityResponse, BookingRequest } from '../../../models';

@Component({
  selector: 'app-book-service',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-service.component.html',
  styleUrls: ['./book-service.component.css']
})
export class BookServiceComponent {
  serviceId: number;
  date = '';
  loading = false;
  checking = false;
  availableSlots: string[] = [];
  selectedSlot: string | null = null;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {
    const id = this.route.snapshot.paramMap.get('serviceId');
    this.serviceId = id ? +id : 0;
    if (!this.serviceId || Number.isNaN(this.serviceId)) {
      console.error('Invalid serviceId from route params:', id);
    } else {
      console.log('Booking for serviceId:', this.serviceId);
    }
  }

  checkAvailability() {
    if (!this.date) return;
    this.error = '';
    this.checking = true;
    this.availableSlots = [];
    this.selectedSlot = null;
    this.userService.checkAvailability(this.serviceId, this.date).subscribe({
      next: (res: AvailabilityResponse) => {
        this.availableSlots = res.availableSlots;
        this.checking = false;
      },
      error: (err) => {
        this.error = 'Failed to load availability';
        this.checking = false;
        console.error(err);
      }
    });
  }

  selectSlot(slot: string) {
    this.selectedSlot = slot;
  }

  confirmBooking() {
    if (!this.date || !this.selectedSlot || !this.serviceId) {
      this.error = !this.serviceId ? 'Invalid service. Please navigate again.' : 'Please select a date and time slot.';
      return;
    }
    
    this.loading = true;
    const bookingTime = `${this.date}T${this.normalizeSlotToHHmmss(this.selectedSlot)}`;
    const req: BookingRequest = { serviceId: this.serviceId, bookingTime };
    
    this.userService.createBooking(req).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/user/my-bookings']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Failed to create booking';
        console.error(err);
      }
    });
  }

  private normalizeSlotToHHmmss(slot: string): string {
    // Accepts "HH:mm" or "HH:mm:ss"; ensures exactly HH:mm:ss
    // Guard against inputs like HH:mm:ss:00 by trimming extra parts.
    const parts = slot.split(':').slice(0, 3); // take at most 3 parts
    if (parts.length === 1) {
      // e.g., "10" -> "10:00:00"
      return `${parts[0].padStart(2, '0')}:00:00`;
    }
    if (parts.length === 2) {
      // e.g., "10:00" -> "10:00:00"
      const [h, m] = parts;
      return `${h.padStart(2, '0')}:${m.padStart(2, '0')}:00`;
    }
    // length >= 3
    const [h, m, s] = parts;
    // If seconds contain extra like "00:00", take only first two digits
    const ss = s.length > 2 ? s.slice(0, 2) : s;
    return `${h.padStart(2, '0')}:${m.padStart(2, '0')}:${ss.padStart(2, '0')}`;
  }
}


