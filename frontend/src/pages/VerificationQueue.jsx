import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar'

const VerificationQueue = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [confirmModal, setConfirmModal] = useState(null)
  const navigate = useNavigate()

  const fetchVerifications = async () => {
    try {
      setLoading(true)
      const res = await fetch('http://localhost:8080/admin/verifications')
      const data = await res.json()
      setItems(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchVerifications() }, [])

  const showToast = (message, type) => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleResolve = async (id, approve) => {
    setConfirmModal(null)
    try {
      const res = await fetch(
        `http://localhost:8080/admin/verification/resolve/${id}?approve=${approve}`,
        { method: 'POST' }
      )
      if (res.ok) {
        setItems(prev => prev.filter(item => item.verificationId !== id))
        showToast(
          approve ? '✓ Approved — added to voter database' : '✗ Rejected — moved to duplicates',
          approve ? 'success' : 'error'
        )
      }
    } catch (err) {
      console.error(err)
    }
  }

  const styles = {
    wrapper: { display: 'flex', minHeight: '100vh', background: '#f0f2f8' },
    main: { marginLeft: '220px', flex: 1, padding: '2rem' },
    pageTitle: {
      fontFamily: 'Playfair Display, serif', fontSize: '2rem',
      fontWeight: 700, color: '#1a2254', marginBottom: '0.25rem'
    },
    alertBar: {
      background: '#eff6ff', border: '1px solid #bfdbfe',
      borderRadius: '10px', padding: '1rem 1.25rem',
      color: '#1d4ed8', fontSize: '0.875rem', fontWeight: 500,
      marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
    },
    card: {
      background: 'white', borderRadius: '12px',
      border: '1px solid #e4e8f4', padding: '1.5rem',
      marginBottom: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
    },
    badge: (bg, color) => ({
      padding: '0.2rem 0.6rem', borderRadius: '999px',
      background: bg, color: color, fontSize: '0.7rem', fontWeight: 700
    }),
    btnApprove: {
      padding: '0.5rem 1rem', background: '#3d4fa0', color: 'white',
      border: 'none', borderRadius: '8px', fontWeight: 600,
      fontSize: '0.8rem', cursor: 'pointer', marginRight: '0.5rem'
    },
    btnReject: {
      padding: '0.5rem 1rem', background: '#e11d48', color: 'white',
      border: 'none', borderRadius: '8px', fontWeight: 600,
      fontSize: '0.8rem', cursor: 'pointer'
    },
    toast: (type) => ({
      position: 'fixed', bottom: '2rem', right: '2rem',
      background: type === 'success' ? '#059669' : '#e11d48',
      color: 'white', padding: '1rem 1.5rem', borderRadius: '10px',
      fontWeight: 600, zIndex: 9999,
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
    }),
    overlay: {
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    },
    modal: {
      background: 'white', borderRadius: '16px', padding: '2rem',
      width: '90%', maxWidth: '460px', position: 'relative',
      boxShadow: '0 20px 60px rgba(0,0,0,0.2)', textAlign: 'center'
    }
  }

  return (
    <div style={styles.wrapper}>
      <AdminSidebar />

      <div style={styles.main} className="page-fade">
        <div style={{ marginBottom: '2rem' }}>
          <div style={styles.pageTitle}>Verification Queue</div>
          <div style={{ color: '#8896b3', fontSize: '0.875rem' }}>
            Review applications requiring manual similarity verification
          </div>
        </div>

        <div style={styles.alertBar}>
          ℹ {items.length} application{items.length !== 1 ? 's' : ''} pending manual review
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#8896b3' }}>Loading queue...</div>
        ) : items.length === 0 ? (
          <div style={{ ...styles.card, textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', color: '#1a2254', marginBottom: '0.5rem' }}>All Clear!</div>
            <div style={{ color: '#8896b3' }}>No pending verifications in the queue.</div>
          </div>
        ) : (
          items.map(item => (
            <div key={item.verificationId} style={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '50%',
                    background: '#3d4fa0', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1.1rem'
                  }}>
                    {item.voterName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1e293b' }}>{item.voterName}</div>
                    <div style={{ color: '#8896b3', fontSize: '0.8rem' }}>ID: {item.verificationId}</div>
                    <div style={{ color: '#8896b3', fontSize: '0.8rem' }}>Phone: {item.phone}</div>
                  </div>
                </div>
                <span style={styles.badge('#fef3c7', '#92400e')}>PENDING</span>
              </div>

              <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#f8f9fc', borderRadius: '8px', fontSize: '0.875rem' }}>
                <span style={{ color: '#8896b3' }}>Similar to voter: </span>
                <span style={{ color: '#3d4fa0', fontWeight: 600 }}>{item.similarToVoterId}</span>
                <span style={{ color: '#8896b3', marginLeft: '1rem' }}>Fields: </span>
                <span style={{ color: '#d97706', fontWeight: 600 }}>{item.similarFields}</span>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
                <button style={styles.btnApprove} onClick={() => setConfirmModal({ id: item.verificationId, name: item.voterName, approve: true })}>
                  ✓ Approve
                </button>
                <button style={styles.btnReject} onClick={() => setConfirmModal({ id: item.verificationId, name: item.voterName, approve: false })}>
                  ✗ Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {confirmModal && (
        <div style={styles.overlay} onClick={() => setConfirmModal(null)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
              {confirmModal.approve ? '✅' : '🚫'}
            </div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#1a2254', marginBottom: '0.75rem' }}>
              {confirmModal.approve ? 'Confirm Approval' : 'Confirm Rejection'}
            </h3>
            <p style={{ color: '#8896b3', marginBottom: '0.5rem' }}>
              {confirmModal.approve
                ? <>Are you sure you want to <strong>approve</strong> and add <strong>{confirmModal.name}</strong> to the voter database?</>
                : <>Are you sure you want to <strong>reject</strong> <strong>{confirmModal.name}</strong>? This will move them to the duplicates log.</>
              }
            </p>
            <p style={{ fontSize: '0.8rem', color: '#e11d48', marginBottom: '1.5rem' }}>
              This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                style={{ padding: '0.75rem 1.5rem', background: 'transparent', border: '1.5px solid #e4e8f4', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                onClick={() => setConfirmModal(null)}>
                Cancel
              </button>
              <button
                style={{ padding: '0.75rem 1.5rem', background: confirmModal.approve ? '#3d4fa0' : '#e11d48', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                onClick={() => handleResolve(confirmModal.id, confirmModal.approve)}>
                {confirmModal.approve ? '✓ Yes, Approve' : '✗ Yes, Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div style={styles.toast(toast.type)}>{toast.message}</div>
      )}
    </div>
  )
}

export default VerificationQueue