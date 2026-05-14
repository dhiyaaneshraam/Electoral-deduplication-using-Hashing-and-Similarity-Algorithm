import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const AdminSidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const adminInfo = JSON.parse(localStorage.getItem('adminSession') || '{}')

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '⊞', path: '/admin' },
    { id: 'voters', label: 'Voter Registry', icon: '👥', path: '/admin/voters' },
    { id: 'verification', label: 'Verification Queue', icon: '✓', path: '/admin/verification' },
    { id: 'duplicates', label: 'Duplicate Attempts', icon: '⚠', path: '/admin/duplicates' }
  ]

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin'
    return location.pathname.startsWith(path)
  }

  const styles = {
    sidebar: {
      width: '220px', background: '#1a2254', display: 'flex',
      flexDirection: 'column', padding: '1.5rem 1rem',
      position: 'fixed', height: '100vh', zIndex: 100,
      top: 0, left: 0
    },
    brand: {
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      marginBottom: '2rem', paddingBottom: '1.5rem',
      borderBottom: '1px solid rgba(255,255,255,0.1)'
    },
    brandIcon: {
      width: '40px', height: '40px', background: '#f59e0b',
      borderRadius: '10px', display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0
    },
    navItem: (active) => ({
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '0.25rem',
      background: active ? '#3d4fa0' : 'transparent',
      color: active ? 'white' : '#94a3b8', cursor: 'pointer',
      fontSize: '0.9rem', fontWeight: 500, border: 'none',
      width: '100%', textAlign: 'left', transition: 'all 0.2s'
    }),
    userChip: {
      marginTop: 'auto', padding: '1rem',
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '10px', color: 'white'
    },
    logoutBtn: {
      width: '100%', padding: '0.75rem', marginTop: '0.75rem',
      background: 'rgba(225,29,72,0.1)',
      border: '1px solid rgba(225,29,72,0.3)',
      color: '#fca5a5', borderRadius: '10px',
      cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem'
    }
  }

  return (
    <div style={styles.sidebar}>
      <div style={styles.brand}>
        <div style={styles.brandIcon}>🛡️</div>
        <div style={{ color: 'white' }}>
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Electoral Portal</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Admin Console</div>
        </div>
      </div>

      {navItems.map(item => (
        <button
          key={item.id}
          style={styles.navItem(isActive(item.path))}
          onClick={() => navigate(item.path)}
        >
          <span>{item.icon}</span>
          {item.label}
        </button>
      ))}

      <div style={styles.userChip}>
        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
          {adminInfo.admin_id || 'ADMIN001'}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>
          {adminInfo.designation || 'Chief Officer'}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
          {adminInfo.branch_office || 'Central Office'}
        </div>
        <button
          style={styles.logoutBtn}
          onClick={() => {
            localStorage.removeItem('adminSession')
            navigate('/login')
          }}
        >
          ⇒ Logout
        </button>
      </div>
    </div>
  )
}

export default AdminSidebar