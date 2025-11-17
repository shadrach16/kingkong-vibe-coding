import React, { useState } from 'react';
import Button from '../common/forms/Button';
import { Sparkles, Code, Play } from 'lucide-react';

const PromptEditor = ({ onSubmit, loading }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-100 p-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">
          <Sparkles size={24} />
        </div>
        <h2 className="text-xl font-bold text-gray-900">AI Prompt Editor</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col flex-1">
        <div className="relative flex-1 mb-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-full p-6 text-gray-800 bg-gray-50 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow placeholder-gray-400 border border-gray-200"
            placeholder="e.g., 'Find all users whose email ends in .com and sort by creation date descending'"
          />
        </div>

        <div className="flex justify-end mt-4">
          <Button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-indigo-600 rounded-full shadow-lg hover:bg-indigo-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Play size={18} className="mr-2" />
            {loading ? 'Running...' : 'Run Prompt'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PromptEditor;