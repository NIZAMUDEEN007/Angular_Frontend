import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ClientService } from '../../../services/client.service';
import { SpaView, ServiceView, ServiceCreateRequest, ApprovalStatus } from '../../../models';
import { ServiceStatus } from '../../../models';

@Component({
  selector: 'app-manage-spa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-spa.component.html',
  styleUrls: ['./manage-spa.component.css']
})
export class ManageSpaComponent implements OnInit {
  spa: SpaView | null = null;
  services: ServiceView[] = [];
  newService: ServiceCreateRequest = {
    name: '',
    description: '',
    price: 0,
    durationInMinutes: 0
  };
  loading = false;
  showAddService = false;

  constructor(
    private route: ActivatedRoute,
    private clientService: ClientService
  ) {}

  ngOnInit() {
    const spaId = this.route.snapshot.paramMap.get('id');
    if (spaId) {
      this.loadSpa(+spaId);
    }
  }

  loadSpa(spaId: number) {
    // Real implementation: load spa and its services from backend
    this.clientService.getMySpas().subscribe({
      next: (spas) => {
        this.spa = spas.find(s => s.id === spaId) ?? null;
        if (this.spa) {
          // Fetch services for this spa
          this.clientService.getSpaServices(spaId).subscribe({
            next: (services) => {
              this.services = services;
            },
            error: (error) => {
              this.services = [];
              console.error('Failed to load services:', error);
            }
          });
        } else {
          this.services = [];
        }
      },
      error: (error) => {
        this.spa = null;
        this.services = [];
        console.error('Failed to load spa:', error);
      }
    });
  }

  addService() {
    if (this.spa) {
      this.clientService.addService(this.spa.id, this.newService).subscribe({
        next: (service) => {
          this.loadSpa(this.spa!.id); // Reload list from backend
          this.newService = { name: '', description: '', price: 0, durationInMinutes: 0 };
          this.showAddService = false;
        },
        error: (error) => {
          console.error('Error adding service:', error);
        }
      });
    }
  }

  toggleServiceStatus(service: ServiceView) {
    const nextStatus: ServiceStatus = service.serviceStatus === 'AVAILABLE'
      ? 'UNAVAILABLE' as ServiceStatus
      : 'AVAILABLE' as ServiceStatus;

    this.clientService.updateServiceStatus(service.id, nextStatus).subscribe({
      next: (updated) => {
        service.serviceStatus = updated.serviceStatus ?? nextStatus;
      },
      error: (error) => {
        console.error('Failed to update service status:', error);
      }
    });
  }
}
