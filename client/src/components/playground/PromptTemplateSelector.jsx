// src/components/playground/PromptTemplateSelector.jsx

import React from 'react';
import { ChevronDown } from 'lucide-react';

const PromptTemplateSelector = ({ onSelect, templates }) => {
  const handleSelect = (event) => {
    onSelect(event.target.value);
  };

  return (
    <div className="relative inline-block text-left">
      <select
        onChange={handleSelect}
        className="appearance-none flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
      >
        <option value="">Apply Template...</option>
        {templates.map((template) => (
          <option key={template.id} value={template.text}>{template.name}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <ChevronDown size={16} />
      </div>
    </div>
  );
};

export default PromptTemplateSelector;