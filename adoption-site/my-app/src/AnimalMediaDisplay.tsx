import React from 'react';
import './AnimalFileUpload.css'

interface AnimalMediaDisplayProps {
  fileName: string;
  animalId: number;
  onDelete?: () => void;
  apiBaseUrl?: string;
}

const AnimalMediaDisplay: React.FC<AnimalMediaDisplayProps> = ({ 
  fileName, 
  animalId, 
  onDelete,
}) => {
  const API_BASE_URL = 'https://localhost:7280';
  const cleanFileName = fileName.includes('\\') ? fileName.split('\\').pop()! : fileName;
  const fileUrl = `${API_BASE_URL}/animal-uploads/${encodeURIComponent(cleanFileName)}`;

  // Extract just the filename if full path was stored
  const normalizedFileName = fileName.includes('\\') 
    ? fileName.split('\\').pop() || fileName 
    : fileName;

  const isImage = normalizedFileName.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/);
  const isVideo = normalizedFileName.toLowerCase().match(/\.(mp4|mov|avi)$/);

  return (
    <div className="animal-media-item">
      {isImage && (
        <img 
          src={fileUrl} 
          alt={`Animal ${animalId} media`} 
          className="animal-media"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/default-media.jpg';
          }}
        />
      )}
      {isVideo && (
        <video controls className="animal-media">
          <source src={fileUrl} type={`video/${normalizedFileName.split('.').pop()}`} />
          Your browser does not support the video tag.
        </video>
      )}
      
      <div className="media-actions">
        <a href={fileUrl} download={normalizedFileName} className="download-button">
          Download
        </a>
        {onDelete && (
          <button onClick={onDelete} className="delete-button">
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default AnimalMediaDisplay;