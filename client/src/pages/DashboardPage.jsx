import React from 'react';
import DashboardLayout from '../components/common/layouts/DashboardLayout';
import ProjectCard from '../components/dashboard/ProjectCard';
import ProjectCardSkeleton from '../components/dashboard/ProjectCardSkeleton';
import QuickActions from '../components/dashboard/QuickActions';
import useFetch from '../hooks/useFetch';
import projectService from '../services/projectService';
import usageService from '../services/usageService';
import {
  AlertTriangle,
  RefreshCcw,
  PhoneCall,
  CheckCircle,
  XCircle,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  FolderOpen,
  GitFork,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const KpiCard = ({ title, value, icon, loading, error, change, changeType }) => {
  const renderValue = () => {
    if (loading) {
      return <div className="h-8 w-2/3 bg-gray-200 rounded-md animate-pulse"></div>;
    }
    if (error) {
      return <p className="text-xs text-red-500">Error</p>;
    }
    return (
      <div className="flex items-end gap-2">
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        {change && (
          <span className={`flex items-center text-sm font-medium ${changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
            {changeType === 'increase' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            {change}
          </span>
        )}
      </div>
    );
  };

  const getIconColors = () => {
    switch(title) {
      case 'Total Calls':
        return { bg: 'bg-indigo-100', text: 'text-indigo-600' };
      case 'Successful':
        return { bg: 'bg-green-100', text: 'text-green-600' };
      case 'Failed':
        return { bg: 'bg-red-100', text: 'text-red-600' };
      case 'Total Projects':
        return { bg: 'bg-sky-100', text: 'text-sky-600' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-600' };
    }
  };

  const { bg, text } = getIconColors();

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{title}</p>
        <div className={`p-2 rounded-full border border-gray-200 ${bg} ${text}`}>
          {icon}
        </div>
      </div>
      {renderValue()}
    </div>
  );
};

const ApiCallsChart = ({ data, loading, error }) => {
  if (loading) {
    return (
      <div className="h-96 w-full bg-white rounded-xl border border-gray-200 animate-pulse flex items-center justify-center text-gray-400">
        <div className="flex flex-col items-center">
          <Activity size={48} className="mb-4" />
          <p className="text-sm font-medium">Loading chart data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-96 w-full bg-white rounded-xl border border-red-200 flex flex-col items-center justify-center text-red-500">
        <AlertTriangle size={48} className="mb-4" />
        <p className="text-sm font-medium">Could not load chart data.</p>
        <p className="text-xs text-gray-400 mt-2">Please try refreshing the page.</p>
      </div>
    );
  }

  const chartData = data?.apiCallsData || [];

  const formatXAxis = (tickItem) => {
    const date = new Date(tickItem);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const date = new Date(label);
      return (
        <div className="bg-gray-800 text-white p-4 rounded-lg shadow-xl border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">{date.toLocaleString()}</p>
          <p className="font-semibold">{`Calls: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900 mb-6">API Calls Over Time</h3>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            stroke="#a3a3a3"
            tickFormatter={formatXAxis}
            padding={{ left: 15, right: 15 }}
          />
          <YAxis stroke="#a3a3a3" />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="count"
            name="API Calls"
            stroke="#1d4ed8"
            strokeWidth={2}
            dot={{ stroke: '#1d4ed8', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, strokeWidth: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const DashboardPage = () => {
  const {
    data: projects,
    loading: loadingProjects,
    error: errorProjects,
    refetch: refetchProjects,
    setData: setProjects
  } = useFetch(projectService.getProjects, { projects: [] });

  const {
    data: usageMetrics,
    loading: loadingMetrics,
    error: errorMetrics,
    refetch: refetchMetrics
  } = useFetch(usageService.getUsageMetrics);

  const handleProjectCreated = (newProject) => {
    setProjects((prev) => ({ projects: [newProject, ...prev.projects] }));
  };

  const projectList = projects?.projects || [];

  const renderProjectState = () => {
    if (loadingProjects) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (errorProjects) {
      return (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-red-200 shadow-sm text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="font-semibold text-lg text-red-600">Could Not Load Projects</h3>
          <p className="mt-2 text-sm text-red-500 max-w-sm">{errorProjects}</p>
          <button
            onClick={refetchProjects}
            className="mt-6 flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <RefreshCcw size={16} />
            Try Again
          </button>
        </div>
      );
    }

    if (projectList.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-16 bg-white rounded-xl shadow-sm border border-gray-200 text-center">
          <FolderOpen className="mx-auto h-20 w-20 text-gray-300 mb-6" strokeWidth={1} />
          <h3 className="text-xl font-medium text-gray-700">No Projects Found</h3>
          <p className="mt-2 text-base text-gray-500 max-w-sm">
            You haven't created any projects yet. Click the button above to get started.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
        {projectList.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="flex-1   bg-slate-50 text-gray-900 overflow-y-auto">
        <header className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900">
              Analytics Overview
            </h1>
            <p className="mt-2 text-md text-gray-500">
              A quick look at your API usage and project activity over the last 7 days.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <QuickActions onProjectCreated={handleProjectCreated} />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard
                  title="Total Calls"
                  value={usageMetrics?.totalCalls || 0}
                  icon={<PhoneCall size={20} />}
                  loading={loadingMetrics}
                  error={errorMetrics}
                  change="+12%"
                  changeType="increase"
                />
                <KpiCard
                  title="Successful"
                  value={usageMetrics?.successfulCalls || 0}
                  icon={<CheckCircle size={20} />}
                  loading={loadingMetrics}
                  error={errorMetrics}
                  change="+8%"
                  changeType="increase"
                />
                <KpiCard
                  title="Failed"
                  value={usageMetrics?.failedCalls || 0}
                  icon={<XCircle size={20} />}
                  loading={loadingMetrics}
                  error={errorMetrics}
                  change="-2%"
                  changeType="decrease"
                />
                <KpiCard
                  title="Total Projects"
                  value={usageMetrics?.totalProjects || 0}
                  icon={<GitFork size={20} />}
                  loading={loadingMetrics}
                  error={errorMetrics}
                  change="+5"
                  changeType="increase"
                />
              </div>
            </section>
  <section className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Projects</h2>
          {renderProjectState()}
        </section>
         
          </div>

          {/* Sidebar / Right Column */}
          <div className="lg:col-span-1 space-y-8 md:pl-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Insights</h3>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3 text-gray-600">
                  <Activity size={20} className="text-blue-500 flex-shrink-0" />
                  <span className="text-sm">High traffic period: <span className="font-semibold text-gray-800">Wed, 10 AM</span></span>
                </li>
                <li className="flex items-center space-x-3 text-gray-600">
                  <AlertTriangle size={20} className="text-yellow-500 flex-shrink-0" />
                  <span className="text-sm">Last failed call: <span className="font-semibold text-gray-800">2 mins ago</span></span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Documentation</h3>
              <p className="text-sm text-gray-600 mb-4">
                Need help getting started? Our comprehensive guides and API reference are available to help you.
              </p>
              <a
                href="/docs"
                className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Go to Docs
                <ArrowUpRight size={16} className="ml-2" />
              </a>
            </div>
          </div>
        </div>
      
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;