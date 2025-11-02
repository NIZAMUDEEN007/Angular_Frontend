import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { UserView, MembershipView, MembershipSubscribeRequest, MembershipStatus } from '../../../models';

@Component({
  selector: 'app-membership',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.css']
})
export class MembershipComponent implements OnInit {
  currentUser: UserView | null = null;
  memberships: MembershipView[] = [];
  loading = false;
  subscribing = false;
  success = '';
  error = '';

  selectedMembershipId: number | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      // Force change detection when user updates
      this.cdr.detectChanges();
    });
    
    // In a real app, you'd load memberships from a service
    // For now, we'll create some mock data
    this.loadMemberships();
  }

  loadMemberships() {
    this.loading = true;
    // Use common endpoint accessible to any logged-in user
    this.userService.getAllMemberships().subscribe({
      next: (memberships) => {
        console.log('Loaded memberships:', memberships);
        this.memberships = memberships || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading memberships:', error);
        this.memberships = [];
        this.loading = false;
        this.error = 'Failed to load memberships. Please try again later.';
        this.cdr.detectChanges();
      }
    });
  }

  subscribeToMembership(membershipId: number, event?: Event) {
    // Prevent any default behavior that might cause navigation
    if (event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }
    
    this.subscribing = true;
    this.success = '';
    this.error = '';
    this.selectedMembershipId = membershipId;

    this.userService.subscribeToMembership(membershipId).subscribe({
        next: (updatedUser) => {
          console.log('Subscribe response:', updatedUser);
          
          // Immediately update both local and AuthService
          if (updatedUser) {
            // Ensure status is ACTIVE
            if (updatedUser.membershipStatus !== MembershipStatus.ACTIVE) {
              updatedUser.membershipStatus = MembershipStatus.ACTIVE;
            }
            
            // Update local currentUser immediately
            this.currentUser = updatedUser;
            
            // Update AuthService's subject - this will notify all subscribers including this component
            (this.authService as any).currentUserSubject.next(updatedUser);
            
            // Force change detection
            this.cdr.detectChanges();
          }
          
          this.subscribing = false;
          this.selectedMembershipId = null;
          this.success = 'Successfully subscribed to membership! Status changed to ACTIVE.';
          
          // Also refresh from backend to ensure we have latest data (non-blocking)
          this.authService.refreshCurrentUser().subscribe({
            next: (refreshedUser) => {
              console.log('Refreshed user after subscribe:', refreshedUser);
              if (refreshedUser) {
                // Ensure status is ACTIVE
                if (refreshedUser.membershipStatus !== MembershipStatus.ACTIVE) {
                  refreshedUser.membershipStatus = MembershipStatus.ACTIVE;
                }
                // Update both local and AuthService
                this.currentUser = refreshedUser;
                (this.authService as any).currentUserSubject.next(refreshedUser);
                // Force change detection again
                this.cdr.detectChanges();
              }
            },
            error: (error) => {
              console.error('Error refreshing user after subscription:', error);
              // Keep using the updatedUser from the subscribe response
            }
          });
          
          // Clear success message after 3 seconds
          setTimeout(() => {
            this.success = '';
          }, 3000);
        },
        error: (error) => {
          this.subscribing = false;
          this.selectedMembershipId = null;
          this.error = 'Failed to subscribe to membership. Please try again.';
          console.error('Membership subscription error:', error);
        }
      });
  }

  cancelMembership() {
    if (confirm('Are you sure you want to cancel your membership?')) {
      this.subscribing = true;
      this.success = '';
      this.error = '';

      this.userService.cancelMembership().subscribe({
        next: (updatedUser) => {
          this.subscribing = false;
          this.success = 'Membership cancelled successfully! Status changed to INACTIVE.';
          // Refresh the current user to update the UI
          this.authService.refreshCurrentUser().subscribe({
            next: (refreshedUser) => {
              this.currentUser = refreshedUser;
              // Verify status was updated to INACTIVE
              if (this.currentUser.membershipStatus === 'INACTIVE') {
                console.log('Membership status successfully set to INACTIVE');
              }
              // Clear success message after 3 seconds
              setTimeout(() => {
                this.success = '';
              }, 3000);
            },
            error: (error) => {
              console.error('Error refreshing user after cancellation:', error);
            }
          });
        },
        error: (error) => {
          this.subscribing = false;
          this.error = 'Failed to cancel membership. Please try again.';
          console.error('Membership cancellation error:', error);
        }
      });
    }
  }

  isSubscribed(membershipId: number): boolean {
    // Check if the user is subscribed to this specific membership
    // We'll compare by matching the membership name or ID
    // Also check that status is ACTIVE (not INACTIVE)
    if (!this.currentUser?.membershipName) {
      return false;
    }
    // Find the membership that matches the current user's membership name
    const userMembership = this.memberships.find(m => m.id === membershipId);
    const isMatchingMembership = userMembership?.name === this.currentUser.membershipName;
    // Only return true if membership matches AND status is ACTIVE
    return isMatchingMembership && this.currentUser.membershipStatus === MembershipStatus.ACTIVE;
  }

  isActive(membershipId: number): boolean {
    // Check if the user has this membership with ACTIVE status
    if (!this.currentUser?.membershipName) {
      return false;
    }
    // Find the membership that matches the current user's membership name
    const userMembership = this.memberships.find(m => m.id === membershipId);
    const isMatchingMembership = userMembership?.name === this.currentUser.membershipName;
    // Return true only if membership matches AND status is ACTIVE
    return isMatchingMembership && this.currentUser.membershipStatus === MembershipStatus.ACTIVE;
  }

  isInactive(membershipId: number): boolean {
    // If no current user or no membership name, show Subscribe button
    if (!this.currentUser) {
      return true;
    }
    
    // If no membership name, user is not subscribed - show Subscribe button
    if (!this.currentUser.membershipName) {
      return true;
    }
    
    // Find the membership that matches the current user's membership name
    const userMembership = this.memberships.find(m => m.id === membershipId);
    const isMatchingMembership = userMembership?.name === this.currentUser.membershipName;
    
    // If not matching this membership, show Subscribe button
    if (!isMatchingMembership) {
      return true;
    }
    
    // Same membership - check status
    // Show Subscribe button if status is NOT ACTIVE (INACTIVE, null, undefined, or any other status)
    const status = this.currentUser.membershipStatus;
    return !status || status !== MembershipStatus.ACTIVE;
  }

  hasActiveMembership(): boolean {
    // Check if user has any active membership
    return this.currentUser?.membershipStatus === MembershipStatus.ACTIVE && !!this.currentUser?.membershipName;
  }

  getSubscribedMembership(): MembershipView | undefined {
    // Get the membership that the user is subscribed to (if any and ACTIVE)
    if (!this.currentUser?.membershipName || this.currentUser.membershipStatus !== MembershipStatus.ACTIVE) {
      return undefined;
    }
    return this.memberships.find(m => m.name === this.currentUser?.membershipName);
  }

  getMembershipName(membershipId: number): string | undefined {
    // Get the name of a membership by ID
    const membership = this.memberships.find(m => m.id === membershipId);
    return membership?.name;
  }

  unsubscribeFromMembership(membershipId: number, event?: Event) {
    // Prevent any default behavior that might cause navigation
    if (event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }
    
    // Unsubscribe from membership (toggle from ACTIVE to INACTIVE)
    if (confirm('Are you sure you want to unsubscribe from this membership?')) {
      this.subscribing = true;
      this.success = '';
      this.error = '';
      this.selectedMembershipId = membershipId;

      this.userService.cancelMembership().subscribe({
        next: (updatedUser) => {
          console.log('Unsubscribe response:', updatedUser);
          
          // Immediately update both local and AuthService
          if (updatedUser) {
            // Ensure status is set to INACTIVE if not already
            if (updatedUser.membershipStatus !== MembershipStatus.INACTIVE) {
              updatedUser.membershipStatus = MembershipStatus.INACTIVE;
            }
            
            // Update local currentUser immediately
            this.currentUser = updatedUser;
            
            // Update AuthService's subject - this will notify all subscribers including this component
            (this.authService as any).currentUserSubject.next(updatedUser);
            
            // Force change detection
            this.cdr.detectChanges();
          }
          
          this.subscribing = false;
          this.selectedMembershipId = null;
          this.success = 'Successfully unsubscribed from membership! Status changed to INACTIVE.';
          
          // Also refresh from backend to ensure we have latest data (non-blocking)
          this.authService.refreshCurrentUser().subscribe({
            next: (refreshedUser) => {
              console.log('Refreshed user after unsubscribe:', refreshedUser);
              if (refreshedUser) {
                // Ensure status is INACTIVE
                if (refreshedUser.membershipStatus !== MembershipStatus.INACTIVE) {
                  refreshedUser.membershipStatus = MembershipStatus.INACTIVE;
                }
                // Update both local and AuthService
                this.currentUser = refreshedUser;
                (this.authService as any).currentUserSubject.next(refreshedUser);
                // Force change detection again
                this.cdr.detectChanges();
              }
              console.log('Final membership status:', refreshedUser?.membershipStatus);
              console.log('Has active membership:', this.hasActiveMembership());
            },
            error: (error) => {
              console.error('Error refreshing user after unsubscription:', error);
              // Don't redirect, just log the error - keep the updated user from API response
            }
          });
          
          // Clear success message after 3 seconds
          setTimeout(() => {
            this.success = '';
          }, 3000);
        },
        error: (error) => {
          this.subscribing = false;
          this.selectedMembershipId = null;
          console.error('Membership unsubscription error:', error);
          console.error('Error details:', error);
          
          // Handle specific error cases without redirecting
          if (error.status === 401 || error.status === 403) {
            this.error = 'Authentication error. Please refresh the page.';
            // Don't redirect - let user see the error
          } else {
            this.error = 'Failed to unsubscribe from membership. Please try again.';
          }
        }
      });
    }
  }

  cancelSpecificMembership(membershipId: number) {
    // Cancel membership (same as cancelMembership but can be called from a specific card)
    this.unsubscribeFromMembership(membershipId);
  }
}
