import React from 'react';
import TestRenderer from 'react-test-renderer';
import AvailableAnimalsPage from './AvailableAnimals';

// 1. Mock your animals.json data
jest.mock('./data/animals.json', () => [
  { id: 1, name: 'Zebra', age: 5, isAdopted: false },
  { id: 2, name: 'Antelope', age: 3, isAdopted: false },
  { id: 3, name: 'Lion', age: 8, isAdopted: false }
]);sss

describe('handleSort', () => {
  // 2. Create component instance
  let component: TestRenderer.ReactTestRenderer;
  let instance: AvailableAnimalsPage;

  beforeEach(() => {
    component = TestRenderer.create(<AvailableAnimalsPage />);
    instance = component.root.instance;
  });

  // 3. Test cases
  it('sorts by name ascending', () => {
    // Call handleSort directly
    instance.handleSort('name-asc');

    // Verify state updates
    expect(instance.state.sortOption).toBe('name-asc');
    expect(instance.state.availableAnimals.map(a => a.name)).toEqual([
      'Antelope',
      'Lion',
      'Zebra'
    ]);
  });

  it('sorts by age descending', () => {
    instance.handleSort('age-desc');
    
    expect(instance.state.availableAnimals.map(a => a.age)).toEqual([8, 5, 3]);
  });
});