import React from 'react';
import { Link } from 'react-router-dom';
import { Clipboard, Code, ExternalLink, Calendar, Key, BarChart, FileText, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProjectCard = ({ project }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(project._id);
      toast.success('Project ID copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy Project ID.');
    }
  };

  return (
    <div className="relative bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-300 transform hover:shadow-2xl">
      {/* Title Bar-like Header */}
      <div className="  border-b  rounded-t-xl px-3 py-2 flex items-center justify-between overflow-hidden truncate mr-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-500 rounded-full text-white shadow-md">
            <Code className="h-5 w-5" />
          </div>
          <h4 className="text-lg font-bold truncate">{project.name}</h4>
        </div>
      </div>

      <div className="p-3 flex flex-col">
        <p className="text-sm text-gray-500 mb-3 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-gray-600">
            Created: {new Date(project.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </span>
        </p>

        <div className="flex-grow">
          <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Key className="h-5 w-5 text-purple-600 flex-shrink-0" />
              <code className="text-xs font-mono text-gray-700 truncate">
                {project._id}
              </code>
            </div>
            <button
              onClick={handleCopy}
              className="ml-3 flex-shrink-0 p-1.5 text-gray-500 rounded-md hover:bg-gray-200 hover:text-purple-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="Copy Project ID"
            >
              <Clipboard className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 flex justify-between items-center border-t border-gray-200 rounded-b-xl">
        <div className="flex items-center gap-4">
          <Link
            to={`/playground?project=${project._id}`}
            className="inline-flex items-center space-x-2 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Code className="h-4 w-4" />
            <span>Playground</span>
          </Link>
          <Link
            to={`/docs?project=${project._id}`}
            className="inline-flex items-center space-x-2 text-xs font-medium text-green-600 hover:text-green-800 transition-colors"
          >
            <FileText className="h-4 w-4" />
            <span>Docs</span>
          </Link>
          <Link
            to={`/logs?project=${project._id}`}
            className="inline-flex items-center space-x-2 text-xs font-medium text-yellow-600 hover:text-yellow-800 transition-colors"
          >
            <BarChart className="h-4 w-4" />
            <span>Logs</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;