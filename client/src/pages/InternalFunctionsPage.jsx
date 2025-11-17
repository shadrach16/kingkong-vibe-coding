import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Select from 'react-select';
import MainLayout from '../components/common/layouts/MainLayout';
import InternalFunctionsComponent from '../components/InternalFunctionsComponent';
import projectService from '../services/projectService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { LibraryBig, X, Minus, Maximize, Circle } from 'lucide-react';
import { toast } from 'react-hot-toast';


const InternalFunctionsPage = () => {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const getProjectParam = () => {
        return searchParams.get('projectId');
    };

    const fetchProjects = async () => {
        try {
            const fetchedProjects = await projectService.getProjects();
            setProjects(fetchedProjects.projects);
            const urlProjectId = getProjectParam();
            if (urlProjectId && fetchedProjects.projects.some(p => p._id === urlProjectId)) {
                setSelectedProjectId(urlProjectId);
            } else if (fetchedProjects.projects.length > 0) {
                setSelectedProjectId(fetchedProjects.projects[0]._id);
            }
        } catch (err) {
            toast.error('Failed to fetch projects.');
            console.error('Failed to fetch projects:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchProjects();
        }
    }, [user]);

    const projectOptions = projects.map(project => ({
        value: project._id,
        label: project.name,
    }));


    return (
        <MainLayout>
            <div className="flex flex-col h-full bg-gray-100 container mx-auto font-sans">
                {/* Window Frame */}
                <div className="flex flex-col h-full bg-white rounded-md  border border-gray-300 overflow-hidden">
                    {/* Title Bar */}
                    <div className="flex items-center justify-between px-4 py-2 bg-gray-200 border-b border-gray-300">
                        <div className="flex items-center space-x-2">
                            <LibraryBig size={16} className="text-gray-500" />
                            <span className="text-sm font-semibold text-gray-700">Internal Functions</span>
                        </div>
                       
                    </div>

                    {/* Main Content Area */}
                    <div className="flex flex-col flex-1 overflow-y-auto">
                        <header className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                                <div className="mb-4 md:mb-0">
                                
                                    <p className=" text-md text-gray-600">
                                        Create, manage, and deploy your custom AI functions.
                                    </p>
                                </div>
                                {isLoading ? (
                                    <div className="flex-shrink-0">
                                        <LoadingSpinner />
                                    </div>
                                ) : (
                                    projects.length > 0 && (
                                        <div className="w-full md:w-80 z-10">
                                            <Select
                                                value={projectOptions.find(option => option.value === selectedProjectId)}
                                                onChange={(option) => setSelectedProjectId(option ? option.value : null)}
                                                options={projectOptions}
                                                placeholder="Select a project"
                                                isClearable={false}
                                                isSearchable
                                                className="text-sm"
                                                styles={{
                                                    control: (baseStyles, state) => ({
                                                        ...baseStyles,
                                                        borderRadius: '0.5rem',
                                                        padding: '0.25rem',
                                                        borderColor: state.isFocused ? '#4f46e5' : '#e5e7eb',
                                                        boxShadow: state.isFocused ? '0 0 0 1px #4f46e5' : 'none',
                                                        '&:hover': {
                                                            borderColor: state.isFocused ? '#4f46e5' : '#d1d5db',
                                                        },
                                                    }),
                                                    option: (baseStyles, state) => ({
                                                        ...baseStyles,
                                                        backgroundColor: state.isSelected ? '#e0e7ff' : state.isHovered ? '#f3f4f6' : 'white',
                                                        color: state.isSelected ? '#4f46e5' : '#374151',
                                                        '&:active': {
                                                            backgroundColor: '#c7d2fe',
                                                        },
                                                    }),
                                                }}
                                            />
                                        </div>
                                    )
                                )}
                            </div>
                        </header>
                        <main className="flex-1 ">
                            <div className="min-h-[60vh] flex flex-col ">
                                {selectedProjectId ? (
                                    <InternalFunctionsComponent projectId={selectedProjectId} />
                                ) : (
                                    <div className="flex-1 flex items-center justify-center text-center text-gray-500 py-10">
                                        <p className="text-lg">Please select a project to manage internal functions.</p>
                                    </div>
                                )}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default InternalFunctionsPage;