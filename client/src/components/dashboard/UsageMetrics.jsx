import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Gauge, HardDrive, Zap, TrendingUp, TrendingDown, CheckCircle, XCircle } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
  labels: ['Used', 'Remaining'],
  datasets: [
    {
      data: [80, 20], // Example data for the chart
      backgroundColor: ['#4F46E5', '#E5E7EB'],
      borderColor: ['#4F46E5', '#E5E7EB'],
      borderWidth: 1,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return `${context.label}: ${context.raw.toFixed(2)}%`;
        },
      },
    },
  },
};

const KpiCard = ({ icon, title, value, unit, description, color, trendIcon, trendText, trendColor }) => (
  <div className="flex flex-col p-6 bg-white rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${color}`}>
        {icon}
      </div>
      <div className="flex items-center text-sm font-medium" style={{ color: trendColor }}>
        {trendIcon}
        <span className="ml-1">{trendText}</span>
      </div>
    </div>
    <div className="flex-1">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</h3>
      <p className="mt-2 text-3xl font-bold text-gray-900">
        {value}
        {unit && <span className="ml-2 text-lg font-medium text-gray-500">{unit}</span>}
      </p>
      <p className="mt-2 text-xs text-gray-500">{description}</p>
    </div>
  </div>
);

const UsageMetrics = ({ usageData }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-2xl p-6 h-48"></div>
        ))}
      </div>
    );
  }

  if (!usageData || usageData.totalCalls === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-200 text-center">
        <h3 className="text-xl font-bold text-gray-700">No Usage Data Available</h3>
        <p className="mt-2 text-base text-gray-500">
          Make your first API call to see your usage statistics here.
        </p>
      </div>
    );
  }

  // Real data handling
  const pieData = {
    labels: ['Used', 'Remaining'],
    datasets: [
      {
        data: [usageData.usedPercentage, 100 - usageData.usedPercentage],
        backgroundColor: ['#4F46E5', '#E5E7EB'],
        borderColor: ['#4F46E5', '#E5E7EB'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <KpiCard
        icon={<Zap className="h-6 w-6 text-indigo-500" />}
        title="Total API Calls"
        value={usageData.totalCalls}
        unit="calls"
        description="Total API calls this month."
        color="bg-indigo-100"
        trendIcon={<TrendingUp className="h-4 w-4" />}
        trendText="+12% from last month"
        trendColor="#10B981"
      />
      <KpiCard
        icon={<CheckCircle className="h-6 w-6 text-green-500" />}
        title="Successful Calls"
        value={usageData.successfulCalls}
        unit="calls"
        description="Calls with a 2xx status code."
        color="bg-green-100"
        trendIcon={<TrendingUp className="h-4 w-4" />}
        trendText="+8% from last month"
        trendColor="#10B981"
      />
      <KpiCard
        icon={<XCircle className="h-6 w-6 text-red-500" />}
        title="Failed Calls"
        value={usageData.failedCalls}
        unit="calls"
        description="Calls with a 4xx or 5xx status code."
        color="bg-red-100"
        trendIcon={<TrendingDown className="h-4 w-4" />}
        trendText="-2% from last month"
        trendColor="#EF4444"
      />

      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="w-40 h-40 flex-shrink-0 relative">
          <Pie data={pieData} options={options} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-900">{usageData.usedPercentage.toFixed(1)}%</span>
            <span className="text-sm font-medium text-gray-500 mt-1">Used</span>
          </div>
        </div>
        <div className="mt-6 w-full text-center">
          <h3 className="text-base font-semibold text-gray-700">Monthly Call Quota</h3>
          <p className="mt-1 text-sm text-gray-500">
            <span className="font-bold text-gray-900">{usageData.totalCalls}</span> of{' '}
            <span className="font-bold text-gray-900">{usageData.planLimit}</span> calls used.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UsageMetrics;