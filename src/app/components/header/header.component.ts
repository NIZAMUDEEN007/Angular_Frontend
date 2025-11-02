import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserView, Role } from '../../models';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentUser: UserView | null = null;
  Role = Role;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        // sessionStorage.clear();
        // Redirect to login page after successful logout
        this.router.navigate(['/login']);
       
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Even if logout fails on backend, clear local user and redirect
        this.router.navigate(['/login']);
      }
    });
  }
}
