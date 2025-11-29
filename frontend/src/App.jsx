import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UploadZone from './components/UploadZone';
import SearchBar from './components/SearchBar';
import Gallery from './components/Gallery';
import { getScreenshots, searchScreenshots, verifyToken } from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [screenshots, setScreenshots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadScreenshots();
    }
  }, [user]);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        await verifyToken(token);
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setAuthLoading(false);
  };

  const loadScreenshots = async () => {
    try {
      setLoading(true);
      const data = await getScreenshots();
      setScreenshots(data);
    } catch (error) {
      console.error('Failed to load screenshots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    loadScreenshots();
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      loadScreenshots();
      return;
    }

    try {
      setLoading(true);
      const results = await searchScreenshots(query);
      setScreenshots(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    loadScreenshots();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (showSignup) {
      return (
        <Signup 
          onSignup={setUser} 
          onSwitchToLogin={() => setShowSignup(false)} 
        />
      );
    }
    return (
      <Login 
        onLogin={setUser} 
        onSwitchToSignup={() => setShowSignup(true)} 
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FCFCFC' }}>
      {/* Top Header */}
      <div style={{ backgroundColor: '#FFF', padding: '12px 0', borderBottom: '1px solid #E6E6E6' }}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div style={{ color: '#666', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                {user.email}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                {user.name}
              </span>
            </div>
            <button
              onClick={handleLogout}
              style={{ backgroundColor: '#FDC600', color: '#FFF', padding: '8px 20px', border: 'none', borderRadius: '3px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '6px' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#313538'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FDC600'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ backgroundColor: '#FFF', borderBottom: '2px solid #FDC600', padding: '25px 0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 style={{ fontSize: '32px', fontWeight: '600', color: '#333', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FDC600" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              Screenshot Organizer
            </h1>
            <p style={{ color: '#777', fontSize: '15px', fontWeight: '500', letterSpacing: '0.5px' }}>ORGANIZE • SEARCH • MANAGE</p>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div style={{ marginBottom: '30px' }}>
          <UploadZone onUploadSuccess={handleUploadSuccess} />
        </div>
        
        <div style={{ marginBottom: '30px' }}>
          <SearchBar onSearch={handleSearch} />
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ display: 'inline-block', width: '50px', height: '50px', border: '4px solid #F3F3F3', borderTop: '4px solid #FDC600', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <p style={{ marginTop: '20px', color: '#777' }}>Loading screenshots...</p>
          </div>
        ) : (
          <Gallery screenshots={screenshots} onDelete={handleDelete} />
        )}
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: '#313538', color: '#FFF', padding: '40px 0 20px', marginTop: '60px' }}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p style={{ color: '#999', fontSize: '14px' }}>© 2024 Screenshot Organizer. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default App;
