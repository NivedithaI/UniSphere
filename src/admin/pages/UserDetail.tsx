import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User as UserIcon, 
  ShieldCheck, 
  Building2, 
  Calendar, 
  Mail, 
  Phone, 
  Edit3, 
  ArrowLeft, 
  ShieldAlert, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  KeyRound, 
  Clock,
  AlertTriangle
} from 'lucide-react';
import { AdminAppShell } from '../components/AdminAppShell';
import { getUserById, deactivateUser, reactivateUser, lockUser, unlockUser, resetUserPassword } from '../../services/userService';
import type { User } from '../../shared/types/user';

export const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchUser = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const u = await getUserById(id);
      setUser(u);
    } catch (err) {
      console.error("Error loading user:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  const handleDeactivate = async () => {
    if (!user) return;
    if (confirm(`Are you sure you want to deactivate ${user.name}?`)) {
      const res = await deactivateUser(user.id);
      if (res) {
        setUser(res);
        setActionMessage(`Account for ${user.name} deactivated.`);
      }
    }
  };

  const handleReactivate = async () => {
    if (!user) return;
    const res = await reactivateUser(user.id);
    if (res) {
      setUser(res);
      setActionMessage(`Account for ${user.name} reactivated.`);
    }
  };

  const handleLockUnlock = async () => {
    if (!user) return;
    if (user.status === 'Locked') {
      const res = await unlockUser(user.id);
      if (res) { setUser(res); setActionMessage(`Account unlocked.`); }
    } else {
      const res = await lockUser(user.id);
      if (res) { setUser(res); setActionMessage(`Administrative lock applied.`); }
    }
  };

  const handleResetPassword = async () => {
    if (!user) return;
    const res = await resetUserPassword(user.id);
    if (res) {
      fetchUser();
      setActionMessage(`Administrative password reset initiated.`);
    }
  };

  if (loading) {
    return (
      <AdminAppShell>
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--brand-dark-grey)' }}>
          Loading User Profile...
        </div>
      </AdminAppShell>
    );
  }

  if (!user) {
    return (
      <AdminAppShell>
        <div className="dashboard-panel" style={{ textAlign: 'center', padding: '3rem' }}>
          <AlertTriangle size={36} style={{ color: 'var(--color-error)', marginBottom: '0.5rem' }} />
          <h2>User Account Not Found</h2>
          <button onClick={() => navigate('/admin/users')} className="btn btn-primary font-sans" style={{ marginTop: '1rem' }}>
            Return to User Directory
          </button>
        </div>
      </AdminAppShell>
    );
  }

  return (
    <AdminAppShell>
      {/* Header Banner */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={() => navigate('/admin/users')} className="btn btn-secondary" style={{ padding: '0.4rem 0.6rem' }}>
            <ArrowLeft size={16} />
          </button>
          <div>
            <span className="badge badge-active font-mono" style={{ backgroundColor: 'var(--brand-black)', color: '#FFF' }}>USER PROFILE</span>
            <h1 className="font-display" style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--brand-black)', marginTop: '0.25rem', marginBottom: 0 }}>
              {user.name}
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--brand-dark-grey)', marginTop: '0.1rem' }}>
              USN / Employee ID: <strong className="font-mono text-blue">{user.userId}</strong>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => navigate(`/admin/users/${user.id}/edit`)}
            className="btn btn-primary font-sans"
          >
            <Edit3 size={16} />
            <span>Edit Information</span>
          </button>

          <button 
            onClick={handleResetPassword}
            className="btn btn-secondary font-sans"
          >
            <KeyRound size={16} />
            <span>Reset Password</span>
          </button>

          {user.status === 'Active' ? (
            <button 
              onClick={handleDeactivate}
              className="btn btn-secondary font-sans"
              style={{ color: 'var(--color-error)' }}
            >
              <ShieldAlert size={16} />
              <span>Deactivate</span>
            </button>
          ) : (
            <button 
              onClick={handleReactivate}
              className="btn btn-secondary font-sans"
              style={{ color: 'var(--color-success)' }}
            >
              <CheckCircle2 size={16} />
              <span>Reactivate</span>
            </button>
          )}
        </div>
      </div>

      {/* Action Confirmation Banner */}
      {actionMessage && (
        <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #6EE7B7', color: '#065F46', padding: '0.85rem 1.25rem', borderRadius: 'var(--border-radius)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <CheckCircle2 size={18} />
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{actionMessage}</span>
        </div>
      )}

      {/* Profile Overview Card */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.75rem' }}>
        
        {/* Main Details Panel */}
        <div className="dashboard-panel">
          <h2 className="panel-title font-display" style={{ marginBottom: '1.25rem' }}>Account & Organizational Profile</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', fontSize: '0.875rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-dark-grey)', textTransform: 'uppercase' }}>FULL NAME</span>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--brand-black)', marginTop: '0.2rem' }}>{user.name}</div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-dark-grey)', textTransform: 'uppercase' }}>APPLICATION ROLE</span>
              <div style={{ marginTop: '0.2rem' }}>
                <span className="badge font-mono font-bold" style={{ backgroundColor: 'var(--brand-black)', color: '#FFF' }}>{user.role}</span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-dark-grey)', textTransform: 'uppercase' }}>DEPARTMENT</span>
              <div style={{ fontWeight: 700, color: 'var(--brand-black)', marginTop: '0.2rem' }}>{user.departmentName}</div>
            </div>

            {user.role === 'STUDENT' && (
              <>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-dark-grey)', textTransform: 'uppercase' }}>SEMESTER & SECTION</span>
                  <div style={{ fontWeight: 700, color: 'var(--brand-black)', marginTop: '0.2rem' }}>
                    Semester {user.semester} ({user.section || 'Sec A'})
                  </div>
                </div>
              </>
            )}

            {(user.role === 'FACULTY' || user.role === 'HOD') && (
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-dark-grey)', textTransform: 'uppercase' }}>ACADEMIC DESIGNATION</span>
                <div style={{ fontWeight: 700, color: 'var(--brand-black)', marginTop: '0.2rem' }}>{user.designation || 'Faculty Member'}</div>
              </div>
            )}

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-dark-grey)', textTransform: 'uppercase' }}>EMAIL ADDRESS</span>
              <div style={{ fontWeight: 600, color: 'var(--brand-black)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Mail size={14} style={{ color: 'var(--brand-dark-grey)' }} />
                <span>{user.email}</span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-dark-grey)', textTransform: 'uppercase' }}>PHONE NUMBER</span>
              <div style={{ fontWeight: 600, color: 'var(--brand-black)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Phone size={14} style={{ color: 'var(--brand-dark-grey)' }} />
                <span>{user.phone || 'Not provided'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Access Box */}
        <div className="dashboard-panel">
          <h2 className="panel-title font-display" style={{ marginBottom: '1.25rem' }}>Security Status</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: 'var(--brand-light-grey)', borderRadius: 'var(--border-radius)' }}>
              <span>ACCOUNT STATUS</span>
              <span className={`badge ${user.status === 'Active' ? 'badge-active' : user.status === 'Locked' ? 'badge-error' : 'badge-pending'}`}>
                {user.status}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: 'var(--brand-light-grey)', borderRadius: 'var(--border-radius)' }}>
              <span>PASSWORD MASK</span>
              <span className="font-mono" style={{ fontWeight: 800 }}>••••••••••</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: 'var(--brand-light-grey)', borderRadius: 'var(--border-radius)' }}>
              <span>PASSWORD STATUS</span>
              <span className="font-mono font-bold" style={{ color: 'var(--brand-orange)' }}>{user.passwordStatus || 'Set'}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: 'var(--brand-light-grey)', borderRadius: 'var(--border-radius)' }}>
              <span>LAST PASSWORD RESET</span>
              <span className="font-mono">{user.lastPasswordReset || '2026-06-01'}</span>
            </div>

            <div style={{ marginTop: '0.5rem' }}>
              <button 
                onClick={handleLockUnlock} 
                className="btn btn-secondary font-sans" 
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {user.status === 'Locked' ? <Unlock size={16} /> : <Lock size={16} />}
                <span>{user.status === 'Locked' ? 'Unlock Account' : 'Lock Account'}</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </AdminAppShell>
  );
};

export default UserDetail;
