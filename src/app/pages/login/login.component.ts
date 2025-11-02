import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginData: LoginRequest = {
    email: '',
    password: ''
  };
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Redirect if already logged in
    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.redirectBasedOnRole(user.role);
      }
    });
  }

  onSubmit() {
    this.loading = true;
    this.error = '';

    this.authService.login(this.loginData).subscribe({
      next: (user) => {
        this.loading = false;
        this.redirectBasedOnRole(user.role);
        sessionStorage.setItem('id' , user.id.toString());
        sessionStorage.setItem('email',user.email);
        sessionStorage.setItem('firstName',user.firstName);
        sessionStorage.setItem('lastName',user.lastName);
        sessionStorage.setItem('phone', user.phone);
        sessionStorage.setItem('role', user.role);
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Invalid email or password';
        console.error('Login error:', error);
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
