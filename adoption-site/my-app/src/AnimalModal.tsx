import React, { useEffect, useState } from 'react';
import './AnimalModal.css';
import AnimalFileUpload from './AnimalFileUpload';

interface AnimalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (animal: {
    id?: number;
    photo: string;
    name: string;
    age: number;
    description: string;
    location: string;
    isAdopted: boolean;
    mediaFiles: string[];
  }) => void;
  initialData?: {
    id?: number;
    photo: string;
    name: string;
    age: number;
    description: string;
    location: string;
    isAdopted: boolean;
    mediaFiles?: string[];
  };
}

const AnimalModal: React.FC<AnimalModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [photo, setPhoto] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [isAdopted, setIsAdopted] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setPhoto(initialData.photo);
      setName(initialData.name);
      setAge(initialData.age);
      setDescription(initialData.description);
      setLocation(initialData.location);
      setIsAdopted(initialData.isAdopted);
      setMediaFiles(initialData.mediaFiles || []);
    } else {
      setPhoto('');
      setName('');
      setAge(0);
      setDescription('');
      setLocation('');
      setIsAdopted(false);
      setMediaFiles([]);
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleFileUploadSuccess = (fileName: string) => {
    setMediaFiles(prev => [...prev, fileName]);
    if (!photo) {
      setPhoto(`/api/animalfiles/download/${fileName}`);
    }
  };

  const validateField = (field: string, value: string | number) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'photo':
        if (!value && mediaFiles.length === 0) {
          newErrors.photo = 'Either photo URL or uploaded file is required.';
        } else {
          delete newErrors.photo;
        }
        break;
      case 'name':
        if (!value) {
          newErrors.name = 'Name is required.';
        } else {
          delete newErrors.name;
        }
        break;
      case 'age':
        if (typeof value === 'number' && value <= 0) {
          newErrors.age = 'Age must be a positive number.';
        } else {
          delete newErrors.age;
        }
        break;
      case 'description':
        if (!value) {
          newErrors.description = 'Description is required.';
        } else {
          delete newErrors.description;
        }
        break;
      case 'location':
        if (!value) {
          newErrors.location = 'Location is required.';
        } else {
          delete newErrors.location;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleInputChange = (field: string, value: string | number) => {
    switch (field) {
      case 'photo':
        setPhoto(value as string);
        break;
      case 'name':
        setName(value as string);
        break;
      case 'age':
        setAge(value as number);
        break;
      case 'description':
        setDescription(value as string);
        break;
      case 'location':
        setLocation(value as string);
        break;
      default:
        break;
    }

    validateField(field, value);
  };

  const isFormValid = () => {
    return (
      (photo || mediaFiles.length > 0) &&
      name &&
      age > 0 &&
      description &&
      location &&
      Object.keys(errors).length === 0
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onSubmit({
        id: initialData?.id,
        photo: photo || (mediaFiles.length > 0 
          ? `/api/animalfiles/download/${mediaFiles[0]}` 
          : ''),
        name,
        age,
        description,
        location,
        isAdopted,
        mediaFiles: mediaFiles.length > 0 ? mediaFiles : [],
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{initialData ? 'Edit Animal' : 'Add Animal'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Upload Media Files</label>
            <AnimalFileUpload 
              animalId={initialData?.id || 0}
              onUploadSuccess={handleFileUploadSuccess}
            />
            {mediaFiles.length > 0 && (
              <div className="uploaded-files">
                <p>Uploaded files:</p>
                <ul>
                  {mediaFiles.map(file => (
                    <li key={file}>{file}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Photo URL</label>
            <input
              type="text"
              value={photo}
              onChange={(e) => handleInputChange('photo', e.target.value)}
              required
            />
            {errors.photo && <span className="error">{errors.photo}</span>}
          </div>

          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => handleInputChange('age', Number(e.target.value))}
              required
            />
            {errors.age && <span className="error">{errors.age}</span>}
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              required
            />
            {errors.description && <span className="error">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              required
            />
            {errors.location && <span className="error">{errors.location}</span>}
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={isAdopted}
                onChange={(e) => setIsAdopted(e.target.checked)}
              />
              Is Adopted
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid()}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnimalModal;