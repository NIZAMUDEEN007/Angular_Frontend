import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { UserView, ProfileUpdateRequest } from '../../../models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: UserView | null = null;
  profileData: ProfileUpdateRequest = {
    firstName: '',
    lastName: '',
    phone: ''
  };
  loading = false;
  success = '';
  error = '';
  stats = {
    totalBookings: 0,
    wishlistItems: 0
  };

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('Profile component initialized');
    this.authService.currentUser.subscribe(user => {
      console.log('Profile component - Current user:', user);
      this.currentUser = user;
      if (user) {
        console.log('User is authenticated, setting profile data');
        this.profileData = {
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone
        };
        this.loadUserStats();
      } else {
        console.log('User not authenticated in profile component');
      }
    });
  }

  loadUserStats() {
    // Only load stats if user is a regular USER (not CLIENT or ADMIN)
    if (this.currentUser?.role === 'USER') {
      // Load user statistics
      this.userService.getMyBookings().subscribe({
        next: (bookings) => {
          this.stats.totalBookings = bookings.length;
        },
        error: (error) => {
          console.error('Error loading bookings:', error);
          // Don't show error to user, just log it
        }
      });

      this.userService.getWishlist().subscribe({
        next: (wishlist) => {
          this.stats.wishlistItems = wishlist.length;
        },
        error: (error) => {
          console.error('Error loading wishlist:', error);
          // Don't show error to user, just log it
        }
      });
    }
    // For CLIENT and ADMIN, stats are not applicable or loaded differently
  }

  onSubmit() {
    this.loading = true;
    this.success = '';
    this.error = '';
    console.log('Submitting profile data:', this.profileData);

    this.userService.updateProfile(this.profileData).subscribe({
      next: (updatedUser) => {
        // Refresh the current user from backend to get latest data
        this.authService.refreshCurrentUser().subscribe({
          next: (refreshedUser) => {
            this.loading = false;
            this.success = 'Profile updated successfully!';
            // Update profileData with refreshed data
            this.profileData = {
              firstName: refreshedUser.firstName,
              lastName: refreshedUser.lastName,
              phone: refreshedUser.phone
            };
          },
          error: (error) => {
            this.loading = false;
            if (error.status === 401) {
              this.router.navigate(['/login']);
              return;
            }
            // Log the full error response
            console.error('Profile update error:', error);
            console.error('Error details:', error.error);
            console.error('Error status:', error.status);
            
            // Check if there are validation messages
            if (error.error?.messages) {
              console.error('Validation messages:', error.error.messages);
              this.error = 'Validation errors: ' + JSON.stringify(error.error.messages);
            } else {
              this.error = 'Failed to update profile. Please try again.';
            }
          }
        });
      },
      error: (error) => {
        this.loading = false;
        if (error.status === 401) {
          this.router.navigate(['/login']);
          return;
        }
        this.error = 'Failed to update profile. Please try again.';
        console.error('Profile update error:', error);
      }
    });
  }

  navigateToBookings() {
    console.log('Navigating to bookings...');
    if (this.currentUser?.role === 'USER') {
      this.router.navigate(['/user/my-bookings']);
    } else if (this.currentUser?.role === 'CLIENT') {
      this.router.navigate(['/client/dashboard']);
    }
  }

  navigateToWishlist() {
    console.log('Navigating to wishlist...');
    if (this.currentUser?.role === 'USER') {
      this.router.navigate(['/user/wishlist']);
    }
    // CLIENT doesn't have wishlist, so do nothing
  }

  navigateToMembership() {
    console.log('Navigating to membership...');
    if (this.currentUser?.role === 'USER') {
      this.router.navigate(['/user/membership']);
    }
    // CLIENT doesn't have membership, so do nothing
  }

  navigateToBrowseSpas() {
    console.log('Navigating to browse spas...');
    this.router.navigate(['/']);
  }
}