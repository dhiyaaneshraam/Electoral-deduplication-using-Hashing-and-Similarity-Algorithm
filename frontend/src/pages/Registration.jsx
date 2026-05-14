import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Registration = () => {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '', fatherName: '', dob: '', gender: '',
    phone: '', aadhar: '', email: '',
    house: '', street: '', city: '', state: '', pincode: '', ward: ''
  })

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry'
  ]

  const handle = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const validateStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.fatherName || !formData.dob || !formData.gender) {
        alert('Please fill all required fields.')
        return false
      }
    }
    if (step === 2) {
      if (!formData.phone || formData.phone.length !== 10) {
        alert('Please enter a valid 10-digit phone number.')
        return false
      }
      if (!formData.aadhar || formData.aadhar.length !== 12) {
        alert('Please enter a valid 12-digit Aadhaar number.')
        return false
      }
    }
    if (step === 3) {
      if (!formData.house || !formData.street || !formData.city || !formData.state || !formData.pincode) {
        alert('Please fill all required address fields.')
        return false
      }
    }
    return true
  }

  const handleSubmit = async () => {
    setLoading(true)
    const address = `${formData.house}, ${formData.street}, ${formData.city}, ${formData.state} - ${formData.pincode}${formData.ward ? ', ' + formData.ward : ''}`
    try {
      const res = await fetch('http://localhost:8080/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          fatherName: formData.fatherName,
          dob: formData.dob,
          phone: formData.phone,
          aadhar: formData.aadhar,
          address,
          photo: ''
        })
      })
      const data = await res.json()
      setResult(data)
    } catch {
      setResult({ status: 'error', message: 'Connection error. Is the backend running?' })
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
      marginBottom: '2rem', width: '100%', maxWidth: '640px'
    },
    backBtn: {
      background: 'transparent', border: '1.5px solid #e4e8f4',
      borderRadius: '8px', padding: '0.5rem 1rem',
      color: '#8896b3', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem'
    },
    card: {
      background: 'white', borderRadius: '16px',
      border: '1px solid #e4e8f4', padding: '2.5rem',
      width: '100%', maxWidth: '640px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
    },
    title: {
      fontFamily: 'Playfair Display, serif', fontSize: '1.75rem',
      fontWeight: 700, color: '#1a2254', marginBottom: '0.25rem'
    },
    sub: { color: '#8896b3', fontSize: '0.875rem', marginBottom: '2rem' },
    stepBar: {
      display: 'flex', alignItems: 'center',
      marginBottom: '2rem', gap: '0'
    },
    stepDot: (status) => ({
      width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: '0.875rem',
      background: status === 'done' ? '#059669' : status === 'active' ? '#1a2254' : '#f1f5f9',
      color: status === 'done' || status === 'active' ? 'white' : '#8896b3',
      border: status === 'active' ? '3px solid #bfdbfe' : 'none'
    }),
    stepLine: (done) => ({
      flex: 1, height: '2px',
      background: done ? '#059669' : '#e4e8f4'
    }),
    label: {
      display: 'block', fontSize: '0.8rem', fontWeight: 600,
      color: '#8896b3', marginBottom: '0.4rem',
      textTransform: 'uppercase', letterSpacing: '0.04em'
    },
    input: {
      width: '100%', padding: '0.85rem 1rem',
      border: '1.5px solid #e4e8f4', borderRadius: '10px',
      fontSize: '1rem', outline: 'none', color: '#1e293b',
      marginBottom: '1.25rem', boxSizing: 'border-box'
    },
    select: {
      width: '100%', padding: '0.85rem 1rem',
      border: '1.5px solid #e4e8f4', borderRadius: '10px',
      fontSize: '1rem', outline: 'none', color: '#1e293b',
      marginBottom: '1.25rem', background: 'white', boxSizing: 'border-box'
    },
    grid2: {
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'
    },
    btn: {
      padding: '0.875rem 2rem', background: '#3d4fa0',
      color: 'white', border: 'none', borderRadius: '10px',
      fontWeight: 700, fontSize: '1rem', cursor: 'pointer'
    },
    btnOutline: {
      padding: '0.875rem 2rem', background: 'transparent',
      color: '#3d4fa0', border: '1.5px solid #3d4fa0',
      borderRadius: '10px', fontWeight: 700,
      fontSize: '1rem', cursor: 'pointer'
    },
    reviewSection: {
      marginBottom: '1.5rem', padding: '1.25rem',
      background: '#f8f9fc', borderRadius: '12px',
      border: '1px solid #e4e8f4'
    },
    reviewLabel: {
      fontSize: '0.7rem', color: '#8896b3',
      textTransform: 'uppercase', marginBottom: '0.2rem'
    },
    reviewValue: {
      fontWeight: 600, color: '#1e293b', fontSize: '0.9rem'
    }
  }

  const stepLabels = ['Personal Info', 'Contact & ID', 'Address', 'Review']

  const getStepStatus = (s) => {
    if (s < step) return 'done'
    if (s === step) return 'active'
    return 'upcoming'
  }

  if (result) {
    const isAccepted = result.status === 'accepted'
    const isDuplicate = result.status === 'duplicate'
    const isVerification = result.status === 'verification_required'

    return (
      <div style={styles.page} className="page-fade">
        <div style={{ ...styles.card, textAlign: 'center', maxWidth: '500px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
            {isAccepted ? '🎉' : isDuplicate ? '🚫' : '⏳'}
          </div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.75rem', color: '#1a2254', marginBottom: '0.75rem' }}>
            {isAccepted ? 'Registration Successful!'
              : isDuplicate ? 'Duplicate Detected'
              : 'Under Review'}
          </h2>
          <p style={{ color: '#8896b3', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            {isAccepted ? 'Your voter registration has been accepted.'
              : isDuplicate ? 'A matching record already exists in our database. Your registration has been blocked.'
              : 'Your application has been flagged for manual review by an election officer.'}
          </p>

          {isAccepted && (
            <div style={{ background: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#8896b3', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Your Voter ID</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669', fontFamily: 'monospace' }}>
                {result.voter_id}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#8896b3', marginTop: '0.5rem' }}>
                Save this ID for future reference
              </div>
            </div>
          )}

          {isVerification && (
            <div style={{ background: '#fef9ec', border: '1px solid #fde68a', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#8896b3', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Verification ID</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#d97706', fontFamily: 'monospace' }}>
                {result.verification_id}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#8896b3', marginTop: '0.5rem' }}>
                Use this ID to track your application status
              </div>
            </div>
          )}

          <button style={{ ...styles.btn, width: '100%' }} onClick={() => navigate('/login')}>
            Back to Home
          </button>
          {(isDuplicate || isVerification) && (
            <button style={{ ...styles.btnOutline, width: '100%', marginTop: '0.75rem' }}
              onClick={() => { setResult(null); setStep(1) }}>
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
            Voter Registration
          </div>
          <div style={{ color: '#8896b3', fontSize: '0.8rem' }}>Step {step} of 4</div>
        </div>
      </div>

      <div style={styles.card}>
        {/* Step indicator */}
        <div style={styles.stepBar}>
          {stepLabels.map((label, i) => {
            const s = i + 1
            const status = getStepStatus(s)
            return (
              <React.Fragment key={s}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={styles.stepDot(status)}>
                    {status === 'done' ? '✓' : s}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: status === 'active' ? '#1a2254' : '#8896b3', fontWeight: status === 'active' ? 700 : 400, whiteSpace: 'nowrap' }}>
                    {label}
                  </div>
                </div>
                {i < stepLabels.length - 1 && (
                  <div style={{ ...styles.stepLine(s < step), marginBottom: '1.2rem' }} />
                )}
              </React.Fragment>
            )
          })}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <>
            <div style={styles.title}>Personal Information</div>
            <div style={styles.sub}>Enter your personal details as per your ID proof</div>
            <label style={styles.label}>Full Name *</label>
            <input style={styles.input} name="name" placeholder="Enter your full name" value={formData.name} onChange={handle} />
            <label style={styles.label}>Father's / Guardian's Name *</label>
            <input style={styles.input} name="fatherName" placeholder="Enter father/guardian name" value={formData.fatherName} onChange={handle} />
            <div style={styles.grid2}>
              <div>
                <label style={styles.label}>Date of Birth *</label>
                <input style={styles.input} type="date" name="dob" value={formData.dob} onChange={handle} />
              </div>
              <div>
                <label style={styles.label}>Gender *</label>
                <select style={styles.select} name="gender" value={formData.gender} onChange={handle}>
                  <option value="">Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          </>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <>
            <div style={styles.title}>Contact & Identity</div>
            <div style={styles.sub}>Enter your contact details and identity numbers</div>
            <label style={styles.label}>Mobile Number *</label>
            <input style={styles.input} name="phone" type="tel" placeholder="10-digit mobile number" maxLength={10} value={formData.phone} onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '') }))} />
            <label style={styles.label}>Aadhaar Number *</label>
            <input style={styles.input} name="aadhar" type="text" placeholder="12-digit Aadhaar number" maxLength={12} value={formData.aadhar} onChange={e => setFormData(prev => ({ ...prev, aadhar: e.target.value.replace(/\D/g, '') }))} />
            <label style={styles.label}>Email Address (Optional)</label>
            <input style={styles.input} name="email" type="email" placeholder="your@email.com" value={formData.email} onChange={handle} />
          </>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <>
            <div style={styles.title}>Address Details</div>
            <div style={styles.sub}>Enter your address as per Aadhaar card</div>
            <label style={styles.label}>House / Door Number *</label>
            <input style={styles.input} name="house" placeholder="e.g. 42B" value={formData.house} onChange={handle} />
            <label style={styles.label}>Street / Area *</label>
            <input style={styles.input} name="street" placeholder="Street name, area, locality" value={formData.street} onChange={handle} />
            <div style={styles.grid2}>
              <div>
                <label style={styles.label}>City *</label>
                <input style={styles.input} name="city" placeholder="City" value={formData.city} onChange={handle} />
              </div>
              <div>
                <label style={styles.label}>State *</label>
                <select style={styles.select} name="state" value={formData.state} onChange={handle}>
                  <option value="">Select State</option>
                  {indianStates.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div style={styles.grid2}>
              <div>
                <label style={styles.label}>Pincode *</label>
                <input style={styles.input} name="pincode" placeholder="6-digit pincode" maxLength={6} value={formData.pincode} onChange={e => setFormData(prev => ({ ...prev, pincode: e.target.value.replace(/\D/g, '') }))} />
              </div>
              <div>
                <label style={styles.label}>Ward / Constituency</label>
                <input style={styles.input} name="ward" placeholder="Ward or constituency" value={formData.ward} onChange={handle} />
              </div>
            </div>
          </>
        )}

        {/* Step 4 - Review */}
        {step === 4 && (
          <>
            <div style={styles.title}>Review & Submit</div>
            <div style={styles.sub}>Please verify all details before submitting</div>

            {[
              {
                title: 'Personal Information',
                fields: [
                  { label: 'Full Name', value: formData.name },
                  { label: "Father's Name", value: formData.fatherName },
                  { label: 'Date of Birth', value: formData.dob },
                  { label: 'Gender', value: formData.gender }
                ]
              },
              {
                title: 'Contact & Identity',
                fields: [
                  { label: 'Phone', value: formData.phone },
                  { label: 'Aadhaar', value: formData.aadhar ? '••••-••••-' + formData.aadhar.slice(-4) : '—' },
                  { label: 'Email', value: formData.email || '—' }
                ]
              },
              {
                title: 'Address',
                fields: [
                  { label: 'House No', value: formData.house },
                  { label: 'Street', value: formData.street },
                  { label: 'City', value: formData.city },
                  { label: 'State', value: formData.state },
                  { label: 'Pincode', value: formData.pincode },
                  { label: 'Ward', value: formData.ward || '—' }
                ]
              }
            ].map((section, si) => (
              <div key={si} style={styles.reviewSection}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 700, color: '#1a2254', fontSize: '0.9rem' }}>{section.title}</div>
                  <button style={{ background: 'transparent', border: 'none', color: '#3d4fa0', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                    onClick={() => setStep(si + 1)}>Edit</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {section.fields.map((f, fi) => (
                    <div key={fi}>
                      <div style={styles.reviewLabel}>{f.label}</div>
                      <div style={styles.reviewValue}>{f.value || '—'}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: '#1d4ed8', fontWeight: 600 }}>🔒 Deduplication Check</div>
              <div style={{ fontSize: '0.8rem', color: '#3b82f6', marginTop: '0.25rem' }}>
                Your data will be hashed and checked against existing records before registration.
              </div>
            </div>
          </>
        )}

        {/* Navigation buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', gap: '1rem' }}>
          {step > 1 ? (
            <button style={styles.btnOutline} onClick={() => setStep(step - 1)}>← Back</button>
          ) : (
            <div />
          )}
          {step < 4 ? (
            <button style={styles.btn} onClick={() => { if (validateStep()) setStep(step + 1) }}>
              Next →
            </button>
          ) : (
            <button style={{ ...styles.btn, background: loading ? '#8896b3' : '#059669' }}
              onClick={handleSubmit} disabled={loading}>
              {loading ? '⏳ Submitting...' : '✓ Submit Registration'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Registration