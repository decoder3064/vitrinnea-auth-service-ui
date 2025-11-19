# Security Documentation

## Overview
This document outlines the security measures implemented in the Vitrinnea Auth UI application and provides recommendations for maintaining security.

## Security Audit Summary (Last Updated: November 18, 2025)

### ✅ Vulnerabilities Found: 0
- npm audit: **0 vulnerabilities**
- All dependencies up-to-date
- No known CVEs in current packages

## Implemented Security Measures

### 1. Authentication & Authorization
- **JWT Bearer Token Authentication**: Secure token-based authentication
- **Role-Based Access Control (RBAC)**: Admin routes protected by role checks
- **Automatic Token Validation**: Token verified on each page load
- **Session Expiration Handling**: Automatic logout and redirect on 401 errors
- **Protected Routes**: Centralized route protection via AuthGuard component

### 2. Input Validation & Sanitization
- **Email Validation**: Regex pattern validation on login form
- **Password Length Check**: Minimum 6 characters enforced
- **Input Trimming**: Whitespace removed before processing
- **JSON Parse Protection**: Try-catch blocks with validation on localStorage reads
- **Token Validation**: Empty token strings rejected

### 3. XSS (Cross-Site Scripting) Protection
- **Error Message Sanitization**: Generic error messages prevent information disclosure
- **No Direct HTML Rendering**: React's automatic escaping prevents XSS
- **No dangerouslySetInnerHTML**: Code reviewed - no unsafe HTML injection
- **No eval() Usage**: Code reviewed - no dynamic code execution

### 4. Security Headers
Configured in `next.config.ts`:
- **X-Frame-Options: DENY** - Prevents clickjacking attacks
- **X-Content-Type-Options: nosniff** - Prevents MIME-sniffing
- **X-XSS-Protection: 1; mode=block** - Browser XSS filter enabled
- **Referrer-Policy: strict-origin-when-cross-origin** - Limits referrer information
- **Permissions-Policy** - Restricts camera, microphone, geolocation access

### 5. API Security
- **HTTPS Only**: Backend API uses HTTPS (vitrinnea-auth.test)
- **Bearer Token in Headers**: Tokens sent via Authorization header (not URL)
- **No Credentials in Repository**: Environment variables for sensitive data
- **CORS Configuration**: Properly configured on Laravel backend
- **Request Interceptors**: Automatic token injection on all API calls
- **Response Interceptors**: Centralized error handling and token refresh

### 6. Data Storage
- **localStorage for Tokens**: Appropriate for SPA architecture
  - ⚠️ Note: Consider httpOnly cookies for enhanced security in production
- **Token Expiration**: Automatic refresh mechanism implemented
- **Auto-Cleanup**: Auth cleared on 401/403 responses
- **JSON Validation**: User data validated before parsing from storage

### 7. Error Handling
- **Generic Error Messages**: Prevent information leakage
- **Status Code Mapping**: Appropriate user-friendly messages
- **No Stack Traces**: Error details hidden from users
- **Centralized Handling**: All API errors caught and sanitized

## Security Best Practices

### For Developers

1. **Never Commit Secrets**
   - Use `.env.local` for sensitive data
   - `.env.local` is in `.gitignore`
   - Never hardcode API keys or tokens

2. **Input Validation**
   - Always validate and sanitize user input
   - Use TypeScript types for compile-time safety
   - Implement server-side validation on Laravel backend

3. **Dependency Management**
   - Run `npm audit` regularly
   - Keep dependencies updated: `npm update`
   - Review security advisories: `npm audit fix`

4. **Code Review**
   - Review all PRs for security issues
   - Check for XSS vulnerabilities
   - Verify authentication checks on protected routes

### For Production Deployment

1. **Environment Variables**
   ```bash
   NEXT_PUBLIC_API_URL=https://your-production-api.com/api
   ```

2. **HTTPS Enforcement**
   - Always use HTTPS in production
   - Configure SSL certificates properly
   - Enable HSTS headers

3. **Content Security Policy (CSP)**
   Consider adding CSP headers:
   ```typescript
   {
     key: 'Content-Security-Policy',
     value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
   }
   ```

4. **Rate Limiting**
   - Implement on Laravel backend
   - Protect login endpoint from brute force
   - Consider using Laravel Throttle middleware

5. **Token Security**
   - Consider shorter token expiration times
   - Implement refresh token rotation
   - For maximum security, migrate to httpOnly cookies

## Known Security Considerations

### ⚠️ localStorage vs httpOnly Cookies

**Current Implementation**: JWT tokens stored in localStorage
- ✅ Works well for SPA architecture
- ✅ Simple to implement
- ⚠️ Vulnerable to XSS attacks
- ⚠️ Accessible via JavaScript

**Recommended for Production**: httpOnly Cookies
- ✅ Not accessible via JavaScript
- ✅ Protected from XSS
- ✅ Can include Secure and SameSite flags
- ⚠️ Requires CORS configuration changes
- ⚠️ More complex implementation

**Migration Path** (if needed):
1. Update Laravel backend to send JWT in httpOnly cookie
2. Remove localStorage token management
3. Update CORS to include credentials: true
4. Set sameSite and secure flags on cookies

### ⚠️ CORS Configuration

Current backend configuration allows wildcard origins:
```php
'allowed_origins' => ['*']
```

**Production Recommendation**:
```php
'allowed_origins' => [
    'https://your-production-domain.com',
    'https://admin.your-production-domain.com'
]
```

## Security Checklist for Production

- [ ] Update CORS to specific origins (remove wildcard)
- [ ] Enable HTTPS on all domains
- [ ] Configure proper SSL certificates
- [ ] Set secure environment variables
- [ ] Review and test all authentication flows
- [ ] Implement rate limiting on backend
- [ ] Add monitoring and logging
- [ ] Set up security alerts
- [ ] Consider migrating to httpOnly cookies
- [ ] Enable Content Security Policy headers
- [ ] Configure firewall rules
- [ ] Implement backup strategy
- [ ] Set up automated security scanning

## Reporting Security Issues

If you discover a security vulnerability, please email:
**security@vitrinnea.com**

Do NOT create public GitHub issues for security vulnerabilities.

## Security Updates

| Date | Version | Update |
|------|---------|--------|
| 2025-11-18 | 0.1.0 | Initial security audit completed |

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [React Security Best Practices](https://react.dev/learn/security)
