import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, createUserByAdmin, deleteUserByAdmin, clearAdminError } from '../features/admin/adminSlice';
import { Link } from 'react-router-dom';
import { UserPlus, LayoutDashboard, Users, Shield, Trash2, MapPin, Search, ChevronRight, Bell, Fuel } from 'lucide-react';
import { fetchAdminFuelPrices, updateFuelPrices } from '../features/tour-planning/fuelSlice';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { users, loading, error } = useSelector((state) => state.admin);
  const { prices: fuelPrices, saving: fuelSaving, error: fuelError } = useSelector((state) => state.fuel);

  const [activeView, setActiveView] = useState('users');
  const [showAddModal, setShowAddModal] = useState(false);
  const [fuelForm, setFuelForm] = useState({ petrol_price: '', diesel_price: '', currency: 'USD' });
  const [fuelFormError, setFuelFormError] = useState(null);
  const [fuelSaveSuccess, setFuelSaveSuccess] = useState(false);
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
    dispatch(fetchAdminFuelPrices());
  }, [dispatch]);

  useEffect(() => {
    if (fuelPrices) {
      setFuelForm({
        petrol_price: fuelPrices.petrol_price ?? '',
        diesel_price: fuelPrices.diesel_price ?? '',
        currency: fuelPrices.currency || 'USD',
      });
    }
  }, [fuelPrices]);

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

  const onFuelChange = (e) => {
    setFuelForm({ ...fuelForm, [e.target.name]: e.target.value });
    setFuelFormError(null);
    setFuelSaveSuccess(false);
  };

  const onFuelSubmit = async (e) => {
    e.preventDefault();
    setFuelFormError(null);
    setFuelSaveSuccess(false);

    const petrol = parseFloat(String(fuelForm.petrol_price).trim());
    const diesel = parseFloat(String(fuelForm.diesel_price).trim());

    if (!Number.isFinite(petrol) || petrol < 0) {
      setFuelFormError('Please enter a valid petrol price (e.g. 355)');
      return;
    }
    if (!Number.isFinite(diesel) || diesel < 0) {
      setFuelFormError('Please enter a valid diesel price (e.g. 285)');
      return;
    }

    const result = await dispatch(updateFuelPrices({
      petrol_price: petrol,
      diesel_price: diesel,
      currency: fuelForm.currency,
    }));

    if (updateFuelPrices.fulfilled.match(result)) {
      setFuelSaveSuccess(true);
    } else {
      setFuelFormError(result.payload?.message || fuelError || 'Failed to update fuel prices');
    }
  };

  const isSuperAdmin = user?.role === 'super_admin';

  return (
    <div className="admin-layout admin-with-navbar" style={{ display: 'flex', minHeight: 'calc(100vh - 72px)', backgroundColor: '#020617', color: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
      <aside
        className="admin-sidebar"
        style={{
        width: '280px', 
        backgroundColor: '#0f172a', 
        borderRight: '1px solid #1e293b', 
        display: 'flex', 
        flexDirection: 'column',
        padding: '2rem 1.5rem',
        position: 'fixed',
        top: '72px',
        height: 'calc(100vh - 72px)',
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3.5rem', padding: '0 0.5rem' }}>
          <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={24} color="white" />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>ADMIN.PANEL</h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <SidebarLink icon={<LayoutDashboard size={20} />} label="Overview" active={activeView === 'users'} onClick={() => setActiveView('users')} />
          <SidebarLink icon={<Users size={20} />} label="Manage Users" active={activeView === 'users'} onClick={() => setActiveView('users')} />
          <SidebarLink icon={<Fuel size={20} />} label="Fuel Price Settings" active={activeView === 'fuel'} onClick={() => setActiveView('fuel')} />
          <SidebarLink icon={<MapPin size={20} />} label="Destinations" to="/destinations" />
          <SidebarLink icon={<Shield size={20} />} label="Security" />
          <SidebarLink icon={<Bell size={20} />} label="Notifications" />
        </nav>

        <div style={{ marginTop: 'auto', borderTop: '1px solid #1e293b', paddingTop: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                {user?.email?.[0].toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
                <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user?.email?.split('@')[0]}</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', textTransform: 'capitalize' }}>{user?.role}</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="admin-main" style={{ flex: 1, marginLeft: '280px', padding: '0 3rem 3rem 3rem' }}>
        {/* Top Header */}
        <header style={{ 
          height: '100px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderBottom: '1px solid #1e293b',
          marginBottom: '3rem',
          position: 'sticky',
          top: '72px',
          backgroundColor: 'rgba(2, 6, 23, 0.8)',
          backdropFilter: 'blur(8px)',
          zIndex: 40
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#0f172a', padding: '0.75rem 1.5rem', borderRadius: '1rem', border: '1px solid #1e293b', width: '400px' }}>
            <Search size={18} color="#64748b" />
            <input 
              type="text" 
              placeholder="Search user, role or status..." 
              style={{ background: 'none', border: 'none', color: 'white', flex: 1, outline: 'none', fontSize: '0.9rem' }}
            />
          </div>
          <Button onClick={() => setShowAddModal(true)} style={{ width: 'auto', padding: '0.75rem 1.5rem', borderRadius: '1rem', background: 'linear-gradient(135deg, #6366f1, #a855f7)', border: 'none', display: activeView === 'users' ? 'flex' : 'none' }}>
            <UserPlus size={18} /> <span style={{ marginLeft: '0.5rem' }}>Create New User</span>
          </Button>
        </header>

        {activeView === 'users' ? (
        <>
        <section style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>User Management</h1>
            <p style={{ color: '#64748b' }}>Manage and monitor all platform accounts from one place.</p>
        </section>

        <section style={{ backgroundColor: '#0f172a', borderRadius: '2rem', border: '1px solid #1e293b', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: 'rgba(255,255,255,0.02)', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <tr>
                <th style={{ padding: '1.5rem 2rem' }}>Email Address</th>
                <th style={{ padding: '1.5rem 2rem' }}>Authorized Role</th>
                <th style={{ padding: '1.5rem 2rem' }}>Region</th>
                <th style={{ padding: '1.5rem 2rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} style={{ borderBottom: '1px solid #1e293b', transition: 'background 0.2s' }}>
                  <td style={{ padding: '1.5rem 2rem' }}>
                    <div style={{ fontWeight: 600 }}>{u.email}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>UID: {u._id.slice(-8).toUpperCase()}</div>
                  </td>
                  <td style={{ padding: '1.5rem 2rem' }}>
                    <span style={{ 
                      padding: '0.4rem 0.8rem', 
                      borderRadius: '0.75rem', 
                      fontSize: '0.75rem', 
                      fontWeight: 700,
                      backgroundColor: u.role === 'admin' ? 'rgba(99, 102, 241, 0.1)' : u.role === 'tour_guide' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(148, 163, 184, 0.1)',
                      color: u.role === 'admin' ? '#818cf8' : u.role === 'tour_guide' ? '#34d399' : '#f8fafc',
                      border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '1.5rem 2rem', color: '#94a3b8' }}>{u.country || 'Not Specified'}</td>
                  <td style={{ padding: '1.5rem 2rem' }}>
                    <button onClick={() => handleDelete(u._id)} style={{ padding: '0.5rem', color: '#ef4444', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', borderRadius: '0.5rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <div style={{ padding: '6rem', textAlign: 'center', color: '#64748b' }}>No verified users found in the database.</div>}
        </section>
        </>
        ) : (
        <>
        <section style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Fuel Price Settings</h1>
          <p style={{ color: '#64748b' }}>Set global petrol and diesel prices used for trip cost calculations.</p>
        </section>

        <section style={{ backgroundColor: '#0f172a', borderRadius: '2rem', border: '1px solid #1e293b', padding: '2.5rem', maxWidth: '560px' }}>
          <form onSubmit={onFuelSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Input
              label="Petrol Price (per Liter)"
              name="petrol_price"
              type="number"
              step="0.01"
              min="0"
              value={fuelForm.petrol_price}
              onChange={onFuelChange}
              required
            />
            <Input
              label="Diesel Price (per Liter)"
              name="diesel_price"
              type="number"
              step="0.01"
              min="0"
              value={fuelForm.diesel_price}
              onChange={onFuelChange}
              required
            />
            <div>
              <label style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>Currency</label>
              <select name="currency" value={fuelForm.currency} onChange={onFuelChange} style={selectStyle}>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="LKR">LKR (Rs)</option>
              </select>
            </div>
            <Button type="submit" loading={fuelSaving}>Save Fuel Prices</Button>
            {fuelSaveSuccess && (
              <p style={{ color: '#34d399', fontSize: '0.9rem' }}>Fuel prices updated successfully.</p>
            )}
            {(fuelFormError || fuelError) && (
              <p style={{ color: '#ef4444', fontSize: '0.9rem' }}>{fuelFormError || fuelError}</p>
            )}
          </form>
        </section>
        </>
        )}
      </main>

      {/* Add User Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div style={modalOverlayStyle}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ 
              backgroundColor: '#0f172a',
              padding: '3rem',
              borderRadius: '2rem',
              border: '1px solid #1e293b',
              width: '100%',
              maxWidth: '550px',
              boxShadow: '0 50px 100px -20px rgba(0,0,0,0.9)'
            }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '2rem' }}>Invite New User</h2>
              <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <Input label="Email Address" name="email" value={formData.email} onChange={onChange} required />
                <Input label="Temporary Password" type="password" name="password" value={formData.password} onChange={onChange} required />
                
                <div>
                  <label style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>Assign System Role</label>
                  <select name="role" value={formData.role} onChange={onChange} style={selectStyle}>
                    <option value="user">Standard User</option>
                    <option value="tour_guide">Tour Guide</option>
                    {isSuperAdmin && <option value="admin">System Administrator</option>}
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <Button type="submit" loading={loading}>Authorise & Create</Button>
                    <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
                </div>
                {error && <p style={{ color: '#ef4444', marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>{error}</p>}
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SidebarLink = ({ icon, label, active, to, onClick }) => {
  const style = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
    padding: '0.85rem 1rem',
    borderRadius: '0.75rem',
    backgroundColor: active ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
    color: active ? '#818cf8' : '#94a3b8',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '0.9rem',
    transition: 'all 0.2s',
    border: active ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid transparent',
    cursor: 'pointer',
    width: '100%',
    boxSizing: 'border-box',
  };

  if (to) {
    return <Link to={to} style={style}>{icon} <span>{label}</span></Link>;
  }

  return (
    <button type="button" onClick={onClick} style={{ ...style, background: style.backgroundColor, border: style.border }}>
      {icon} <span>{label}</span>
      {active && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
    </button>
  );
};

const modalOverlayStyle = { position: 'fixed', inset: 0, backgroundColor: 'rgba(2, 6, 23, 0.9)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' };
const selectStyle = { width: '100%', padding: '1rem', borderRadius: '0.75rem', backgroundColor: 'rgba(255,255,255,0.02)', color: '#f8fafc', border: '1px solid #1e293b', cursor: 'pointer', outline: 'none' };

export default AdminDashboard;
