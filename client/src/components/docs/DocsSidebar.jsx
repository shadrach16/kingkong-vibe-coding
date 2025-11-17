import React from 'react';
import {
  Book,
  Code,
  Compass,
  FileText,
  ChevronRight,
  Minimize,
  Square,
  X,
} from 'lucide-react';
 
const docsMap = [
  {
    section: 'Getting Started',
    icon: <Compass className="h-4 w-4" />,
    files: [{ name: 'Introduction', path: 'tutorials/introduction' }],
  },
  {
    section: 'Tutorials',
    icon: <Book className="h-4 w-4" />,
    files: [
      { name: 'Getting Started', path: 'tutorials/getting-started' },
      { name: 'How to Prompt', path: 'tutorials/prompt' },
  ],
  },
  {
    section: 'API Reference',
    icon: <Code className="h-4 w-4" />,
    files: [
      { name: 'Query API', path: 'api-reference/query-api' },
    ],
  },
];
 
const DocsSidebar = ({ onSelect, currentDoc }) => {
 

  return (
    <div className="flex flex-col w-[300px] min-h-full mx-auto  bg-gray-100   border border-gray-300 overflow-hidden font-sans">
      {/* Window Title Bar */}
      <div className="bg-gray-200 border-b border-gray-300 p-2 flex justify-between items-center cursor-move flex-shrink-0">
        <div className="flex space-x-1">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
 
        </div>
        <span className="text-sm font-medium text-gray-700">KingKong Documentation</span>
        <div className="flex space-x-1 opacity-0">
          <Minimize className="w-3 h-3 text-gray-500" />
          <Square className="w-3 h-3 text-gray-500" />
          <X className="w-3 h-3 text-gray-500" />
        </div>
      </div>
 
      {/* Main Content Area */}
      <div className="w-full flex-1 p-4 overflow-y-auto">
        <h2 className="sr-only">Documentation Navigation</h2>
        <nav className="space-y-6">
          {docsMap.map((section) => (
            <div key={section.section}>
              <h3 className="flex items-center gap-3 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                {section.icon}
                {section.section}
              </h3>
              <ul className="space-y-1">
                {section.files.map((file) => (
                  <li key={file.path}>
                    <button
                      onClick={() => onSelect(file.path)}
                      className={`flex items-center gap-3 w-full text-left py-2 px-3 rounded-md text-sm transition-colors duration-200
                        ${currentDoc.startsWith(file.path)
                          ? 'bg-indigo-200 text-indigo-800 font-semibold'
                          : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'}`}
                    >
                      <FileText className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{file.name}</span>
                      <ChevronRight className={`h-4 w-4 ml-auto text-gray-400 transition-transform duration-200 ${currentDoc.startsWith(file.path) ? 'rotate-90' : ''}`} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
        </nav>
      </div>
    </div>
  );
};
 
export default DocsSidebar;