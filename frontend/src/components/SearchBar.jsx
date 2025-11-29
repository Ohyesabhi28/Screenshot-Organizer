import { useState } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ backgroundColor: '#FFF', borderRadius: '5px', padding: '20px', boxShadow: '0px 1px 3px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'stretch' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={20} color="#999" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search screenshots by text content or tags..."
            style={{ width: '100%', padding: '12px 15px 12px 45px', border: '1px solid #DADADA', borderRadius: '2px', fontSize: '14px', color: '#333', outline: 'none', transition: 'border 0.3s' }}
            onFocus={(e) => e.target.style.borderColor = '#FDC600'}
            onBlur={(e) => e.target.style.borderColor = '#DADADA'}
          />
        </div>
        <button
          type="submit"
          style={{ backgroundColor: '#FDC600', color: '#FFF', padding: '12px 30px', border: 'none', borderRadius: '2px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '8px' }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#313538'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FDC600'}
        >
          <Search size={18} />
          Search
        </button>
        {query && (
          <button
            type="button"
            onClick={handleClear}
            style={{ backgroundColor: '#E6E6E6', color: '#666', padding: '12px 20px', border: 'none', borderRadius: '2px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '6px' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#D0D0D0'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#E6E6E6'}
          >
            <X size={16} />
            Clear
          </button>
        )}
      </div>
    </form>
  );
}
