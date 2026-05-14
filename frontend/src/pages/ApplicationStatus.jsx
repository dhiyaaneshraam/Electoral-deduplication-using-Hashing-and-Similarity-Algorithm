import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ApplicationStatus = () => {
  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSearch = async () => {
    if (!searchInput.trim()) {
      setError('Please enter a Voter ID or Verification ID.')
      return
    }
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch(`http://localhost:8080/user/status/${searchInput.trim()}`)
      const data = await res.json()
      setResult(data)
    } catch {
      setError('Connection error. Is the backend running?')
    }
    setLoading(false)
  }

  const styles = {
    page: {
      minHeight: '100vh', background: '#f0f2f8',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', padding: '2rem 1rem'
    },
    header: {
      display: 'flex', alignItems: 'center', gap: '1rem',
      marginBottom: '2rem', width: '100%', maxWidth: '600px'
    },
    backBtn: {
      background: 'transparent', border: '1.5px solid #e4e8f4',
      borderRadius: '8px', padding: '0.5rem 1rem',
      color: '#8896b3', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem'
    },
    card: {
      background: 'white', borderRadius: '16px',
      border: '1px solid #e4e8f4', padding: '2.5rem',
      width: '100%', maxWidth: '600px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
    },
    title: {
      fontFamily: 'Playfair Display, serif', fontSize: '1.75rem',
      fontWeight: 700, color: '#1a2254', marginBottom: '0.4rem'
    },
    sub: { color: '#8896b3', fontSize: '0.875rem', marginBottom: '2rem' },
    label: {
      display: 'block', fontSize: '0.8rem', fontWeight: 600,
      color: '#8896b3', marginBottom: '0.4rem',
      textTransform: 'uppercase', letterSpacing: '0.04em'
    },
    input: {
      width: '100%', padding: '0.85rem 1rem',
      border: '1.5px solid #e4e8f4', borderRadius: '10px',
      fontSize: '1rem', outline: 'none', color: '#1e293b',
      marginBottom: '1rem'
    },
    btn: {
      width: '100%', padding: '0.875rem', background: '#3d4fa0',
      color: 'white', border: 'none', borderRadius: '10px',
      fontWeight: 700, fontSize: '1rem', cursor: 'pointer'
    },
    error: {
      background: '#fff1f2', border: '1px solid #fecdd3',
      color: '#e11d48', padding: '0.75rem 1rem',
      borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1rem'
    },
    timeline: {
      display: 'flex', flexDirection: 'column', gap: '0',
      marginTop: '1.5rem'
    },
    timelineItem: (done) => ({
      display: 'flex', gap: '1rem', alignItems: 'flex-start'
    }),
    timelineDot: (done, active) => ({
      width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: '0.85rem',
      background: done ? '#059669' : active ? '#3d4fa0' : '#f1f5f9',
      color: done || active ? 'white' : '#8896b3',
      border: active ? '3px solid #bfdbfe' : 'none'
    }),
    timelineLine: (done) => ({
      width: '2px', height: '36px', marginLeft: '15px',
      background: done ? '#059669' : '#e4e8f4'
    })
  }

  const getTimeline = (status) => {
    const stages = [
      { label: 'Application Submitted', desc: 'Registration request received by the system' },
      { label: 'Deduplication Check', desc: 'Identity verified against existing voter records' },
      { label: 'Admin Review', desc: 'Manual verification by election officer' },
      { label: 'Voter ID Issued', desc: 'Registration complete — Voter ID assigned' }
    ]

    let doneCount = 0
    let activeIndex = 0

    if (status === 'registered') {
      doneCount = 4
      activeIndex = -1
    } else if (status === 'pending_verification') {
      doneCount = 2
      activeIndex = 2
    } else {
      doneCount = 0
      activeIndex = 0
    }

    return { stages, doneCount, activeIndex }
  }

  return (
    <div style={styles.page} className="page-fade">
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>← Back</button>
        <div>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', color: '#1a2254', fontWeight: 700 }}>
            Application Status
          </div>
          <div style={{ color: '#8896b3', fontSize: '0.8rem' }}>Track your voter registration</div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.title}>Track Your Application</div>
        <div style={styles.sub}>Enter your Voter ID or Verification ID to check status</div>

        {error && <div style={styles.error}>{error}</div>}

        <label style={styles.label}>Voter ID or Verification ID</label>
        <input
          style={styles.input}
          placeholder="e.g. VOT-A1B2C3D4 or VER-XXXXXXXX"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <button style={styles.btn} onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : '🔍 Check Status'}
        </button>

        {result && (
          <div style={{ marginTop: '2rem' }} className="page-fade">
            {/* Status badge */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '1.25rem', borderRadius: '12px', marginBottom: '1.5rem',
              background: result.status === 'registered'
                ? '#ecfdf5' : result.status === 'pending_verification'
                ? '#fef9ec' : '#fff1f2',
              border: `1px solid ${result.status === 'registered'
                ? '#6ee7b7' : result.status === 'pending_verification'
                ? '#fde68a' : '#fecdd3'}`
            }}>
              <div style={{ fontSize: '2.5rem' }}>
                {result.status === 'registered' ? '✅'
                  : result.status === 'pending_verification' ? '⏳' : '❌'}
              </div>
              <div>
                <div style={{
                  fontWeight: 700, fontSize: '1.1rem',
                  color: result.status === 'registered'
                    ? '#059669' : result.status === 'pending_verification'
                    ? '#d97706' : '#e11d48'
                }}>
                  {result.status === 'registered' ? 'Registered'
                    : result.status === 'pending_verification' ? 'Pending Verification'
                    : 'Not Found'}
                </div>
                <div style={{ color: '#8896b3', fontSize: '0.875rem', marginTop: '0.2rem' }}>
                  {result.status === 'registered'
                    ? `Voter ID: ${result.voter_id} · Name: ${result.name}`
                    : result.status === 'pending_verification'
                    ? 'Your application is awaiting admin review'
                    : 'No record found for this ID. Please check and try again.'}
                </div>
              </div>
            </div>

            {/* Timeline */}
            {result.status !== 'not_found' && (() => {
              const { stages, doneCount, activeIndex } = getTimeline(result.status)
              return (
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#8896b3', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.05em' }}>
                    Registration Progress
                  </div>
                  <div style={styles.timeline}>
                    {stages.map((stage, i) => {
                      const done = i < doneCount
                      const active = i === activeIndex
                      return (
                        <div key={i}>
                          <div style={styles.timelineItem(done)}>
                            <div style={styles.timelineDot(done, active)}>
                              {done ? '✓' : i + 1}
                            </div>
                            <div style={{ paddingTop: '0.35rem' }}>
                              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: done ? '#059669' : active ? '#1a2254' : '#8896b3' }}>
                                {stage.label}
                              </div>
                              <div style={{ fontSize: '0.8rem', color: '#8896b3', marginTop: '0.15rem' }}>
                                {stage.desc}
                              </div>
                            </div>
                          </div>
                          {i < stages.length - 1 && (
                            <div style={styles.timelineLine(i < doneCount - 1)} />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })()}
          </div>
        )}
      </div>
    </div>
  )
}

export default ApplicationStatus