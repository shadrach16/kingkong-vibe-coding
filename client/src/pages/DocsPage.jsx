import React, { useState } from 'react';
import MainLayout from '../components/common/layouts/MainLayout';
import DocsSidebar from '../components/docs/DocsSidebar';
import DocsContent from '../components/docs/DocsContent';

const DocsPage = () => {
  const [currentDoc, setCurrentDoc] = useState('tutorials/introduction');

  return (
      <div className="flex">
        <DocsSidebar onSelect={setCurrentDoc} currentDoc={currentDoc} />
        <div className="flex-1 p-8">
          <DocsContent docPath={currentDoc} />
        </div>
      </div>
  );
};

export default DocsPage;