import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar'

const StoredVoters = () => {
  const [voters, setVoters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [activePopover, setActivePopover] = useState(null)
  const [modal, setModal] = useState(null)
  const navigate = useNavigate()

  const fetchVoters = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('http://localhost:8080/admin/voters')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setVoters(Array.isArray(data) ? data : [])
    } catch (err) {
      setError('Unable to fetch voter records. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchVoters() }, [])

  const handleBlock = async (voterId) => {
    try {
      const res = await fetch(`http://localhost:8080/admin/voters/${voterId}/block`, { method: 'PATCH' })
      if (res.ok) {
        setVoters(prev => prev.map(v => v.voterId === voterId ? { ...v, blocked: true } : v))
        setModal(null)
      }
    } catch (err) { console.error(err) }
  }

  const handleRemove = async (voterId) => {
    try {
      const res = await fetch(`http://localhost:8080/admin/voters/${voterId}`, { method: 'DELETE' })
      if (res.ok) {
        setVoters(prev => prev.filter(v => v.voterId !== voterId))
        setModal(null)
      }
    } catch (err) { console.error(err) }
  }

  const filtered = voters.filter(v =>
    v.name?.toLowerCase().includes(search.toLowerCase()) ||
    v.voterId?.toLowerCase().includes(search.toLowerCase())
  )

  const styles = {
    wrapper: { display: 'flex', minHeight: '100vh', background: '#f0f2f8' },
    main: { marginLeft: '220px', flex: 1, padding: '2rem' },
    topbar: {
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', marginBottom: '2rem'
    },
    pageTitle: {
      fontFamily: 'Playfair Display, serif', fontSize: '2rem',
      fontWeight: 700, color: '#1a2254'
    },
    card: {
      background: 'white', borderRadius: '12px',
      border: '1px solid #e4e8f4', padding: '1.5rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
    },
    searchBar: {
      width: '300px', padding: '0.65rem 1rem',
      border: '1.5px solid #e4e8f4', borderRadius: '10px',
      fontSize: '0.9rem', outline: 'none'
    },
    btn: (bg, color) => ({
      padding: '0.6rem 1.25rem', background: bg, color: color,
      border: 'none', borderRadius: '8px', fontWeight: 600,
      fontSize: '0.875rem', cursor: 'pointer'
    }),
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
      background: bg, color: color, fontSize: '0.7rem', fontWeight: 700,
      display: 'inline-flex', alignItems: 'center', gap: '0.25rem'
    }),
    popover: {
      position: 'absolute', top: '100%', right: '1rem',
      width: '160px', zIndex: 50, borderRadius: '10px',
      padding: '0.4rem', background: 'white',
      border: '1px solid #e4e8f4',
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
    },
    popoverItem: (color) => ({
      display: 'flex', alignItems: 'center', gap: '0.5rem',
      padding: '0.6rem 0.75rem', borderRadius: '6px',
      cursor: 'pointer', fontSize: '0.875rem',
      color: color || '#1e293b', border: 'none',
      background: 'transparent', width: '100%', textAlign: 'left'
    }),
    popoverItemDisabled: {
      display: 'flex', alignItems: 'center', gap: '0.5rem',
      padding: '0.6rem 0.75rem', borderRadius: '6px',
      fontSize: '0.875rem', color: '#c4ccd8', border: 'none',
      background: 'transparent', width: '100%', textAlign: 'left',
      cursor: 'not-allowed'
    },
    overlay: {
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    },
    modal: {
      background: 'white', borderRadius: '16px', padding: '2rem',
      width: '90%', maxWidth: '520px', position: 'relative',
      boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
    }
  }

  return (
    <div style={styles.wrapper} onClick={() => setActivePopover(null)}>
      <AdminSidebar />

      <div style={styles.main} className="page-fade">
        <div style={styles.topbar}>
          <div>
            <div style={styles.pageTitle}>Voter Registry</div>
            <div style={{ color: '#8896b3', fontSize: '0.875rem' }}>
              {voters.length} registered voters
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input style={styles.searchBar} placeholder="Search by name or ID..."
              value={search} onChange={e => setSearch(e.target.value)} />
            <button style={styles.btn('#3d4fa0', 'white')} onClick={fetchVoters}>
              ↻ Sync
            </button>
          </div>
        </div>

        {error && (
          <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', color: '#e11d48', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem' }}>
            ⚠ {error}
          </div>
        )}

        <div style={styles.card}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['Voter ID', 'Full Name', 'Father Name', 'Phone', 'Aadhaar', 'Registered', 'Status', 'Actions'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: '#8896b3' }}>Loading voter records...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: '#8896b3' }}>No records found.</td></tr>
              ) : (
                filtered.map((voter, index) => (
                  <tr key={voter?.voterId || index} style={{ background: 'white' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8f9fc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                    <td style={{ ...styles.td, color: '#3d4fa0', fontWeight: 600 }}>{voter?.voterId ?? '—'}</td>
                    <td style={styles.td}>{voter?.name ?? '—'}</td>
                    <td style={styles.td}>{voter?.fatherName ?? '—'}</td>
                    <td style={styles.td}>{voter?.phone ?? '—'}</td>
                    <td style={styles.td}>{voter?.aadhar ?? '—'}</td>
                    <td style={styles.td}>
                      {voter?.createdAt ? new Date(voter.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                    <td style={styles.td}>
                      {voter?.blocked ? (
                        <span style={styles.badge('#fef3c7', '#92400e')}>⚠ BLOCKED</span>
                      ) : (
                        <span style={styles.badge('#d1fae5', '#065f46')}>✓ VERIFIED</span>
                      )}
                    </td>
                    <td style={{ ...styles.td, position: 'relative' }}>
                      <button
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#8896b3' }}
                        onClick={e => { e.stopPropagation(); setActivePopover(activePopover === voter?.voterId ? null : voter?.voterId) }}>
                        ···
                      </button>
                      {activePopover === voter?.voterId && (
                        <div style={styles.popover} onClick={e => e.stopPropagation()}>
                          <button style={styles.popoverItem()} onClick={() => { setModal({ type: 'details', voter }); setActivePopover(null) }}>👁 View Details</button>
                          {voter?.blocked ? (
                            <button style={styles.popoverItemDisabled} disabled title="Already blocked">🔒 Already Blocked</button>
                          ) : (
                            <button style={styles.popoverItem('#d97706')} onClick={() => { setModal({ type: 'block', voter }); setActivePopover(null) }}>🔒 Block</button>
                          )}
                          <button style={styles.popoverItem('#e11d48')} onClick={() => { setModal({ type: 'remove', voter }); setActivePopover(null) }}>🗑 Remove</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div style={styles.overlay} onClick={() => setModal(null)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <button onClick={() => setModal(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#8896b3' }}>×</button>

            {modal.type === 'details' && (
              <>
                <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#1a2254', marginBottom: '1.5rem' }}>Voter Details</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  {[
                    { label: 'Voter ID', value: modal.voter?.voterId },
                    { label: 'Full Name', value: modal.voter?.name },
                    { label: "Father's Name", value: modal.voter?.fatherName },
                    { label: 'Date of Birth', value: modal.voter?.dob },
                    { label: 'Phone', value: modal.voter?.phone },
                    { label: 'Aadhaar', value: modal.voter?.aadhar },
                    { label: 'Registered', value: modal.voter?.createdAt ? new Date(modal.voter.createdAt).toLocaleString() : '—' },
                    { label: 'Status', value: modal.voter?.blocked ? 'Blocked' : 'Verified' }
                  ].map((f, i) => (
                    <div key={i}>
                      <div style={{ fontSize: '0.75rem', color: '#8896b3', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{f.label}</div>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>{f.value ?? '—'}</div>
                    </div>
                  ))}
                  <div style={{ gridColumn: 'span 2' }}>
                    <div style={{ fontSize: '0.75rem', color: '#8896b3', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Address</div>
                    <div style={{ fontWeight: 600, color: '#1e293b' }}>{modal.voter?.address ?? '—'}</div>
                  </div>
                </div>
              </>
            )}

            {modal.type === 'block' && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#1a2254', marginBottom: '0.75rem' }}>Confirm Block</h3>
                <p style={{ color: '#8896b3', marginBottom: '1.5rem' }}>Are you sure you want to block <strong>{modal.voter?.name}</strong>?</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <button style={{ padding: '0.75rem 1.5rem', background: 'transparent', border: '1.5px solid #e4e8f4', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }} onClick={() => setModal(null)}>Cancel</button>
                  <button style={{ padding: '0.75rem 1.5rem', background: '#d97706', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }} onClick={() => handleBlock(modal.voter.voterId)}>Confirm Block</button>
                </div>
              </div>
            )}

            {modal.type === 'remove' && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗑️</div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#1a2254', marginBottom: '0.75rem' }}>Confirm Removal</h3>
                <p style={{ color: '#8896b3', marginBottom: '1.5rem' }}>Are you sure you want to permanently remove <strong>{modal.voter?.name}</strong>?</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <button style={{ padding: '0.75rem 1.5rem', background: 'transparent', border: '1.5px solid #e4e8f4', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }} onClick={() => setModal(null)}>Cancel</button>
                  <button style={{ padding: '0.75rem 1.5rem', background: '#e11d48', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }} onClick={() => handleRemove(modal.voter.voterId)}>Confirm Remove</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default StoredVoters