import React, { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  children: ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 sm:p-5 shadow-md border border-gray-700 hover:border-gray-600 transition-all duration-300 responsive-card">
      <h3 className="text-base sm:text-lg font-medium text-white mb-4">{title}</h3>
      <div className="chart-responsive">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
