import React, { useState, useEffect } from 'react';
import DataTable from '../../components/admin/DataTable';
import { UserPlus } from 'lucide-react';
import { adminService } from '../../api/services';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getUsers({ limit: 100 });
      setUsers(res.data?.data?.users || []);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBan = async (row) => {
    const action = row.status === 'Active' ? 'ban' : 'unban';
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;

    try {
      await adminService.toggleBanUser(row.id);
      fetchUsers();
    } catch (err) {
      console.error('Failed to toggle ban', err);
      alert('Action failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const tableData = users.map(u => ({
    id: u._id,
    name: u.name,
    email: u.email,
    role: u.role === 'super_admin' ? 'Super Admin' : (u.role === 'admin' ? 'Admin' : 'Customer'),
    joined: new Date(u.createdAt).toLocaleDateString(),
    status: u.isActive ? 'Active' : 'Banned',
    originalData: u
  }));

  const columns = [
    { 
      header: 'User', 
      accessor: 'name',
      render: (name, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gold-bg text-gold-accent flex items-center justify-center font-bold text-xs">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-neutral-900">{name}</div>
            <div className="text-xs text-neutral-500">{row.email}</div>
          </div>
        </div>
      )
    },
    { 
      header: 'Role', 
      accessor: 'role',
      render: (role) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${role.includes('Admin') ? 'bg-purple-100 text-purple-700' : 'bg-neutral-100 text-neutral-700'}`}>
          {role}
        </span>
      )
    },
    { header: 'Joined', accessor: 'joined' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (status) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
          status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {status}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Customers</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage user accounts and roles.</p>
        </div>
      </div>

      {loading ? (
        <div className="py-10 text-center text-sm font-bold text-gray-400">Loading users...</div>
      ) : (
        <DataTable 
          columns={columns} 
          data={tableData} 
          onDelete={handleToggleBan}
        />
      )}
    </div>
  );
};

export default AdminUsers;
