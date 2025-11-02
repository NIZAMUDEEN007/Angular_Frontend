import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ClientService } from '../../../services/client.service';
import { UserService } from '../../../services/user.service';
import { UserView, SpaView, BookingView, SpaCreateRequest, ApprovalStatus, BookingStatus, ProfileUpdateRequest } from '../../../models';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class ClientDashboardComponent implements OnInit {
  currentUser: UserView | null = null;
  spas: SpaView[] = [];
  recentBookings: BookingView[] = [];
  loading = false;
  showAddSpaForm = false;
  newSpa: SpaCreateRequest = {
    name: '',
    address: '',
    description: ''
  };
  addingSpa = false;
  success = '';
  error = '';
  
  // Profile editing
  showProfileForm = false;
  profileData: ProfileUpdateRequest = {
    firstName: '',
    lastName: '',
    phone: ''
  };
  updatingProfile = false;
  profileSuccess = '';
  profileError = '';

  constructor(
    private authService: AuthService,
    private clientService: ClientService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      console.log('Client dashboard - Current user:', user);
      if (user) {
        console.log('User is authenticated, loading dashboard data...');
        this.loadDashboardData();
      } else {
        console.log('User not authenticated, redirecting to login...');
        // User not authenticated, redirect to login
        this.router.navigate(['/login']);
      }
    });
  }

  loadDashboardData() {
    this.loading = true;
    this.loadSpas();
  }

  loadSpas() {
    this.clientService.getMySpas().subscribe({
      next: (spas) => {
        this.spas = spas;
        this.loadRecentBookingsFromSpas();
      },
      error: (error) => {
        console.error('Error loading spas:', error);
        if (error.status === 401) {
          // User not authenticated, redirect to login
          this.router.navigate(['/login']);
          return;
        }
        // If spas failed to load we still end loading state
        this.loading = false;
      }
    });
  }

  loadRecentBookingsFromSpas() {
    if (!this.spas || this.spas.length === 0) {
      this.recentBookings = [];
      this.loading = false;
      return;
    }

    const requests = this.spas.map(s => this.clientService.getBookingsForSpa(s.id));
    forkJoin(requests).subscribe({
      next: (results) => {
        const merged = results.flat();
        this.recentBookings = merged
          .sort((a, b) => new Date(b.bookingTime).getTime() - new Date(a.bookingTime).getTime())
          .slice(0, 10);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading recent bookings from spas:', error);
        this.recentBookings = [];
        this.loading = false;
      }
    });
  }

  openAddSpaForm() {
    this.showAddSpaForm = true;
    this.newSpa = { name: '', address: '', description: '' };
    this.success = '';
    this.error = '';
  }

  cancelAddSpa() {
    this.showAddSpaForm = false;
    this.newSpa = { name: '', address: '', description: '' };
    this.success = '';
    this.error = '';
  }

  addSpa() {
    if (!this.newSpa.name || !this.newSpa.address || !this.newSpa.description) {
      this.error = 'Please fill in all fields';
      return;
    }

    console.log('Attempting to add spa:', this.newSpa);
    console.log('Current user:', this.currentUser);

    this.addingSpa = true;
    this.error = '';
    this.success = '';

    this.clientService.addSpa(this.newSpa).subscribe({
      next: (spa) => {
        console.log('Spa added successfully:', spa);
        // Add the new spa to the list
        this.spas.push(spa);
        this.success = 'Spa added successfully! It will be reviewed for approval.';
        this.addingSpa = false;
        this.showAddSpaForm = false;
        this.newSpa = { name: '', address: '', description: '' };
      },
      error: (error) => {
        console.error('Error adding spa:', error);
        if (error.status === 401) {
          this.error = 'Session expired. Please log in again.';
          console.log('401 Unauthorized - redirecting to login');
          this.router.navigate(['/login']);
          return;
        }
        if (error.status === 400) {
          this.error = 'Invalid spa data. Please check your input.';
        } else if (error.status === 500) {
          this.error = 'Server error. Please try again later.';
        } else {
          this.error = 'Failed to add spa. Please try again.';
        }
        this.addingSpa = false;
      }
    });
  }

  viewSpaDetails(spaId: number) {
    this.router.navigate(['/client/spa', spaId, 'manage']);
  }

  openProfileForm() {
    if (this.currentUser) {
      this.profileData = {
        firstName: this.currentUser.firstName,
        lastName: this.currentUser.lastName,
        phone: this.currentUser.phone
      };
    }
    this.showProfileForm = true;
    this.profileSuccess = '';
    this.profileError = '';
  }

  cancelProfileEdit() {
    this.showProfileForm = false;
    this.profileSuccess = '';
    this.profileError = '';
  }

  updateProfile() {
    if (!this.profileData.firstName || !this.profileData.lastName || !this.profileData.phone) {
      this.profileError = 'Please fill in all fields';
      return;
    }

    this.updatingProfile = true;
    this.profileSuccess = '';
    this.profileError = '';

    this.userService.updateProfile(this.profileData).subscribe({
      next: (updatedUser) => {
        // Refresh the current user from backend to get latest data
        this.authService.refreshCurrentUser().subscribe({
          next: (refreshedUser) => {
            this.updatingProfile = false;
            this.profileSuccess = 'Profile updated successfully!';
            this.showProfileForm = false;
            // Update profileData with refreshed data
            this.profileData = {
              firstName: refreshedUser.firstName,
              lastName: refreshedUser.lastName,
              phone: refreshedUser.phone
            };
            // Clear success message after 3 seconds
            setTimeout(() => {
              this.profileSuccess = '';
            }, 3000);
          },
          error: (error) => {
            this.updatingProfile = false;
            if (error.status === 401) {
              this.router.navigate(['/login']);
              return;
            }
            this.profileError = 'Failed to refresh profile data. Please refresh the page.';
            console.error('Profile refresh error:', error);
          }
        });
      },
      error: (error) => {
        this.updatingProfile = false;
        if (error.status === 401) {
          this.profileError = 'Session expired. Please log in again.';
          this.router.navigate(['/login']);
          return;
        }
        if (error.status === 400) {
          this.profileError = 'Invalid profile data. Please check your input.';
        } else {
          this.profileError = 'Failed to update profile. Please try again.';
        }
        console.error('Profile update error:', error);
      }
    });
  }
}
