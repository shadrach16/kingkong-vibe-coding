import React, { useState } from 'react';
import { Plus, Loader2, X } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { toast } from 'react-hot-toast';
import projectService from '../../services/projectService';

const QuickActions = ({ onProjectCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [loading, setLoading] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
    setProjectName('');
  };

  const openModal = () => setIsOpen(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await projectService.createProject(projectName);
      toast.success('Project created successfully!');
      if (onProjectCreated) {
        onProjectCreated(response.project);
      }
      closeModal();
    } catch (err) {
      const errorMessage = err.message || 'Failed to create project.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={openModal}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors duration-200"
      >
        <Plus className="h-4 w-4 mr-2" />
        Create New Project
      </button>

      <Transition appear show={isOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900 bg-opacity-20 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-lg bg-gray-100 border border-gray-300 shadow-xl transition-all">
                  {/* Title Bar */}
                  <div className="flex items-center justify-between px-4 py-2 bg-gray-200 border-b border-gray-300">
                    <Dialog.Title as="h3" className="text-sm font-normal text-gray-700">
                      Create a New Project
                    </Dialog.Title>
                    <button
                      type="button"
                      className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-300 transition-colors"
                      onClick={closeModal}
                    >
                      <X size={16} />
                    </button>
                  </div>
                  {/* Main Content Area */}
                  <div className="p-6 text-left">
                    <p className="mt-2 text-sm text-gray-600">
                      Give your project a name to get started. You can change this later.
                    </p>
                    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                      <div>
                        <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
                          Project Name
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="projectName"
                            id="projectName"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 transition-colors bg-white border"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            placeholder="e.g., My Awesome App Backend"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors"
                          onClick={closeModal}
                          disabled={loading}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className={`inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={loading}
                        >
                          {loading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            'Create Project'
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default QuickActions;