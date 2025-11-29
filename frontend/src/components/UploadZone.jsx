import { useState } from 'react';
import { Upload, Image, Loader2 } from 'lucide-react';
import { uploadScreenshot } from '../services/api';

export default function UploadZone({ onUploadSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    try {
      setUploading(true);
      await uploadScreenshot(file);
      onUploadSuccess();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div
      style={{
        backgroundColor: dragActive ? '#FFF9E6' : '#FFF',
        border: dragActive ? '2px dashed #FDC600' : '2px dashed #E6E6E6',
        borderRadius: '5px',
        padding: '40px 20px',
        textAlign: 'center',
        transition: 'all 0.3s',
        boxShadow: '0px 1px 3px rgba(0,0,0,0.1)',
        cursor: uploading ? 'not-allowed' : 'pointer'
      }}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="file-upload"
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleChange}
        disabled={uploading}
      />
      
      {uploading ? (
        <div>
          <Loader2 size={48} color="#FDC600" style={{ animation: 'spin 1s linear infinite', margin: '0 auto' }} />
          <p style={{ marginTop: '15px', color: '#777', fontSize: '15px', fontWeight: '500' }}>
            Processing screenshot with OCR...
          </p>
          <p style={{ marginTop: '5px', color: '#999', fontSize: '13px' }}>
            Extracting text and generating tags
          </p>
        </div>
      ) : (
        <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'block' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', backgroundColor: '#FFF9E6', borderRadius: '50%', marginBottom: '20px' }}>
            <Upload size={40} color="#FDC600" strokeWidth={2} />
          </div>
          <p style={{ fontSize: '20px', fontWeight: '500', color: '#333', marginBottom: '8px' }}>
            Drop screenshot here or click to upload
          </p>
          <p style={{ fontSize: '14px', color: '#999', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Image size={16} color="#999" />
            PNG, JPG, GIF up to 10MB • OCR text extraction enabled
          </p>
        </label>
      )}
    </div>
  );
}
