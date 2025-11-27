'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, selectedCountry, changeCountry } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCountryMenuOpen, setIsCountryMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const isAdmin = user?.roles?.some(role => {
    const roleName = typeof role === 'string' ? role : role.name;
    return ['super_admin', 'admin_sv', 'admin_gt'].includes(roleName);
  });

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/profile" className="text-xl font-bold text-gray-900">
                Vitrinnea
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/profile"
                className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                  pathname === '/profile'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Profile
              </Link>
              {isAdmin && (
                <>
                  <Link
                    href="/admin/users"
                    className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                      pathname?.startsWith('/admin/users')
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    Users
                  </Link>
                  <Link
                    href="/admin/roles"
                    className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                      pathname?.startsWith('/admin/roles')
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    Roles
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Desktop user menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {/* Country Selector */}
            {user?.allowed_countries && user.allowed_countries.length > 1 && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsCountryMenuOpen(!isCountryMenuOpen)}
                  className="flex items-center gap-2 rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{selectedCountry || user.country}</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isCountryMenuOpen && (
                  <div className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                    {user.allowed_countries.map((country) => (
                      <button
                        key={country}
                        onClick={() => {
                          changeCountry(country);
                          setIsCountryMenuOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          (selectedCountry || user.country) === country
                            ? 'bg-blue-50 text-blue-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {country}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            <div className="relative ml-3">
              <div>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                </button>
              </div>

              {isMenuOpen && (
                <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <div className="font-medium">{user?.name}</div>
                    <div className="text-xs text-gray-500">{user?.email}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open menu</span>
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden border-t border-gray-200">
          <div className="space-y-1 pb-3 pt-2">
            <Link
              href="/profile"
              onClick={() => setIsMenuOpen(false)}
              className={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium ${
                pathname === '/profile'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              Profile
            </Link>
            {isAdmin && (
              <>
                <Link
                  href="/admin/users"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium ${
                    pathname?.startsWith('/admin/users')
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  Users
                </Link>
                <Link
                  href="/admin/roles"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium ${
                    pathname?.startsWith('/admin/roles')
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  Roles
                </Link>
              </>
            )}
          </div>
          <div className="border-t border-gray-200 pb-3 pt-4">
            {/* Mobile Country Selector */}
            {user?.allowed_countries && user.allowed_countries.length > 1 && (
              <div className="px-4 pb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Country
                </label>
                <select
                  value={selectedCountry || user.country}
                  onChange={(e) => changeCountry(e.target.value)}
                  className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                >
                  {user.allowed_countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{user?.name}</div>
                <div className="text-sm font-medium text-gray-500">{user?.email}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
