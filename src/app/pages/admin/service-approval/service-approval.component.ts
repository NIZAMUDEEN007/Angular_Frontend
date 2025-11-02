import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { ServiceView, ApprovalStatus, ServiceStatus } from '../../../models';

@Component({
  selector: 'app-service-approval',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './service-approval.component.html',
  styleUrls: ['./service-approval.component.css']
})
export class ServiceApprovalComponent implements OnInit {
  services: ServiceView[] = [];
  loading = false;
  error = '';
  success = '';
  ApprovalStatus = ApprovalStatus;

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPendingServices();
  }

  loadPendingServices() {
    this.loading = true;
    this.error = '';
    
    // Use the real backend endpoint to get pending services
    this.adminService.getAllServices(ApprovalStatus.PENDING).subscribe({
      next: (pendingServices) => {
        this.services = pendingServices;
        this.loading = false;
        console.log('Loaded pending services:', pendingServices);
      },
      error: (error) => {
        console.error('Error loading pending services:', error);
        if (error.status === 401) {
          this.router.navigate(['/login']);
          return;
        }
        if (error.status === 500) {
          this.error = 'Server error. Please try again later.';
        } else {
          this.error = 'Failed to load pending services. Please try again.';
        }
        this.loading = false;
      }
    });
  }

  approveService(serviceId: number, status: ApprovalStatus) {
    this.loading = true;
    this.error = '';
    this.success = '';

    console.log(`Attempting to ${status === ApprovalStatus.APPROVED ? 'approve' : 'reject'} service with ID: ${serviceId}`);

    this.adminService.approveService(serviceId, status).subscribe({
      next: (updatedService) => {
        console.log('Service approval successful:', updatedService);
        this.success = `Service ${status === ApprovalStatus.APPROVED ? 'approved' : 'rejected'} successfully!`;
        this.loading = false;
        // Remove the service from the list since it's no longer pending
        this.services = this.services.filter(service => service.id !== serviceId);
        // Reload the list to get updated data
        this.loadPendingServices();
      },
      error: (error) => {
        console.error('Error updating service approval:', error);
        if (error.status === 401) {
          this.router.navigate(['/login']);
          return;
        }
        if (error.status === 400) {
          this.error = 'Invalid request. Please check the service data.';
        } else if (error.status === 404) {
          this.error = 'Service not found. It may have already been processed.';
        } else if (error.status === 500) {
          this.error = 'Server error. Please try again later.';
        } else {
          this.error = `Failed to update service approval. Error: ${error.message || 'Unknown error'}`;
        }
        this.loading = false;
      }
    });
  }
}
