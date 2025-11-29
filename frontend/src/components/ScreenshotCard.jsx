import { useState } from 'react';
import { Trash2, Calendar, Maximize2, Tag, FileText } from 'lucide-react';
import { deleteScreenshot } from '../services/api';

export default function ScreenshotCard({ screenshot, onDelete }) {
  const [showFullText, setShowFullText] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Delete this screenshot?')) return;
    
    try {
      setDeleting(true);
      await deleteScreenshot(screenshot.id);
      onDelete();
    } catch (error) {
      alert('Failed to delete: ' + error.message);
    } finally {
      setDeleting(false);
    }
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{ backgroundColor: '#FFF', borderRadius: '0', overflow: 'hidden', boxShadow: '0px 1px 3px rgba(0,0,0,0.1)', transition: 'all 0.3s' }}
         onMouseOver={(e) => e.currentTarget.style.boxShadow = '0px 3px 8px rgba(0,0,0,0.15)'}
         onMouseOut={(e) => e.currentTarget.style.boxShadow = '0px 1px 3px rgba(0,0,0,0.1)'}>
      <div style={{ position: 'relative', paddingTop: '56.25%', backgroundColor: '#F5F5F5' }}>
        <img
          src={`/${screenshot.filepath}`}
          alt={screenshot.filename}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>
      
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '500', color: '#333', margin: 0, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={16} color="#FDC600" />
            {screenshot.filename}
          </h3>
          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{ marginLeft: '10px', padding: '6px', background: 'none', border: 'none', cursor: deleting ? 'not-allowed' : 'pointer', opacity: deleting ? 0.5 : 1, transition: 'all 0.3s', borderRadius: '4px' }}
            onMouseOver={(e) => !deleting && (e.currentTarget.style.backgroundColor = '#FFE6E6')}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            title="Delete screenshot"
          >
            <Trash2 size={18} color="#E74C3C" />
          </button>
        </div>

        {screenshot.tags && screenshot.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '15px' }}>
            {screenshot.tags.map((tag) => (
              <span
                key={tag}
                style={{ padding: '5px 12px', backgroundColor: '#FFF3CD', color: '#856404', fontSize: '11px', borderRadius: '3px', fontWeight: '600', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Tag size={12} />
                {tag}
              </span>
            ))}
          </div>
        )}

        {screenshot.extracted_text && (
          <div style={{ fontSize: '13px', color: '#666', marginBottom: '15px', lineHeight: '1.7', backgroundColor: '#F9F9F9', padding: '12px', borderRadius: '4px', borderLeft: '3px solid #FDC600' }}>
            <p style={{ margin: 0, maxHeight: showFullText ? 'none' : '60px', overflow: 'hidden' }}>
              {showFullText ? screenshot.extracted_text : truncateText(screenshot.extracted_text)}
            </p>
            {screenshot.extracted_text.length > 150 && (
              <button
                onClick={() => setShowFullText(!showFullText)}
                style={{ color: '#FDC600', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', marginTop: '8px', padding: 0, fontWeight: '600', textDecoration: 'underline' }}
              >
                {showFullText ? '▲ Show less' : '▼ Show more'}
              </button>
            )}
          </div>
        )}

        <div style={{ fontSize: '12px', color: '#999', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #F0F0F0' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Calendar size={14} />
            {formatDate(screenshot.created_at)}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Maximize2 size={14} />
            {screenshot.width} × {screenshot.height}
          </span>
        </div>
      </div>
    </div>
  );
}
