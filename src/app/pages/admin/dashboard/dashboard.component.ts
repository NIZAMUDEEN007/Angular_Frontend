import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AdminService } from '../../../services/admin.service';
import { UserView, MembershipStatus, SpaView, ServiceView, ApprovalStatus, MembershipView } from '../../../models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  currentUser: UserView | null = null;
  stats = {
    totalUsers: 0,
    totalSpas: 0,
    pendingApprovals: 0,
    totalBookings: 0
  };
  spas: SpaView[] = [];
  memberships: MembershipView[] = [];
  membershipSubscribers: { [membershipId: number]: UserView[] } = {};
  expandedMemberships: Set<number> = new Set();
  loadingMemberships = false;
  loading = false;
  error = '';
  ApprovalStatus = ApprovalStatus;
  MembershipStatus = MembershipStatus;

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadDashboardStats();
        this.loadMembershipsWithSubscribers();
      } else {
        // User not authenticated, redirect to login
        this.router.navigate(['/login']);
      }
    });
  }

  loadDashboardStats() {
    this.loading = true;
    this.error = '';

    // Load all clients to get total count
    this.adminService.getAllClients().subscribe({
      next: (clients) => {
        this.stats.totalUsers = clients.length;
        this.loadSpasAndServices();
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
        if (error.status === 401) {
          this.router.navigate(['/login']);
          return;
        }
        // Leave stats as zeroed if backend fails
        this.loadSpasAndServices();
      }
    });
  }

  loadSpasAndServices() {
    this.adminService.getAllSpas().subscribe({
      next: (spas) => {
        this.spas = spas;
        this.stats.totalSpas = spas.length;
        const pendingSpas = spas.filter(spa => spa.approvalStatus === ApprovalStatus.PENDING).length;

        // Also load services to count their pending approvals
        this.adminService.getAllServices().subscribe({
          next: (services: ServiceView[]) => {
            const pendingServices = services.filter(s => s.approvalStatus === ApprovalStatus.PENDING).length;
            this.stats.pendingApprovals = pendingSpas + pendingServices;
            // Note: totalBookings requires a backend endpoint; leaving as 0 until provided
            this.loading = false;
          },
          error: (error) => {
            console.error('Error loading services:', error);
            this.stats.pendingApprovals = pendingSpas;
            this.loading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error loading spas:', error);
        if (error.status === 401) {
          this.router.navigate(['/login']);
          return;
        }
        this.error = 'Failed to load spas. Please try again.';
        this.loading = false;
      }
    });
  }

  loadMembershipsWithSubscribers() {
    this.loadingMemberships = true;
    this.adminService.getAllMemberships().subscribe({
      next: (memberships) => {
        this.memberships = memberships;
        // Load subscribers for each membership
        memberships.forEach(membership => {
          this.loadSubscribersForMembership(membership.id);
        });
        this.loadingMemberships = false;
      },
      error: (error) => {
        console.error('Error loading memberships:', error);
        this.memberships = [];
        this.loadingMemberships = false;
      }
    });
  }

  loadSubscribersForMembership(membershipId: number) {
    this.adminService.getUsersByMembership(membershipId).subscribe({
      next: (users) => {
        this.membershipSubscribers[membershipId] = users;
      },
      error: (error) => {
        console.error(`Error loading subscribers for membership ${membershipId}:`, error);
        this.membershipSubscribers[membershipId] = [];
      }
    });
  }

  toggleMembershipExpansion(membershipId: number) {
    if (this.expandedMemberships.has(membershipId)) {
      this.expandedMemberships.delete(membershipId);
    } else {
      this.expandedMemberships.add(membershipId);
    }
  }

  isMembershipExpanded(membershipId: number): boolean {
    return this.expandedMemberships.has(membershipId);
  }

  getSubscriberCount(membershipId: number): number {
    return this.membershipSubscribers[membershipId]?.length || 0;
  }
}