import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  fetchAnimals, 
  createAnimal, 
  updateAnimal, 
  deleteAnimal,
  generateRandomAnimal,
  Animal
} from './services/AnimalService';
import AnimalCard from './AnimalCard';
import AnimalModal from './AnimalModal';
import ConfirmationDialog from './ConfirmationDialog';
import Dashboard from './Dashboard';
import './AvailableAnimalsPage.css';

const AvailableAnimalsPage = () => {
  const [availableAnimals, setAvailableAnimals] = useState<Animal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>('name-asc');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [animalToDelete, setAnimalToDelete] = useState<Animal | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [animalsPerPage, setAnimalsPerPage] = useState(6);
  const [isGenerating, setIsGenerating] = useState(false);
  const generationInterval = useRef<NodeJS.Timeout | null>(null);

  // Fetch animals from API
  const loadAnimals = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchAnimals(searchQuery, sortOption);
      setAvailableAnimals(response.data);
    } catch (err) {
      setError('Failed to load animals. Please try again later.');
      console.error('Error fetching animals:', err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, sortOption]);

  // Initial load
  useEffect(() => {
    loadAnimals();
  }, [loadAnimals]);

  // Toggle animal generation
  const toggleGeneration = useCallback(async () => {
    if (isGenerating) {
      if (generationInterval.current) {
        clearInterval(generationInterval.current);
        generationInterval.current = null;
      }
    } else {
      generationInterval.current = setInterval(async () => {
        try {
          await generateRandomAnimal();
          await loadAnimals(); // Refresh the list
        } catch (err) {
          console.error('Error generating animal:', err);
        }
      }, 5000); // Generate every 5 seconds
    }
    setIsGenerating(!isGenerating);
  }, [isGenerating, loadAnimals]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (generationInterval.current) {
        clearInterval(generationInterval.current);
      }
    };
  }, []);

  // Pagination calculations
  const indexOfLastAnimal = currentPage * animalsPerPage;
  const indexOfFirstAnimal = indexOfLastAnimal - animalsPerPage;
  const currentAnimals = availableAnimals.slice(indexOfFirstAnimal, indexOfLastAnimal);
  const totalPages = Math.ceil(availableAnimals.length / animalsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  const handleSort = (option: string) => {
    setSortOption(option);
    setCurrentPage(1);
  };

  const handleReset = async () => {
    setSearchQuery('');
    setSortOption('name-asc');
    setCurrentPage(1);
    await loadAnimals();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleEdit = (id: number) => {
    const animal = availableAnimals.find(a => a.id === id);
    if (animal) {
      setSelectedAnimal(animal);
      setIsModalOpen(true);
    }
  };

  const handleDelete = (id: number) => {
    const animal = availableAnimals.find(a => a.id === id);
    if (animal) {
      setAnimalToDelete(animal);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (animalToDelete) {
      try {
        await deleteAnimal(animalToDelete.id);
        await loadAnimals();
      } catch (err) {
        setError('Failed to delete animal. Please try again.');
        console.error('Error deleting animal:', err);
      } finally {
        setIsDeleteDialogOpen(false);
        setAnimalToDelete(null);
      }
    }
  };

  const handleAdd = () => {
    setSelectedAnimal(null);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (animalData: {
    id?: number;
    photo: string;
    name: string;
    age: number;
    description: string;
    location: string;
    isAdopted: boolean;
    mediaFiles: string[];
  }) => {
    try {
      if (animalData.id) {
        // Update existing
        await updateAnimal(animalData.id, animalData);
      } else {
        // Create new
        await createAnimal(animalData);
      }
      await loadAnimals();
    } catch (err) {
      setError(`Failed to ${animalData.id ? 'update' : 'create'} animal. Please try again.`);
      console.error('Error saving animal:', err);
    } finally {
      setIsModalOpen(false);
    }
  };

  const getAgeStatistics = (animals: Animal[]) => {
    if (animals.length === 0) return { oldest: null, youngest: null, average: null };

    const ages = animals.map(animal => animal.age);
    const maxAge = Math.max(...ages);
    const minAge = Math.min(...ages);
    const averageAge = ages.reduce((sum, age) => sum + age, 0) / ages.length;

    return {
      oldest: maxAge,
      youngest: minAge,
      average: averageAge
    };
  };

  if (isLoading) return <div className="loading">Loading animals...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="available-animals-page">
      <div className="controls-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search animals..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="sort-container">
          <label htmlFor="sort">Sort by:</label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => handleSort(e.target.value)}
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="age-asc">Age (Youngest first)</option>
            <option value="age-desc">Age (Oldest first)</option>
          </select>
          <button onClick={handleReset} className="reset-button">
            Reset
          </button>
        </div>
        <div className="items-per-page">
          <label htmlFor="items-per-page">Items per page:</label>
          <select
            id="items-per-page"
            value={animalsPerPage}
            onChange={(e) => {
              setAnimalsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value="4">4</option>
            <option value="6">6</option>
            <option value="8">8</option>
            <option value="10">10</option>
            <option value="12">12</option>
          </select>
        </div>
        <button onClick={toggleGeneration} className={`generate-button ${isGenerating ? 'stop' : 'start'}`}>
          {isGenerating ? 'Stop Generation' : 'Generate Animals'}
        </button>
        <button onClick={handleAdd} className="add-button">
          Add Animal
        </button>
      </div>

      <div className="animal-list">
        {currentAnimals.map((animal) => {
          const stats = getAgeStatistics(availableAnimals);
          const isOldest = animal.age === stats.oldest;
          const isYoungest = animal.age === stats.youngest;
          const isAverageAge = Math.abs(animal.age - (stats.average || 0)) < 0.5;

          return (
            <AnimalCard
              key={animal.id}
              animal={animal}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isOldest={isOldest}
              isYoungest={isYoungest}
              isAverageAge={isAverageAge}
            />
          );
        })}
      </div>

      <Dashboard 
        animals={availableAnimals} 
      />

      {availableAnimals.length > 0 && (
        <div className="pagination-info">
          Showing {indexOfFirstAnimal + 1}-{Math.min(indexOfLastAnimal, availableAnimals.length)} of {availableAnimals.length} animals
        </div>
      )}

      {availableAnimals.length > animalsPerPage && (
        <div className="pagination-controls">
          <button 
            onClick={prevPage} 
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`pagination-button ${currentPage === i + 1 ? 'active' : ''}`}
            >
              {i + 1}
            </button>
          ))}
          
          <button 
            onClick={nextPage} 
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      )}

      <AnimalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={selectedAnimal || undefined}
      />

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        message="Are you sure you want to delete this animal?"
      />
    </div>
  );
};

export default AvailableAnimalsPage;