import React, { useState, useEffect } from 'react';
import animalsData from './data/animals.json'; 
import Animal from './models/Animal'; 
import AnimalCard from './AnimalCard'; 
import './HappyStoriesPage.css'; 

const HappyStoriesPage = () => {
  const [adoptedAnimals, setAdoptedAnimals] = useState<Animal[]>([]);

  useEffect(() => {
    const adopted = animalsData
      .filter((animal) => animal.isAdopted) 
      .map(
        (animal) =>
          new Animal(
            animal.id,
            animal.photo,
            animal.name,
            animal.age,
            animal.description,
            animal.location,
            animal.isAdopted
          )
      );
    setAdoptedAnimals(adopted);
  }, []);

  return (
    <div className="happy-stories-page">
      <div className="animal-list">
        {adoptedAnimals.map((animal) => (
          <AnimalCard
            key={animal.id}
            animal={animal}
            onEdit={() => {}} 
            onDelete={() => {}} 
            showActions={false}
          />
        ))}
      </div>
    </div>
  );
};

export default HappyStoriesPage;