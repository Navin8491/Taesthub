import React, { useState, useRef } from 'react';
import { UploadCloud, Check, AlertCircle } from 'lucide-react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../config/firebase';

const ImageUpload = ({ storagePath, onUploadSuccess, onUploadStart, buttonText = "Upload Image" }) => {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate type is an image
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, WEBP)');
      return;
    }

    // Validate file size under 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB');
      return;
    }

    setError('');
    uploadImage(file);
  };

  const uploadImage = (file) => {
    setLoading(true);
    setSuccess(false);
    setProgress(0);
    if (onUploadStart) onUploadStart();

    const fileExtension = file.name.split('.').pop();
    const uniquePath = `${storagePath}/${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, uniquePath);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const percentage = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(percentage);
      },
      (err) => {
        console.error("Firebase upload error:", err);
        setError('Upload failed. Please check rules or connection.');
        setLoading(false);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setSuccess(true);
          setLoading(false);
          if (onUploadSuccess) onUploadSuccess(downloadURL);
        } catch (err) {
          setError('Failed to retrieve upload URL.');
          setLoading(false);
        }
      }
    );
  };

  return (
    <div style={{ width: '100%' }}>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        style={{ display: 'none' }} 
      />
      
      <button
        type="button"
        onClick={() => fileInputRef.current.click()}
        disabled={loading}
        className="btn d-flex align-items-center justify-content-center gap-2 w-100"
        style={{
          backgroundColor: '#6F4E37',
          color: '#ffffff',
          borderRadius: '50px',
          padding: '8px 20px',
          fontSize: '14px',
          fontWeight: 500,
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#583D2B'; }}
        onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#6F4E37'; }}
      >
        {loading ? (
          <>
            <span style={{ 
              width: '16px', 
              height: '16px', 
              border: '2px solid rgba(255,255,255,0.2)', 
              borderTopColor: '#ffffff', 
              borderRadius: '50%', 
              animation: 'spin 1s linear infinite', 
              display: 'inline-block' 
            }}></span>
            <span>Uploading... {progress}%</span>
          </>
        ) : success ? (
          <>
            <Check size={16} />
            <span>Uploaded successfully!</span>
          </>
        ) : (
          <>
            <UploadCloud size={16} />
            <span>{buttonText}</span>
          </>
        )}
      </button>

      {/* Progress Bar */}
      {loading && (
        <div style={{ width: '100%', height: '4px', backgroundColor: '#E5E7EB', borderRadius: '2px', marginTop: '10px', overflow: 'hidden' }}>
          <div 
            style={{ 
              width: `${progress}%`, 
              height: '100%', 
              backgroundColor: '#D9A066', 
              transition: 'width 0.1s ease-in-out' 
            }} 
          />
        </div>
      )}

      {error && (
        <div style={{ color: '#DC2626', fontSize: '12px', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
      
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ImageUpload;
