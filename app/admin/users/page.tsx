'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { userApi, roleApi } from '@/lib/api';
import { User } from '@/types/user';
import { Role } from '@/types/auth';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    user_type: '',
    country: '',
    roles: [] as number[],
  });

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    // MOCK DATA - Replace with real API call to backend
    // TODO: Connect to GET /users endpoint
    setUsers([
      { id: 1, name: 'Admin User', email: 'admin@vitrinnea.com', user_type: 'admin', country: 'SV', roles: [{ id: 1, name: 'super_admin', guard_name: 'api', created_at: '2024-01-01', updated_at: '2024-01-01' }], permissions: [] },
      { id: 2, name: 'Employee User', email: 'employee@vitrinnea.com', user_type: 'employee', country: 'GT', roles: [{ id: 7, name: 'employee', guard_name: 'api', created_at: '2024-01-01', updated_at: '2024-01-01' }], permissions: [] },
      { id: 3, name: 'Warehouse Manager', email: 'warehouse@vitrinnea.com', user_type: 'manager', country: 'SV', roles: [{ id: 4, name: 'warehouse_manager_sv', guard_name: 'api', created_at: '2024-01-01', updated_at: '2024-01-01' }], permissions: [] }
    ]);
    setLoading(false);
    
    // Uncomment below when connecting to real backend:
    // try {
    //   const response = await userApi.getAll();
    //   if (response.success) {
    //     setUsers(response.data);
    //   }
    // } catch (error: any) {
    //   toast.error('Failed to fetch users');
    // } finally {
    //   setLoading(false);
    // }
  };

  const fetchRoles = async () => {
    // MOCK DATA - Replace with real API call to backend
    // TODO: Connect to GET /roles endpoint
    setRoles([
      { id: 1, name: 'super_admin', guard_name: 'api', created_at: '2024-01-01', updated_at: '2024-01-01' },
      { id: 2, name: 'admin_sv', guard_name: 'api', created_at: '2024-01-01', updated_at: '2024-01-01' },
      { id: 3, name: 'admin_gt', guard_name: 'api', created_at: '2024-01-01', updated_at: '2024-01-01' },
      { id: 4, name: 'warehouse_manager_sv', guard_name: 'api', created_at: '2024-01-01', updated_at: '2024-01-01' },
      { id: 5, name: 'warehouse_manager_gt', guard_name: 'api', created_at: '2024-01-01', updated_at: '2024-01-01' },
      { id: 6, name: 'operations', guard_name: 'api', created_at: '2024-01-01', updated_at: '2024-01-01' },
      { id: 7, name: 'employee', guard_name: 'api', created_at: '2024-01-01', updated_at: '2024-01-01' }
    ]);
    
    // Uncomment below when connecting to real backend:
    // try {
    //   const response = await roleApi.getAll();
    //   if (response.success) {
    //     setRoles(response.data);
    //   }
    // } catch (error) {
    //   console.error('Failed to fetch roles');
    // }
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
      roles: [],
    });
    setShowModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      password_confirmation: '',
      user_type: user.user_type,
      country: user.country,
      roles: user.roles.map(r => r.id),
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // MOCK SAVE - Replace with real API calls to backend
    // TODO: Connect to POST /users (create) and PUT /users/:id (update) endpoints
    // TODO: Connect to POST /users/:id/roles endpoint for role assignment
    toast.success(editingUser ? 'User updated successfully! (Mock)' : 'User created successfully! (Mock)');
    setShowModal(false);
    fetchUsers();
    
    // Uncomment below when connecting to real backend:
    // try {
    //   if (editingUser) {
    //     const updateData: any = {
    //       name: formData.name,
    //       email: formData.email,
    //       user_type: formData.user_type,
    //       country: formData.country,
    //     };
    //     
    //     if (formData.password) {
    //       updateData.password = formData.password;
    //       updateData.password_confirmation = formData.password_confirmation;
    //     }
    //     
    //     await userApi.update(editingUser.id, updateData);
    //     
    //     if (formData.roles.length > 0) {
    //       await userApi.assignRoles(editingUser.id, formData.roles);
    //     }
    //     
    //     toast.success('User updated successfully');
    //   } else {
    //     await userApi.create(formData);
    //     toast.success('User created successfully');
    //   }
    //   
    //   setShowModal(false);
    //   fetchUsers();
    // } catch (error: any) {
    //   toast.error(error.message || 'Failed to save user');
    // }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }
    
    // MOCK DELETE - Replace with real API call to backend
    // TODO: Connect to DELETE /users/:id endpoint
    toast.success('User deleted successfully! (Mock)');
    fetchUsers();
    
    // Uncomment below when connecting to real backend:
    // try {
    //   await userApi.delete(userId);
    //   toast.success('User deleted successfully');
    //   fetchUsers();
    // } catch (error: any) {
    //   toast.error('Failed to delete user');
    // }
  };

  const toggleRole = (roleId: number) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(roleId)
        ? prev.roles.filter(id => id !== roleId)
        : [...prev.roles, roleId]
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
            A list of all users in the system including their name, email, type, and roles.
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

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                      Name
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Type
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Country
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Roles
                    </th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {user.user_type}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {user.country}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map((role) => (
                            <span
                              key={role.id}
                              className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800"
                            >
                              {role.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
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
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
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
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  required={!editingUser || !!formData.password}
                  value={formData.password_confirmation}
                  onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">User Type</label>
                <input
                  type="text"
                  required
                  value={formData.user_type}
                  onChange={(e) => setFormData({ ...formData, user_type: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Country</label>
                <input
                  type="text"
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Roles</label>
                <div className="space-y-2">
                  {roles.map((role) => (
                    <label key={role.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.roles.includes(role.id)}
                        onChange={() => toggleRole(role.id)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{role.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
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
