import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';

const SPECIALTIES = [
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Dermatology',
  'ENT (Ear, Nose & Throat)',
  'Ophthalmology',
  'Gynecology & Obstetrics',
  'Oncology',
  'Psychiatry',
  'Endocrinology',
  'Nephrology',
  'Gastroenterology',
  'Pulmonology',
  'Rheumatology',
  'Urology',
  'General Medicine',
  'General Surgery',
  'Emergency Medicine',
  'Radiology',
  'Pathology',
  'Anesthesiology',
  'Other',
];

const InputField = ({ id, label, icon, children }) => (
  <div>
    <label htmlFor={id} style={{
      display: 'block',
      fontSize: '10px',
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: '#64748b',
      marginBottom: '6px',
    }}>
      {label}
    </label>
    <div style={{ position: 'relative' }}>
      {icon && (
        <div style={{
          position: 'absolute',
          top: 0, bottom: 0, left: 0,
          display: 'flex', alignItems: 'center',
          paddingLeft: '14px',
          pointerEvents: 'none',
        }}>
          {icon}
        </div>
      )}
      {children}
    </div>
  </div>
);

const inputStyle = (hasIcon = true) => ({
  display: 'block',
  width: '100%',
  paddingTop: '12px',
  paddingBottom: '12px',
  paddingLeft: hasIcon ? '42px' : '14px',
  paddingRight: '14px',
  border: '1.5px solid #e2e8f0',
  borderRadius: '12px',
  outline: 'none',
  fontSize: '14px',
  fontWeight: 500,
  color: '#1e293b',
  background: '#ffffff',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s',
});

