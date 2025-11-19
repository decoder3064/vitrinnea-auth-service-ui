# Backend API Response Reference

This document maps the actual Laravel backend responses to the frontend expectations.

## Authentication Endpoints

### POST /api/auth/login
**Backend Response:**
```json
{
  "success": true,
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": {
    "id": 1,
    "name": "Super Admin",
    "email": "admin@vitrinnea.com",
    "country": "SV",
    "user_type": "employee",
    "active": true,
    "roles": [{"id": 1, "name": "super_admin", "guard_name": "api"}]
  }
}
```

**Frontend Expects:**
```typescript
AuthResponse {
  success: boolean;
  data: {
    access_token: string;
    token_type: string;
    expires_in: number;
    user: User;
  }
}
```

**Transformation:** Wrap access_token, token_type, expires_in, and user in a `data` object.

---

### GET /api/auth/me
**Backend Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "Super Admin",
    "email": "admin@vitrinnea.com",
    "roles": [{"id": 1, "name": "super_admin", "guard_name": "api"}]
  }
}
```

**Frontend Expects:**
```typescript
MeResponse {
  success: boolean;
  data: User;
}
```

**Transformation:** Move `user` to `data` field.

---

### GET /api/admin/users
**Backend Response:**
```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "name": "Super Admin",
        "email": "admin@vitrinnea.com",
        "roles": [{"id": 1, "name": "super_admin", "guard_name": "api"}],
        "groups": []
      }
    ],
    "first_page_url": "...",
    "last_page": 1,
    "per_page": 15,
    "total": 5
  }
}
```

**Frontend Expects:**
```typescript
{
  success: boolean;
  data: User[]; // Array of users
}
```

**Transformation:** Extract `data.data` (the users array) from the pagination wrapper.

---

### GET /api/admin/groups
**Backend Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "admin",
      "display_name": "Administrators",
      "description": "System administrators",
      "active": true
    }
  ]
}
```

**Frontend Expects:**
```typescript
{
  success: boolean;
  data: Role[]; // Groups mapped as roles
}
```

**Transformation:** None needed - direct array.

---

## Key Differences

### 1. Pagination Wrapper
**Backend:** Returns `{ success, data: { current_page, data: [...], total, ... } }`
**Frontend:** Expects `{ success, data: [...] }`
**Solution:** Extract `response.data.data` to get the actual array.

### 2. Login Response Structure
**Backend:** Returns fields at root level (`access_token`, `user`, etc.)
**Frontend:** Expects nested in `data` object
**Solution:** Restructure in API layer to wrap in `data`.

### 3. Me Response Structure
**Backend:** Returns `{ success, user: {...} }`
**Frontend:** Expects `{ success, data: {...} }`
**Solution:** Map `user` to `data`.

### 4. Permissions Endpoint
**Backend:** No `/api/permissions` endpoint exists
**Frontend:** Attempts to call `permissionApi.getAll()`
**Solution:** Return empty array since permissions are tied to roles/groups.

## Implementation Status

✅ **Fixed:**
- Login response transformation
- Me response transformation
- Users pagination handling
- Permissions endpoint removed (returns empty array)
- Type definitions updated to support both structures

## Testing Checklist

- [x] Login returns token and user
- [x] /auth/me returns current user
- [ ] /admin/users returns array of users (not paginated object)
- [ ] /admin/groups returns array of groups
- [ ] No 404 errors for /api/permissions
