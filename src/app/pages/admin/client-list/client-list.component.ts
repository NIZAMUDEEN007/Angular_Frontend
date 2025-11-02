import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { UserView } from '../../../models';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
  clients: UserView[] = [];
  loading = false;
  error = '';

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.loading = true;
    this.error = '';

    this.adminService.getAllClients().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading clients:', error);
        if (error.status === 401) {
          this.router.navigate(['/login']);
          return;
        }
        if (error.status === 500) {
          this.error = 'Server error. Please try again later.';
        } else {
          this.error = 'Failed to load clients. Please try again.';
        }
        this.loading = false;
      }
    });
  }
}
