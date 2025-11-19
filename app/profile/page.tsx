'use client';

import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfilePage() {
  const { user, loading } = useAuth();

  return (
    <>
      {!loading && user ? (
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="py-10">
            <header className="mb-8">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
                  Profile
                </h1>
              </div>
            </header>
            <main>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {/* User Information Card */}
              <div className="bg-white shadow sm:rounded-lg mb-6">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-base sm:text-lg font-medium leading-6 text-gray-900 mb-4">
                    User Information
                  </h3>
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Name</dt>
                      <dd className="mt-1 text-sm text-gray-900">{user.name}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">User Type</dt>
                      <dd className="mt-1 text-sm text-gray-900">{user.user_type}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Country</dt>
                      <dd className="mt-1 text-sm text-gray-900">{user.country}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Roles Card */}
              <div className="bg-white shadow sm:rounded-lg mb-6">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                    Assigned Roles
                  </h3>
                  {user.roles && user.roles.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.roles.map((role, index) => {
                        const roleName = typeof role === 'string' ? role : role.name;
                        const roleId = typeof role === 'string' ? index : role.id;
                        return (
                          <span
                            key={roleId}
                            className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                          >
                            {roleName}
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No roles assigned</p>
                  )}
                </div>
              </div>

              {/* Permissions Card */}
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                    Assigned Permissions
                  </h3>
                  {user.permissions && user.permissions.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {user.permissions.map((permission, index) => {
                        const permName = typeof permission === 'string' ? permission : permission.name;
                        const permId = typeof permission === 'string' ? index : permission.id;
                        return (
                          <li key={permId} className="py-3 flex items-center">
                            <svg
                              className="h-5 w-5 text-green-500 mr-3"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-sm text-gray-900">{permName}</span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No permissions assigned</p>
                  )}
                </div>
              </div>
            </div>
          </main>
          </div>
        </div>
      ) : (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      )}
    </>
  );
}