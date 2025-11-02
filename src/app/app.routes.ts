import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { Role } from './models/enums';

// Import all your page components here...
import { HomeComponent } from './pages/home/home.component';
import { SpaDetailComponent } from './pages/spa-detail/spa-detail.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/user/profile/profile.component';
import { MyBookingsComponent } from './pages/user/my-bookings/my-bookings.component';
import { WishlistComponent } from './pages/user/wishlist/wishlist.component';
import { MembershipComponent } from './pages/user/membership/membership.component';
import { BookServiceComponent } from './pages/user/book-service/book-service.component';
import { BookingPaymentComponent } from './pages/user/booking-payment/booking-payment.component';
import { ClientDashboardComponent } from './pages/client/dashboard/dashboard.component';
import { ManageSpaComponent } from './pages/client/manage-spa/manage-spa.component';
import { ManageBookingsComponent } from './pages/client/manage-bookings/manage-bookings.component';
import { AdminDashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { SpaApprovalComponent } from './pages/admin/spa-approval/spa-approval.component';
import { ServiceApprovalComponent } from './pages/admin/service-approval/service-approval.component';
import { ClientListComponent } from './pages/admin/client-list/client-list.component';
import { MembershipMgmtComponent } from './pages/admin/membership-mgmt/membership-mgmt.component';
import { UserFilterComponent } from './pages/admin/user-filter/user-filter.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [
  // Public Routes
  { path: '', component: HomeComponent },
  { path: 'spa/:id', component: SpaDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // --- USER Routes ---
  { 
    path: 'user', 
    canActivate: [authGuard, roleGuard(Role.USER)],
    children: [
      { path: 'profile', component: ProfileComponent },
      { path: 'my-bookings', component: MyBookingsComponent },
      { path: 'wishlist', component: WishlistComponent },
      { path: 'membership', component: MembershipComponent },
      { path: 'book/:serviceId', component: BookServiceComponent },
      { path: 'bookings/:bookingId/payment', component: BookingPaymentComponent }
    ]
  },
  
  // --- CLIENT Routes ---
  {
    path: 'client',
    canActivate: [authGuard, roleGuard(Role.CLIENT)],
    children: [
      { path: 'dashboard', component: ClientDashboardComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'spa/:id/manage', component: ManageSpaComponent },
      { path: 'spa/:id/bookings', component: ManageBookingsComponent }
    ]
  },

  // --- ADMIN Routes ---
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard(Role.ADMIN)],
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'spa-approvals', component: SpaApprovalComponent },
      { path: 'service-approvals', component: ServiceApprovalComponent },
      { path: 'clients', component: ClientListComponent },
      { path: 'memberships', component: MembershipMgmtComponent },
      { path: 'users', component: UserFilterComponent }
    ]
  },

  // Fallback route
  { path: '**', component: NotFoundComponent }
];
