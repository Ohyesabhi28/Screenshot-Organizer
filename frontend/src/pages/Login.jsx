import { useState } from 'react';
import { login } from '../services/api';

export default function Login({ onLogin, onSwitchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const data = await login(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
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
            <p style={{ color: '#777' }}>Login to manage your screenshots</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Login Form */}
            <div style={{ backgroundColor: '#FFF', padding: '30px', boxShadow: '0px 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '400', marginBottom: '20px', color: '#333' }}>Login</h2>
              
              <form onSubmit={handleSubmit}>
                {error && (
                  <div style={{ backgroundColor: '#FFE6E6', color: '#D32F2F', padding: '12px', marginBottom: '15px', borderRadius: '2px' }}>
                    {error}
                  </div>
                )}

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

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontSize: '14px' }}>Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                  {loading ? 'Logging in...' : 'Log in'}
                </button>
              </form>
            </div>

            {/* Signup Prompt */}
            <div style={{ backgroundColor: '#FFF', padding: '30px', boxShadow: '0px 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '400', marginBottom: '20px', color: '#333' }}>New User?</h2>
              <p style={{ color: '#777', marginBottom: '20px', lineHeight: '1.6' }}>
                Create an account to start organizing your screenshots with powerful OCR text extraction, smart tagging, and searchable archives.
              </p>
              <button
                onClick={onSwitchToSignup}
                style={{ width: '100%', backgroundColor: '#FFF', color: '#FDC600', padding: '12px 20px', border: '2px solid #FDC600', borderRadius: '2px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s' }}
                onMouseOver={(e) => { e.target.style.backgroundColor = '#FDC600'; e.target.style.color = '#FFF'; }}
                onMouseOut={(e) => { e.target.style.backgroundColor = '#FFF'; e.target.style.color = '#FDC600'; }}
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
