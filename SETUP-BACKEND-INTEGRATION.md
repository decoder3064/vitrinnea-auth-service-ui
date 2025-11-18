# Backend Integration Setup Guide

Follow these steps to connect your Next.js frontend to the Laravel backend API.

---

## ⚠️ Prerequisites

- Laravel backend running at `http://vitrinnea-auth.test/api`
- Backend has all required endpoints implemented (see list below)
- Valid test user credentials with `@vitrinnea.com` email

---

## Step 1: Verify Backend API Endpoints

Ensure your Laravel backend has these endpoints available:

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/verify` - Verify token validity

### User Management Endpoints
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get single user
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `POST /api/users/:id/roles` - Assign roles to user

### Role & Permission Endpoints
- `GET /api/roles` - List all roles
- `GET /api/roles/:id` - Get single role with permissions
- `POST /api/roles/:id/permissions` - Assign permissions to role
- `GET /api/permissions` - List all permissions

---

## Step 2: Test Backend API with Postman/Insomnia

Before connecting frontend, verify the backend works:

```bash
# Test login
curl -X POST http://vitrinnea-auth.test/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@vitrinnea.com","password":"password"}'

# Should return:
# {
#   "success": true,
#   "data": {
#     "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
#     "token_type": "bearer",
#     "expires_in": 3600,
#     "user": { ... }
#   }
# }
```

---

## Step 3: Update Environment Variables

Verify `.env.local` has the correct API URL:

```env
NEXT_PUBLIC_API_URL=http://vitrinnea-auth.test/api
```

If your backend uses a different URL or port, update this value.

---

## Step 4: Enable Authentication in AuthContext

**File:** `contexts/AuthContext.tsx`

### 4.1 Enable Auth Initialization (Line ~27)

**Find this:**
```typescript
// DISABLED FOR UI PREVIEW - Uncomment when connecting to real backend
// const initAuth = async () => {
```

**Uncomment the entire `initAuth` function and its call:**
```typescript
const initAuth = async () => {
  const token = getToken();
  const storedUser = getUser();

  if (token && storedUser) {
    setUserState(storedUser);
    // Verify token is still valid
    try {
      const response = await authApi.me();
      if (response.success) {
        setUserState(response.data);
        setUser(response.data);
      } else {
        clearAuth();
        setUserState(null);
      }
    } catch (error) {
      clearAuth();
      setUserState(null);
    }
  }
  setLoading(false);
};

initAuth();
```

### 4.2 Enable Real Login (Line ~60)

**Remove the mock login code:**
```typescript
// MOCK LOGIN - Replace with real API call to backend
// TODO: Connect to POST /auth/login endpoint
toast.success('Login successful! (Mock)');
router.push('/profile');
```

**Uncomment the real login code:**
```typescript
try {
  setLoading(true);
  const response = await authApi.login(email, password);

  if (response.success && response.data) {
    setToken(response.data.access_token);
    setUser(response.data.user);
    setUserState(response.data.user);
    toast.success('Login successful!');
    router.push('/profile');
  } else {
    toast.error('Login failed. Please try again.');
  }
} catch (error: any) {
  const errorMessage = error.message || 'Login failed. Please check your credentials.';
  toast.error(errorMessage);
  throw error;
} finally {
  setLoading(false);
}
```

### 4.3 Enable Real Logout (Line ~90)

**Remove mock logout and uncomment real code:**
```typescript
try {
  await authApi.logout();
  clearAuth();
  setUserState(null);
  toast.success('Logged out successfully');
  router.push('/login');
} catch (error) {
  clearAuth();
  setUserState(null);
  router.push('/login');
}
```

### 4.4 Enable User Refresh (Line ~110)

**Uncomment the real refresh code:**
```typescript
try {
  const response = await authApi.me();
  if (response.success) {
    setUserState(response.data);
    setUser(response.data);
  }
} catch (error) {
  console.error('Failed to refresh user:', error);
}
```

### 4.5 Remove Mock User Data (Line ~24)

**Remove the entire mock user object:**
```typescript
// DELETE THIS:
const [user, setUserState] = useState<User | null>({
  id: 1,
  name: 'John Doe',
  // ... rest of mock data
});

