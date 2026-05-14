import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar'

const AdminDashboard = () => {
  const [stats, setStats] = useState({ total_voters: 0, pending_verifications: 0, total_duplicates: 0 })
  const [recentVoters, setRecentVoters] = useState([])
  const [recentDuplicates, setRecentDuplicates] = useState([])
  const [adminInfo, setAdminInfo] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    const session = localStorage.getItem('adminSession')
    if (session) setAdminInfo(JSON.parse(session))
    fetchStats()
    fetchVoters()
    fetchDuplicates()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:8080/admin/stats')
      const data = await res.json()
      setStats(data)
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }

  const fetchVoters = async () => {
    try {
      const res = await fetch('http://localhost:8080/admin/voters')
      const data = await res.json()
      setRecentVoters(Array.isArray(data) ? data.slice(0, 4) : [])
    } catch (err) {
      console.error('Error fetching voters:', err)
    }
  }

  const fetchDuplicates = async () => {
    try {
      const res = await fetch('http://localhost:8080/admin/duplicates')
      const data = await res.json()
      setRecentDuplicates(Array.isArray(data) ? data.slice(0, 4) : [])
    } catch (err) {
      console.error('Error fetching duplicates:', err)
    }
  }

  const styles = {
    wrapper: { display: 'flex', minHeight: '100vh', background: '#f0f2f8' },
    main: { marginLeft: '220px', flex: 1, padding: '2rem' },
    topbar: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      marginBottom: '2rem', paddingBottom: '1.5rem',
      borderBottom: '1px solid #e4e8f4'
    },
    pageTitle: {
      fontFamily: 'Playfair Display, serif', fontSize: '2rem',
      fontWeight: 700, color: '#1a2254'
    },
    statusPill: {
      display: 'flex', alignItems: 'center', gap: '0.5rem',
      background: '#ecfdf5', border: '1px solid #6ee7b7',
      borderRadius: '999px', padding: '0.4rem 1rem',
      color: '#065f46', fontSize: '0.85rem', fontWeight: 600
    },
    statsGrid: {
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '1.5rem', marginBottom: '2rem'
    },
    statCard: {
      background: 'white', borderRadius: '12px',
      border: '1px solid #e4e8f4', padding: '1.5rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
    },
    statLabel: {
      fontSize: '0.75rem', textTransform: 'uppercase',
      letterSpacing: '0.1em', color: '#8896b3',
      marginBottom: '0.5rem', fontWeight: 600
    },
    statValue: (color) => ({
      fontSize: '2rem', fontWeight: 800, color: color
    }),
    bottomGrid: {
      display: 'grid', gridTemplateColumns: '1fr 1fr',
      gap: '1.5rem', marginBottom: '1.5rem'
    },
    card: {
      background: 'white', borderRadius: '12px',
      border: '1px solid #e4e8f4', padding: '1.5rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
    },
    cardTitle: {
      fontFamily: 'Playfair Display, serif', fontSize: '1.1rem',
      fontWeight: 700, color: '#1a2254', marginBottom: '1.25rem'
    },
    voterRow: {
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      padding: '0.75rem 0', borderBottom: '1px solid #f1f5f9'
    },
    avatar: (color) => ({
      width: '36px', height: '36px', borderRadius: '50%',
      background: color, display: 'flex', alignItems: 'center',
      justifyContent: 'center', color: 'white', fontWeight: 700,
      fontSize: '0.9rem', flexShrink: 0
    }),
    badge: (bg, color) => ({
      padding: '0.2rem 0.6rem', borderRadius: '999px',
      background: bg, color: color, fontSize: '0.7rem', fontWeight: 700
    })
  }

  const avatarColors = ['#3d4fa0', '#059669', '#d97706', '#e11d48', '#7c3aed']

  return (
    <div style={styles.wrapper}>
      <AdminSidebar />

      <div style={styles.main} className="page-fade">
        <div style={styles.topbar}>
          <div>
            <div style={styles.pageTitle}>Dashboard</div>
            <div style={{ color: '#8896b3', fontSize: '0.875rem' }}>
              {adminInfo.branch_office || 'Central Office'} · {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={styles.statusPill}>
              <span className="pulse-dot"></span>
              System Operational
            </div>
          </div>
        </div>

        <div style={styles.statsGrid}>
          {[
            { label: 'Total Voters', value: stats.total_voters, color: '#3d4fa0', icon: '👥', sub: 'Verified records' },
            { label: 'Pending Queue', value: stats.pending_verifications, color: '#d97706', icon: '⏱', sub: 'Awaiting approval' },
            { label: 'Duplicate Attempts', value: stats.total_duplicates, color: '#e11d48', icon: '⚠', sub: 'Blocked this month' },
            { label: 'Detection Rate', value: '100%', color: '#059669', icon: '🛡', sub: 'Accuracy score' }
          ].map((s, i) => (
            <div key={i} style={styles.statCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={styles.statLabel}>{s.label}</div>
                <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
              </div>
              <div style={styles.statValue(s.color)}>{s.value}</div>
              <div style={{ fontSize: '0.8rem', color: '#8896b3', marginTop: '0.25rem' }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div style={styles.bottomGrid}>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Recent Registrations</div>
            {recentVoters.length === 0 ? (
              <div style={{ color: '#8896b3', textAlign: 'center', padding: '2rem' }}>No voters registered yet</div>
            ) : (
              recentVoters.map((voter, i) => (
                <div key={voter.voterId} style={styles.voterRow}>
                  <div style={styles.avatar(avatarColors[i % avatarColors.length])}>
                    {voter.name?.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{voter.name}</div>
                    <div style={{ color: '#8896b3', fontSize: '0.75rem' }}>{voter.voterId}</div>
                  </div>
                  <span style={styles.badge(
                    voter.blocked ? '#fef3c7' : '#d1fae5',
                    voter.blocked ? '#92400e' : '#065f46'
                  )}>
                    {voter.blocked ? 'Blocked' : 'Verified'}
                  </span>
                </div>
              ))
            )}
          </div>

          <div style={styles.card}>
            <div style={styles.cardTitle}>Duplicate Alerts</div>
            {recentDuplicates.length === 0 ? (
              <div style={{ color: '#8896b3', textAlign: 'center', padding: '2rem' }}>No duplicate attempts</div>
            ) : (
              recentDuplicates.map((dup) => (
                <div key={dup.duplicateId} style={styles.voterRow}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{dup.name}</div>
                    <div style={{ color: '#8896b3', fontSize: '0.75rem' }}>Matched: {dup.matchedVoterId}</div>
                  </div>
                  <span style={styles.badge('#ffe4e6', '#9f1239')}>Rejected</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={styles.cardTitle}>System Health</div>
            <span style={styles.badge('#d1fae5', '#065f46')}>Live</span>
          </div>
          {[
            { label: 'Hash Collisions', value: 0, color: '#059669', max: 100 },
            { label: 'Queue Processing', value: 85, color: '#3d4fa0', max: 100 },
            { label: 'DB Sync Status', value: 100, color: '#d97706', max: 100 }
          ].map((bar, i) => (
            <div key={i} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.875rem', color: '#1e293b' }}>{bar.label}</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: bar.color }}>{bar.value}%</span>
              </div>
              <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '999px' }}>
                <div style={{ height: '100%', width: `${bar.value}%`, background: bar.color, borderRadius: '999px' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard