import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import CodeBlock from '../common/CodeBlock';
import { Loader2, AlertTriangle, FileText } from 'lucide-react';

const DocsContent = ({ docPath }) => {
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoc = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/documentation/${docPath}.md`);
        if (!res.ok) {
          throw new Error('Documentation file not found.');
        }
        const text = await res.text();
        setMarkdown(text);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoc();
  }, [docPath]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[50vh] text-gray-400">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
        <p className="mt-4 text-lg">Loading documentation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[50vh] text-red-500">
        <AlertTriangle className="h-10 w-10" />
        <p className="mt-4 text-lg font-semibold">Error loading content</p>
        <p className="text-sm text-gray-500 mt-1">Details: {error}</p>
      </div>
    );
  }

  return (
    <article className="prose prose-base sm:prose-lg max-w-none text-gray-800 font-sans break-words">
      <ReactMarkdown
        children={markdown}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-4xl font-extrabold mt-8 mb-4 text-gray-900 border-b border-gray-200 pb-2" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-3xl font-bold mt-10 mb-3 text-gray-900" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-2xl font-bold mt-8 mb-2 text-gray-900" {...props} />
          ),
          p: ({ node, ...props }) => <p className="mb-4 text-gray-700 leading-relaxed" {...props} />,
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-700" {...props} />
          ),
          li: ({ node, ...props }) => <li className="pl-1" {...props} />,
          code: ({ node, inline, ...props }) => {
            if (inline) {
              return <code className="bg-gray-100 text-red-600 rounded-md px-1 py-0.5 text-sm font-mono break-words" {...props} />;
            }
            return <CodeBlock {...props} />;
          },
          pre: ({ node, ...props }) => <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm overflow-x-auto mb-6" {...props} />,
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse border border-gray-300 rounded-lg overflow-hidden my-6" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => <thead className="bg-gray-100" {...props} />,
          th: ({ node, ...props }) => (
            <th className="px-4 py-3 border border-gray-300 font-semibold text-left text-gray-700 whitespace-nowrap" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="px-4 py-3 border border-gray-300 align-top text-sm text-gray-600" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200 font-medium no-underline hover:underline" {...props} />
          ),
        }}
      />
    </article>
  );
};

export default DocsContent;