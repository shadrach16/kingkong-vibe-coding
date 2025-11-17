import React from 'react';

const ProjectCardSkeleton = () => {
  return (
    <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200 animate-pulse transition-all duration-300">
      <div className="h-6 w-3/4 bg-neutral-200 rounded-md mb-4"></div>
      <div className="h-4 w-1/2 bg-neutral-200 rounded-md mb-2"></div>
      <div className="h-4 w-2/3 bg-neutral-200 rounded-md mb-6"></div>
      <div className="flex justify-between items-center mt-auto">
        <div className="h-8 w-1/4 bg-neutral-200 rounded-md"></div>
        <div className="h-8 w-8 rounded-full bg-neutral-200"></div>
      </div>
    </div>
  );
};

export default ProjectCardSkeleton;