import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { MembershipView, MembershipCreateRequest } from '../../../models';

@Component({
  selector: 'app-membership-mgmt',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './membership-mgmt.component.html',
  styleUrls: ['./membership-mgmt.component.css']
})
export class MembershipMgmtComponent implements OnInit {
  memberships: MembershipView[] = [];
  newMembership: MembershipCreateRequest = {
    name: '',
    description: '',
    pricePerMonth: 0,
    discountPercentage: 0
  };
  loading = false;
  showAddForm = false;
  success = '';
  error = '';

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadMemberships();
  }

  loadMemberships() {
    this.loading = true;
    this.adminService.getAllMemberships().subscribe({
      next: (memberships) => {
        // Normalize potential backend field naming differences
        this.memberships = (memberships || []).map(m => this.normalizeMembership(m));
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading memberships:', error);
        this.memberships = [];
        this.loading = false;
      }
    });
  }

  addMembership() {
    if (!this.newMembership.name || !this.newMembership.description || 
        this.newMembership.pricePerMonth <= 0 || this.newMembership.discountPercentage < 0) {
      this.error = 'Please fill in all fields with valid values.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.adminService.createMembership(this.newMembership).subscribe({
      next: (membership) => {
        this.memberships.push(this.normalizeMembership(membership));
        this.newMembership = { name: '', description: '', pricePerMonth: 0, discountPercentage: 0 };
        this.showAddForm = false;
        this.success = 'Membership created successfully!';
        this.loading = false;
      },
      error: (error) => {
        console.error('Error creating membership:', error);
        if (error.status === 401) {
          this.router.navigate(['/login']);
          return;
        }
        if (error.status === 400) {
          this.error = 'Invalid membership data. Please check your input.';
        } else if (error.status === 500) {
          this.error = 'Server error. Please try again later.';
        } else {
          this.error = 'Failed to create membership. Please try again.';
        }
        this.loading = false;
      }
    });
  }

  deleteMembership(id: number) {
    if (!confirm('Are you sure you want to delete this membership?')) return;
    this.loading = true;
    this.error = ''; // Clear previous errors
    this.success = ''; // Clear previous success messages
    
    this.adminService.deleteMembership(id).subscribe({
      next: () => {
        this.success = 'Membership deleted successfully!';
        this.loadMemberships(); // Refresh from backend to reflect server state
      },
      error: (error) => {
        console.error('Error deleting membership:', error);
        // Check if it's actually a success (204) but being treated as error
        if (error.status === 204 || error.status === 200) {
          // Backend succeeded, refresh the list
          this.success = 'Membership deleted successfully!';
          this.loadMemberships();
        } else {
          this.loading = false;
          this.error = 'Failed to delete membership.';
        }
      }
    });
  }

  private normalizeMembership(m: any): MembershipView {
    const discountCandidates = [
      m?.discountPercentage,
      m?.discount,
      m?.discountRate,
      m?.percentage,
      m?.percent
    ];
    const parsedDiscount = discountCandidates.find(v => v !== undefined && v !== null);
    const discountNum = typeof parsedDiscount === 'string' ? parseFloat(parsedDiscount) : Number(parsedDiscount);
    return {
      id: Number(m.id),
      name: m.name,
      description: m.description,
      pricePerMonth: typeof m.pricePerMonth === 'string' ? parseFloat(m.pricePerMonth) : Number(m.pricePerMonth),
      discountPercentage: isNaN(discountNum) ? 0 : discountNum
    } as MembershipView;
  }
}
