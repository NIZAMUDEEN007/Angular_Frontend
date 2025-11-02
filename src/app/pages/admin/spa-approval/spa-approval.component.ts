import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { SpaView, ApprovalStatus } from '../../../models';

@Component({
  selector: 'app-spa-approval',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spa-approval.component.html',
  styleUrls: ['./spa-approval.component.css']
})
export class SpaApprovalComponent implements OnInit {
  spas: SpaView[] = [];
  loading = false;
  error = '';
  success = '';
  ApprovalStatus = ApprovalStatus;

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPendingSpas();
  }

  loadPendingSpas() {
    this.loading = true;
    this.error = '';
    
    // Use the real backend endpoint to get pending spas
    this.adminService.getAllSpas(ApprovalStatus.PENDING).subscribe({
      next: (pendingSpas) => {
        this.spas = pendingSpas;
        this.loading = false;
        console.log('Loaded pending spas:', pendingSpas);
      },
      error: (error) => {
        console.error('Error loading pending spas:', error);
        if (error.status === 401) {
          this.router.navigate(['/login']);
          return;
        }
        if (error.status === 500) {
          this.error = 'Server error. Please try again later.';
        } else {
          this.error = 'Failed to load pending spas. Please try again.';
        }
        this.loading = false;
      }
    });
  }

  approveSpa(spaId: number, status: ApprovalStatus) {
    this.loading = true;
    this.error = '';
    this.success = '';

    console.log(`Attempting to ${status === ApprovalStatus.APPROVED ? 'approve' : 'reject'} spa with ID: ${spaId}`);

    this.adminService.approveSpa(spaId, status).subscribe({
      next: (updatedSpa) => {
        console.log('Spa approval successful:', updatedSpa);
        this.success = `Spa ${status === ApprovalStatus.APPROVED ? 'approved' : 'rejected'} successfully!`;
        this.loading = false;
        // Remove the spa from the list since it's no longer pending
        this.spas = this.spas.filter(spa => spa.id !== spaId);
        // Reload the list to get updated data
        this.loadPendingSpas();
      },
      error: (error) => {
        console.error('Error updating spa approval:', error);
        if (error.status === 401) {
          this.router.navigate(['/login']);
          return;
        }
        if (error.status === 400) {
          this.error = 'Invalid request. Please check the spa data.';
        } else if (error.status === 404) {
          this.error = 'Spa not found. It may have already been processed.';
        } else if (error.status === 500) {
          this.error = 'Server error. Please try again later.';
        } else {
          this.error = `Failed to update spa approval. Error: ${error.message || 'Unknown error'}`;
        }
        this.loading = false;
      }
    });
  }
}
