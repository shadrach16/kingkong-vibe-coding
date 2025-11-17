import React, { useState, useEffect, useMemo } from 'react';
import MainLayout from '../components/common/layouts/MainLayout';
import LogViewer from '../components/logs/LogViewer';
import LogFilters from '../components/logs/LogFilters';
import { useAuth } from '../context/AuthContext';
import { logService } from '../services/logService';
import projectService from '../services/projectService';
import { Loader2, AlertCircle, HardDrive, Filter, Clock, Calendar, Search, ArrowDownUp, Minimize, Square, X } from 'lucide-react';
import Select from 'react-select';
import { toast } from 'react-hot-toast';
import moment from 'moment';
 
const getProjectParam = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('project');
};
 
const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeLevel, setActiveLevel] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
 
  const { user } = useAuth();
 
  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const fetchedProjects = await projectService.getProjects();
        setProjects(fetchedProjects.projects);
        const projectIdFromUrl = getProjectParam();
        if (projectIdFromUrl) {
          setSelectedProjectId(projectIdFromUrl);
        } else if (fetchedProjects?.projects?.length > 0) {
          setSelectedProjectId(fetchedProjects.projects[0]._id);
        }
      } catch (err) {
        toast.error('Failed to fetch user projects.');
        console.error('Failed to fetch projects:', err);
      }
    };
    if (user?.token) {
      fetchProjects();
    }
  }, [user]);
 
  // Fetch logs whenever the project, level, or date changes
  useEffect(() => {
    const fetchLogs = async () => {
      if (!selectedProjectId) return;
 
      setLoading(true);
      setError(null);
      try {
        const fetchedLogs = await logService.getProjectLogs(selectedProjectId, user.apiKey, activeLevel, selectedDate);
        setLogs(fetchedLogs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user && selectedProjectId) {
      fetchLogs();
    }
  }, [user, selectedProjectId, activeLevel, selectedDate]);
 
  // Memoized filtered and sorted logs for performance
  const sortedAndFilteredLogs = useMemo(() => {
    let currentLogs = logs;
 
    // Apply search filter
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      currentLogs = currentLogs.filter(log =>
        log.message?.toLowerCase().includes(lowercasedTerm) ||
        (log.details && JSON.stringify(log.details)?.toLowerCase().includes(lowercasedTerm))
      );
    }
 
    // Apply sort
    const sortedLogs = [...currentLogs].sort((a, b) => {
      const dateA = moment(a.timestamp);
      const dateB = moment(b.timestamp);
      if (sortOrder === 'asc') {
        return dateA.valueOf() - dateB.valueOf();
      }
      return dateB.valueOf() - dateA.valueOf();
    });
 
    return sortedLogs;
  }, [logs, searchTerm, sortOrder]);
 
  const projectOptions = projects.map(project => ({
    value: project._id,
    label: project.name,
  }));
 
  return (
    <MainLayout>
      <div className=" flex justify-center items-center min-h-screen antialiased bg-gray-200">
        <div className="w-full  bg-gray-100 rounded-md   border border-gray-300 overflow-hidden flex flex-col font-sans">
          {/* Window Title Bar */}
          <div className="bg-gray-200 border-b border-gray-300 p-2 flex items-center justify-between">
         
            <span className="text-sm font-medium text-gray-700">Project Logs - Monitor and Analyze</span>
            <div className="flex items-center space-x-2 opacity-0">
              <Minimize className="w-4 h-4 text-gray-500" />
              <Square className="w-4 h-4 text-gray-500" />
              <X className="w-4 h-4 text-gray-500" />
            </div>
          </div>
 
          {/* Main Application Content */}
          <div className="  overflow-hidden w-full">
            {/* Sidebar for Filters */}
            <div className="flex items-center  border-b ">
                <LogFilters onFilterChange={setActiveLevel} activeLevel={activeLevel} />
            </div>
 
            {/* Main Content Area */}
            <div className="flex-1 px-6 flex flex-col overflow-y-auto">
              {/* Header/Toolbar */}
              <div className="py-4 border-b border-gray-200 mb-6 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <HardDrive className="h-6 w-6 text-indigo-500" />
                  <h2 className="text-2xl font-bold text-gray-900">Log Stream</h2>
                  <span className="text-sm font-medium text-gray-600 ml-4">
                    <Clock className="h-4 w-4 inline-block mr-1 text-gray-500" />
                    Logs for {selectedDate}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-48">
                    <Select
                      value={projectOptions.find(option => option.value === selectedProjectId)}
                      onChange={(option) => setSelectedProjectId(option ? option.value : '')}
                      options={projectOptions}
                      placeholder="Select Project"
                      isClearable
                      isSearchable
                      className="text-sm"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-36 pl-8 pr-2 py-2 text-sm rounded-md border border-gray-300 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <Calendar className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />
                  </div>
                </div>
              </div>
 
              {/* Search and Sort Bar */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm rounded-md border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="flex items-center gap-2 py-2 px-4 rounded-md text-gray-600 border border-gray-300 bg-white shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <ArrowDownUp className="h-4 w-4" />
                  <span className="text-sm font-medium">Sort</span>
                </button>
              </div>
 
              {/* Log Viewer Area */}
              <div className="min-h-[600px] relative   bg-white  flex-1 overflow-auto">
                {loading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10">
                    <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
                    <p className="mt-4 text-gray-600 font-medium">Loading logs...</p>
                  </div>
                )}
                {error && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10">
                    <AlertCircle className="h-12 w-12 text-red-500" />
                    <p className="mt-4 text-red-600 font-medium">Error: {error}</p>
                  </div>
                )}
                {!loading && !error && <LogViewer logs={sortedAndFilteredLogs} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
 
export default LogsPage;