import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Eye, 
  Edit3, 
  ShieldAlert, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  KeyRound, 
  AlertTriangle, 
  X,
  RefreshCw
} from 'lucide-react';
import { AdminAppShell } from '../components/AdminAppShell';
import { getUsers, deactivateUser, reactivateUser, lockUser, unlockUser, resetUserPassword, changeUserRole } from '../../services/userService';
import type { User, UserRole, AccountStatus } from '../../shared/types/user';

export const UserList: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Name');

  // Confirmation Modal State
  const [activeModalUser, setActiveModalUser] = useState<User | null>(null);
  const [modalAction, setModalAction] = useState<'deactivate' | 'reactivate' | 'lock' | 'unlock' | 'resetPassword' | 'changeRole' | null>(null);
  const [selectedNewRole, setSelectedNewRole] = useState<UserRole>('STUDENT');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers(roleFilter, deptFilter, statusFilter, searchQuery, sortBy);
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, deptFilter, statusFilter, searchQuery, sortBy]);

  const handleOpenConfirm = (user: User, action: 'deactivate' | 'reactivate' | 'lock' | 'unlock' | 'resetPassword' | 'changeRole') => {
    setActiveModalUser(user);
    setModalAction(action);
    if (action === 'changeRole') {
      setSelectedNewRole(user.role);
    }
  };

  const handleExecuteAction = async () => {
    if (!activeModalUser || !modalAction) return;

    let success = false;
    let msg = '';

    if (modalAction === 'deactivate') {
      const res = await deactivateUser(activeModalUser.id);
      if (res) { success = true; msg = `Account for ${activeModalUser.name} deactivated successfully.`; }
    } else if (modalAction === 'reactivate') {
      const res = await reactivateUser(activeModalUser.id);
      if (res) { success = true; msg = `Account for ${activeModalUser.name} reactivated.`; }
    } else if (modalAction === 'lock') {
      const res = await lockUser(activeModalUser.id);
      if (res) { success = true; msg = `Security lock applied to ${activeModalUser.name}.`; }
    } else if (modalAction === 'unlock') {
      const res = await unlockUser(activeModalUser.id);
      if (res) { success = true; msg = `Security lock removed from ${activeModalUser.name}.`; }
    } else if (modalAction === 'resetPassword') {
      const res = await resetUserPassword(activeModalUser.id);
      if (res) { success = true; msg = `Password reset notification dispatched for ${activeModalUser.name}.`; }
    } else if (modalAction === 'changeRole') {
      const res = await changeUserRole(activeModalUser.id, selectedNewRole);
      if (res) { success = true; msg = `Role updated to ${selectedNewRole} for ${activeModalUser.name}.`; }
    }

    if (success) {
      setActionSuccessMsg(msg);
      setActiveModalUser(null);
      setModalAction(null);
      fetchUsers();
      setTimeout(() => setActionSuccessMsg(null), 4000);
    }
  };

  return (
    <AdminAppShell>
      {/* Header Banner */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge badge-active font-mono" style={{ backgroundColor: 'var(--brand-black)', color: '#FFF' }}>USER DIRECTORY</span>
          <h1 className="font-display" style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--brand-black)', marginTop: '0.25rem', marginBottom: 0 }}>
            User Account Management
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--brand-dark-grey)', marginTop: '0.2rem' }}>
            Institution Master Roster: Students, Faculty, Department Heads & System Administrators
          </p>
        </div>

        <button 
          onClick={() => navigate('/admin/users/create')}
          className="btn btn-primary font-sans"
        >
          <UserPlus size={16} />
          <span>Add New User</span>
        </button>
      </div>

      {/* Success Notification Alert */}
      {actionSuccessMsg && (
        <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #6EE7B7', color: '#065F46', padding: '0.85rem 1.25rem', borderRadius: 'var(--border-radius)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <CheckCircle2 size={18} />
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Filter and Search Bar Panel */}
      <div className="dashboard-panel" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'center' }}>
          
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--brand-dark-grey)' }} />
            <input 
              type="text"
              placeholder="Search name, USN/EMP ID..."
              className="form-input font-sans"
              style={{ paddingLeft: '2.35rem', fontSize: '0.85rem' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Role Filter */}
          <div>
            <select 
              className="form-select font-sans"
              style={{ fontSize: '0.85rem' }}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="All">All Roles</option>
              <option value="STUDENT">Student</option>
              <option value="FACULTY">Faculty</option>
              <option value="HOD">HOD</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select 
              className="form-select font-sans"
              style={{ fontSize: '0.85rem' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Locked">Locked</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select 
              className="form-select font-sans"
              style={{ fontSize: '0.85rem' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="Name">Sort by Name</option>
              <option value="Role">Sort by Role</option>
              <option value="Department">Sort by Department</option>
              <option value="Status">Sort by Status</option>
            </select>
          </div>

        </div>
      </div>

      {/* Main User Master Table */}
      <div className="dashboard-panel" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--brand-dark-grey)' }}>
            Loading User Records...
          </div>
        ) : users.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--brand-dark-grey)' }}>
            <Users size={36} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
            <div>No user accounts found matching selected criteria.</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--brand-light-grey)', borderBottom: '1px solid rgba(156, 163, 175, 0.2)', color: 'var(--brand-black)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.03em' }}>
                  <th style={{ padding: '0.85rem 1rem' }}>User & Identification</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Role</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Department & Section</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Last Activity</th>
                  <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid rgba(156, 163, 175, 0.15)' }}>
                    {/* User Name & Email */}
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--brand-black)' }}>{u.name}</div>
                      <div style={{ fontSize: '0.775rem', color: 'var(--brand-dark-grey)', marginTop: '0.1rem' }}>
                        ID: <span className="font-mono text-blue font-bold">{u.userId}</span> · {u.email}
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span 
                        className="badge font-mono font-bold" 
                        style={{
                          backgroundColor: u.role === 'ADMIN' ? 'var(--brand-black)' : u.role === 'HOD' ? '#4C1D95' : u.role === 'FACULTY' ? 'var(--brand-orange)' : 'var(--brand-blue)',
                          color: '#FFF'
                        }}
                      >
                        {u.role}
                      </span>
                    </td>

                    {/* Department & Section */}
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--brand-black)' }}>{u.departmentName}</div>
                      {u.role === 'STUDENT' && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--brand-dark-grey)' }}>
                          Semester {u.semester} ({u.section || 'Sec A'})
                        </div>
                      )}
                      {(u.role === 'FACULTY' || u.role === 'HOD') && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--brand-dark-grey)' }}>
                          {u.designation}
                        </div>
                      )}
                    </td>

                    {/* Account Status Badge */}
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className={`badge ${u.status === 'Active' ? 'badge-active' : u.status === 'Locked' ? 'badge-error' : 'badge-pending'}`}>
                        {u.status}
                      </span>
                    </td>

                    {/* Last Activity */}
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: 'var(--brand-dark-grey)' }}>
                      {u.lastActivity}
                    </td>

                    {/* Admin Actions */}
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => navigate(`/admin/users/${u.id}`)}
                          className="btn btn-secondary"
                          style={{ padding: '0.3rem 0.5rem' }}
                          title="View Profile Details"
                        >
                          <Eye size={14} />
                        </button>

                        <button 
                          onClick={() => navigate(`/admin/users/${u.id}/edit`)}
                          className="btn btn-secondary"
                          style={{ padding: '0.3rem 0.5rem' }}
                          title="Edit User Information"
                        >
                          <Edit3 size={14} />
                        </button>

                        <button 
                          onClick={() => handleOpenConfirm(u, 'changeRole')}
                          className="btn btn-secondary"
                          style={{ padding: '0.3rem 0.5rem' }}
                          title="Change Role"
                        >
                          <RefreshCw size={14} />
                        </button>

                        <button 
                          onClick={() => handleOpenConfirm(u, 'resetPassword')}
                          className="btn btn-secondary"
                          style={{ padding: '0.3rem 0.5rem' }}
                          title="Reset Password"
                        >
                          <KeyRound size={14} />
                        </button>

                        {u.status === 'Active' ? (
                          <button 
                            onClick={() => handleOpenConfirm(u, 'deactivate')}
                            className="btn btn-secondary"
                            style={{ padding: '0.3rem 0.5rem', color: 'var(--color-error)' }}
                            title="Deactivate Account"
                          >
                            <ShieldAlert size={14} />
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleOpenConfirm(u, 'reactivate')}
                            className="btn btn-secondary"
                            style={{ padding: '0.3rem 0.5rem', color: 'var(--color-success)' }}
                            title="Reactivate Account"
                          >
                            <CheckCircle2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {activeModalUser && modalAction && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="dashboard-panel" style={{ width: '100%', maxWidth: '520px', backgroundColor: '#FFF', borderRadius: 'var(--border-radius)', boxShadow: 'var(--box-shadow-lg)', padding: '1.75rem' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: modalAction === 'deactivate' || modalAction === 'lock' ? 'var(--color-error)' : 'var(--brand-black)' }}>
                <AlertTriangle size={20} />
                <h3 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                  Confirm Administrative Action
                </h3>
              </div>
              <button onClick={() => setActiveModalUser(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--brand-dark-grey)' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ fontSize: '0.9rem', color: 'var(--brand-black)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              {modalAction === 'deactivate' && (
                <p>Are you sure you want to <strong>deactivate</strong> account for <strong>{activeModalUser.name}</strong> (<span className="font-mono text-blue">{activeModalUser.userId}</span>)? The user will be unable to log in until reactivated.</p>
              )}
              {modalAction === 'reactivate' && (
                <p>Reactivate portal access for <strong>{activeModalUser.name}</strong> (<span className="font-mono text-blue">{activeModalUser.userId}</span>)?</p>
              )}
              {modalAction === 'resetPassword' && (
                <p>Initiate administrative password reset for <strong>{activeModalUser.name}</strong>? Password status will be marked as <em>Reset Required</em>. No plaintext passwords will be exposed.</p>
              )}
              {modalAction === 'changeRole' && (
                <div>
                  <p style={{ marginBottom: '0.85rem' }}>Select new application role for <strong>{activeModalUser.name}</strong>:</p>
                  <select 
                    className="form-select font-sans"
                    value={selectedNewRole}
                    onChange={(e) => setSelectedNewRole(e.target.value as UserRole)}
                    style={{ marginBottom: '0.85rem' }}
                  >
                    <option value="STUDENT">Student</option>
                    <option value="FACULTY">Faculty</option>
                    <option value="HOD">HOD</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                  <p style={{ fontSize: '0.8rem', color: 'var(--brand-dark-grey)' }}>Changing this user's role will update their portal navigation and permission clearance.</p>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setActiveModalUser(null)} className="btn btn-secondary font-sans">
                Cancel
              </button>
              <button 
                onClick={handleExecuteAction} 
                className={`btn ${modalAction === 'deactivate' ? 'btn-danger' : 'btn-primary'} font-sans`}
              >
                Confirm Action
              </button>
            </div>

          </div>
        </div>
      )}
    </AdminAppShell>
  );
};

export default UserList;
