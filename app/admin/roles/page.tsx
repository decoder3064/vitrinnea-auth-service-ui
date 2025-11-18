'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { roleApi, permissionApi } from '@/lib/api';
import { Role, Permission } from '@/types/auth';

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [rolePermissions, setRolePermissions] = useState<number[]>([]);

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

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
    setLoading(false);
    
    // Uncomment below when connecting to real backend:
    // try {
    //   const response = await roleApi.getAll();
    //   if (response.success) {
    //     setRoles(response.data);
    //   }
    // } catch (error: any) {
    //   toast.error('Failed to fetch roles');
    // } finally {
    //   setLoading(false);
    // }
  };

  const fetchPermissions = async () => {
    // MOCK DATA - Replace with real API call to backend
    // TODO: Connect to GET /permissions endpoint
    setPermissions([
      { id: 1, name: 'view-users', guard_name: 'api', created_at: '2024-01-01', updated_at: '2024-01-01' },
      { id: 2, name: 'create-users', guard_name: 'api', created_at: '2024-01-01', updated_at: '2024-01-01' },
      { id: 3, name: 'edit-users', guard_name: 'api', created_at: '2024-01-01', updated_at: '2024-01-01' },
      { id: 4, name: 'delete-users', guard_name: 'api', created_at: '2024-01-01', updated_at: '2024-01-01' },
      { id: 5, name: 'manage-roles', guard_name: 'api', created_at: '2024-01-01', updated_at: '2024-01-01' },
      { id: 6, name: 'view-reports', guard_name: 'api', created_at: '2024-01-01', updated_at: '2024-01-01' },
      { id: 7, name: 'manage-inventory', guard_name: 'api', created_at: '2024-01-01', updated_at: '2024-01-01' },
      { id: 8, name: 'process-orders', guard_name: 'api', created_at: '2024-01-01', updated_at: '2024-01-01' }
    ]);
    
    // Uncomment below when connecting to real backend:
    // try {
    //   const response = await permissionApi.getAll();
    //   if (response.success) {
    //     setPermissions(response.data);
    //   }
    // } catch (error) {
    //   console.error('Failed to fetch permissions');
    // }
  };

  const handleManagePermissions = async (role: Role) => {
    setSelectedRole(role);
    
    // MOCK DATA - Replace with real API call to backend
    // TODO: Connect to GET /roles/:id endpoint to fetch role permissions
    // Mock: assign some permissions based on role
    if (role.name === 'super_admin') {
      setRolePermissions([1, 2, 3, 4, 5, 6, 7, 8]);
    } else if (role.name.includes('admin')) {
      setRolePermissions([1, 2, 3, 5, 6]);
    } else if (role.name.includes('warehouse')) {
      setRolePermissions([7, 8]);
    } else {
      setRolePermissions([1, 6]);
    }
    
    setShowModal(true);
    
    // Uncomment below when connecting to real backend:
    // try {
    //   const response = await roleApi.getById(role.id);
    //   if (response.success && response.data.permissions) {
    //     setRolePermissions(response.data.permissions.map((p: Permission) => p.id));
    //   } else {
    //     setRolePermissions([]);
    //   }
    // } catch (error) {
    //   setRolePermissions([]);
    // }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRole) return;
    
    // MOCK SAVE - Replace with real API call to backend
    // TODO: Connect to POST /roles/:id/permissions endpoint
    toast.success('Permissions updated successfully! (Mock)');
    setShowModal(false);
    
    // Uncomment below when connecting to real backend:
    // try {
    //   await roleApi.assignPermissions(selectedRole.id, rolePermissions);
    //   toast.success('Permissions updated successfully');
    //   setShowModal(false);
    //   fetchRoles();
    // } catch (error: any) {
    //   toast.error('Failed to update permissions');
    // }
  };

  const togglePermission = (permissionId: number) => {
    setRolePermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading roles...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="sm:flex sm:items-center mb-6">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Roles & Permissions</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage roles and their assigned permissions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {roles.map((role) => (
          <div key={role.id} className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    {role.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Guard: {role.guard_name}
                  </p>
                </div>
                <button
                  onClick={() => handleManagePermissions(role)}
                  className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                >
                  Manage Permissions
                </button>
              </div>
              
              {/* Display current permissions if available */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Assigned Permissions:
                </h4>
                <div className="text-sm text-gray-500">
                  Click "Manage Permissions" to view and edit
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && selectedRole && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Manage Permissions for {selectedRole.name}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-4">
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {permissions.map((permission) => (
                  <label key={permission.id} className="flex items-start">
                    <input
                      type="checkbox"
                      checked={rolePermissions.includes(permission.id)}
                      onChange={() => togglePermission(permission.id)}
                      className="h-4 w-4 mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="ml-3">
                      <span className="text-sm font-medium text-gray-700">
                        {permission.name}
                      </span>
                      {permission.guard_name && (
                        <p className="text-xs text-gray-500">
                          Guard: {permission.guard_name}
                        </p>
                      )}
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-4">
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
                  Update Permissions
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
