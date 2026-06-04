import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { fetchAllUsers, createUserByAdmin, deleteUserByAdmin, clearAdminError } from '../features/admin/adminSlice';
import { useNavigate } from 'react-router-dom';
import { UserPlus, LogOut, LayoutDashboard, Users, Shield, Trash2 } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { users, loading, error } = useSelector((state) => state.admin);

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user',
    phone_number: '',
    current_address: '',
    country: ''
  });

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(createUserByAdmin(formData));
    if (createUserByAdmin.fulfilled.match(resultAction)) {
      setShowAddModal(false);
      setFormData({ email: '', password: '', role: 'user', phone_number: '', current_address: '', country: '' });
      dispatch(fetchAllUsers());
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUserByAdmin(id));
    }
  };

  const isSuperAdmin = user?.role === 'super_admin';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f172a' }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', backgroundColor: '#1e293b', padding: '2rem 1.5rem', borderRight: '1px solid #334155' }}>
        <h2 style={{ color: '#6366f1', marginBottom: '3rem', fontSize: '1.5rem' }}>Admin Portal</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Overview" active />
          <SidebarItem icon={<Users size={20} />} label="User Management" />
          <SidebarItem icon={<Shield size={20} />} label="System Logs" />
        </nav>
        <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
          <button onClick={handleLogout} style={logoutButtonStyle}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '3rem' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Management Dashboard</h1>
            <p style={{ color: '#94a3b8' }}>Logged in as <span style={{ color: '#6366f1' }}>{user?.role}</span></p>
          </div>
          <Button onClick={() => setShowAddModal(true)} style={{ width: 'auto' }}>
            <UserPlus size={18} /> Add New {isSuperAdmin ? 'Admin/User' : 'User'}
          </Button>
        </header>

        <section style={{ backgroundColor: '#1e293b', borderRadius: '1rem', border: '1px solid #334155', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: '#334155', color: '#94a3b8', fontSize: '0.875rem' }}>
              <tr>
                <th style={{ padding: '1rem 2rem' }}>Email</th>
                <th style={{ padding: '1rem 2rem' }}>Role</th>
                <th style={{ padding: '1rem 2rem' }}>Country</th>
                <th style={{ padding: '1rem 2rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '1rem 2rem' }}>{u.email}</td>
                  <td style={{ padding: '1rem 2rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '1rem', 
                      fontSize: '0.75rem', 
                      backgroundColor: u.role === 'admin' ? '#1e1b4b' : u.role === 'tour_guide' ? '#064e3b' : '#334155',
                      color: u.role === 'admin' ? '#818cf8' : u.role === 'tour_guide' ? '#34d399' : '#f8fafc'
                    }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 2rem', color: '#94a3b8' }}>{u.country || 'N/A'}</td>
                  <td style={{ padding: '1rem 2rem' }}>
                    <button onClick={() => handleDelete(u._id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <p style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No users found.</p>}
        </section>
      </main>

      {/* Add User Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div style={modalOverlayStyle}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="glass-card" style={{ maxWidth: '500px' }}>
              <h2 style={{ marginBottom: '1.5rem' }}>Add New User</h2>
              <form onSubmit={onSubmit}>
                <Input label="Email" name="email" value={formData.email} onChange={onChange} required />
                <Input label="Password" type="password" name="password" value={formData.password} onChange={onChange} required />
                
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ fontSize: '0.875rem', color: '#94a3b8', display: 'block', marginBottom: '0.5rem' }}>Role</label>
                  <select name="role" value={formData.role} onChange={onChange} style={selectStyle}>
                    <option value="user">User</option>
                    <option value="tour_guide">Tour Guide</option>
                    {isSuperAdmin && <option value="admin">Admin</option>}
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <Button type="submit" loading={loading}>Create User</Button>
                  <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
                </div>
                {error && <p style={{ color: '#ef4444', marginTop: '1rem' }}>{error}</p>}
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SidebarItem = ({ icon, label, active }) => (
  <div style={{ 
    display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '0.5rem',
    backgroundColor: active ? '#334155' : 'transparent', color: active ? '#f8fafc' : '#94a3b8', cursor: 'pointer'
  }}>
    {icon} <span>{label}</span>
  </div>
);

const logoutButtonStyle = { display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', padding: '0.75rem' };
const modalOverlayStyle = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' };
const selectStyle = { width: '100%', padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: '#0f172a', color: '#f8fafc', border: '1px solid #334155' };

export default AdminDashboard;
