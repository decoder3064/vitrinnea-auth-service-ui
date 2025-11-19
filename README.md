# Vitrinnea Auth UI

Next.js 14+ admin UI for Laravel JWT authentication microservice with comprehensive user and group management.

## 📋 Prerequisites

Before you begin, ensure you have:
- **Node.js 18+** installed ([Download here](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Laravel backend** running at `https://vitrinnea-auth.test/api`
- **Git** for cloning the repository

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/decoder3064/vitrinnea-auth-service-ui.git
cd vitrinnea-auth-service-ui
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_API_URL=https://vitrinnea-auth.test/api
```

**Important:** Update the URL to match your Laravel backend API endpoint.

### 4. Run Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### 5. Login

Use your Laravel backend credentials to log in. Only users with admin roles (`super_admin`, `admin_sv`, `admin_gt`) can access the admin panel.

## 🏗️ Production Deployment

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

The production server runs on port 3000 by default.

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com/new)
3. Add environment variable: `NEXT_PUBLIC_API_URL`
4. Deploy

## 📦 Features

- ✅ **JWT Authentication** with automatic token refresh
- ✅ **User Management** - Create, edit, activate/deactivate users
- ✅ **Groups Management** - Custom organizational units with CRUD operations
- ✅ **Role Assignment** - Pre-defined system roles (not editable)
- ✅ **Permissions Display** - View assigned permissions per group (read-only)
- ✅ **Advanced Filtering** - Search by name/email, filter by country and status
- ✅ **Status Management** - Activate/deactivate users with visual badges
- ✅ **Responsive Design** - Mobile-friendly UI with collapsible navigation
- ✅ **Security Hardened** - XSS protection, input validation, secure headers

## 🔑 User Roles

System roles (assigned via backend):
- `super_admin` - Full system access
- `admin_sv` - Admin access (El Salvador)
- `admin_gt` - Admin access (Guatemala)
- `warehouse_manager_sv` - Warehouse manager (El Salvador)
- `warehouse_manager_gt` - Warehouse manager (Guatemala)
- `operations` - Operations staff
- `employee` - Regular employee

## 👥 Admin Panel Access

Users with these roles can access admin features:
- `super_admin`
- `admin_sv`
- `admin_gt`

### Admin Features:
1. **Users Page** (`/admin/users`)
   - Create new users with role and groups
   - Edit existing users
   - Activate/deactivate users
   - Filter by country (SV/GT), status (active/deactivated), search
   - View user roles and assigned groups

2. **Groups Page** (`/admin/roles`)
   - Create custom groups
   - Edit group details (display name, description, active status)
   - Delete groups
   - View assigned permissions (read-only)

## 🔄 Authentication Flow

1. User navigates to `/login`
2. Enters credentials (email & password)
3. JWT token received and stored in localStorage
4. Token automatically attached to all API requests
5. Token auto-refreshes on 401 errors
6. Auto-redirect to login if authentication fails

## 📡 Backend API Integration

The frontend expects these Laravel endpoints:

### Authentication
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user profile
- `POST /auth/logout` - Logout user
- `POST /auth/refresh` - Refresh JWT token

### User Management
- `GET /admin/users` - List users (with pagination)
- `GET /admin/users/:id` - Get single user
- `POST /admin/users` - Create user
- `PUT /admin/users/:id` - Update user
- `DELETE /admin/users/:id` - Deactivate user
- `POST /admin/users/:id/activate` - Activate user

### Groups Management
- `GET /admin/groups` - List all groups
- `GET /admin/groups/:id` - Get group with permissions
- `POST /admin/groups` - Create group
- `PUT /admin/groups/:id` - Update group
- `DELETE /admin/groups/:id` - Delete group

**Note:** Permissions are read-only. They cannot be assigned/removed through this UI.

## 📁 Project Structure

```
app/
├── login/              # Login page
├── profile/            # User profile page
├── admin/              # Admin panel
│   ├── layout.tsx      # Admin layout with sidebar
│   ├── users/          # User management (CRUD + filters)
│   └── roles/          # Groups management (CRUD + permissions view)
├── layout.tsx          # Root layout with AuthProvider
└── page.tsx            # Home page (redirects to profile)

components/
├── auth/
│   ├── AuthGuard.tsx         # Route protection wrapper
│   └── ProtectedRoute.tsx    # Legacy route protection
└── layout/
    ├── Navbar.tsx            # Top navigation (responsive)
    └── Sidebar.tsx           # Admin sidebar (collapsible on mobile)

contexts/
└── AuthContext.tsx     # Global auth state management

lib/
└── api.ts              # Axios API client with interceptors

types/
├── auth.ts             # Auth & Role types
└── user.ts             # User types
```

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload

# Production
npm run build        # Build optimized production bundle
npm start            # Run production server

# Code Quality
npm run lint         # Run ESLint
npm audit            # Check for vulnerabilities
```

## 🔒 Security Features

- XSS protection via input sanitization
- Email regex validation
- Password length requirements (min 8 chars)
- Secure HTTP headers configured
- CORS handling via Laravel backend
- Token validation and automatic refresh
- Error message sanitization (no backend details exposed)

See `SECURITY.md` for detailed security documentation.

## 🐛 Troubleshooting

### "Failed to fetch users"
- Verify `NEXT_PUBLIC_API_URL` is correct in `.env.local`
- Check Laravel backend is running
- Ensure CORS is configured correctly in Laravel

### Login not working
- Verify credentials are correct
- Check Laravel backend `/auth/login` endpoint
- Open browser console for detailed error messages

### Admin panel not visible
- Ensure your user has role: `super_admin`, `admin_sv`, or `admin_gt`
- Check user permissions in Laravel backend

## 📞 Support

For issues or questions, contact the development team.

## 📄 License

Private - Vitrinnea Internal Use Only
