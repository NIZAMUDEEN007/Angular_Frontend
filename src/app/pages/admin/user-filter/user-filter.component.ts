import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { UserView, MembershipStatus } from '../../../models';

@Component({
  selector: 'app-user-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-filter.component.html',
  styleUrls: ['./user-filter.component.css']
})
export class UserFilterComponent implements OnInit {
  users: UserView[] = [];
  loading = false;
  error = '';
  filterType: 'status' | 'membership' = 'status';
  selectedStatus: MembershipStatus | null = null;
  selectedMembershipId: number | null = null;
  MembershipStatus = MembershipStatus;

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    // Mock data
    this.users = [];
    this.loading = false;
  }

  filterByStatus() {
    if (this.selectedStatus) {
      this.loading = true;
      this.error = '';
      this.adminService.getUsersByStatus(this.selectedStatus).subscribe({
        next: (users) => {
          this.users = users;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error filtering users by status:', error);
          if (error.status === 401) {
            this.router.navigate(['/login']);
            return;
          }
          if (error.status === 500) {
            this.error = 'Server error. Please try again later.';
          } else {
            this.error = 'Failed to filter users by status. Please try again.';
          }
          this.loading = false;
        }
      });
    }
  }

  filterByMembership() {
    if (this.selectedMembershipId) {
      this.loading = true;
      this.error = '';
      this.adminService.getUsersByMembership(this.selectedMembershipId).subscribe({
        next: (users) => {
          this.users = users;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error filtering users by membership:', error);
          if (error.status === 401) {
            this.router.navigate(['/login']);
            return;
          }
          if (error.status === 500) {
            this.error = 'Server error. Please try again later.';
          } else {
            this.error = 'Failed to filter users by membership. Please try again.';
          }
          this.loading = false;
        }
      });
    }
  }
}
