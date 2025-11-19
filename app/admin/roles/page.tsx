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
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [rolePermissions, setRolePermissions] = useState<number[]>([]);
  const [editingGroup, setEditingGroup] = useState<Role | null>(null);
  const [groupFormData, setGroupFormData] = useState({
    name: '',
    display_name: '',
    description: '',
    active: true,
  });

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await roleApi.getAll();
      if (response.success) {
        setRoles(response.data);
      }
    } catch (error: any) {
      toast.error('Failed to fetch groups');
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await permissionApi.getAll();
      if (response.success) {
        setPermissions(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch permissions');
    }
  };

  const handleViewPermissions = async (role: Role) => {
    setSelectedRole(role);
    
    try {
      const response = await roleApi.getById(role.id);
      if (response.success && response.data.permissions) {
        setRolePermissions(response.data.permissions.map((p: Permission) => p.id));
      } else {
        setRolePermissions([]);
      }
    } catch (error) {
      setRolePermissions([]);
    }
    
    setShowPermissionsModal(true);
  };

  const handleCreateGroup = () => {
    setEditingGroup(null);
    setGroupFormData({
      name: '',
      display_name: '',
      description: '',
      active: true,
    });
    setShowGroupModal(true);
  };

  const handleEditGroup = (role: Role) => {
    setEditingGroup(role);
    setGroupFormData({
      name: role.name,
      display_name: role.display_name || '',
      description: role.description || '',
      active: role.active ?? true,
    });
    setShowGroupModal(true);
  };

  const handleDeleteGroup = async (groupId: number) => {
    if (!confirm('Are you sure you want to delete this group?')) {
      return;
    }
    
    try {
      await roleApi.delete(groupId);
      toast.success('Group deleted successfully');
      fetchRoles();
    } catch (error: any) {
      toast.error('Failed to delete group');
    }
  };

  const handleGroupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingGroup) {
        await roleApi.update(editingGroup.id, {
          display_name: groupFormData.display_name,
          description: groupFormData.description,
          active: groupFormData.active,
        });
        toast.success('Group updated successfully');
      } else {
        await roleApi.create(groupFormData);
        toast.success('Group created successfully');
      }
      setShowGroupModal(false);
      fetchRoles();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save group');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading groups...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="sm:flex sm:items-center mb-6">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Groups & Permissions</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage groups and their assigned permissions.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={handleCreateGroup}
            className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            Add Group
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {roles.map((role) => (
          <div key={role.id} className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900 break-words">
                  {role.display_name || role.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500 break-words">
                  {role.description || `Group: ${role.guard_name}`}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                <button
                  onClick={() => handleViewPermissions(role)}
                  className="flex-1 sm:min-w-[120px] rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                >
                  Permissions
                </button>
                <button
                  onClick={() => handleEditGroup(role)}
                  className="flex-1 sm:flex-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteGroup(role.id)}
                  className="flex-1 sm:flex-none rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Permissions Modal (Read-Only) */}
      {showPermissionsModal && selectedRole && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Permissions for {selectedRole.display_name || selectedRole.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500">View assigned permissions (read-only)</p>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {permissions.length === 0 ? (
                  <p className="text-sm text-gray-500">No permissions available</p>
                ) : permissions.filter(p => rolePermissions.includes(p.id)).length === 0 ? (
                  <p className="text-sm text-gray-500">No permissions assigned to this group</p>
                ) : (
                  permissions.filter(permission => rolePermissions.includes(permission.id)).map((permission) => (
                    <div key={permission.id} className="flex items-start p-3 bg-gray-50 rounded-md">
                      <svg className="h-5 w-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div className="ml-3">
                        <span className="text-sm font-medium text-gray-900">
                          {permission.name}
                        </span>
                        {permission.guard_name && (
                          <p className="text-xs text-gray-500">
                            Guard: {permission.guard_name}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200 mt-4">
                <button
                  type="button"
                  onClick={() => setShowPermissionsModal(false)}
                  className="w-full sm:w-auto rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Group Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {editingGroup ? 'Edit Group' : 'Create Group'}
              </h3>
            </div>
            <form onSubmit={handleGroupSubmit} className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name (Slug)</label>
                <input
                  type="text"
                  required
                  disabled={!!editingGroup}
                  value={groupFormData.name}
                  onChange={(e) => setGroupFormData({ ...groupFormData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100"
                  placeholder="e.g., customer_service"
                />
                {editingGroup && (
                  <p className="mt-1 text-xs text-gray-500">Name cannot be changed after creation</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Display Name</label>
                <input
                  type="text"
                  required
                  value={groupFormData.display_name}
                  onChange={(e) => setGroupFormData({ ...groupFormData, display_name: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  placeholder="e.g., Customer Service"
                />
              </div>

                            <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={groupFormData.description}
                  onChange={(e) => setGroupFormData({ ...groupFormData, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  placeholder="Brief description of this group"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={groupFormData.active}
                  onChange={(e) => setGroupFormData({ ...groupFormData, active: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-900">Active</label>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowGroupModal(false)}
                  className="w-full sm:w-auto rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
                >
                  {editingGroup ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