// REPLACE WITH:
const [user, setUserState] = useState<User | null>(null);
```

### 4.6 Re-enable Loading State (Line ~46)

**Change:**
```typescript
const [loading, setLoading] = useState(false);
```

**To:**
```typescript
const [loading, setLoading] = useState(true);
```

---

## Step 5: Enable Route Protection

### 5.1 Enable ProtectedRoute Component

**File:** `components/auth/ProtectedRoute.tsx`

**Find this (Line ~15):**
```typescript
// DISABLED FOR UI PREVIEW - Uncomment when connecting to real backend
// if (!loading) {
```

**Uncomment the entire useEffect logic:**
```typescript
useEffect(() => {
  if (!loading) {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (allowedRoles && allowedRoles.length > 0) {
      const hasRequiredRole = user?.roles?.some(role => 
        allowedRoles.includes(role.name)
      );

      if (!hasRequiredRole) {
        router.push('/profile');
      }
    }
  }
}, [loading, isAuthenticated, user, allowedRoles, router]);
```

### 5.2 Enable Protection Checks (Line ~40)

**Remove this line:**
```typescript
// DISABLED FOR UI PREVIEW - Just render children directly
return <>{children}</>;
```

**Uncomment the full protection logic:**
```typescript
if (loading) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

if (!isAuthenticated) {
  return null;
}

if (allowedRoles && allowedRoles.length > 0) {
  const hasRequiredRole = user?.roles?.some(role => 
    allowedRoles.includes(role.name)
  );

  if (!hasRequiredRole) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Access Denied</h1>
          <p className="mt-2 text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }
}

return <>{children}</>;
```

---

## Step 6: Enable Middleware Protection

**File:** `middleware.ts`

**Uncomment all the middleware logic (Line ~6):**
```typescript
export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const { pathname } = request.nextUrl;

  const publicRoutes = ['/login'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  if (!token && !isPublicRoute && pathname !== '/') {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (token && pathname === '/login') {
    const profileUrl = new URL('/profile', request.url);
    return NextResponse.redirect(profileUrl);
  }

  return NextResponse.next();
}
```

---

## Step 7: Enable API Calls in Admin Pages

### 7.1 User Management Page

**File:** `app/admin/users/page.tsx`

**Find and uncomment (Line ~20):**
```typescript
// Uncomment below when connecting to real backend:
try {
  const response = await userApi.getAll();
  if (response.success) {
    setUsers(response.data);
  }
} catch (error: any) {
  toast.error('Failed to fetch users');
} finally {
  setLoading(false);
}
```

**Remove the mock data above it.**

**Do the same for:**
- `fetchRoles()` - Line ~35
- `handleSubmit()` - Line ~75
- `handleDeleteUser()` - Line ~120

### 7.2 Role Management Page

**File:** `app/admin/roles/page.tsx`

**Uncomment the real API calls in:**
- `fetchRoles()` - Line ~20
- `fetchPermissions()` - Line ~40
- `handleManagePermissions()` - Line ~55
- `handleSubmit()` - Line ~80

**Remove all mock data sections.**

---

## Step 8: Enable Login Page Redirect

**File:** `app/login/page.tsx`

**Uncomment (Line ~12):**
```typescript
useEffect(() => {
  if (isAuthenticated) {
    router.push('/profile');
  }
}, [isAuthenticated, router]);
```

---

## Step 9: Enable Home Page Redirect Logic

**File:** `app/page.tsx`

**Replace (Line ~10):**
```typescript
// DISABLED FOR UI PREVIEW - Just redirect to profile
router.push('/profile');
```

**With:**
```typescript
if (!loading) {
  if (isAuthenticated) {
    router.push('/profile');
  } else {
    router.push('/login');
  }
}
```

**Update dependencies:**
```typescript
}, [isAuthenticated, loading, router]);
```

---

## Step 10: Test the Integration

### 10.1 Restart Dev Server
```bash
# Kill current server
Ctrl + C

