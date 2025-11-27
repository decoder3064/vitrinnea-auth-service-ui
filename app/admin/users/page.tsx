'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { userApi, roleApi } from '@/lib/api';
import { User, Country } from '@/types/user';
import { Role } from '@/types/auth';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Role[]>([]); // These are actually groups
  const [countries, setCountries] = useState<Country[]>([
    { code: 'SV', name: 'El Salvador' },
    { code: 'GT', name: 'Guatemala' },
    { code: 'CR', name: 'Costa Rica' },
    { code: 'HN', name: 'Honduras' },
    { code: 'NI', name: 'Nicaragua' },
    { code: 'PA', name: 'Panamá' }
  ]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    country: '',
    active: 'all',
    search: '',
  });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    user_type: '',
    country: '',
    allowed_countries: [] as string[], // Multi-country support
    role: '', // Single role string
    groups: [] as number[], // Multiple groups
  });

  useEffect(() => {
    fetchUsers();
    fetchGroups();
    fetchCountries();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, filters]);

  const fetchUsers = async () => {
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
  };

  const applyFilters = () => {
    let filtered = [...users];

    // Filter by country
    if (filters.country) {
      filtered = filtered.filter(user => user.country === filters.country);
    }

    // Filter by active status
    if (filters.active !== 'all') {
      const isActive = filters.active === 'active';
      filtered = filtered.filter(user => user.active === isActive);
    }

    // Filter by search (name or email)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }

    setFilteredUsers(filtered);
  };

  const fetchGroups = async () => {
    try {
      const response = await roleApi.getAll();
      if (response.success) {
        setGroups(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch groups');
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await userApi.getAvailableCountries();
      if (response.success && response.data) {
        setCountries(response.data);
      }
    } catch (error) {
      console.log('Using default country list');
    }
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      user_type: '',
      country: '',
      allowed_countries: [],
      role: '',
      groups: [],
    });
    setShowModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    // Extract first role name or use empty string
    const userRole = user.roles && user.roles.length > 0
      ? (typeof user.roles[0] === 'string' ? user.roles[0] : user.roles[0].name)
      : '';
    
    // Extract group IDs from user.groups if available
    const userGroups = user.groups?.map((g: any) => typeof g === 'number' ? g : g.id) || [];
    
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      password_confirmation: '',
      user_type: user.user_type,
      country: user.country,
      allowed_countries: user.allowed_countries || [user.country],
      role: userRole,
      groups: userGroups,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingUser) {
        const updateData: any = {
          name: formData.name,
          email: formData.email,
          user_type: formData.user_type,
          country: formData.country,
          allowed_countries: formData.allowed_countries,
          role: formData.role,
        };
        
        if (formData.password) {
          updateData.password = formData.password;
          updateData.password_confirmation = formData.password_confirmation;
        }
        
        await userApi.update(editingUser.id, updateData);
        
        // Assign groups separately
        if (formData.groups.length > 0) {
          await userApi.assignGroups(editingUser.id, formData.groups);
        }
        
        toast.success('User updated successfully');
      } else {
        // For new users, backend expects role and groups in the create request
        const createData = {
          ...formData,
          allowed_countries: formData.allowed_countries,
          groups: formData.groups,
          send_welcome_email: true,
        };
        await userApi.create(createData);
        toast.success('User created successfully');
      }
      
      setShowModal(false);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save user');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to deactivate this user? They will no longer be able to log in.')) {
      return;
    }
    
    try {
      const response = await userApi.delete(userId);
      if (response.success) {
        toast.success(response.message || 'User deactivated successfully');
        fetchUsers();
      } else {
        toast.error(response.message || 'Failed to deactivate user');
      }
    } catch (error: any) {
      console.error('Delete user error:', error);
      toast.error(error.message || 'Failed to deactivate user');
    }
  };

  const handleActivateUser = async (userId: number) => {
    if (!confirm('Are you sure you want to activate this user? They will be able to log in again.')) {
      return;
    }
    
    try {
      const response = await userApi.activate(userId);
      if (response.success) {
        toast.success(response.message || 'User activated successfully');
        fetchUsers();
      } else {
        toast.error(response.message || 'Failed to activate user');
      }
    } catch (error: any) {
      console.error('Activate user error:', error);
      toast.error(error.message || 'Failed to activate user');
    }
  };

  const toggleGroup = (groupId: number) => {
    setFormData(prev => ({
      ...prev,
      groups: prev.groups.includes(groupId)
        ? prev.groups.filter(id => id !== groupId)
        : [...prev.groups, groupId]
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="sm:flex sm:items-center mb-6">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all users in the system including their name, email, role, and groups.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={handleCreateUser}
            className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            Add User
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
          <select
            value={filters.country}
            onChange={(e) => setFilters({ ...filters, country: e.target.value })}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="">All Countries</option>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>{c.code}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={filters.active}
            onChange={(e) => setFilters({ ...filters, active: e.target.value })}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="all">All Users</option>
            <option value="active">Active</option>
            <option value="inactive">Deactivated</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={() => setFilters({ country: '', active: 'all', search: '' })}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle px-4 sm:px-6 lg:px-8">
            <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">
                      Name
                    </th>
                    <th className="px-3 py-3.5 text-left text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">
                      Email
                    </th>
                    <th className="px-3 py-3.5 text-left text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">
                      Type
                    </th>
                    <th className="px-3 py-3.5 text-left text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">
                      Country
                    </th>
                    <th className="px-3 py-3.5 text-left text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">
                      Status
                    </th>
                    <th className="px-3 py-3.5 text-left text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">
                      Role
                    </th>
                    <th className="px-3 py-3.5 text-left text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">
                      Groups
                    </th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className={!user.active ? 'bg-gray-50 opacity-60' : ''}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs sm:text-sm font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-xs sm:text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-xs sm:text-sm text-gray-500">
                        {user.user_type}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-xs sm:text-sm text-gray-500">
                        {user.country}
                        {user.allowed_countries && user.allowed_countries.length > 1 && (
                          <div className="text-xs text-gray-400 mt-1">
                            Access: {user.allowed_countries.join(', ')}
                          </div>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-xs sm:text-sm">
                        {user.active ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                            Deactivated
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-xs sm:text-sm text-gray-500">
                        <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">
                          {user.roles && user.roles.length > 0
                            ? (typeof user.roles[0] === 'string' ? user.roles[0] : user.roles[0].name)
                            : 'N/A'}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-xs sm:text-sm text-gray-500">
                        <div className="flex flex-wrap gap-1">
                          {user.groups && user.groups.length > 0 ? (
                            user.groups.map((group: any, idx: number) => (
                              <span
                                key={idx}
                                className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800"
                              >
                                {typeof group === 'string' ? group : (group.display_name || group.name)}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-400">No groups</span>
                          )}
                        </div>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </button>
                        {user.active ? (
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            onClick={() => handleActivateUser(user.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Activate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {editingUser ? 'Edit User' : 'Create User'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password {editingUser && '(leave blank to keep current)'}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  required={!editingUser || !!formData.password}
                  value={formData.password_confirmation}
                  onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">User Type</label>
                <input
                  type="text"
                  required
                  value={formData.user_type}
                  onChange={(e) => setFormData({ ...formData, user_type: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Primary Country</label>
                <select
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                >
                  <option value="">Select a country</option>
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Allowed Countries (Multi-select)
                </label>
                <div className="border border-gray-300 rounded-md p-2 space-y-2 max-h-32 overflow-y-auto">
                  {countries.map((c) => (
                    <label key={c.code} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.allowed_countries.includes(c.code)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, allowed_countries: [...formData.allowed_countries, c.code] });
                          } else {
                            setFormData({ ...formData, allowed_countries: formData.allowed_countries.filter(code => code !== c.code) });
                          }
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-900">{c.name} ({c.code})</span>
                    </label>
                  ))}
                </div>
                <p className="mt-1 text-xs text-gray-500">Select all countries this user can access</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                >
                  <option value="">Select a role</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="admin_sv">Admin SV</option>
                  <option value="admin_gt">Admin GT</option>
                  <option value="warehouse_manager_sv">Warehouse Manager SV</option>
                  <option value="warehouse_manager_gt">Warehouse Manager GT</option>
                  <option value="operations">Operations</option>
                  <option value="employee">Employee</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Groups</label>
                <div className="space-y-2">
                  {groups.map((group) => (
                    <label key={group.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.groups.includes(group.id)}
                        onChange={() => toggleGroup(group.id)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-base text-gray-900">{group.display_name || group.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full sm:w-auto rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
                >
                  {editingUser ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