const Register = () => {
  const { register, user } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'patient',
    specialty: '',
    customSpecialty: '',
    experience: '',
    consultationFee: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const { name, email, phone, password, role, specialty, customSpecialty, experience, consultationFee } = formData;

    if (!name || !email || !phone || !password) {
      setError('Please fill in all required fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (role === 'doctor') {
      const chosenSpecialty = specialty === 'Other' ? customSpecialty : specialty;
      if (!chosenSpecialty) {
        setError('Please enter your medical specialty');
        return;
      }
      if (!experience || !consultationFee) {
        setError('Please fill in experience and consultation fee');
        return;
      }
    }

    const finalSpecialty = formData.specialty === 'Other' ? formData.customSpecialty : formData.specialty;
    const payload = { ...formData, specialty: finalSpecialty };

    setLoading(true);
    const result = await register(payload);
    setLoading(false);

    if (result.success) {
      showToast('Registration successful! Welcome.', 'success');
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  const getFocusStyle = (field) => focusedField === field
    ? { borderColor: '#2563eb', boxShadow: '0 0 0 3px rgba(37,99,235,0.12)' }
    : {};

  const iconColor = '#94a3b8';

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f4ff 0%, #fafaff 50%, #f0f9ff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 16px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative blobs */}
      <div style={{
        position: 'absolute', top: '-80px', left: '-80px',
        width: '320px', height: '320px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(96,165,250,0.15), transparent)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-80px', right: '-80px',
        width: '320px', height: '320px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.1), transparent)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: '480px', position: 'relative', zIndex: 10 }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(37,99,235,0.3)',
            }}>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 10.5h-5.5V5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v5.5H5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h5.5V19c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5.5H19c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z" />
              </svg>
            </div>
            <span style={{ fontSize: '26px', fontWeight: 800, color: '#1e293b', letterSpacing: '-0.5px' }}>
              Care<span style={{ color: '#2563eb' }}>Sync</span>
            </span>
          </Link>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px', letterSpacing: '-0.3px' }}>
            Create your account
          </h1>
          <p style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 500, margin: 0 }}>
            Sign up to book and manage medical appointments
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: '#ffffff',
          border: '1.5px solid #e2e8f0',
          borderRadius: '20px',
          padding: '32px',
          boxShadow: '0 4px 32px rgba(0,0,0,0.06)',
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Error Alert */}
            {error && (
              <div style={{
                background: '#fff1f2', border: '1.5px solid #fecdd3',
                borderRadius: '12px', padding: '14px 16px',
                display: 'flex', alignItems: 'flex-start', gap: '10px',
              }}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#f43f5e" strokeWidth={2} style={{ flexShrink: 0, marginTop: '1px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#9f1239', lineHeight: 1.4 }}>{error}</span>
              </div>
            )}

            {/* Role Selector */}
            <div>
              <label style={{
                display: 'block', fontSize: '10px', fontWeight: 700,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: '#64748b', marginBottom: '8px',
              }}>
                Register As
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { value: 'patient', label: '🧑‍⚕️ Patient', color: '#0ea5e9' },
                  { value: 'doctor', label: '👨‍⚕️ Doctor', color: '#10b981' },
                ].map(({ value, label, color }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: value })}
                    style={{
                      flex: 1,
                      padding: '10px 8px',
                      borderRadius: '10px',
                      border: formData.role === value ? `2px solid ${color}` : '2px solid #e2e8f0',
                      background: formData.role === value ? `${color}12` : '#f8fafc',
                      color: formData.role === value ? color : '#64748b',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Doctor-Only Fields */}
            {formData.role === 'doctor' && (
              <div style={{
                background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)',
                border: '1.5px solid #bbf7d0',
                borderRadius: '14px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                  <span style={{ fontSize: '16px' }}>🩺</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#059669' }}>
                    Doctor Profile Details
                  </span>
                </div>

                {/* Specialty Dropdown */}
                <div>
                  <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#475569', marginBottom: '6px' }}>
                    Medical Specialty
                  </label>
                  <select
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('specialty')}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      ...inputStyle(false),
                      fontSize: '13px',
                      ...getFocusStyle('specialty'),
                    }}
                  >
                    <option value="">— Select your specialty —</option>
                    {SPECIALTIES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Custom Specialty (only if "Other" selected) */}
                {formData.specialty === 'Other' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#475569', marginBottom: '6px' }}>
                      Enter Your Specialty
                    </label>
                    <input
                      name="customSpecialty"
                      type="text"
                      value={formData.customSpecialty}
                      onChange={handleChange}
                      placeholder="e.g. Sports Medicine"
                      onFocus={() => setFocusedField('customSpecialty')}
                      onBlur={() => setFocusedField(null)}
                      style={{ ...inputStyle(false), fontSize: '13px', ...getFocusStyle('customSpecialty') }}
                    />
                  </div>
                )}

                {/* Experience & Fee - side by side */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#475569', marginBottom: '6px' }}>
                      Experience (yrs)
                    </label>
                    <input
                      name="experience"
                      type="number"
                      min="0"
                      max="60"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="e.g. 8"
                      onFocus={() => setFocusedField('experience')}
                      onBlur={() => setFocusedField(null)}
                      style={{ ...inputStyle(false), fontSize: '13px', ...getFocusStyle('experience') }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#475569', marginBottom: '6px' }}>
                      Fee (₹)
                    </label>
                    <input
                      name="consultationFee"
                      type="number"
                      min="0"
                      value={formData.consultationFee}
                      onChange={handleChange}
                      placeholder="e.g. 500"
                      onFocus={() => setFocusedField('consultationFee')}
                      onBlur={() => setFocusedField(null)}
                      style={{ ...inputStyle(false), fontSize: '13px', ...getFocusStyle('consultationFee') }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b', marginBottom: '8px' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: '14px', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke={iconColor} strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  id="name" name="name" type="text" required
                  value={formData.name} onChange={handleChange}
                  placeholder={formData.role === 'doctor' ? 'Dr. John Doe' : 'John Doe'}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  style={{ ...inputStyle(true), ...getFocusStyle('name') }}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b', marginBottom: '8px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: '14px', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke={iconColor} strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  id="email" name="email" type="email" required
                  value={formData.email} onChange={handleChange}
                  placeholder="name@example.com"
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  style={{ ...inputStyle(true), ...getFocusStyle('email') }}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b', marginBottom: '8px' }}>
                Phone Number
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: '14px', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke={iconColor} strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input
                  id="phone" name="phone" type="tel" required
                  value={formData.phone} onChange={handleChange}
                  placeholder="9876543210"
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => setFocusedField(null)}
                  style={{ ...inputStyle(true), ...getFocusStyle('phone') }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b', marginBottom: '8px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: '14px', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke={iconColor} strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password" name="password" type="password" required
                  value={formData.password} onChange={handleChange}
                  placeholder="Min. 6 characters"
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  style={{ ...inputStyle(true), ...getFocusStyle('password') }}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: loading ? '#94a3b8' : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 6px 20px rgba(37,99,235,0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                marginTop: '4px',
              }}
            >
              {loading ? (
                <>
                  <svg style={{ animation: 'spin 1s linear infinite' }} width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                    <path style={{ opacity: 0.75 }} fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating Account...
                </>
              ) : (
                <>
                  {formData.role === 'doctor' ? '🩺' : '✨'} Create Account
                </>
              )}
            </button>

          </form>
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', fontSize: '13px', fontWeight: 600, color: '#64748b', marginTop: '20px' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>
            Sign in →
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        input:focus, select:focus {
          outline: none;
        }
        button[type="button"]:hover {
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
};

export default Register;
