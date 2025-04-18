import axios from 'axios';

const API_BASE_URL = 'https://localhost:7280/api/animals';

export interface Animal {
  id: number;
  photo: string; // Main photo URL (kept for backward compatibility)
  name: string;
  age: number;
  description: string;
  location: string;
  isAdopted: boolean;
  mediaFiles: string[]; // Array of file names/references for additional media
}

interface ApiResponse<T> {
  data: T;
  status: number;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchAnimals = async (
  searchQuery?: string,
  sortOption?: string
): Promise<ApiResponse<Animal[]>> => {
  const params: Record<string, any> = {};
  
  if (searchQuery) {
    params.name = searchQuery;
  }
  
  if (sortOption) {
    const [sortBy, direction] = sortOption.split('-');
    params.sortBy = sortBy;
    params.ascending = direction === 'asc';
  }
  
  const response = await api.get('', { params });
  return response;
};

export const createAnimal = async (animal: Omit<Animal, 'id'>): Promise<ApiResponse<Animal>> => {
  const response = await api.post('', animal);
  return response;
};

export const updateAnimal = async (id: number, animal: Partial<Animal>): Promise<ApiResponse<Animal>> => {
  const response = await api.put(`/${id}`, animal);
  return response;
};

export const deleteAnimal = async (id: number): Promise<ApiResponse<void>> => {
  const response = await api.delete(`/${id}`);
  return response;
};

export const generateRandomAnimal = async (): Promise<ApiResponse<Animal>> => {
  // This would call a special endpoint if you create one for generation
  // For now, we'll generate client-side and post to server
  const types = ['dog', 'cat', 'rabbit', 'bird', 'hamster', 'fish'];
  const type = types[Math.floor(Math.random() * types.length)];
  const name = `Generated ${type}`;
  
  const newAnimal = {
    photo: `https://source.unsplash.com/random/300x300/?${type}`,
    name,
    age: Math.floor(Math.random() * 15),
    description: `A ${type} looking for a home`,
    location: ['New York', 'Los Angeles', 'Chicago'][Math.floor(Math.random() * 3)],
    isAdopted: false,
    mediaFiles:['']
  };
  
  return createAnimal(newAnimal);
};