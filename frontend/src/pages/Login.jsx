import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [activeTab, setActiveTab] = useState('user')
  const [userStep, setUserStep] = useState('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [generatedOtp, setGeneratedOtp] = useState('')
  const [adminId, setAdminId] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSendOtp = async () => {
    if (phoneNumber.length !== 10) {
      setError('Please enter a valid 10-digit phone number.')
      return
    }
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8080/auth/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber })
      })
      const data = await response.json()
      if (response.ok) {
        setGeneratedOtp(data.otp)
        setUserStep('otp')
        setError('')
      } else {
        setError(data.detail || 'Failed to send OTP.')
      }
    } catch {
      setError('Connection error. Is the backend running?')
    }
    setLoading(false)
  }

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError('Please enter the 6-digit OTP.')
      return
    }
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8080/auth/user/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber, otp })
      })
      const data = await response.json()
      if (response.ok) {
        setUserStep('services')
        setError('')
      } else {
        setError(data.detail || 'Invalid OTP.')
      }
    } catch {
      setError('Connection error. Please try again.')
    }
    setLoading(false)
  }

  const handleAdminLogin = async () => {
    if (!adminId || !adminPassword) {
      setError('Please enter both ID and Password.')
      return
    }
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8080/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: adminId, password: adminPassword, role: 'admin' })
      })
      const data = await response.json()
      if (response.ok) {
        localStorage.setItem('adminSession', JSON.stringify(data))
        navigate('/admin')
      } else {
        setError(data.detail || 'Invalid credentials.')
      }
    } catch {
      setError('Connection error. Please try again.')
    }
    setLoading(false)
  }

  const styles = {
    wrapper: {
      minHeight: '100vh',
      display: 'flex',
      background: '#f0f2f8'
    },
    leftPanel: {
      width: '45%',
      background: '#1a2254',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '3rem',
      color: 'white'
    },
    rightPanel: {
      width: '55%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    },
    card: {
      background: 'white',
      borderRadius: '16px',
      padding: '2.5rem',
      width: '100%',
      maxWidth: '440px',
      border: '1px solid #e4e8f4',
      boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
    },
    heading: {
      fontFamily: 'Playfair Display, serif',
      fontSize: '2rem',
      fontWeight: 700,
      marginBottom: '0.5rem',
      color: 'white'
    },
    subtext: {
      color: '#94a3b8',
      fontSize: '0.95rem',
      lineHeight: 1.6
    },
    tabs: {
      display: 'flex',
      background: '#f0f2f8',
      borderRadius: '10px',
      padding: '4px',
      marginBottom: '1.5rem'
    },
    tab: (active) => ({
      flex: 1,
      padding: '0.65rem',
      border: 'none',
      borderRadius: '8px',
      background: active ? '#3d4fa0' : 'transparent',
      color: active ? 'white' : '#8896b3',
      fontWeight: 600,
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: 'all 0.2s'
    }),
    label: {
      display: 'block',
      fontSize: '0.85rem',
      fontWeight: 500,
      color: '#8896b3',
      marginBottom: '0.4rem'
    },
    input: {
      width: '100%',
      padding: '0.75rem 1rem',
      border: '1.5px solid #e4e8f4',
      borderRadius: '10px',
      fontSize: '1rem',
      marginBottom: '1.25rem',
      outline: 'none',
      transition: 'border 0.2s'
    },
    btn: {
      width: '100%',
      padding: '0.85rem',
      background: '#3d4fa0',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      fontSize: '1rem',
      fontWeight: 600,
      cursor: 'pointer',
      marginBottom: '0.75rem'
    },
    btnOutline: {
      width: '100%',
      padding: '0.85rem',
      background: 'transparent',
      color: '#3d4fa0',
      border: '1.5px solid #3d4fa0',
      borderRadius: '10px',
      fontSize: '1rem',
      fontWeight: 600,
      cursor: 'pointer',
      marginBottom: '0.75rem'
    },
    error: {
      background: '#fff1f2',
      border: '1px solid #fecdd3',
      color: '#e11d48',
      padding: '0.75rem 1rem',
      borderRadius: '8px',
      fontSize: '0.875rem',
      marginBottom: '1rem'
    },
    serviceCard: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '1rem',
      background: '#f8f9fc',
      borderRadius: '12px',
      border: '1px solid #e4e8f4',
      cursor: 'pointer',
      marginBottom: '0.75rem',
      transition: 'all 0.2s'
    },
    iconBox: (bg) => ({
      width: '40px',
      height: '40px',
      background: bg,
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.2rem',
      flexShrink: 0
    })
  }

  return (
    <div style={{ ...styles.wrapper, justifyContent: userStep === 'services' ? 'center' : 'flex-start' }}>
      <div style={{ ...styles.leftPanel, display: userStep === 'services' ? 'none' : 'flex' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛡️</div>
        <h1 style={styles.heading}>Electoral Portal</h1>
        <p style={styles.subtext}>
          National Electoral Deduplication & Verification Service.
          Secure, accurate, and tamper-proof voter registration system.
        </p>
        <div style={{ marginTop: '2rem' }}>
          {['SHA-256 field-level hashing', 'Real-time duplicate detection', 'Admin verification queue'].map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '24px', height: '24px', background: '#f59e0b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.75rem', fontWeight: 700 }}>{i + 1}</div>
              <span style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.rightPanel}>
        <div style={styles.card} className="page-fade">
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', marginBottom: '0.25rem', color: '#1a2254' }}>
            {activeTab === 'user' ? 'Access Your Portal' : 'Admin Access'}
          </h2>
          <p style={{ color: '#8896b3', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            {activeTab === 'user' ? 'Enter your mobile number to continue' : 'Enter your admin credentials'}
          </p>

          <div style={styles.tabs}>
            <button style={styles.tab(activeTab === 'user')} onClick={() => { setActiveTab('user'); setError('') }}>User Portal</button>
            <button style={styles.tab(activeTab === 'admin')} onClick={() => { setActiveTab('admin'); setError('') }}>Admin Access</button>
          </div>

          {error && <div style={styles.error}>{error}</div>}

          {activeTab === 'admin' ? (
            <>
              <label style={styles.label}>Administrator ID</label>
              <input style={styles.input} type="text" placeholder="Enter Admin ID" value={adminId} onChange={e => setAdminId(e.target.value)} />
              <label style={styles.label}>Password</label>
              <input style={styles.input} type="password" placeholder="Enter Password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} />
              <button style={styles.btn} onClick={handleAdminLogin} disabled={loading}>
                {loading ? 'Authenticating...' : 'Login as Admin'}
              </button>
            </>
          ) : (
            <>
              {userStep === 'phone' && (
                <>
                  <label style={styles.label}>Mobile Number</label>
                  <input style={styles.input} type="tel" placeholder="10-digit mobile number" maxLength={10} value={phoneNumber} onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, ''))} />
                  <button style={styles.btn} onClick={handleSendOtp} disabled={loading}>
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                </>
              )}

              {userStep === 'otp' && (
                <>
                  <p style={{ color: '#8896b3', fontSize: '0.875rem', marginBottom: '1rem' }}>OTP sent to +91 {phoneNumber}</p>
                  <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem', textAlign: 'center', color: '#1d4ed8', fontWeight: 700 }}>
                    Demo OTP: {generatedOtp}
                  </div>
                  <label style={styles.label}>Enter OTP</label>
                  <input style={{ ...styles.input, textAlign: 'center', letterSpacing: '0.5rem', fontSize: '1.25rem' }} type="text" placeholder="XXXXXX" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)} />
                  <button style={styles.btn} onClick={handleVerifyOtp} disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify & Continue'}
                  </button>
                  <button style={styles.btnOutline} onClick={() => setUserStep('phone')}>← Back</button>
                </>
              )}

              {userStep === 'services' && (
                <>
                  <div style={{ background: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: '8px', padding: '0.75rem', marginBottom: '1.25rem', color: '#065f46', fontSize: '0.875rem', fontWeight: 600 }}>
                    ✓ Secure session active
                  </div>
                  <p style={{ color: '#8896b3', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600, marginBottom: '1rem' }}>What would you like to do?</p>
                  {[
                    { icon: '📄', label: 'New Registration', desc: 'Apply for a fresh Voter ID', bg: '#eef0fb', path: '/register' },
                    { icon: '🔍', label: 'Application Status', desc: 'Track your registration progress', bg: '#ecfdf5', path: '/status' },
                    { icon: '✏️', label: 'Edit Profile', desc: 'Update your registered details', bg: '#fef9ec', path: '/edit' }
                  ].map((s, i) => (
                    <div key={i} style={styles.serviceCard} onClick={() => navigate(s.path)}>
                      <div style={styles.iconBox(s.bg)}>{s.icon}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{s.label}</div>
                        <div style={{ color: '#8896b3', fontSize: '0.8rem' }}>{s.desc}</div>
                      </div>
                      <div style={{ marginLeft: 'auto', color: '#8896b3' }}>›</div>
                    </div>
                  ))}
                  <button style={styles.btnOutline} onClick={() => setUserStep('phone')}>Logout</button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login