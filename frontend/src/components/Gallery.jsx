import { ImageOff, Images } from 'lucide-react';
import ScreenshotCard from './ScreenshotCard';

export default function Gallery({ screenshots, onDelete }) {
  if (screenshots.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', backgroundColor: '#FFF', borderRadius: '5px', boxShadow: '0px 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '120px', height: '120px', backgroundColor: '#F9F9F9', borderRadius: '50%', marginBottom: '25px' }}>
          <ImageOff size={60} color="#CCC" strokeWidth={1.5} />
        </div>
        <p style={{ fontSize: '22px', color: '#666', marginBottom: '10px', fontWeight: '500' }}>No screenshots yet</p>
        <p style={{ fontSize: '15px', color: '#999', lineHeight: '1.6' }}>Upload your first screenshot to get started with OCR text extraction</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', padding: '18px 25px', backgroundColor: '#FFF', borderRadius: '5px', boxShadow: '0px 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '500', color: '#333', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Images size={24} color="#FDC600" />
          Your Screenshots
        </h2>
        <span style={{ fontSize: '13px', backgroundColor: '#FDC600', padding: '6px 16px', borderRadius: '20px', color: '#FFF', fontWeight: '600', letterSpacing: '0.5px' }}>
          {screenshots.length} {screenshots.length !== 1 ? 'ITEMS' : 'ITEM'}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {screenshots.map((screenshot) => (
          <ScreenshotCard
            key={screenshot.id}
            screenshot={screenshot}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
