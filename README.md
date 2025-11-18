# Vitrinnea Auth UI

Next.js 14+ admin UI for Laravel JWT authentication microservice.

## Features

- 🔐 JWT Authentication with automatic token refresh
- 👤 User Profile page with roles and permissions
- 👥 User Management (CRUD operations)
- 🔑 Role & Permission Management
- 🛡️ Protected routes with role-based access control
- 📱 Responsive design with Tailwind CSS
- 🎨 Clean, professional UI
- 🔔 Toast notifications for user feedback

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Axios for API calls
- React Hot Toast for notifications

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `.env.example` to `.env.local`
   - Update `NEXT_PUBLIC_API_URL` with your backend API URL

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/
├── login/              # Login page
├── profile/            # User profile page
├── admin/              # Admin panel
│   ├── layout.tsx      # Admin layout with sidebar
│   ├── users/          # User management
│   └── roles/          # Role management
├── layout.tsx          # Root layout with AuthProvider
└── page.tsx            # Home page (redirects)

components/
├── auth/
│   └── ProtectedRoute.tsx    # Route protection wrapper
└── layout/
    ├── Navbar.tsx            # Top navigation
    └── Sidebar.tsx           # Admin sidebar

contexts/
└── AuthContext.tsx     # Auth state management

lib/
└── api.ts              # API client with interceptors

types/
├── auth.ts             # Auth-related types
└── user.ts             # User-related types
```

## Authentication Flow

1. User logs in via `/login`
2. JWT token stored in localStorage
3. Token automatically added to all API requests via axios interceptor
4. Token refresh on 401 errors
5. Auto-redirect to login on auth failure

## User Roles

- `super_admin` - Full system access
- `admin_sv` - Admin access (El Salvador)
- `admin_gt` - Admin access (Guatemala)
- `warehouse_manager_sv` - Warehouse manager (El Salvador)
- `warehouse_manager_gt` - Warehouse manager (Guatemala)
- `operations` - Operations staff
- `employee` - Regular employee

## Admin Features

Only users with roles `super_admin`, `admin_sv`, or `admin_gt` can access:

- **User Management**: Create, edit, delete users and assign roles
- **Role Management**: View roles and manage their permissions

## API Endpoints

Backend API should provide:

- `POST /auth/login` - User login
- `GET /auth/me` - Get current user
- `POST /auth/logout` - Logout
- `POST /auth/refresh` - Refresh token
- `GET /users` - List all users
- `POST /users` - Create user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `GET /roles` - List all roles
- `GET /permissions` - List all permissions
- `POST /roles/:id/permissions` - Assign permissions to role

## Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API URL (required)

## Learn More

To learn more about Next.js:
- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

## License

Private - Vitrinnea Internal Use Only


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# vitrinnea-auth-service-ui
# vitrinnea-auth-service-ui
