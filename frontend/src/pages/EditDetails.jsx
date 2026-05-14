import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const EditDetails = () => {
  const { voterId: paramVoterId } = useParams()
  const [step, setStep] = useState(paramVoterId ? 'form' : 'verify')
  const [voterId, setVoterId] = useState(paramVoterId || '')
  const [verifying, setVerifying] = useState(false)
  const [voterInfo, setVoterInfo] = useState(null)
  const [verifyError, setVerifyError] = useState('')
  const [address, setAddress] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const navigate = useNavigate()

  const handleVerify = async () => {
    if (!voterId.trim()) {
      setVerifyError('Please enter your Voter ID.')
      return
    }
    setVerifying(true)
    setVerifyError('')
    try {
      const res = await fetch(`http://localhost:8080/user/status/${voterId.trim()}`)
      const data = await res.json()
      if (data.status === 'registered') {
        setVoterInfo(data)
        setStep('form')
      } else if (data.status === 'pending_verification') {
        setVerifyError('Your application is still under review. You cannot edit details yet.')
      } else {
        setVerifyError('Voter ID not found. Please check and try again.')
      }
    } catch {
      setVerifyError('Connection error. Is the backend running?')
    }
    setVerifying(false)
  }

  const handleSubmit = async () => {
    if (!address.trim()) {
      alert('Please enter your new address.')
      return
    }
    setSubmitting(true)
    try {
      // Only send address — do NOT send photo so the existing photo is preserved
      const res = await fetch(`http://localhost:8080/user/update/${voterId.trim()}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address })
      })
      const data = await res.json()
      setResult(data)
    } catch {
      setResult({ status: 'error' })
    }
    setSubmitting(false)
  }

  const styles = {
    page: {
      minHeight: '100vh', background: '#f0f2f8',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', padding: '2rem 1rem'
    },
    header: {
      display: 'flex', alignItems: 'center', gap: '1rem',
      marginBottom: '2rem', width: '100%', maxWidth: '580px'
    },
    backBtn: {
      background: 'transparent', border: '1.5px solid #e4e8f4',
      borderRadius: '8px', padding: '0.5rem 1rem',
      color: '#8896b3', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem'
    },
    card: {
      background: 'white', borderRadius: '16px',
      border: '1px solid #e4e8f4', padding: '2.5rem',
      width: '100%', maxWidth: '580px',
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
    textarea: {
      width: '100%', padding: '0.85rem 1rem',
      border: '1.5px solid #e4e8f4', borderRadius: '10px',
      fontSize: '1rem', outline: 'none', color: '#1e293b',
      marginBottom: '1rem', minHeight: '100px',
      resize: 'vertical', fontFamily: 'DM Sans, sans-serif'
    },
    btn: {
      width: '100%', padding: '0.875rem', background: '#3d4fa0',
      color: 'white', border: 'none', borderRadius: '10px',
      fontWeight: 700, fontSize: '1rem', cursor: 'pointer'
    },
    btnOutline: {
      width: '100%', padding: '0.875rem', background: 'transparent',
      color: '#3d4fa0', border: '1.5px solid #3d4fa0',
      borderRadius: '10px', fontWeight: 700,
      fontSize: '1rem', cursor: 'pointer', marginTop: '0.75rem'
    },
    error: {
      background: '#fff1f2', border: '1px solid #fecdd3',
      color: '#e11d48', padding: '0.75rem 1rem',
      borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1rem'
    },
    infoRow: {
      display: 'flex', justifyContent: 'space-between',
      padding: '0.75rem 0', borderBottom: '1px solid #f1f5f9'
    },
    infoLabel: { color: '#8896b3', fontSize: '0.875rem' },
    infoValue: { fontWeight: 600, color: '#1e293b', fontSize: '0.875rem' }
  }

  if (result) {
    const isSuccess = result.status === 'updated'
    return (
      <div style={styles.page} className="page-fade">
        <div style={{ ...styles.card, textAlign: 'center', maxWidth: '480px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
            {isSuccess ? '✅' : '❌'}
          </div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.75rem', color: '#1a2254', marginBottom: '0.75rem' }}>
            {isSuccess ? 'Details Updated!' : 'Update Failed'}
          </h2>
          <p style={{ color: '#8896b3', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            {isSuccess
              ? 'Your address has been successfully updated in the system.'
              : 'Something went wrong. Please try again.'}
          </p>
          {isSuccess && (
            <div style={{ background: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#8896b3', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Voter ID</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#059669', fontFamily: 'monospace' }}>
                {result.voter_id}
              </div>
            </div>
          )}
          <button style={styles.btn} onClick={() => navigate('/login')}>
            Back to Home
          </button>
          {!isSuccess && (
            <button style={styles.btnOutline} onClick={() => setResult(null)}>
              Try Again
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={styles.page} className="page-fade">
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>← Back</button>
        <div>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', color: '#1a2254', fontWeight: 700 }}>
            Edit Profile
          </div>
          <div style={{ color: '#8896b3', fontSize: '0.8rem' }}>Update your registered details</div>
        </div>
      </div>

      {step === 'verify' && (
        <div style={styles.card}>
          <div style={styles.title}>Verify Your Identity</div>
          <div style={styles.sub}>Enter your Voter ID to access your profile</div>

          {verifyError && <div style={styles.error}>{verifyError}</div>}

          <label style={styles.label}>Voter ID</label>
          <input
            style={styles.input}
            placeholder="e.g. VOT-A1B2C3D4"
            value={voterId}
            onChange={e => setVoterId(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleVerify()}
          />

          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#1d4ed8', fontWeight: 600 }}>ℹ Where to find your Voter ID?</div>
            <div style={{ fontSize: '0.8rem', color: '#3b82f6', marginTop: '0.25rem' }}>
              Your Voter ID was provided when your registration was accepted. It starts with VOT- followed by 8 characters.
            </div>
          </div>

          <button style={styles.btn} onClick={handleVerify} disabled={verifying}>
            {verifying ? 'Verifying...' : '🔍 Verify & Continue'}
          </button>
        </div>
      )}

      {step === 'form' && (
        <div style={styles.card}>
          <div style={styles.title}>Update Your Details</div>
          <div style={styles.sub}>You can update your address below</div>

          {voterInfo && (
            <div style={{ background: '#f8f9fc', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.75rem', border: '1px solid #e4e8f4' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8896b3', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                Current Registration
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Name</span>
                <span style={styles.infoValue}>{voterInfo.name ?? '—'}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Phone</span>
                <span style={styles.infoValue}>{voterInfo.phone ?? '—'}</span>
              </div>
              <div style={{ ...styles.infoRow, borderBottom: 'none' }}>
                <span style={styles.infoLabel}>Voter ID</span>
                <span style={{ ...styles.infoValue, color: '#3d4fa0', fontFamily: 'monospace' }}>{voterInfo.voter_id ?? voterId}</span>
              </div>
            </div>
          )}

          <label style={styles.label}>New Address *</label>
          <textarea
            style={styles.textarea}
            placeholder="Enter your complete new address including house no., street, city, state and pincode"
            value={address}
            onChange={e => setAddress(e.target.value)}
          />

          <div style={{ background: '#fef9ec', border: '1px solid #fde68a', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#92400e' }}>
              ⚠ Only address updates are allowed. To change other details, please visit your nearest electoral office.
            </div>
          </div>

          <button
            style={{ ...styles.btn, background: submitting ? '#8896b3' : '#059669' }}
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Saving...' : '✓ Save Changes'}
          </button>
          <button style={styles.btnOutline} onClick={() => navigate('/login')}>
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}

export default EditDetails