# Remove lock file if needed
rm -rf .next/dev/lock

# Restart
npm run dev
```

### 10.2 Test Flow

1. **Visit `http://localhost:3000`**
   - Should redirect to `/login` (not authenticated)

2. **Try to access `/profile` or `/admin/users`**
   - Should redirect to `/login`

3. **Login with valid credentials**
   - Use a valid `@vitrinnea.com` email
   - Should redirect to `/profile` on success
   - Check browser localStorage for `access_token`

4. **Visit Profile Page**
   - Should display real user data from backend
   - Check roles and permissions are displayed

5. **Test Admin Pages** (if you have admin role)
   - `/admin/users` - Should fetch and display real users
   - Try creating, editing, deleting users
   - `/admin/roles` - Should fetch and display real roles
   - Try assigning permissions to roles

6. **Test Logout**
   - Click logout in navbar
   - Should redirect to `/login`
   - localStorage should be cleared

---

## Step 11: Troubleshooting

### Issue: CORS Errors

**Add to Laravel backend (config/cors.php):**
```php
'allowed_origins' => ['http://localhost:3000'],
'supports_credentials' => true,
```

### Issue: 401 Unauthorized on every request

**Check:**
- JWT token is being saved to localStorage correctly
- Axios interceptor is adding `Bearer ${token}` to headers
- Backend is accepting the token format

**Debug in browser console:**
```javascript
localStorage.getItem('access_token')
```

### Issue: Token refresh not working

**Verify backend has:**
- `POST /api/auth/refresh` endpoint
- Returns new token in same format as login

### Issue: Routes still not protected

**Check:**
- Middleware is enabled (no commented code)
- Token is stored in localStorage (not cookies by default)
- ProtectedRoute component wraps protected pages

---

## Step 12: Backend Response Format

Ensure your Laravel API returns data in this format:

### Login Response
```json
{
  "success": true,
  "data": {
    "access_token": "eyJ0eXAiOiJKV1Qi...",
    "token_type": "bearer",
    "expires_in": 3600,
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@vitrinnea.com",
      "user_type": "admin",
      "country": "SV",
      "roles": [
        {
          "id": 1,
          "name": "super_admin",
          "guard_name": "api",
          "created_at": "2024-01-01T00:00:00Z",
          "updated_at": "2024-01-01T00:00:00Z"
        }
      ],
      "permissions": [
        {
          "id": 1,
          "name": "view-users",
          "guard_name": "api",
          "created_at": "2024-01-01T00:00:00Z",
          "updated_at": "2024-01-01T00:00:00Z"
        }
      ]
    }
  }
}
```

### List Response (Users, Roles, etc.)
```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "User 1", ... },
    { "id": 2, "name": "User 2", ... }
  ]
}
```

### Error Response
```json
{
  "success": false,
  "message": "Authentication failed",
  "errors": {
    "email": ["The email field is required."]
  }
}
```

---

## 🎉 Done!

Once all steps are complete:
- Frontend will authenticate against your Laravel backend
- Protected routes will require login
- Admin features will be role-protected
- All CRUD operations will persist to your database

**Need Help?** Check browser console and network tab for errors.

---

## Quick Reference: Files to Edit

1. ✅ `contexts/AuthContext.tsx` - Enable auth logic
2. ✅ `components/auth/ProtectedRoute.tsx` - Enable route protection
3. ✅ `middleware.ts` - Enable middleware
4. ✅ `app/admin/users/page.tsx` - Enable user API calls
5. ✅ `app/admin/roles/page.tsx` - Enable role API calls
6. ✅ `app/login/page.tsx` - Enable redirect
7. ✅ `app/page.tsx` - Enable redirect logic

**Search for:** `TODO:` or `Uncomment below when connecting` to find all sections.
