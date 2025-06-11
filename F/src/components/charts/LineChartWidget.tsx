import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useBotContext } from '../../context/BotContext';
import ChartCard from './ChartCard';

interface LineChartWidgetProps {
  title: string;
}

const LineChartWidget: React.FC<LineChartWidgetProps> = ({ title }) => {
  const { subscriberData } = useBotContext();

  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={subscriberData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="date" 
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
            axisLine={{ stroke: '#4B5563' }}
          />
          <YAxis 
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
            axisLine={{ stroke: '#4B5563' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              borderColor: '#374151',
              color: '#F9FAFB' 
            }}
            itemStyle={{ color: '#F9FAFB' }}
            labelStyle={{ color: '#F9FAFB' }}
            formatter={(value: number) => [value.toLocaleString(), 'الفنيين']}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#10B981" 
            strokeWidth={2}
            dot={{ stroke: '#10B981', strokeWidth: 2, r: 4, fill: '#1F2937' }}
            activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2, fill: '#10B981' }}
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default LineChartWidget;
