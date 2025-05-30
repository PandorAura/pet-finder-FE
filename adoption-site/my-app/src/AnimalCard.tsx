import React, { useState, useMemo } from 'react';
import Animal from './models/Animal';
import AnimalMediaDisplay from './AnimalMediaDisplay';
import './AnimalCard.css';

interface AnimalCardProps {
  animal: Animal;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onDeleteMedia?: (fileName: string) => void;
  showActions?: boolean;
  showMedia?: boolean;
  isOldest?: boolean;
  isYoungest?: boolean;
  isAverageAge?: boolean;
}

const AnimalCard = React.memo(({ 
  animal, 
  onEdit, 
  onDelete,
  onDeleteMedia,
  showActions = true,
  showMedia = false,
  isOldest = false,
  isYoungest = false,
  isAverageAge = false,
}: AnimalCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const API_BASE_URL = 'https://pet-finder-be-production.up.railway.app/api/animals';

  const mainPhotoUrl = useMemo(() => {
    if (animal.mediaFiles?.length > 0) {
      // Use the static files URL pattern
      return `${API_BASE_URL}/animal-uploads/${encodeURIComponent(animal.mediaFiles[0])}`;
    }
    return animal.photo || '/default-animal-image.jpg';
  }, [animal.mediaFiles, animal.photo]);

  return (
    <div className={`animal-card ${isOldest ? 'oldest' : ''} ${isYoungest ? 'youngest' : ''} ${isAverageAge ? 'average-age' : ''}`}>
      <div className="animal-photo-container">
        {!imageLoaded && <div className="loading-placeholder"></div>}
        
        <img 
          src={mainPhotoUrl} 
          alt={animal.name}
          className={`animal-photo ${imageLoaded ? '' : 'loading'}`}
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/default-animal-image.jpg';
            setImageLoaded(true);
          }}
          style={{ display: imageLoaded ? 'block' : 'none' }}
        />
      </div>
      
      <div className="animal-info">
        <div className="animal-details">
          <h2 data-testid="animal-name">{animal.name}</h2>
          <p>
            <strong>Age:</strong>
            <span data-testid="animal-age">{animal.age}</span> years
            {isOldest && <span className="stat-badge">Oldest</span>}
            {isYoungest && <span className="stat-badge">Youngest</span>}
            {isAverageAge && <span className="stat-badge">Average Age</span>}
          </p>
          <p><strong>Location:</strong> {animal.location}</p>
          <p>{animal.description}</p>
        </div>

        {/* Media gallery section */}
        {showMedia && animal.mediaFiles?.length > 0 && (
          <div className="animal-media-gallery">
            {animal.mediaFiles.map((fileName) => (
              <div key={fileName} className="media-thumbnail">
                <AnimalMediaDisplay 
                  fileName={fileName} 
                  animalId={animal.id}
                  onDelete={onDeleteMedia ? () => onDeleteMedia(fileName) : undefined}
                />
              </div>
            ))}
          </div>
        )}

        {showActions && (
          <div className="animal-actions">
            <button onClick={() => onEdit(animal.id)} className="edit-button">
              Edit
            </button>
            <button onClick={() => onDelete(animal.id)} className="delete-button">
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

export default AnimalCard;