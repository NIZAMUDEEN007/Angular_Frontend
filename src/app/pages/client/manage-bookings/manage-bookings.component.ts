import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ClientService } from '../../../services/client.service';
import { BookingView, BookingStatus } from '../../../models';

@Component({
  selector: 'app-manage-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-bookings.component.html',
  styleUrls: ['./manage-bookings.component.css']
})
export class ManageBookingsComponent implements OnInit {
  bookings: BookingView[] = [];
  loading = false;
  selectedStatus: BookingStatus | null = null;
  BookingStatus = BookingStatus;

  constructor(
    private route: ActivatedRoute,
    private clientService: ClientService
  ) {}

  ngOnInit() {
    const spaId = this.route.snapshot.paramMap.get('id');
    if (spaId) {
      this.loadBookings(+spaId);
    }
  }

  loadBookings(spaId: number) {
    this.loading = true;
    this.clientService.getBookingsForSpa(spaId).subscribe({
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

  updateBookingStatus(bookingId: number, status: BookingStatus) {
    this.clientService.updateBookingStatus(bookingId, status).subscribe({
      next: () => {
        // Reload bookings
        const spaId = this.route.snapshot.paramMap.get('id');
        if (spaId) {
          this.loadBookings(+spaId);
        }
      },
      error: (error) => {
        console.error('Error updating booking status:', error);
      }
    });
  }

  filterByStatus(status: BookingStatus | null) {
    this.selectedStatus = status;
    const spaId = this.route.snapshot.paramMap.get('id');
    if (spaId) {
      if (status) {
        this.clientService.getFilteredBookings(+spaId, status).subscribe({
          next: (bookings) => {
            this.bookings = bookings;
          },
          error: (error) => {
            console.error('Error filtering bookings:', error);
          }
        });
      } else {
        this.loadBookings(+spaId);
      }
    }
  }
}
