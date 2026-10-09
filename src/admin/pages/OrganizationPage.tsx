import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Layers, Users, Eye, Plus, Edit2, CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { AdminAppShell } from '../components/AdminAppShell';
import { getAllDepartments, createDepartment, updateDepartment } from '../../services/departmentService';
import type { Department } from '../../types/database.types';

export const OrganizationPage: React.FC = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'departments' | 'sections'>('departments');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadDepts = async () => {
    setLoading(true);
    const data = await getAllDepartments();
    setDepartments(data);
    setLoading(false);
  };

  useEffect(() => {
    loadDepts();
  }, []);

  const handleOpenCreate = () => {
    setEditingDept(null);
    setName('');
    setCode('');
    setStatus('ACTIVE');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dept: Department) => {
    setEditingDept(dept);
    setName(dept.name);
    setCode(dept.code || '');
    setStatus(dept.status);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      setErrorMsg('Department name and code are required.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    try {
      if (editingDept) {
        await updateDepartment(editingDept.id, { name: name.trim(), code: code.trim(), status });
      } else {
        await createDepartment({ name: name.trim(), code: code.trim(), status });
      }
      setIsModalOpen(false);
      await loadDepts();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save department');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (dept: Department) => {
    const newStatus = dept.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await updateDepartment(dept.id, { status: newStatus });
      await loadDepts();
    } catch (err: any) {
      alert(`Error updating department status: ${err.message}`);
    }
  };

  return (
    <AdminAppShell>
      {/* Header Banner */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge badge-active font-mono" style={{ backgroundColor: 'var(--brand-black)', color: '#FFF' }}>ORGANIZATION MANAGEMENT</span>
          <h1 className="font-display" style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--brand-black)', marginTop: '0.25rem', marginBottom: 0 }}>
            Departments & Governance
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--brand-dark-grey)', marginTop: '0.2rem' }}>
            Institutional Structure, Department Code & Active Status Matrix
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={handleOpenCreate}
            className="btn btn-primary"
            style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Plus size={16} />
            <span>Create Department</span>
          </button>
          
          <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'var(--brand-light-grey)', padding: '0.25rem', borderRadius: 'var(--border-radius)', border: '1px solid rgba(156, 163, 175, 0.2)' }}>
            <button 
              onClick={() => setActiveTab('departments')}
              className={`btn ${activeTab === 'departments' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}
            >
              Departments ({departments.length})
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', gap: '1rem' }}>
          <Loader2 className="animate-spin text-orange" size={36} />
          <p style={{ color: 'var(--brand-dark-grey)', fontSize: '0.9rem' }}>Loading Departments...</p>
        </div>
      ) : activeTab === 'departments' ? (
        /* Departments List Grid */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {departments.map((dept) => (
            <div key={dept.id} className="dashboard-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                  <div>
                    <span className="badge badge-active font-mono font-bold" style={{ fontSize: '0.8rem' }}>{dept.code}</span>
                    <h3 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-black)', marginTop: '0.25rem', marginBottom: 0 }}>
                      {dept.name}
                    </h3>
                  </div>
                  <span className={`badge ${dept.status === 'ACTIVE' ? 'badge-active' : 'badge-overdue'}`}>
                    {dept.status}
                  </span>
                </div>

                <div style={{ backgroundColor: 'var(--brand-light-grey)', padding: '0.85rem', borderRadius: 'var(--border-radius)', marginBottom: '1rem', fontSize: '0.85rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-dark-grey)', textTransform: 'uppercase' }}>DEPARTMENT UUID</div>
                  <div style={{ fontWeight: 600, color: 'var(--brand-black)', marginTop: '0.15rem', fontSize: '0.75rem', wordBreak: 'break-all' }} className="font-mono">{dept.id}</div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(156, 163, 175, 0.2)', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => handleToggleStatus(dept)}
                  className={`btn ${dept.status === 'ACTIVE' ? 'btn-secondary' : 'btn-primary'}`}
                  style={{ fontSize: '0.775rem', padding: '0.35rem 0.65rem' }}
                >
                  {dept.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                </button>

                <button 
                  onClick={() => handleOpenEdit(dept)}
                  className="btn btn-secondary font-sans"
                  style={{ fontSize: '0.775rem', padding: '0.35rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Edit2 size={14} />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {/* Create / Edit Department Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem'
        }}>
          <div className="dashboard-panel" style={{ width: '100%', maxWidth: '480px', backgroundColor: 'var(--brand-white)', borderRadius: 'var(--border-radius)', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 className="font-display" style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--brand-black)' }}>
                {editingDept ? 'Edit Department' : 'Create Department'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: 'var(--brand-dark-grey)' }}
              >
                ×
              </button>
            </div>

            {errorMsg && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '0.75rem', borderRadius: 'var(--border-radius)', marginBottom: '1rem', fontSize: '0.85rem' }}>
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: 'var(--brand-black)', marginBottom: '0.35rem' }}>
                  Department Name *
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Artificial Intelligence & Machine Learning"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--border-radius)', border: '1px solid rgba(156, 163, 175, 0.4)', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: 'var(--brand-black)', marginBottom: '0.35rem' }}>
                  Department Code *
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. AIML"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--border-radius)', border: '1px solid rgba(156, 163, 175, 0.4)', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: 'var(--brand-black)', marginBottom: '0.35rem' }}>
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'ACTIVE' | 'INACTIVE')}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--border-radius)', border: '1px solid rgba(156, 163, 175, 0.4)', fontSize: '0.9rem' }}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.85rem' }}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  disabled={submitting}
                >
                  {submitting && <Loader2 className="animate-spin" size={14} />}
                  <span>{editingDept ? 'Save Changes' : 'Create Department'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminAppShell>
  );
};

export default OrganizationPage;
