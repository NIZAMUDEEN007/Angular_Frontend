import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PublicService } from '../../services/public.service';
import { SpaDetailView, ServiceView } from '../../models';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-spa-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './spa-detail.component.html',
  styleUrls: ['./spa-detail.component.css']
})
export class SpaDetailComponent implements OnInit {
  spa: SpaDetailView | null = null;
  loading = false;
  wishlistedServiceIds = new Set<number>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private publicService: PublicService,
    private userService: UserService
  ) {}

  ngOnInit() {
    const spaId = this.route.snapshot.paramMap.get('id');
    if (spaId) {
      this.loadSpa(+spaId);
    }
    // Preload wishlist so hearts can reflect current state
    this.userService.getWishlist().subscribe({
      next: (services) => {
        services.forEach(s => this.wishlistedServiceIds.add(s.id));
      },
      error: (err) => {
        console.error('Failed to load wishlist for heart state:', err);
      }
    });
  }

  loadSpa(spaId: number) {
    this.loading = true;
    this.publicService.getSpaById(spaId).subscribe({
      next: (spa) => {
        this.spa = spa;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading spa:', error);
        this.loading = false;
      }
    });
  }

  addToWishlist(serviceId: number) {
    this.userService.addToWishlist(serviceId).subscribe({
      next: () => {
        this.wishlistedServiceIds.add(serviceId);
      },
      error: (error) => {
        console.error('Failed to add to wishlist:', error);
      }
    });
  }

  removeFromWishlist(serviceId: number) {
    this.userService.removeFromWishlist(serviceId).subscribe({
      next: () => {
        this.wishlistedServiceIds.delete(serviceId);
      },
      error: (error) => {
        console.error('Failed to remove from wishlist:', error);
      }
    });
  }

  toggleWishlist(serviceId: number) {
    if (this.wishlistedServiceIds.has(serviceId)) {
      this.removeFromWishlist(serviceId);
    } else {
      this.addToWishlist(serviceId);
    }
  }

  goToBooking(serviceId: number) {
    this.router.navigate(['/user/book', serviceId]);
  }
}
