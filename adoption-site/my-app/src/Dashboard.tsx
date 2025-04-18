import React, { useEffect, useMemo } from 'react';
import { Pie, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import './Dashboard.css';
import Animal from './models/Animal';

ChartJS.register(
  ArcElement, Tooltip, Legend, CategoryScale,
  LinearScale, BarElement, Title
);

interface DashboardProps {
  animals: Animal[];
  lastUpdateTime?: Date;
  newAnimalsCount?: number;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  animals = [],
  lastUpdateTime,
  newAnimalsCount = 0
}) => {
  const lastUpdate = useMemo(() => {
    return lastUpdateTime?.toLocaleTimeString() || new Date().toLocaleTimeString();
  }, [lastUpdateTime]);

  const ageData = useMemo(() => {
    return {
      labels: ['0-2 years', '3-5 years', '6+ years'],
      datasets: [{
        data: [
          animals.filter(a => a.age <= 2).length,
          animals.filter(a => a.age > 2 && a.age <= 5).length,
          animals.filter(a => a.age > 5).length
        ],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
      }]
    };
  }, [animals]);

  const adoptionData = useMemo(() => {
    const adoptedCount = animals.filter(a => a.isAdopted).length;
    return {
      labels: ['Adoption Status'],
      datasets: [
        {
          label: 'Adopted',
          data: [adoptedCount],
          backgroundColor: '#4BC0C0'
        },
        {
          label: 'Available',
          data: [animals.length - adoptedCount],
          backgroundColor: '#9966FF'
        }
      ]
    };
  }, [animals]);

  const locationData = useMemo(() => {
    const locations = [...new Set(animals.map(a => a.location))];
    return {
      labels: locations,
      datasets: [{
        data: locations.map(loc => animals.filter(a => a.location === loc).length),
        backgroundColor: locations.map((_, i) => 
          `hsl(${(i * 360 / locations.length)}, 70%, 50%)`
        )
      }]
    };
  }, [animals]);

  return (
    <div className="dashboard">
      <h2>Animal Shelter Analytics</h2>
      
      <div className="stats-summary">
        <div className="stat-card">
          <h3>Total Animals</h3>
          <p>{animals.length}</p>
        </div>
        <div className="stat-card">
          <h3>Adopted</h3>
          <p>{animals.filter(a => a.isAdopted).length}</p>
        </div>
        <div className="stat-card">
          <h3>New Today</h3>
          <p>{newAnimalsCount}</p>
        </div>
        <div className="stat-card">
          <h3>Avg. Age</h3>
          <p>{animals.length ? 
            (animals.reduce((sum, a) => sum + a.age, 0) / animals.length).toFixed(1) : 
            '0'} yrs
          </p>
        </div>
      </div>

      <div className="update-info">
        <span className="update-time">Last update: {lastUpdate}</span>
      </div>

      <div className="chart-grid">
        <div className="chart-container">
          <h3>Age Distribution</h3>
          <Pie data={ageData} options={{ 
            responsive: true, 
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom'
              }
            }
          }} />
        </div>
        <div className="chart-container">
          <h3>Adoption Status</h3>
          <Bar data={adoptionData} options={{ 
            responsive: true, 
            maintainAspectRatio: false,
            scales: {
              x: {
                stacked: true,
              },
              y: {
                stacked: true,
                beginAtZero: true
              }
            }
          }} />
        </div>
        <div className="chart-container">
          <h3>Location Distribution</h3>
          <Doughnut data={locationData} options={{ 
            responsive: true, 
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom'
              }
            }
          }} />
        </div>
      </div>
    </div>
  );
};

export default React.memo(Dashboard);