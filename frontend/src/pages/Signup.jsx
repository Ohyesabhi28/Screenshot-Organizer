import { useState } from 'react';
import { signup } from '../services/api';

export default function Signup({ onSignup, onSwitchToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      const data = await signup(name, email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onSignup(data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#F9F9F9', minHeight: '100vh' }}>
      {/* Top Header */}
      <div style={{ backgroundColor: '#FFF', padding: '10px 0', borderBottom: '1px solid #E6E6E6' }}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div style={{ color: '#666' }}>
              <span style={{ marginRight: '15px' }}>📧 support@screenshot.com</span>
              <span>📞 +1 234 567 7890</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 style={{ fontSize: '30px', fontWeight: '300', textTransform: 'uppercase', letterSpacing: '2px', color: '#333', marginBottom: '10px' }}>
              📸 Screenshot Organizer
            </h1>
            <p style={{ color: '#777' }}>Create your account</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Signup Form */}
            <div style={{ backgroundColor: '#FFF', padding: '30px', boxShadow: '0px 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '400', marginBottom: '20px', color: '#333' }}>New Account</h2>
              
              <form onSubmit={handleSubmit}>
                {error && (
                  <div style={{ backgroundColor: '#FFE6E6', color: '#D32F2F', padding: '12px', marginBottom: '15px', borderRadius: '2px' }}>
                    {error}
                  </div>
                )}

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontSize: '14px' }}>Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #DADADA', borderRadius: '0', fontSize: '13px', color: '#838383' }}
                    placeholder="John Doe"
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontSize: '14px' }}>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #DADADA', borderRadius: '0', fontSize: '13px', color: '#838383' }}
                    placeholder="you@example.com"
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontSize: '14px' }}>Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #DADADA', borderRadius: '0', fontSize: '13px', color: '#838383' }}
                    placeholder="••••••••"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontSize: '14px' }}>Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #DADADA', borderRadius: '0', fontSize: '13px', color: '#838383' }}
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{ width: '100%', backgroundColor: '#FDC600', color: '#FFF', padding: '12px 20px', border: 'none', borderRadius: '2px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s' }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#313538'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#FDC600'}
                >
                  {loading ? 'Creating account...' : 'Register'}
                </button>
              </form>
            </div>

            {/* Login Prompt */}
            <div style={{ backgroundColor: '#FFF', padding: '30px', boxShadow: '0px 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '400', marginBottom: '20px', color: '#333' }}>Already have an account?</h2>
              <p style={{ color: '#777', marginBottom: '20px', lineHeight: '1.6' }}>
                Login to access your organized screenshots, search through extracted text, and manage your archive.
              </p>
              <button
                onClick={onSwitchToLogin}
                style={{ width: '100%', backgroundColor: '#FFF', color: '#FDC600', padding: '12px 20px', border: '2px solid #FDC600', borderRadius: '2px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s' }}
                onMouseOver={(e) => { e.target.style.backgroundColor = '#FDC600'; e.target.style.color = '#FFF'; }}
                onMouseOut={(e) => { e.target.style.backgroundColor = '#FFF'; e.target.style.color = '#FDC600'; }}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
