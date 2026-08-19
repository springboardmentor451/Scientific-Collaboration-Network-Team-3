import React, { useEffect, useState } from 'react';
import { userService } from '../../services/userService';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingId, setPendingId] = useState(null);

  const loadUsers = (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    return userService
      .list()
      .then(setUsers)
      .catch(() => setError('Could not load users.'))
      .finally(() => {
        if (!silent) setLoading(false);
      });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggle = async (user) => {
    setPendingId(user.id);
    try {
      await userService.toggleActive(user.id, !user.active);
      await loadUsers(true);
    } catch {
      setError('Could not update that account.');
    } finally {
      setPendingId(null);
    }
  };

  const columns = [
    {
      header: 'User',
      render: (u) => (
        <div>
          <div className="font-semibold text-primary">{u.name}</div>
          <div className="text-xs text-on-surface-variant mt-0.5">{u.email || 'user@example.com'}</div>
        </div>
      ),
    },
    { header: 'Role', render: (u) => <StatusBadge status={u.role} /> },
    {
      header: 'Status',
      render: (u) => (
        <span className={`inline-flex items-center gap-1 font-semibold text-xs ${u.active ? 'text-secondary' : 'text-on-surface-variant'}`}>
          <span className={`w-2 h-2 rounded-full ${u.active ? 'bg-secondary' : 'bg-outline-variant'}`} />
          {u.active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (u) => (
        <button
          type="button"
          disabled={pendingId === u.id}
          onClick={() => handleToggle(u)}
          className="text-primary font-semibold hover:underline text-xs disabled:opacity-50"
        >
          {pendingId === u.id ? 'Updating…' : u.active ? 'Deactivate' : 'Activate'}
        </button>
      ),
    },
  ];

  return (
    <div className="w-full space-y-stack-md">
      <PageHeader
        title="User Management"
        subtitle="Manage platform access, roles, and account statuses."
        actions={<Button icon="person_add">Invite User</Button>}
      />
      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        error={error}
        onRetry={loadUsers}
        emptyIcon="manage_accounts"
        emptyTitle="No users found"
        emptyMessage="Invited accounts will appear in this directory."
      />
    </div>
  );
}
