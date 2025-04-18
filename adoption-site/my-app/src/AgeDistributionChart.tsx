import React, { useEffect, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Animal from './models/Animal';
import './Dashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend);

interface AgeDistributionChartProps {
  animals: Animal[];
}

const AgeDistributionChart: React.FC<AgeDistributionChartProps> = ({ animals }) => {
  const chartRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const ageGroups = {
    '0-2': animals.filter(a => a.age <= 2).length,
    '3-5': animals.filter(a => a.age > 2 && a.age <= 5).length,
    '6+': animals.filter(a => a.age > 5).length
  };

  const data = {
    labels: Object.keys(ageGroups),
    datasets: [{
      data: Object.values(ageGroups),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
    }]
  };

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.data = data;
      chartRef.current.update();
    }
  }, [data]);

  return (
    <div ref={containerRef} className="chart-container">
      <Pie
        ref={chartRef}
        data={data}
        options={{
          animation: {
            duration: 500,
            easing: 'easeOutQuad'
          },
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                font: {
                  size: 12
                }
              }
            }
          }
        }}
      />
    </div>
  );
};

export default React.memo(AgeDistributionChart);