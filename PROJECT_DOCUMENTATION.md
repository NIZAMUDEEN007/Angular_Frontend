# Spa Booking System - Complete Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Application Flow](#application-flow)
5. [Routing System](#routing-system)
6. [Components](#components)
7. [Services](#services)
8. [Models & Data Structures](#models--data-structures)
9. [Guards & Security](#guards--security)
10. [API Integration](#api-integration)
11. [Key Features](#key-features)

---

## Project Overview

This is a **Spa Booking System** built with Angular 17, designed to manage spa services, bookings, memberships, and user interactions. The system supports three distinct user roles:

- **USER**: Regular customers who can browse spas, book services, manage memberships, and track bookings
- **CLIENT**: Spa owners who can create spas, manage services, and handle booking requests
- **ADMIN**: System administrators who approve spas/services, manage memberships, and oversee users

### Application Type
- **Framework**: Angular 17.3.0 (Standalone Components)
- **Language**: TypeScript 5.4.2
- **Architecture**: Single Page Application (SPA)
- **Backend API**: RESTful API running on `http://localhost:8080`

---

## Technology Stack

### Core Dependencies
- **@angular/core**: ^17.3.0 - Angular framework core
- **@angular/router**: ^17.3.0 - Client-side routing
- **@angular/common**: ^17.3.0 - Common Angular utilities
- **@angular/forms**: ^17.3.0 - Form handling and validation
- **rxjs**: ~7.8.0 - Reactive programming library
- **zone.js**: ~0.14.3 - Angular change detection

### UI Libraries
- **Bootstrap 5.3.0** (via CDN) - CSS framework for styling
- **Bootstrap Icons 1.11.1** (via CDN) - Icon library

### Development Tools
- **@angular/cli**: ^17.3.9 - Angular command-line interface
- **TypeScript**: ~5.4.2 - Type-safe JavaScript
- **Karma & Jasmine**: Testing framework

---

## Project Structure

```
fontend/
├── src/
│   ├── app/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── header/          # Navigation header
│   │   │   ├── booking-modal/   # Booking modal component
│   │   │   ├── payment-modal/   # Payment modal component
│   │   │   ├── review-form/     # Review form component
│   │   │   └── not-found/       # 404 error page
│   │   │
│   │   ├── pages/               # Route components (page views)
│   │   │   ├── home/            # Landing page
│   │   │   ├── login/           # Login page
│   │   │   ├── register/        # Registration page
│   │   │   ├── spa-detail/      # Spa details page
│   │   │   ├── user/            # User role pages
│   │   │   │   ├── profile/
│   │   │   │   ├── my-bookings/
│   │   │   │   ├── wishlist/
│   │   │   │   ├── membership/
│   │   │   │   ├── book-service/
│   │   │   │   └── booking-payment/
│   │   │   ├── client/          # Client role pages
│   │   │   │   ├── dashboard/
│   │   │   │   ├── manage-spa/
│   │   │   │   └── manage-bookings/
│   │   │   └── admin/           # Admin role pages
│   │   │       ├── dashboard/
│   │   │       ├── spa-approval/
│   │   │       ├── service-approval/
│   │   │       ├── client-list/
│   │   │       ├── membership-mgmt/
│   │   │       └── user-filter/
│   │   │
│   │   ├── services/            # Business logic & API calls
│   │   │   ├── auth.service.ts
│   │   │   ├── public.service.ts
│   │   │   ├── user.service.ts
│   │   │   ├── client.service.ts
│   │   │   └── admin.service.ts
│   │   │
│   │   ├── models/              # TypeScript interfaces & enums
│   │   │   ├── enums.ts
│   │   │   ├── user.model.ts
│   │   │   ├── spa.model.ts
│   │   │   ├── service.model.ts
│   │   │   ├── booking.model.ts
│   │   │   ├── membership.model.ts
│   │   │   ├── api.model.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── guards/              # Route guards for authentication
│   │   │   ├── auth.guard.ts
│   │   │   └── role.guard.ts
│   │   │
│   │   ├── app.ts               # Root component
│   │   ├── app.html             # Root template
│   │   ├── app.css              # Root styles
│   │   ├── app.config.ts        # Application configuration
│   │   └── app.routes.ts        # Routing configuration
│   │
│   ├── index.html               # Main HTML entry point
│   ├── main.ts                  # Application bootstrap
│   └── styles.css               # Global styles
│
├── angular.json                 # Angular CLI configuration
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
└── tsconfig.app.json            # App-specific TypeScript config
```

---

## Application Flow

### 1. Application Initialization

1. **Entry Point** (`src/main.ts`):
   - Bootstraps the Angular application
   - Loads `app.config.ts` for configuration
   - Initializes the root component (`App`)

2. **Root Component** (`src/app/app.ts`):
   - Renders the header component
   - Provides router outlet for page components
   - Sets application title

3. **Authentication Check**:
   - `AuthService` automatically checks if user is logged in on initialization
   - Makes GET request to `/api/auth/me` to verify session
   - Updates `currentUser` observable based on response
   - Guards wait for initialization before allowing route access

### 2. User Journey Flows

#### Public User Flow
```
Home Page → Browse Spas → View Spa Details → Login/Register
```

#### Registered User Flow
```
Login → User Dashboard → Browse Services → Book Service → 
Check Availability → Create Booking → Payment → Confirmation
```

#### Client Flow
```
Register as Client → Create Spa → Add Services → Wait for Approval →
Manage Bookings → Confirm/Decline Bookings → Manage Service Status
```

#### Admin Flow
```
Login as Admin → Dashboard → Review Pending Approvals →
Approve/Reject Spas & Services → Manage Memberships → 
View Users & Clients
```

### 3. Data Flow

```
Component → Service → HTTP Client → Backend API
                ↓
         Observable/RxJS
                ↓
         Component Updates
```

---

## Routing System

The routing is configured in `src/app/app.routes.ts` using Angular's standalone routing.

### Route Structure

#### Public Routes (No Authentication Required)
```typescript
'/'                    → HomeComponent
'/spa/:id'            → SpaDetailComponent
'/login'              → LoginComponent
'/register'           → RegisterComponent
```

#### User Routes (Requires: Authentication + USER role)
```typescript
'/user/profile'                    → ProfileComponent
'/user/my-bookings'                → MyBookingsComponent
'/user/wishlist'                   → WishlistComponent
'/user/membership'                 → MembershipComponent
'/user/book/:serviceId'            → BookServiceComponent
'/user/bookings/:bookingId/payment' → BookingPaymentComponent
```

#### Client Routes (Requires: Authentication + CLIENT role)
```typescript
'/client/dashboard'           → ClientDashboardComponent
'/client/profile'             → ProfileComponent (shared)
'/client/spa/:id/manage'      → ManageSpaComponent
'/client/spa/:id/bookings'    → ManageBookingsComponent
```

#### Admin Routes (Requires: Authentication + ADMIN role)
```typescript
'/admin/dashboard'        → AdminDashboardComponent
'/admin/spa-approvals'    → SpaApprovalComponent
'/admin/service-approvals' → ServiceApprovalComponent
'/admin/clients'          → ClientListComponent
'/admin/memberships'      → MembershipMgmtComponent
'/admin/users'            → UserFilterComponent
```

#### Fallback Route
```typescript
'**' → NotFoundComponent (404 page)
```

### Route Guards

1. **AuthGuard** (`auth.guard.ts`):
   - Checks if user is authenticated
   - Reads from `AuthService.currentUser` observable
   - Redirects to `/login` if not authenticated
   - Waits for auth initialization before checking

2. **RoleGuard** (`role.guard.ts`):
   - Factory function that returns `CanActivateFn`
   - Checks if user has required role (USER, CLIENT, or ADMIN)
   - Redirects to appropriate dashboard if role mismatch
   - Used in route configuration: `roleGuard(Role.USER)`

### Route Protection Example
```typescript
{
  path: 'user',
  canActivate: [authGuard, roleGuard(Role.USER)],
  children: [...]
}
```

---

## Components

### Shared Components (`src/app/components/`)

#### 1. HeaderComponent (`components/header/`)
- **Purpose**: Main navigation bar
- **Features**:
  - Displays user information
  - Role-based menu items
  - Logout functionality
  - Conditional rendering based on authentication state
- **Dependencies**: `AuthService`, `Router`
- **Template**: `header.component.html`
- **Styles**: `header.component.css`

#### 2. NotFoundComponent (`components/not-found/`)
- **Purpose**: 404 error page
- **Usage**: Fallback route for invalid URLs
- **Features**: User-friendly error message with navigation options

#### 3. BookingModalComponent (`components/booking-modal/`)
- **Purpose**: Modal for creating bookings
- **Usage**: Reusable booking form component

#### 4. PaymentModalComponent (`components/payment-modal/`)
- **Purpose**: Payment processing modal
- **Usage**: Handles payment form and UPI transactions

#### 5. ReviewFormComponent (`components/review-form/`)
- **Purpose**: Form for submitting reviews
- **Usage**: Allows users to review services/spas

---

### Page Components (`src/app/pages/`)

#### Public Pages

##### 1. HomeComponent (`pages/home/`)
- **Route**: `/`
- **Purpose**: Landing page showing all available spas
- **Features**:
  - Lists all approved spas
  - Search functionality
  - Navigation to spa details
- **Services Used**: `PublicService`

##### 2. LoginComponent (`pages/login/`)
- **Route**: `/login`
- **Purpose**: User authentication
- **Features**:
  - Email/password login form
  - Redirects to appropriate dashboard after login
  - Role-based routing (USER → /user/profile, CLIENT → /client/dashboard, ADMIN → /admin/dashboard)
- **Services Used**: `AuthService`

##### 3. RegisterComponent (`pages/register/`)
- **Route**: `/register`
- **Purpose**: New user registration
- **Features**:
  - Registration form (email, password, name, phone)
  - Role selection (USER or CLIENT)
  - Redirects to login after successful registration
- **Services Used**: `AuthService`

##### 4. SpaDetailComponent (`pages/spa-detail/`)
- **Route**: `/spa/:id`
- **Purpose**: Display spa information and services
- **Features**:
  - Shows spa details (name, address, description)
  - Lists all services for the spa
  - Navigation to booking flow
- **Services Used**: `PublicService`

---

#### User Role Pages (`pages/user/`)

##### 1. ProfileComponent (`pages/user/profile/`)
- **Route**: `/user/profile`
- **Purpose**: User profile management
- **Features**:
  - View and edit profile information
  - Update name, phone number
- **Services Used**: `UserService`

##### 2. MyBookingsComponent (`pages/user/my-bookings/`)
- **Route**: `/user/my-bookings`
- **Purpose**: View all user bookings
- **Features**:
  - List of past and upcoming bookings
  - Booking status tracking
  - Cancel booking functionality
  - Payment status display
- **Services Used**: `UserService`

##### 3. WishlistComponent (`pages/user/wishlist/`)
- **Route**: `/user/wishlist`
- **Purpose**: Manage wishlist
- **Features**:
  - View saved services
  - Add/remove services from wishlist
  - Quick booking from wishlist
- **Services Used**: `UserService`

##### 4. MembershipComponent (`pages/user/membership/`)
- **Route**: `/user/membership`
- **Purpose**: Membership management
- **Features**:
  - View available memberships
  - Subscribe to membership plans
  - View current membership status
  - Cancel membership
- **Services Used**: `UserService`

##### 5. BookServiceComponent (`pages/user/book-service/`)
- **Route**: `/user/book/:serviceId`
- **Purpose**: Service booking form
- **Features**:
  - Select booking date and time
  - Check availability
  - Create booking request
  - Navigate to payment
- **Services Used**: `UserService`, `PublicService`

##### 6. BookingPaymentComponent (`pages/user/booking-payment/`)
- **Route**: `/user/bookings/:bookingId/payment`
- **Purpose**: Payment processing for bookings
- **Features**:
  - Display booking details
  - Payment form (UPI details)
  - Process payment
  - Confirm payment completion
- **Services Used**: `UserService`

---

#### Client Role Pages (`pages/client/`)

##### 1. ClientDashboardComponent (`pages/client/dashboard/`)
- **Route**: `/client/dashboard`
- **Purpose**: Client overview dashboard
- **Features**:
  - View owned spas
  - Recent bookings summary
  - Quick actions
- **Services Used**: `ClientService`

##### 2. ManageSpaComponent (`pages/client/manage-spa/`)
- **Route**: `/client/spa/:id/manage`
- **Purpose**: Spa management
- **Features**:
  - View spa details
  - Add new services
  - Edit spa information
  - Toggle service availability
- **Services Used**: `ClientService`

##### 3. ManageBookingsComponent (`pages/client/manage-bookings/`)
- **Route**: `/client/spa/:id/bookings`
- **Purpose**: Booking management for spa
- **Features**:
  - View all bookings for spa
  - Filter bookings by status
  - Confirm or decline bookings
  - View booking details
- **Services Used**: `ClientService`

---

#### Admin Role Pages (`pages/admin/`)

##### 1. AdminDashboardComponent (`pages/admin/dashboard/`)
- **Route**: `/admin/dashboard`
- **Purpose**: Administrative overview
- **Features**:
  - Statistics and metrics
  - Pending approvals count
  - Recent activity
- **Services Used**: `AdminService`

##### 2. SpaApprovalComponent (`pages/admin/spa-approval/`)
- **Route**: `/admin/spa-approvals`
- **Purpose**: Approve/reject spa registrations
- **Features**:
  - List of pending spas
  - View spa details
  - Approve or reject spas
- **Services Used**: `AdminService`

##### 3. ServiceApprovalComponent (`pages/admin/service-approval/`)
- **Route**: `/admin/service-approvals`
- **Purpose**: Approve/reject service registrations
- **Features**:
  - List of pending services
  - View service details
  - Approve or reject services
- **Services Used**: `AdminService`

##### 4. ClientListComponent (`pages/admin/client-list/`)
- **Route**: `/admin/clients`
- **Purpose**: Manage client accounts
- **Features**:
  - List all registered clients
  - View client details
  - Client management actions
- **Services Used**: `AdminService`

##### 5. MembershipMgmtComponent (`pages/admin/membership-mgmt/`)
- **Route**: `/admin/memberships`
- **Purpose**: Membership plan management
- **Features**:
  - Create new membership plans
  - Edit existing plans
  - Delete plans
  - View all plans
- **Services Used**: `AdminService`

##### 6. UserFilterComponent (`pages/admin/user-filter/`)
- **Route**: `/admin/users`
- **Purpose**: Filter and view users
- **Features**:
  - Filter users by membership status
  - Filter users by membership plan
  - View user details
- **Services Used**: `AdminService`

---

## Services

All services are provided in the root injector (`providedIn: 'root'`) and use Angular's HttpClient for API communication.

### 1. AuthService (`services/auth.service.ts`)
- **Base URL**: `http://localhost:8080/api/auth`
- **Responsibilities**:
  - User authentication (login/logout)
  - User registration
  - Session management
  - Current user state management
- **Key Methods**:
  - `login(data: LoginRequest): Observable<UserView>` - POST `/login`
  - `register(data: RegistrationRequest): Observable<UserView>` - POST `/register`
  - `logout(): Observable<any>` - POST `/logout`
  - `checkMe(): Observable<UserView>` - GET `/me`
  - `getCurrentUser(): UserView | null` - Get cached user
  - `refreshCurrentUser(): Observable<UserView>` - Refresh user data
- **State Management**:
  - `currentUser: Observable<UserView | null>` - Observable of current user
  - `initialized$: Observable<boolean>` - Auth initialization status

### 2. PublicService (`services/public.service.ts`)
- **Base URL**: `http://localhost:8080/api/public`
- **Responsibilities**:
  - Public spa browsing
  - Spa search functionality
- **Key Methods**:
  - `getAllSpas(): Observable<SpaView[]>` - GET `/spas`
  - `searchSpas(name: string): Observable<SpaView[]>` - GET `/spas/search`
  - `getSpaById(spaId: number): Observable<SpaDetailView>` - GET `/spas/{id}`

### 3. UserService (`services/user.service.ts`)
- **Base URL**: `http://localhost:8080/api/user`
- **Responsibilities**:
  - User profile management
  - Booking management
  - Wishlist operations
  - Membership subscriptions
  - Payment processing
- **Key Methods**:
  - `updateProfile(data: ProfileUpdateRequest): Observable<UserView>` - PUT `/api/profile`
  - `createBooking(data: BookingRequest): Observable<BookingView>` - POST `/bookings`
  - `getMyBookings(): Observable<BookingView[]>` - GET `/bookings`
  - `cancelBooking(bookingId: number): Observable<BookingView>` - PUT `/bookings/{id}/cancel`
  - `checkAvailability(serviceId: number, date: string): Observable<AvailabilityResponse>` - POST `/services/{id}/availability`
  - `addToWishlist(serviceId: number): Observable<void>` - POST `/wishlist/service/{id}`
  - `getWishlist(): Observable<ServiceView[]>` - GET `/wishlist`
  - `removeFromWishlist(serviceId: number): Observable<void>` - DELETE `/wishlist/service/{id}`
  - `subscribeToMembership(membershipId: number): Observable<UserView>` - POST `/membership/subscribe`
  - `cancelMembership(): Observable<UserView>` - POST `/membership/cancel`
  - `getAllMemberships(): Observable<MembershipView[]>` - GET `/api/common/memberships`
  - `processPayment(paymentData: PaymentRequest): Observable<string>` - Mock payment
  - `confirmBookingPayment(bookingId: number): Observable<BookingView>` - POST `/bookings/{id}/confirm-payment`

### 4. ClientService (`services/client.service.ts`)
- **Base URL**: `http://localhost:8080/api/client`
- **Responsibilities**:
  - Spa creation and management
  - Service management
  - Booking management for owned spas
- **Key Methods**:
  - `addSpa(data: SpaCreateRequest): Observable<SpaView>` - POST `/spas`
  - `addService(spaId: number, data: ServiceCreateRequest): Observable<ServiceView>` - POST `/spas/{id}/services`
  - `updateServiceStatus(serviceId: number, status: ServiceStatus): Observable<ServiceView>` - PUT `/services/{id}/status`
  - `updateBookingStatus(bookingId: number, status: BookingStatus): Observable<BookingView>` - PUT `/bookings/{id}/status`
  - `getBookingsForSpa(spaId: number): Observable<BookingView[]>` - GET `/spas/{id}/bookings`
  - `getFilteredBookings(spaId: number, status: BookingStatus): Observable<BookingView[]>` - GET `/spas/{id}/bookings/filter`
  - `getMySpas(): Observable<SpaView[]>` - GET `/spas`
  - `getSpaServices(spaId: number): Observable<ServiceView[]>` - GET `/spas/{id}/services`

### 5. AdminService (`services/admin.service.ts`)
- **Base URL**: `http://localhost:8080/api/admin`
- **Responsibilities**:
  - Spa and service approvals
  - Client management
  - Membership management
  - User filtering and management
- **Key Methods**:
  - `approveSpa(spaId: number, status: ApprovalStatus): Observable<SpaView>` - PUT `/spas/{id}/approve`
  - `approveService(serviceId: number, status: ApprovalStatus): Observable<ServiceView>` - PUT `/services/{id}/approve`
  - `getAllClients(): Observable<UserView[]>` - GET `/clients`
  - `createMembership(data: MembershipCreateRequest): Observable<MembershipView>` - POST `/memberships`
  - `getAllMemberships(): Observable<MembershipView[]>` - GET `/memberships`
  - `deleteMembership(membershipId: number): Observable<void>` - DELETE `/memberships/{id}`
  - `getUsersByStatus(status: MembershipStatus): Observable<UserView[]>` - GET `/users/filter/status`
  - `getUsersByMembership(membershipId: number): Observable<UserView[]>` - GET `/users/filter/membership`
  - `getAllSpas(status?: ApprovalStatus): Observable<SpaView[]>` - GET `/spas`
  - `getAllServices(status?: ApprovalStatus): Observable<ServiceView[]>` - GET `/services`

---

## Models & Data Structures

All models are defined in `src/app/models/` and exported through `index.ts`.

### Enums (`models/enums.ts`)

```typescript
enum Role {
  USER = 'USER',
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN'
}

enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

enum ServiceStatus {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE'
}

enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED_BY_USER = 'CANCELLED_BY_USER',
  DECLINED_BY_CLIENT = 'DECLINED_BY_CLIENT'
}

enum MembershipStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  INACTIVE = 'INACTIVE'
}

enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}
```

### User Models (`models/user.model.ts`)

```typescript
interface UserView {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: Role;
  membershipName: string | null;
  membershipStatus: MembershipStatus | null;
}

interface LoginRequest {
  email: string;
  password?: string;
}

interface RegistrationRequest {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: Role;
}

interface ProfileUpdateRequest {
  firstName: string;
  lastName: string;
  phone: string;
}
```

### Spa Models (`models/spa.model.ts`)

```typescript
interface SpaView {
  id: number;
  name: string;
  address: string;
  description: string;
  approvalStatus: ApprovalStatus;
  ownerId: number;
}

interface SpaDetailView extends SpaView {
  services: ServiceView[];
}

interface SpaCreateRequest {
  name: string;
  address: string;
  description: string;
}
```

### Service Models (`models/service.model.ts`)

```typescript
interface ServiceView {
  id: number;
  name: string;
  description: string;
  price: number;
  durationInMinutes: number;
  approvalStatus: ApprovalStatus;
  serviceStatus: ServiceStatus;
  spaId: number;
}

interface ServiceCreateRequest {
  name: string;
  description: string;
  price: number;
  durationInMinutes: number;
}
```

### Booking Models (`models/booking.model.ts`)

```typescript
interface BookingView {
  id: number;
  bookingTime: string; // ISO date string
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  customerId: number;
  customerName: string;
  spaId: number;
  spaName: string;
  serviceId: number;
  serviceName: string;
  originalPrice: number;
  finalPrice: number;
}

interface BookingRequest {
  serviceId: number;
  bookingTime: string; // ISO date string
}

interface AvailabilityRequest {
  date: string; // 'YYYY-MM-DD'
}

interface AvailabilityResponse {
  availableSlots: string[]; // 'HH:mm'
}

interface PaymentRequest {
  fromUpiId: string;
  toUpiId: string;
  toAccountNumber: string;
  amount: number;
  remarks?: string;
}
```

### Membership Models (`models/membership.model.ts`)

```typescript
interface MembershipView {
  id: number;
  name: string;
  description: string;
  pricePerMonth: number;
  discountPercentage: number;
}

interface MembershipCreateRequest {
  name: string;
  description: string;
  pricePerMonth: number;
  discountPercentage: number;
}

interface MembershipSubscribeRequest {
  membershipId: number;
}
```

---

## Guards & Security

### Authentication Guard (`guards/auth.guard.ts`)

**Purpose**: Ensures only authenticated users can access protected routes.

**Implementation**:
- Implements `CanActivate` interface
- Checks `AuthService.currentUser` observable
- Waits for auth initialization before proceeding
- Redirects to `/login` if user is not authenticated
- Returns `Observable<boolean>`

**Usage**:
```typescript
{ path: 'protected', canActivate: [authGuard], component: ... }
```

### Role Guard (`guards/role.guard.ts`)

**Purpose**: Ensures users have the required role to access specific routes.

**Implementation**:
- Factory function that returns `CanActivateFn`
- Checks user's role against required role
- Redirects to appropriate dashboard if role mismatch:
  - USER → `/user/profile`
  - CLIENT → `/client/dashboard`
  - ADMIN → `/admin/dashboard`
- Redirects to `/login` if not authenticated

**Usage**:
```typescript
{ path: 'admin', canActivate: [authGuard, roleGuard(Role.ADMIN)], ... }
```

### Security Features

1. **Cookie-based Authentication**: All API calls use `withCredentials: true` for session cookies
2. **Route Protection**: Guards prevent unauthorized access
3. **Role-based Access Control**: Different routes for different user roles
4. **Session Persistence**: AuthService checks session on initialization

---

## API Integration

### Base URLs
- **Auth API**: `http://localhost:8080/api/auth`
- **Public API**: `http://localhost:8080/api/public`
- **User API**: `http://localhost:8080/api/user`
- **Client API**: `http://localhost:8080/api/client`
- **Admin API**: `http://localhost:8080/api/admin`
- **Common API**: `http://localhost:8080/api/common`

### HTTP Client Configuration

All HTTP requests include:
- `withCredentials: true` - For cookie-based authentication
- Proper Content-Type headers (handled by Angular HttpClient)
- Error handling in components via RxJS operators

### Request/Response Patterns

**GET Requests**: Return typed observables (e.g., `Observable<UserView[]>`)
**POST/PUT Requests**: Accept typed request bodies and return typed responses
**DELETE Requests**: Return `Observable<void>` for successful deletions

---

## Key Features

### User Features
1. ✅ Browse and search spas
2. ✅ View spa details and services
3. ✅ Create service bookings
4. ✅ Check service availability
5. ✅ Manage bookings (view, cancel)
6. ✅ Wishlist management
7. ✅ Membership subscription
8. ✅ Payment processing
9. ✅ Profile management

### Client Features
1. ✅ Register as spa owner
2. ✅ Create spa profiles
3. ✅ Add services to spas
4. ✅ Manage service availability
5. ✅ View and manage bookings
6. ✅ Confirm/decline bookings
7. ✅ Filter bookings by status

### Admin Features
1. ✅ Approve/reject spa registrations
2. ✅ Approve/reject service registrations
3. ✅ Manage membership plans
4. ✅ View and filter users
5. ✅ View client list
6. ✅ Administrative dashboard

### System Features
1. ✅ Role-based authentication
2. ✅ Protected routes with guards
3. ✅ Session management
4. ✅ Responsive UI with Bootstrap
5. ✅ Error handling and validation
6. ✅ Type-safe TypeScript implementation

---

## Configuration Files

### angular.json
- **Purpose**: Angular CLI workspace configuration
- **Key Settings**:
  - Output path: `dist/spazz`
  - Source root: `src`
  - Browser entry: `src/main.ts`
  - Assets: `src/favicon.ico`, `src/assets`
  - Styles: `src/styles.css`

### package.json
- **Project Name**: `spazz`
- **Version**: `0.0.0`
- **Scripts**:
  - `ng serve` - Start development server
  - `ng build` - Build for production
  - `ng test` - Run tests

### tsconfig.json
- **Target**: ES2022
- **Module**: ES2022
- **Strict Mode**: Enabled
- **Decorators**: Enabled (for Angular)

### app.config.ts
- **Purpose**: Application-level configuration
- **Providers**:
  - Router configuration
  - HTTP client configuration
  - Zone.js change detection

---

## Component Architecture

### Standalone Components
All components are **standalone** (Angular 17 feature), meaning:
- No NgModule required
- Components import dependencies directly
- Better tree-shaking and performance
- Simplified module structure

### Component Pattern
Each component consists of:
- **`.component.ts`**: TypeScript class with logic
- **`.component.html`**: Template markup
- **`.component.css`**: Component-specific styles

### Common Imports
Most components import:
- `CommonModule` - For `*ngIf`, `*ngFor`, pipes
- `RouterModule` - For routing directives
- `FormsModule` - For form handling
- `HttpClient` - Via services, not directly

---

## State Management

### Current Approach
- **Observable-based**: RxJS observables for reactive state
- **Service-level State**: Services maintain state (e.g., `AuthService.currentUser`)
- **Component-level State**: Components manage local UI state

### Key Observables
- `AuthService.currentUser`: Current authenticated user
- `AuthService.initialized$`: Authentication initialization status

### Data Flow
1. User action → Component method
2. Component calls Service method
3. Service makes HTTP request
4. Response updates observable
5. Component subscribes and updates UI

---

## Styling

### Global Styles (`src/styles.css`)
- Applied application-wide
- Bootstrap 5.3.0 loaded via CDN in `index.html`
- Bootstrap Icons 1.11.1 for icons

### Component Styles
- Each component has its own CSS file
- Scoped to component by Angular
- Can use global Bootstrap classes

---

## Error Handling

### Service Level
- HTTP errors handled via RxJS `catchError`
- Console logging for debugging
- Observable error streams

### Component Level
- Subscribe with error callbacks
- User-friendly error messages
- Loading states during API calls

---

## Development Workflow

### Running the Application
```bash
npm start          # or ng serve
# Starts dev server on http://localhost:4200
```

### Building for Production
```bash
npm run build      # or ng build
# Outputs to dist/spazz/
```

### Testing
```bash
npm test           # or ng test
# Runs Karma/Jasmine tests
```

---

## Backend Integration

### Expected Backend Endpoints

The frontend expects a RESTful API running on `http://localhost:8080` with the following structure:

- `/api/auth/*` - Authentication endpoints
- `/api/public/*` - Public spa browsing
- `/api/user/*` - User-specific operations
- `/api/client/*` - Client (spa owner) operations
- `/api/admin/*` - Administrative operations
- `/api/common/*` - Shared endpoints
- `/api/profile` - Profile management (common)

### Authentication
- Uses cookie-based sessions
- `withCredentials: true` on all requests
- Session validation via `/api/auth/me`

---

## Future Improvements

Potential enhancements:
1. Add interceptors for global error handling
2. Implement token-based auth (JWT) as alternative
3. Add loading indicators globally
4. Implement real-time updates (WebSocket)
5. Add unit and e2e tests
6. Implement form validation libraries
7. Add state management library (NgRx/Akita)
8. Implement lazy loading for routes
9. Add internationalization (i18n)
10. Improve error messages and user feedback

---

## Conclusion

This Angular application provides a comprehensive spa booking system with role-based access control, secure authentication, and a well-structured component architecture. The use of standalone components, observables, and TypeScript ensures type safety and maintainability throughout the codebase.

---

**Documentation Version**: 1.0
**Last Updated**: 2024
**Angular Version**: 17.3.0

