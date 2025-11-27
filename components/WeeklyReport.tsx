import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TaskObject, Category } from '../types';
import { CATEGORY_LABELS } from '../constants';

interface WeeklyReportProps {
  tasks: TaskObject[];
}

const COLORS = {
  [Category.MINISTRY]: '#f97316', // Orange 500
  [Category.FAMILY]: '#3b82f6',   // Blue 500
  [Category.PERSONAL_GROWTH]: '#22c55e' // Green 500
};

const WeeklyReport: React.FC<WeeklyReportProps> = ({ tasks }) => {
  const stats = useMemo(() => {
    const totalMinutes = {
      [Category.MINISTRY]: 0,
      [Category.FAMILY]: 0,
      [Category.PERSONAL_GROWTH]: 0,
    };

    let grandTotal = 0;

    tasks.forEach(task => {
      const start = new Date(task.startTime);
      const end = new Date(task.endTime);
      const duration = (end.getTime() - start.getTime()) / (1000 * 60); // minutes
      
      if (duration > 0) {
        totalMinutes[task.category] += duration;
        grandTotal += duration;
      }
    });

    const data = [
      { name: CATEGORY_LABELS[Category.MINISTRY], value: totalMinutes[Category.MINISTRY], color: COLORS[Category.MINISTRY] },
      { name: CATEGORY_LABELS[Category.FAMILY], value: totalMinutes[Category.FAMILY], color: COLORS[Category.FAMILY] },
      { name: CATEGORY_LABELS[Category.PERSONAL_GROWTH], value: totalMinutes[Category.PERSONAL_GROWTH], color: COLORS[Category.PERSONAL_GROWTH] },
    ];

    return { data, grandTotal, totalMinutes };
  }, [tasks]);

  const formatHours = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = Math.floor(minutes % 60);
    return `${h}h ${m}m`;
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Relatório Semanal de Equilíbrio</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Chart Section */}
        <div className="h-64 md:h-80 w-full bg-gray-50 rounded-lg p-4">
          {stats.grandTotal > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatHours(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Sem dados para exibir
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="space-y-4">
          <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
            <h3 className="font-semibold text-orange-900">Ministério</h3>
            <p className="text-2xl font-bold text-orange-700">{formatHours(stats.totalMinutes[Category.MINISTRY])}</p>
            <p className="text-sm text-orange-600">
              {stats.grandTotal > 0 ? ((stats.totalMinutes[Category.MINISTRY] / stats.grandTotal) * 100).toFixed(1) : 0}% do tempo total
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <h3 className="font-semibold text-blue-900">Família</h3>
            <p className="text-2xl font-bold text-blue-700">{formatHours(stats.totalMinutes[Category.FAMILY])}</p>
            <p className="text-sm text-blue-600">
              {stats.grandTotal > 0 ? ((stats.totalMinutes[Category.FAMILY] / stats.grandTotal) * 100).toFixed(1) : 0}% do tempo total
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
            <h3 className="font-semibold text-green-900">Crescimento Pessoal</h3>
            <p className="text-2xl font-bold text-green-700">{formatHours(stats.totalMinutes[Category.PERSONAL_GROWTH])}</p>
            <p className="text-sm text-green-600">
              {stats.grandTotal > 0 ? ((stats.totalMinutes[Category.PERSONAL_GROWTH] / stats.grandTotal) * 100).toFixed(1) : 0}% do tempo total
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyReport;