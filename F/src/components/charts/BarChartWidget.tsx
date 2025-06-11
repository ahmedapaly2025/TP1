import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useBotContext } from '../../context/BotContext';
import ChartCard from './ChartCard';

interface BarChartWidgetProps {
  title: string;
  variant?: 'vertical' | 'horizontal';
}

const BarChartWidget: React.FC<BarChartWidgetProps> = ({ 
  title, 
  variant = 'vertical'
}) => {
  const { commandUsageData, taskCompletionData } = useBotContext();
  const isHorizontal = variant === 'horizontal';
  
  // Choose data based on title
  const rawData = title.includes('أوامر') ? commandUsageData : taskCompletionData;
  const data = rawData.slice(0, isHorizontal ? 5 : 8);
  
  const dataKey = isHorizontal ? 'value' : 'name';
  const barDataKey = isHorizontal ? 'name' : 'value';
  
  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          layout={isHorizontal ? 'vertical' : 'horizontal'}
          margin={{ top: 10, right: 10, left: isHorizontal ? 70 : 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            type={isHorizontal ? 'number' : 'category'}
            dataKey={isHorizontal ? undefined : dataKey}
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
            axisLine={{ stroke: '#4B5563' }}
            tickFormatter={isHorizontal ? (value) => value.toLocaleString() : undefined}
          />
          <YAxis 
            type={isHorizontal ? 'category' : 'number'}
            dataKey={isHorizontal ? dataKey : undefined}
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
            axisLine={{ stroke: '#4B5563' }}
            tickFormatter={!isHorizontal ? (value) => value.toLocaleString() : undefined}
            width={isHorizontal ? 70 : 40}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              borderColor: '#374151',
              color: '#F9FAFB' 
            }}
            itemStyle={{ color: '#F9FAFB' }}
            labelStyle={{ color: '#F9FAFB' }}
            formatter={(value: number) => [value.toLocaleString(), title.includes('أوامر') ? 'الاستخدام' : 'المهام']}
          />
          <Bar 
            dataKey={barDataKey} 
            fill="#8884d8" 
            radius={[4, 4, 0, 0]} 
            animationDuration={1000}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default BarChartWidget;
