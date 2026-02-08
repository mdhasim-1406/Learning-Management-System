import { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../api';
import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui-next/Button';
import Input from '../components/ui-next/Input';
import Badge from '../components/ui-next/Badge';
import Avatar from '../components/ui-next/Avatar';
import Card, { CardContent } from '../components/ui-next/Card';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '../components/ui-next/Table';
import Modal from '../components/ui-next/Modal';
import Skeleton from '../components/ui-next/Skeleton';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants, fadeInUp } from '../lib/animations';

// Icons
function PlusIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function SearchIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function UsersIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

const ROLE_FILTERS = [
  { value: 'all', label: 'All Roles' },
  { value: 'learner', label: 'Learners' },
  { value: 'trainer', label: 'Trainers' },
  { value: 'admin', label: 'Admins' },
  { value: 'superadmin', label: 'Super Admins' },
];

const STATUS_FILTERS = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const getRoleBadgeVariant = (role) => {
  switch (role) {
    case 'superadmin':
      return 'default';
    case 'admin':
      return 'destructive';
    case 'trainer':
      return 'secondary';
    default:
      return 'outline';
  }
};

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'learner' });
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await createUser(formData);
      setShowModal(false);
      setFormData({ name: '', email: '', password: '', role: 'learner' });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (user) => {
    try {
      await updateUser(user._id, { isActive: !user.isActive });
      fetchUsers();
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to deactivate this user?')) return;
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && user.isActive) ||
      (statusFilter === 'inactive' && !user.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: users.length,
    active: users.filter((u) => u.isActive).length,
    learners: users.filter((u) => u.role === 'learner').length,
    trainers: users.filter((u) => u.role === 'trainer').length,
  };

  if (loading) {
    return (
      <AppLayout>
        <PageHeader title="User Management" />
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="space-y-6"
      >
        <PageHeader
          title="User Management"
          subtitle={`${users.length} total users`}
          actions={
            <Button onClick={() => setShowModal(true)} variant="luxury">
              <PlusIcon className="w-4 h-4 mr-2" />
              Create User
            </Button>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={UsersIcon}
            label="Total Users"
            value={stats.total}
            color="text-emerald-600"
            bgColor="bg-emerald-100"
          />
          <StatCard
            icon={() => <div className="w-3 h-3 rounded-full bg-teal-500" />}
            label="Active"
            value={stats.active}
            color="text-teal-600"
            bgColor="bg-teal-100"
          />
          <StatCard
            textIcon="L"
            label="Learners"
            value={stats.learners}
            color="text-blue-600"
            bgColor="bg-blue-100"
          />
          <StatCard
            textIcon="T"
            label="Trainers"
            value={stats.trainers}
            color="text-purple-600"
            bgColor="bg-purple-100"
          />
        </div>

        {/* Filters */}
        <Card className="mb-6 border-stone-200">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 z-10" />
                <Input
                  type="text"
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                  variant="bordered"
                />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                {ROLE_FILTERS.map((filter) => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                {STATUS_FILTERS.map((filter) => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="border-stone-200 overflow-hidden" padding="none">
          <Table aria-label="Users table">
            <TableHeader>
              <TableColumn>USER</TableColumn>
              <TableColumn>DEPARTMENT</TableColumn>
              <TableColumn>ROLE</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn align="end">ACTIONS</TableColumn>
            </TableHeader>
            <TableBody emptyContent={<div className="text-center py-12"><UsersIcon className="w-12 h-12 text-stone-300 mx-auto mb-4" /><p className="text-stone-500 font-medium">No users found</p></div>}>
              {filteredUsers.map((user) => (
                <TableRow key={user._id} className="hover:bg-stone-50 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar src={user.avatar} name={user.name} size="md" />
                      <div>
                        <p className="text-sm font-semibold text-stone-900">{user.name}</p>
                        <p className="text-sm text-stone-500">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-stone-600">{user.department || '—'}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? 'success' : 'destructive'}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleActive(user)}
                      disabled={user.role === 'superadmin'}
                      className="hover:bg-stone-100 hover:text-stone-900"
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Create User Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Create New User"
        >
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium border border-red-100">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Full Name</label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Email Address</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Password</label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="learner">Learner</option>
                <option value="trainer">Trainer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} variant="luxury">
                {submitting ? 'Creating...' : 'Create User'}
              </Button>
            </div>
          </form>
        </Modal>
      </motion.div>
    </AppLayout>
  );
};

function StatCard({ icon: Icon, textIcon, label, value, color, bgColor }) {
  return (
    <Card className="border-stone-200 hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", bgColor)}>
            {Icon ? (
              <Icon className={cn("w-5 h-5", color)} />
            ) : (
              <span className={cn("font-bold text-lg", color)}>{textIcon}</span>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-stone-500">{label}</p>
            <p className="text-2xl font-bold text-stone-900">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default AdminUsersPage;
