import { Component, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegistrationRequest, Role } from '../../models';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registrationData: RegistrationRequest = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: Role.USER
  };
  loading = false;
  error = '';
  message='';
  Role = Role;
  justRegistered=false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // // Redirect if already logged in
    // this.authService.currentUser.subscribe(user => {
    //   if (user && !this.justRegistered) {
    //     this.redirectBasedOnRole(user.role);
    //   }
    // });
  }

  onSubmit() {
    this.loading = true;
    this.error = '';
    this.message = '';
  
    this.authService.register(this.registrationData).subscribe({
      next: (response) => {
        // If backend auto-logged in, log out so user can log in fresh
        this.authService.logout().subscribe({
          next: () => {
            this.loading = false;
            this.message = 'Registered successfully! Redirecting to login...';
            this.cdr.detectChanges();
  
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          },
          error: () => {
            // Even if logout fails, proceed with navigation
            this.loading = false;
            this.message = 'Registered successfully! Redirecting to login...';
            this.cdr.detectChanges();
  
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          }
        });
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Registration failed. Please try again.';
        console.error('Registration error:', error);
        this.cdr.detectChanges();
      }
    });
  }

  private redirectBasedOnRole(role: string) {
    switch (role) {
      case 'USER':
        this.router.navigate(['/user/profile']);
        break;
      case 'CLIENT':
        this.router.navigate(['/client/dashboard']);
        break;
      case 'ADMIN':
        this.router.navigate(['/admin/dashboard']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }
}
