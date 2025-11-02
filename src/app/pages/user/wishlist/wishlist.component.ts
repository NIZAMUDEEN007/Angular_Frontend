import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { ServiceView } from '../../../models';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlist: ServiceView[] = [];
  loading = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadWishlist();
  }

  loadWishlist() {
    this.loading = true;
    this.userService.getWishlist().subscribe({
      next: (services) => {
        this.wishlist = services;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading wishlist:', error);
        // Use fake data for demo
        this.wishlist = [
          {
            id: 1,
            name: 'Deep Tissue Massage',
            description: 'Relaxing deep tissue massage for muscle tension relief',
            price: 120,
            durationInMinutes: 60,
            approvalStatus: 'APPROVED' as any,
            serviceStatus: 'AVAILABLE' as any,
            spaId: 1
          },
          {
            id: 2,
            name: 'Facial Treatment',
            description: 'Rejuvenating facial treatment with premium products',
            price: 80,
            durationInMinutes: 45,
            approvalStatus: 'APPROVED' as any,
            serviceStatus: 'AVAILABLE' as any,
            spaId: 2
          },
          {
            id: 3,
            name: 'Hot Stone Massage',
            description: 'Therapeutic hot stone massage for deep relaxation',
            price: 150,
            durationInMinutes: 90,
            approvalStatus: 'APPROVED' as any,
            serviceStatus: 'AVAILABLE' as any,
            spaId: 1
          }
        ];
        this.loading = false;
      }
    });
  }

  removeFromWishlist(serviceId: number) {
    this.userService.removeFromWishlist(serviceId).subscribe({
      next: () => {
        this.loadWishlist(); // Reload wishlist
      },
      error: (error) => {
        console.error('Error removing from wishlist:', error);
      }
    });
  }
}
