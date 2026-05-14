import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar'

const DuplicateAttempts = () => {
  const [duplicates, setDuplicates] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchDuplicates = async () => {
    try {
      setLoading(true)
      const res = await fetch('http://localhost:8080/admin/duplicates')
      const data = await res.json()
      setDuplicates(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDuplicates() }, [])

  const styles = {
    wrapper: { display: 'flex', minHeight: '100vh', background: '#f0f2f8' },
    main: { marginLeft: '220px', flex: 1, padding: '2rem' },
    pageTitle: {
      fontFamily: 'Playfair Display, serif', fontSize: '2rem',
      fontWeight: 700, color: '#1a2254', marginBottom: '0.25rem'
    },
    alertBar: {
      background: '#fff1f2', border: '1px solid #fecdd3',
      borderRadius: '10px', padding: '1rem 1.25rem',
      color: '#e11d48', fontSize: '0.875rem', fontWeight: 500,
      marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
    },
    card: {
      background: 'white', borderRadius: '12px',
      border: '1px solid #e4e8f4', padding: '1.5rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
    },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: {
      padding: '0.75rem 1rem', textAlign: 'left',
      color: '#8896b3', fontSize: '0.75rem',
      textTransform: 'uppercase', letterSpacing: '0.05em',
      background: '#f8f9fc', borderBottom: '1px solid #e4e8f4'
    },
    td: {
      padding: '1rem', borderBottom: '1px solid #f1f5f9',
      fontSize: '0.9rem', color: '#1e293b'
    },
    badge: (bg, color) => ({
      padding: '0.2rem 0.6rem', borderRadius: '999px',
      background: bg, color: color, fontSize: '0.7rem', fontWeight: 700
    })
  }

  return (
    <div style={styles.wrapper}>
      <AdminSidebar />

      <div style={styles.main} className="page-fade">
        <div style={{ marginBottom: '2rem' }}>
          <div style={styles.pageTitle}>Duplicate Attempts</div>
          <div style={{ color: '#8896b3', fontSize: '0.875rem' }}>
            Read-only log of all blocked duplicate registration attempts
          </div>
        </div>

        <div style={styles.alertBar}>
          ⚠ {duplicates.length} duplicate attempt{duplicates.length !== 1 ? 's' : ''} blocked in total
        </div>

        <div style={styles.card}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['Duplicate ID', 'Name', 'Phone', 'Matched Voter', 'Source IP', 'Timestamp', 'Confidence'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#8896b3' }}>
                    Loading duplicate records...
                  </td>
                </tr>
              ) : duplicates.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#8896b3' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
                    No duplicate attempts recorded.
                  </td>
                </tr>
              ) : (
                duplicates.map((log, index) => (
                  <tr key={log?.duplicateId || index}
                    style={{ background: 'white' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8f9fc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                    <td style={{ ...styles.td, color: '#e11d48', fontWeight: 600, fontFamily: 'monospace', fontSize: '0.8rem' }}>
                      {log?.duplicateId ?? '—'}
                    </td>
                    <td style={styles.td}>{log?.name ?? '—'}</td>
                    <td style={styles.td}>{log?.phone ?? '—'}</td>
                    <td style={{ ...styles.td, color: '#3d4fa0', fontWeight: 600 }}>
                      {log?.matchedVoterId ?? '—'}
                    </td>
                    <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '0.8rem', color: '#8896b3' }}>
                      {log?.sourceIp ?? '—'}
                    </td>
                    <td style={styles.td}>
                      {log?.createdAt
                        ? new Date(log.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })
                        : '—'}
                    </td>
                    <td style={styles.td}>
                      <span style={styles.badge('#d1fae5', '#065f46')}>100%</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DuplicateAttempts