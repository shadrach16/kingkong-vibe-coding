import React, { useState } from 'react';
import { JsonView } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';
import { Table, Code } from 'lucide-react';

const Visualizer = ({ data }) => {
  const [view, setView] = useState('table');

  if (!data || !data.result || data.result.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        No results to display.
      </div>
    );
  }

  const columns = data.result.length > 0 ? Object.keys(data.result[0]) : [];

  const renderTable = () => (
    <div className="overflow-hidden h-full rounded-xl border border-gray-200">
      <div className="overflow-x-auto h-full">
        <table className="w-full table-auto text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase text-gray-500 sticky top-0">
            <tr>
              {columns.map((col) => (
                <th key={col} scope="col" className="px-6 py-3 font-semibold border-r border-gray-200 last:border-r-0">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.result.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 transition-colors duration-200">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap border-r border-gray-200 last:border-r-0">
                    {typeof row[col] === 'object' && row[col] !== null ? JSON.stringify(row[col]) : String(row[col])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderJsonTree = () => (
    <div className="bg-white p-4 rounded-xl h-full overflow-y-auto border border-gray-200">
      <JsonView data={data.result} shouldInitiallyExpand={(level) => level < 1} />
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <div className="flex items-center gap-4 mb-6 border-b border-gray-200 pb-4">
        <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">
          <Table size={24} />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Query Visualizer</h2>
      </div>

      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setView('table')}
          className={`flex items-center gap-2 py-2 px-4 rounded-full font-semibold transition-colors duration-200 ${
            view === 'table' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Table size={18} />
          <span>Table View</span>
        </button>
        <button
          onClick={() => setView('json-tree')}
          className={`flex items-center gap-2 py-2 px-4 rounded-full font-semibold transition-colors duration-200 ${
            view === 'json-tree' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Code size={18} />
          <span>JSON Tree View</span>
        </button>
      </div>

      <div className="flex-1 min-h-0">
        {view === 'table' ? renderTable() : renderJsonTree()}
      </div>
    </div>
  );
};

export default Visualizer;