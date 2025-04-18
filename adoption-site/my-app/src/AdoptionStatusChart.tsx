import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Animal from './models/Animal';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface AdoptionStatusChartProps {
  animals: Animal[];
}

const AdoptionStatusChart: React.FC<AdoptionStatusChartProps> = ({ animals }) => {
  const adoptedCount = animals.filter(a => a.isAdopted).length;
  const availableCount = animals.length - adoptedCount;

  const data = {
    labels: ['Adoption Status'],
    datasets: [
      {
        label: 'Adopted',
        data: [adoptedCount],
        backgroundColor: '#4BC0C0'
      },
      {
        label: 'Available',
        data: [availableCount],
        backgroundColor: '#9966FF'
      }
    ]
  };

  return <Bar data={data} />;
};

export default AdoptionStatusChart;