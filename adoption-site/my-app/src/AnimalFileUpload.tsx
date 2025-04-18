import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { AxiosError, AxiosProgressEvent } from 'axios';
import './AnimalFileUpload.css'


interface AnimalFileUploadProps {
  animalId: number;
  onUploadSuccess: (fileName: string) => void;
  onError?: (message: string) => void;
}

const AnimalFileUpload: React.FC<AnimalFileUploadProps> = ({ 
  animalId, 
  onUploadSuccess,
  onError
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const API_BASE_URL = 'https://localhost:7280';


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.mp4', '.mov', '.avi'];
      const extension = file.name.split('.').pop()?.toLowerCase();
      
      if (!extension || !allowedExtensions.includes(`.${extension}`)) {
        if (onError) onError('Invalid file type. Please upload images or videos only.');
        return;
      }
      setSelectedFile(file);
    }
  };


const handleUpload = useCallback(async () => {
  if (!selectedFile) return;

  const formData = new FormData();
  formData.append('file', selectedFile);

  try {
    setUploadStatus('uploading');
    setUploadProgress(0);

    const response = await axios.post(
      `${API_BASE_URL}/api/AnimalFiles/upload/${animalId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(progress);
        },
      }
    );

    setUploadStatus('success');
    onUploadSuccess(response.data.fileName);
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    console.error('Upload failed:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    setUploadStatus('error');
    if (onError) {
      onError(
        error.response?.data?.message || 
        error.message || 
        'File upload failed'
      );
    }
  }
}, [selectedFile, animalId, onUploadSuccess, onError]);
  return (
    <div className="animal-file-upload">
      <input 
        type="file"
        onChange={handleFileChange}
        accept=".jpg,.jpeg,.png,.mp4,.mov,.avi"
      />
      
      {selectedFile && (
        <div className="file-info">
          <p>Selected: {selectedFile.name}</p>
          <p>Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
          {selectedFile.size > 100 * 1024 * 1024 && (
            <p className="file-warning">Warning: Large file may take longer to upload</p>
          )}
        </div>
      )}
      
      <button 
        onClick={handleUpload} 
        disabled={!selectedFile || uploadStatus === 'uploading'}
      >
        {uploadStatus === 'uploading' ? `Uploading... ${uploadProgress}%` : 'Upload Media'}
      </button>
      
      {uploadStatus === 'error' && (
        <p className="error">Upload failed. Please try again.</p>
      )}
    </div>
  );
};

export default AnimalFileUpload;