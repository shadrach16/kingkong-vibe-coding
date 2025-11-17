import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, ClipboardCheck } from 'lucide-react';
import { useState } from 'react';

const CodeBlock = ({ children, language = 'markdown' }) => {
  const [copied, setCopied] = useState(false);
  const codeString = String(children).replace(/\n$/, '');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  return (
    <div className="relative rounded-xl overflow-hidden shadow-lg my-6 group " style={{width:'65vw'}}  >
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-gray-400 text-xs font-mono">
        <span className="capitalize">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors duration-200"
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <>
              <ClipboardCheck className="w-3.5 h-3.5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={language}
        showLineNumbers={true}
        customStyle={{
          borderRadius: '0 0 8px 8px',
          padding: '1.5rem',
          fontSize: '0.875rem',
          lineHeight: '1.5',
          margin: 0,
          background: '#1e1e1e',
        }}
        codeTagProps={{
          style: {
            fontFamily: 'Fira Code, monospace',
          },
        }}
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;