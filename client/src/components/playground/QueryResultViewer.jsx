import React, { useState } from 'react';
import { Database, Code, Clipboard, Check } from 'lucide-react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yLight, atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { toast } from 'react-hot-toast';

const QueryResultViewer = ({ data, API_KEY, API_URL, payload }) => {
  const [activeTab, setActiveTab] = useState('results');
  const [isCopied, setIsCopied] = useState(false);

  const formatJSON = (json) => {
    try {
      return JSON.stringify(json, null, 2);
    } catch (e) {
      return 'Invalid JSON data';
    }
  };

  const handleCopy = (textToCopy) => {
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setIsCopied(true);
        toast.success('Code copied to clipboard!');
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => {
        toast.error('Failed to copy code.');
        console.error('Failed to copy text: ', err);
      });
  };

  const codeSnippets = {
    curl: `curl --location '${API_URL}' \\
--header 'Content-Type: application/json' \\
--header 'x-api-key: ${API_KEY}' \\
--data-raw '${JSON.stringify(payload, null, 2)}'`,
    javascript: `const url = '${API_URL}';
const headers = {
  'Content-Type': 'application/json',
  'x-api-key': '${API_KEY}'
};
const payload = ${formatJSON(payload)};

fetch(url, {
  method: 'POST',
  headers: headers,
  body: JSON.stringify(payload)
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`,
    python: `import requests
import json

url = '${API_URL}'
headers = {
    'Content-Type': 'application/json',
    'x-api-key': '${API_KEY}'
}
payload = ${formatJSON(payload)};

response = requests.post(url, headers=headers, data=json.dumps(payload))

print(response.json())`,
    node: `const fetch = require('node-fetch');

const url = '${API_URL}';
const headers = {
  'Content-Type': 'application/json',
  'x-api-key': '${API_KEY}'
};
const payload = ${formatJSON(payload)};

fetch(url, {
  method: 'POST',
  headers: headers,
  body: JSON.stringify(payload)
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`,
    rust: `use reqwest::blocking::Client;
use std::collections::HashMap;

fn main() -> Result<(), reqwest::Error> {
    let client = Client::new();
    let mut payload = HashMap::new();
    // Reconstruct the payload as a Rust HashMap or struct
    // This is a simplified example, you'd need to properly serialize your payload
    payload.insert("prompts", serde_json::to_value(&["Create a customer table...", "Populate the table..."]).unwrap());

    let res = client.post("${API_URL}")
           .header("Content-Type", "application/json")
           .header("x-api-key", "${API_KEY}")
           .json(&payload)
           .send()?
           .json::<serde_json::Value>()?;

    println!("{:#?}", res);
    Ok(())
}`,
  };

  const renderContent = () => {
    if (activeTab === 'results') {
      return (
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Query Results</h3>
            <button
              onClick={() => handleCopy(formatJSON(data))}
              className="flex items-center gap-2 p-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label="Copy results"
            >
              {isCopied ? <Check size={16} className="text-green-500" /> : <Clipboard size={16} />}
              <span>{isCopied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm border border-gray-200 overflow-auto">
            <SyntaxHighlighter
              language="json"
              style={a11yLight}
              customStyle={{ background: 'transparent', padding: '0' }}
              showLineNumbers
              lineNumberStyle={{ color: '#aaa', paddingRight: '1rem' }}
            >
              {formatJSON(data)}
            </SyntaxHighlighter>
          </div>
        </div>
      );
    } else {
      return (
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Request Code</h3>
            <button
              onClick={() => handleCopy(codeSnippets[activeTab])}
              className="flex items-center gap-2 p-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label="Copy code"
            >
              {isCopied ? <Check size={16} className="text-green-500" /> : <Clipboard size={16} />}
              <span>{isCopied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm overflow-auto">
            <SyntaxHighlighter
              language={activeTab === 'curl' ? 'bash' : activeTab}
              style={atomOneDark}
              customStyle={{ background: 'transparent', padding: '0' }}
              showLineNumbers
              lineNumberStyle={{ color: '#666', paddingRight: '1rem' }}
            >
              {codeSnippets[activeTab]}
            </SyntaxHighlighter>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col bg-white    shadow-lg min-h-[700px]">
      <div className="p-4   border-b   rounded-t-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-100 rounded-full text-purple-600">
            <Database size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">API Query Response</h2>
            <p className="text-sm text-gray-600 mt-1">
              Explore the results and the code to integrate this AI task into your application.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1">
        <div className="flex border-b border-gray-200 bg-gray-100 p-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('results')}
            className={`flex items-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap
              ${activeTab === 'results' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
          >
            <Database size={16} />
            Results
          </button>
          {['curl', 'javascript', 'python', 'node', 'rust'].map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveTab(lang)}
              className={`flex items-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap
                ${activeTab === lang ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              <Code size={16} />
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default QueryResultViewer;