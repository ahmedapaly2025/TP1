import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon }) => {
  const isPositive = change >= 0;
  
  return (
    <div className="bg-gray-800 rounded-lg p-3 sm:p-4 shadow-md border border-gray-700 hover:border-gray-600 transition-all duration-300 responsive-card">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-gray-400 font-medium text-sm sm:text-base text-responsive">{title}</h3>
        <span className="p-2 rounded-md bg-gray-700/50 flex-shrink-0">
          {icon}
        </span>
      </div>
      <div className="flex flex-col">
        <p className="text-xl sm:text-2xl font-bold text-responsive">{value}</p>
        <div className="flex items-center mt-1">
          <span className={`flex items-center text-xs sm:text-sm ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
            {isPositive ? (
              <ArrowUpRight size={14} sm:size={16} className="mr-1" />
            ) : (
              <ArrowDownRight size={14} sm:size={16} className="mr-1" />
            )}
            {Math.abs(change)}%
          </span>
          <span className="text-gray-500 text-xs sm:text-sm ml-1 hidden sm:inline">vs previous</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
