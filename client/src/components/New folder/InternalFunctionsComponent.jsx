import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import playgroundService from '../services/playgroundService';
import { PlusCircle, Save, X, Edit, Lock, Zap, FileCode2, Book, GitFork, Trash2, Code, ListFilter, Clipboard, Check, ChevronLeft, Play } from 'lucide-react';
import LoadingSpinner from './common/LoadingSpinner';
import { toast } from 'react-hot-toast';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const InternalFunctionsComponent = ({ projectId }) => {
    const { user } = useAuth();
    const [functions, setFunctions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedFunction, setSelectedFunction] = useState(null);
    const [newFunctionName, setNewFunctionName] = useState('');
    const [newFunctionPrompt, setNewFunctionPrompt] = useState('');
    const [activeTab, setActiveTab] = useState('list');
    const [activeFunctionTab, setActiveFunctionTab] = useState('code');
    const [isCopied, setIsCopied] = useState(false);
    const [isEditingNow, setIsEditingNow] = useState(false);
    const [error, setError] = useState("");
    const [runParams, setRunParams] = useState('{}');
    const [runOutput, setRunOutput] = useState('');
    const [isFunctionRunning, setIsFunctionRunning] = useState(false);

    useEffect(() => {
        if (user?.user?.apiKey && projectId && activeTab === 'list') {
            fetchInternalFunctions();
        }
    }, [user, projectId, activeTab]);

    useEffect(() => {
        if ( activeTab ) {
            setSelectedFunction();
        }
    }, [ activeTab]);

    const fetchInternalFunctions = async () => {
        setIsLoading(true);
        try {
            const response = await playgroundService.getInternalFunctions(projectId, user?.user?.apiKey);
            setFunctions(response);
        } catch (error) {
            toast.error('Failed to fetch internal functions.');
            console.error('Failed to fetch internal functions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateFunction = async () => {
        setIsCreating(true);
        setError();
        try {
            const payload = {
                projectId,
                name: newFunctionName,
                prompt: newFunctionPrompt,
            };
            const newFunc = await playgroundService.createInternalFunction(payload, user?.user?.apiKey);
            setNewFunctionName('');
            setNewFunctionPrompt('');
            setFunctions(prev => [...prev, newFunc]);
            toast.success('Function created successfully!');
            setError();
            setActiveTab('list');
        } catch (error) {
            console.error('Failed to create function:', error);
            toast.error('Failed to create function: ' + error.message);
            setError(error.message);
        } finally {
            setIsCreating(false);
        }
    };

    const handleUpdateFunction = async () => {
        setIsEditing(true);
        try {
            const payload = { ...selectedFunction, projectId };
            await playgroundService.updateInternalFunction(selectedFunction._id, payload, user?.user?.apiKey);
            toast.success('Function updated successfully!');
            fetchInternalFunctions();
            setSelectedFunction(null);
            setIsEditingNow(false);
        } catch (error) {
            console.error('Failed to update function:', error);
            toast.error('Failed to update function: ' + error.message);
        } finally {
            setIsEditing(false);
        }
    };

    const handleDeleteFunction = async (funcId) => {
        if (window.confirm('Are you sure you want to delete this function? This action cannot be undone.')) {
            setIsDeleting(true);
            try {
                await playgroundService.deleteInternalFunction(projectId, funcId, user?.user?.apiKey);
                setFunctions(prev => prev.filter(func => func._id !== funcId));
                toast.success('Function deleted successfully!');
                setSelectedFunction(null);
            } catch (error) {
                console.error('Failed to delete function:', error);
                toast.error('Failed to delete function: ' + error.message);
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const handleSelectFunction = (func) => {
        setSelectedFunction(func);
        setActiveFunctionTab('code');
        setIsEditingNow(false);
        setRunOutput('');
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

    const handleRunFunction = async () => {
        setIsFunctionRunning(true);
        setRunOutput('');
        try {
            const params = JSON.parse(runParams);
            const output = await playgroundService.runInternalFunction(projectId, selectedFunction._id, params, user?.user?.apiKey);
            setRunOutput(output);
            toast.success('Function executed successfully!');
        } catch (err) {
            console.error('Failed to run function:', err);
            setRunOutput('Error: ' + (err.message || 'An unknown error occurred.'));
            toast.error('Failed to run function.');
        } finally {
            setIsFunctionRunning(false);
        }
    };

    const isEditable = selectedFunction && selectedFunction.projectId;

    const renderFunctionContent = () => {
        if (!selectedFunction) return null;

        let content = '';
        let language = 'javascript';
        let isInputEnabled = false;

        switch (activeFunctionTab) {
            case 'code':
                content = selectedFunction.code || '// No code available.';
                language = 'javascript';
                isInputEnabled = isEditingNow;
                break;
            case 'docs':
                content = selectedFunction.docs || 'No documentation available.';
                language = 'plaintext';
                isInputEnabled = isEditingNow;
                break;
            case 'exampleUsage':
                content = selectedFunction.exampleUsage || 'No example usage available.';
                language = 'javascript';
                isInputEnabled = isEditingNow;
                break;
            case 'libraries':
                content = selectedFunction.libraries?.join(', ') || 'No libraries.';
                language = 'plaintext';
                isInputEnabled = isEditingNow;
                break;
            case 'run':
                content = runOutput;
                language = 'plaintext';
                isInputEnabled = false;
                break;
            default:
                content = '';
                language = 'plaintext';
                isInputEnabled = false;
                break;
        }

        return (
            <div className="flex flex-col h-full bg-white rounded-md shadow-inner border border-gray-200">
                <div className="flex items-center justify-between p-2">
                    <span className="text-sm font-semibold text-gray-800 capitalize">
                    </span>
                    {activeFunctionTab !== 'run' && (
                        <button
                            onClick={() => handleCopy(content)}
                            className="flex items-center gap-2 px-3 py-1 rounded-md text-xs text-gray-500 hover:bg-gray-100 transition-colors"
                            aria-label="Copy content"
                        >
                            {isCopied ? <Check size={14} className="text-green-500" /> : <Clipboard size={14} />}
                            <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                        </button>
                    )}
                </div>
                {activeFunctionTab === 'run' ? (
                    <div className="flex-1 overflow-auto p-4">
                        <h4 className="font-semibold text-gray-700 mb-2 text-sm">Parameters (JSON)</h4>
                        <textarea
                            className="w-full h-24 p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800 font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                            placeholder="Enter JSON parameters, e.g., { 'userId': '123' }"
                            value={runParams}
                            onChange={(e) => setRunParams(e.target.value)}
                        />
                        <button
                            onClick={handleRunFunction}
                            disabled={isFunctionRunning}
                            className="w-full mt-4 flex items-center justify-center space-x-2 py-2 px-4 rounded-md font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
                        >
                            {isFunctionRunning ? <LoadingSpinner size={16} /> : <Play size={16} />}
                            <span>{isFunctionRunning ? 'Running...' : 'Run Function'}</span>
                        </button>
                        <h4 className="font-semibold text-gray-700 mt-6 mb-2 text-sm">Output</h4>
                        <div className="w-full p-4 border border-gray-300 rounded-md bg-gray-50 text-gray-800 font-mono text-sm whitespace-pre-wrap overflow-auto">
                            {runOutput || 'The function output will appear here.'}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 overflow-auto bg-gray-50 rounded-b-md p-4 font-mono text-sm border-t border-gray-200">
                        {isInputEnabled ? (
                            <textarea
                                className="w-full h-full p-2 border-none rounded-md bg-gray-50 text-gray-800 font-mono text-sm resize-none focus:outline-none"
                                value={content}
                                onChange={(e) => {
                                    let updatedFunc = { ...selectedFunction };
                                    if (activeFunctionTab === 'libraries') {
                                        updatedFunc.libraries = e.target.value.split(',').map(lib => lib.trim());
                                    } else {
                                        updatedFunc[activeFunctionTab] = e.target.value;
                                    }
                                    setSelectedFunction(updatedFunc);
                                }}
                            />
                        ) : (
                            <SyntaxHighlighter
                                language={language}
                                style={a11yLight}
                                customStyle={{ background: 'transparent', padding: '0' }}
                                showLineNumbers
                                lineNumberStyle={{ color: '#aaa', paddingRight: '1rem' }}
                            >
                                {content}
                            </SyntaxHighlighter>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex h-screen bg-gray-100   font-sans container ">
            <div className={`flex flex-col flex-1 bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 ${selectedFunction ? 'md:w-1/2 md:flex-shrink-0' : 'w-full'}`}>
               

                {/* Header and Tab Navigation */}
                <div className="flex-shrink-0 flex border-b border-gray-200 bg-white">
                    <button
                        onClick={() => setActiveTab('list')}
                        className={`py-3 px-6 flex-1 text-center transition-colors duration-200 border-r border-gray-200
                                       ${activeTab === 'list' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <div className="flex items-center justify-center space-x-2">
                            <ListFilter size={16} />
                            <span>Existing Functions</span>
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('create')}
                        className={`py-3 px-6 flex-1 text-center transition-colors duration-200
                                       ${activeTab === 'create' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <div className="flex items-center justify-center space-x-2">
                            <PlusCircle size={16} />
                            <span>Create New Function</span>
                        </div>
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
                    {activeTab === 'create' && (
                        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">New Function Details</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Define a new function to enhance your AI prompts. Provide a unique name and a clear description.
                            </p>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Function Name (e.g., sendEmail)"
                                    value={newFunctionName}
                                    onChange={(e) => setNewFunctionName(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                    disabled={isCreating}
                                />
                                <textarea
                                    placeholder="Short description for the AI (e.g., 'A function to send an email to a user with a given ID.')"
                                    rows="3"
                                    value={newFunctionPrompt}
                                    onChange={(e) => setNewFunctionPrompt(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
                                    disabled={isCreating}
                                />
                                <button
                                    onClick={handleCreateFunction}
                                    disabled={isCreating || !newFunctionName || !newFunctionPrompt}
                                    className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors shadow"
                                >
                                    {isCreating ? <LoadingSpinner size={20} /> : <Zap size={20} />}
                                    <span>{isCreating ? 'Creating...' : 'Create Function'}</span>
                                </button>
                                {error && <p className="p-2 border border-red-500 bg-red-100 text-red-700 rounded-md shadow-md font-sans text-sm">{error}</p>}
                            </div>
                        </div>
                    )}

                    {activeTab === 'list' && (
                        <div className="space-y-2">
                            {isLoading ? (
                                <div className="text-center py-10">
                                    <LoadingSpinner />
                                    <p className="mt-4 text-gray-500">Loading functions...</p>
                                </div>
                            ) : functions.length === 0 ? (
                                <div className="text-center py-10 text-gray-500 border-t border-gray-200">
                                    <p className="text-base">No functions found for this project. <br /> Start by creating one!</p>
                                </div>
                            ) : (
                                functions.map((func) => (
                                    <button
                                        key={func._id}
                                        onClick={() => handleSelectFunction(func)}
                                        className={`w-full flex items-center justify-between text-left p-4 rounded-md border transition-all duration-200
                                                       ${selectedFunction?._id === func._id ? 'bg-indigo-100 border-indigo-400' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-3 text-gray-900 mb-1">
                                                <Zap size={20} className="text-indigo-600 flex-shrink-0" />
                                                <h4 className="font-mono text-lg font-bold truncate">{func.name}</h4>
                                                {!func.projectId && <span className="text-xs font-semibold text-gray-500 bg-gray-200 px-2 py-1 rounded-full flex-shrink-0">System</span>}
                                            </div>
                                            <p className="text-sm text-gray-600 truncate">{String(func.docs).split("\n")[0].replace("Description:", "")}</p>
                                        </div>
                                        <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                                            {func.projectId && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteFunction(func._id);
                                                    }}
                                                    className="p-2 rounded-md text-red-500 hover:bg-red-100 transition-colors"
                                                    aria-label={`Delete ${func.name}`}
                                                    disabled={isDeleting}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Sidebar / Detail Pane */}
            {selectedFunction && (
                <div className=" fixed md:static inset-y-0 right-0 z-20 w-full md:w-1/2 lg:w-1/2 h-full bg-gray-100 md:bg-white shadow-2xl md:shadow-none pl-4 pr-4 py-4 flex flex-col transition-transform duration-300 transform translate-x-0 md:border-l md:border-gray-300">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                        <div className="flex items-center space-x-3 min-w-0">
                            <button
                                onClick={() => setSelectedFunction(null)}
                                className="md:hidden p-2 -ml-2 rounded-full text-gray-500 hover:bg-gray-200 focus:outline-none"
                                aria-label="Close sidebar"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            {isEditable ? <Edit size={24} className="text-indigo-600 flex-shrink-0" /> : <Lock size={24} className="text-gray-400 flex-shrink-0" />}
                            <h3 className="text-xl font-bold text-gray-900 truncate flex-1">{selectedFunction.name}</h3>
                        </div>
                        <button
                            onClick={() => setSelectedFunction(null)}
                            className="hidden md:block p-2 rounded-md text-gray-500 hover:bg-gray-200 focus:outline-none"
                            aria-label="Close sidebar"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex flex-col flex-1 overflow-hidden pt-4">
                        <div className="flex flex-shrink-0 border-b border-gray-200 bg-white rounded-t-lg overflow-x-auto shadow-sm">
                            <button
                                onClick={() => setActiveFunctionTab('code')}
                                className={`flex items-center gap-2 py-2 px-4 rounded-t-lg text-sm font-medium transition-all duration-200 whitespace-nowrap
                                               ${activeFunctionTab === 'code' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <FileCode2 size={16} />
                                Code
                            </button>
                            <button
                                onClick={() => setActiveFunctionTab('docs')}
                                className={`flex items-center gap-2 py-2 px-4 rounded-t-lg text-sm font-medium transition-all duration-200 whitespace-nowrap
                                               ${activeFunctionTab === 'docs' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <Book size={16} />
                                Docs
                            </button>
                            <button
                                onClick={() => setActiveFunctionTab('exampleUsage')}
                                className={`flex items-center gap-2 py-2 px-4 rounded-t-lg text-sm font-medium transition-all duration-200 whitespace-nowrap
                                               ${activeFunctionTab === 'exampleUsage' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <Code size={16} />
                                Example
                            </button>
                            <button
                                onClick={() => setActiveFunctionTab('libraries')}
                                className={`flex items-center gap-2 py-2 px-4 rounded-t-lg text-sm font-medium transition-all duration-200 whitespace-nowrap
                                               ${activeFunctionTab === 'libraries' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <GitFork size={16} />
                                Libraries
                            </button>
                            <button
                                onClick={() => setActiveFunctionTab('run')}
                                className={`flex items-center gap-2 py-2 px-4 rounded-t-lg text-sm font-medium transition-all duration-200 whitespace-nowrap
                                               ${activeFunctionTab === 'run' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <Play size={16} />
                                Run
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto mt-2">
                            {renderFunctionContent()}
                        </div>
                    </div>

                    {isEditable && (
                        <div className="mt-auto flex space-x-2 pt-4 border-t border-gray-200 bg-white flex-shrink-0">
                            {!isEditingNow ? (
                                <button
                                    onClick={() => setIsEditingNow(true)}
                                    className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow"
                                >
                                    <Edit size={20} />
                                    <span>Edit Function</span>
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleUpdateFunction}
                                        disabled={isEditing}
                                        className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors shadow"
                                    >
                                        {isEditing ? <LoadingSpinner size={20} /> : <Save size={20} />}
                                        <span>{isEditing ? 'Saving...' : 'Save Changes'}</span>
                                    </button>
                                    <button
                                        onClick={() => setIsEditingNow(false)}
                                        className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                                    >
                                        <X size={20} />
                                        <span>Cancel</span>
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default InternalFunctionsComponent;