import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Animal from './models/Animal';
import './Dashboard.css'

ChartJS.register(ArcElement, Tooltip, Legend);

interface LocationChartProps {
  animals: Animal[];
}

const LocationChart: React.FC<LocationChartProps> = ({ animals }) => {
  const locations = [...new Set(animals.map(a => a.location))];
  
  const data = {
    labels: locations,
    datasets: [{
      data: locations.map(loc => animals.filter(a => a.location === loc).length),
      backgroundColor: locations.map((_, i) => 
        `hsl(${(i * 360 / locations.length)}, 70%, 50%)`
      )
    }]
  };

  return <Doughnut className="distribution-chart" data={data} />;
};

export default LocationChart;