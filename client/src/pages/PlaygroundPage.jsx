import React, { useState, useEffect } from 'react';
import MainLayout from '../components/common/layouts/MainLayout';
import QueryResultViewer from '../components/playground/QueryResultViewer';
import PromptTemplateSelector from '../components/playground/PromptTemplateSelector';
import playgroundService from '../services/playgroundService';
import projectService from '../services/projectService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { Layers,FlaskConical, Plus, Trash2, Play, NotebookText, Zap, Settings, X, ChevronRight, File, Type, Loader2, LibraryBig, Minus, Maximize, Circle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Select from 'react-select';
import { useNavigate, Link } from 'react-router-dom';
import { Transition } from '@headlessui/react';


// --- Sample Data and Internal Functions ---
const PROMPT_TEMPLATES = [
  { id: '1', name: 'Find users by country', text: 'Find all users from the United States' },
  { id: '2', name: 'Count users by status', text: 'Count the number of users by their account status and display as a bar chart.' },
  { id: '3', name: 'Send a welcome email', text: '!sendEmail to user with id 12345' },
  { id: '4', name: 'Find users by env var', text: 'Find all users from country $country' }
];

const AI_MODELS = [
    { value: 'openai/gpt-4o', label: 'GPT-4o' },
    { value: 'google/gemini-pro', label: 'Gemini Pro' },
    { value: 'anthropic/claude-3-haiku', label: 'Claude 3 Haiku' },
    { value: 'mistralai/mistral-7b-instruct', label: 'Mistral 7B' },
];


const getProjectParam = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('project');
};


const PlaygroundPage = () => {
    let { user } = useAuth();
    console.log('user', user);

    const navigate = useNavigate();
    const [prompts, setPrompts] = useState([
        { id: 1, text: '', result: null, loading: false, showSuggestions: false, suggestions: [] }
    ]);
    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [globalLoading, setGlobalLoading] = useState(false);
    const [error, setError] = useState(null);
    const [envVars, setEnvVars] = useState([{ name: '', value: '', type: 'string' }]);
    const [activeTab, setActiveTab] = useState('notebook');
    const [showSettings, setShowSettings] = useState(false);
    const [aiSettings, setAiSettings] = useState({
        model: 'google/gemini-pro',
        temperature: 0.7,
        topP: 1,
        optimiseTask: true,
    });
    const [showResultsViewer, setShowResultsViewer] = useState(false);
    const [combinedResults, setCombinedResults] = useState(null);
    const [responsePayload, setResponsePayload] = useState({});
    const [internalFunctions, setInternalFunctions] = useState([]);


  const fetchProjects = async () => {
            try {
                const fetchedProjects = await projectService.getProjects();
                setProjects(fetchedProjects.projects);
                if (fetchedProjects?.projects?.length > 0 && !getProjectParam() ) {
                    setSelectedProjectId(fetchedProjects?.projects[0]._id);
                }
            } catch (err) {
                toast.error('Failed to fetch user projects.');
                console.error('Failed to fetch projects:', err);
            }
        };


  const fetchInternalFunctions = async (projectId) => {
    try {
        const functions = await playgroundService.getInternalFunctions(projectId, user?.user?.apiKey);
        setInternalFunctions(functions);
    } catch (err) {
        toast.error('Failed to fetch internal functions.');
        console.error('Failed to fetch internal functions:', err);
        setInternalFunctions([]);
    }
  };


  useEffect(() => {
    const projectId = getProjectParam();
    
    if (projectId) {
      console.log('Project ID:', projectId);
      setSelectedProjectId(projectId)

    } else if (!projects.length) {
        fetchProjects();
    }
  }, []);



    useEffect(() => {
      
        if (user?.token) {
            fetchProjects();
        }
    }, [user]);

    useEffect(() => {
      if ( selectedProjectId) {
          fetchInternalFunctions(selectedProjectId);
      }
    }, [ selectedProjectId,activeTab]);


    const handleRunAllTasks = async () => {
        setError(null);
        setCombinedResults(null);
        setShowResultsViewer(false);

        if (!selectedProjectId) {
            setError('Please select a project to run the tasks.');
            return;
        }

        setGlobalLoading(true);

        const formattedEnvVars = envVars.reduce((acc, curr) => {
            if (curr.name && curr.type === 'string') {
                acc[curr.name] = curr.value;
            }
            return acc;
        }, {});

        const attachmentVars = {};
        for (const env of envVars) {
            if (env.name && env.type === 'file' && env.value) {
                try {
                    const fileContent = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result);
                        reader.onerror = reject;
                        reader.readAsDataURL(env.value);
                    });
                    attachmentVars[env.name] = fileContent;
                } catch (err) {
                    setError(`Failed to read file ${env.name}: ${err.message}`);
                    setGlobalLoading(false);
                    return;
                }
            }
        }

        try {
            const payload = {
                prompts: prompts.map(p => p.text),
                variables: formattedEnvVars,
                attachment_variables: attachmentVars,
                projectId: selectedProjectId,
                settings: aiSettings,
            };
            setResponsePayload(payload)
            const response = await playgroundService.runTask(payload, user?.user?.apiKey);
            
            // Correctly access the nested results
            if (response?.result?.results) {
                setCombinedResults(response.result.results);
                setShowResultsViewer(true);
            } else {
                setCombinedResults(response);
                setShowResultsViewer(true);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setGlobalLoading(false);
        }
    };

    const handleAddPrompt = () => {
        setPrompts([...prompts, { id: prompts.length + 1, text: '', result: null, loading: false, showSuggestions: false, suggestions: [] }]);
    };

    const handleRemovePrompt = (index) => {
        const newPrompts = prompts.filter((_, i) => i !== index);
        setPrompts(newPrompts);
    };

    const handlePromptChange = (index, value) => {
        const newPrompts = [...prompts];
        newPrompts[index].text = value;

        const lastBangIndex = value.lastIndexOf('!');
        if (lastBangIndex !== -1 && (value.length === lastBangIndex + 1 || !value.substring(lastBangIndex + 1).includes(' '))) {
            const query = value.substring(lastBangIndex + 1).trim();
            const filtered = internalFunctions.filter(func => func.name.toLowerCase().includes('!' + query.toLowerCase()));

            newPrompts[index].showSuggestions = true;
            newPrompts[index].suggestions = filtered;
        } else {
            newPrompts[index].showSuggestions = false;
            newPrompts[index].suggestions = [];
        }

        setPrompts(newPrompts);
    };

    const handleApplyTemplate = (index, templateText) => {
        handlePromptChange(index, templateText);
    };

    const handleAddEnvVar = () => {
        setEnvVars([...envVars, { name: '', value: '', type: 'string' }]);
    };

    const handleRemoveEnvVar = (index) => {
        const newEnvVars = envVars.filter((_, i) => i !== index);
        setEnvVars(newEnvVars);
    };

    const handleEnvVarChange = (index, field, value) => {
        const newEnvVars = [...envVars];
        if (field === 'name') {
            newEnvVars[index][field] = value.replace(" ", "_").toUpperCase();
        } else {
            newEnvVars[index][field] = value;
        }
        setEnvVars(newEnvVars);
    };

    const handleEnvVarTypeChange = (index, type) => {
        const newEnvVars = [...envVars];
        newEnvVars[index].type = type;
        newEnvVars[index].value = type === 'string' ? '' : null;
        setEnvVars(newEnvVars);
    };

    const handleAiSettingsChange = (field, value) => {
        setAiSettings(prevSettings => ({ ...prevSettings, [field]: value }));
    };

    const handleExportData = (data, format) => {
        if (!data) {
            toast.error('No data to export.');
            return;
        }
        const filename = `data-export.${format}`;
        let content;
        let mimeType;

        if (format === 'json') {
            content = JSON.stringify(data, null, 2);
            mimeType = 'application/json';
        } else if (format === 'csv') {
            const headers = Object.keys(data[0] || {}).join(',');
            const rows = data.map(obj => Object.values(obj).join(',')).join('\n');
            content = `${headers}\n${rows}`;
            mimeType = 'text/csv';
        } else {
            toast.error('Unsupported export format.');
            return;
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success('Data exported successfully!');
    };

    const handleSelectSuggestion = (index, suggestion) => {
        const newPrompts = [...prompts];
        const lastBangIndex = newPrompts[index].text.lastIndexOf('!');
        if (lastBangIndex !== -1) {
            newPrompts[index].text = newPrompts[index].text.substring(0, lastBangIndex) + suggestion.name;
        } else {
            newPrompts[index].text = newPrompts[index].text + suggestion.name;
        }
        newPrompts[index].showSuggestions = false;
        setPrompts(newPrompts);
    };

    const projectOptions = projects.map(project => ({
        value: project._id,
        label: project.name,
    }));

    const handleCreateFunctionClick = () => {
        navigate('/internal-functions');
    };

    return (
        <MainLayout>
            <div className="flex flex-col h-full bg-gray-100  font-sans">
                {/* Window Frame */}
                <div className="flex flex-col h-full bg-white rounded-md  border border-gray-300 overflow-hidden">
                    {/* Title Bar */}
                    <div className="flex items-center justify-between px-4 py-2 bg-gray-200 border-b border-gray-300">
                        <div className="flex items-center space-x-2">
                            <FlaskConical size={16} className="text-gray-500" />
                            <span className="text-sm font-semibold text-gray-700">AI Notebook Playground</span>
                        </div>
                      
                    </div>
                    
                    {/* Main Content Area */}
                    <div className="flex flex-row flex-1 overflow-hidden">
                        {/* Left Panel - Notebook & Controls */}
                        <div className="flex-1 p-6 overflow-y-auto border-r border-gray-200">
                            <header className="mb-6">
                              
                                <p className="mt-1 text-md text-gray-600">
                                    Chain AI tasks in a notebook-like interface.
                                </p>
                            </header>

                            <div className="flex justify-between items-center mb-6">
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setActiveTab('notebook')}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                                            activeTab === 'notebook' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        <NotebookText className="h-5 w-5" />
                                        <span>Notebook</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('envVars')}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                                            activeTab === 'envVars' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        <Layers className="h-5 w-5" />
                                        <span>Variables</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('functions')}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                                            activeTab === 'functions' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        <Zap className="h-5 w-5" />
                                        <span>Functions</span>
                                    </button>
                                </div>
                                <div className="flex space-x-2 items-center">
                                    <div className="w-48">
                                        <Select
                                            value={projectOptions.find(option => option.value === selectedProjectId)}
                                            onChange={(option) => setSelectedProjectId(option ? option.value : '')}
                                            options={projectOptions}
                                            placeholder="Select Project"
                                            isClearable
                                            isSearchable
                                            className="text-sm"
                                        />
                                    </div>
                                    <button
                                        onClick={() => setShowSettings(!showSettings)}
                                        className="p-2 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
                                    >
                                        <Settings size={20} />
                                    </button>
                                </div>
                            </div>
                            
                            {/* Tab Content */}
                            <div className="flex-1 overflow-y-auto">
                                {activeTab === 'notebook' && (
                                    <div className="flex flex-col space-y-6">
                                        {prompts.map((prompt, index) => (
                                            <div key={prompt.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-mono text-gray-500">{`In [${index + 1}]:`}</span>
                                                    <div className="flex space-x-1">
                                                        <PromptTemplateSelector templates={PROMPT_TEMPLATES} onSelect={(text) => handleApplyTemplate(index, text)} />
                                                        {prompts.length > 1 && (
                                                            <button
                                                                onClick={() => handleRemovePrompt(index)}
                                                                className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-gray-200 transition-colors"
                                                                aria-label="Remove prompt"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-start">
                                                    <div className="flex-1 relative">
                                                        <textarea
                                                            rows="3"
                                                            className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors duration-200 text-sm"
                                                            placeholder="Enter your prompt here..."
                                                            value={prompt.text}
                                                            onChange={(e) => handlePromptChange(index, e.target.value)}
                                                            onBlur={() => setPrompts(prevPrompts => prevPrompts.map(p => ({ ...p, showSuggestions: false })))}
                                                        />
                                                        {prompt.showSuggestions && (
                                                            <div className="absolute z-10 top-full left-0 mt-2 w-full max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg">
                                                                {prompt.suggestions.length > 0 ? (
                                                                    prompt.suggestions.map((s, sIndex) => (
                                                                        <div
                                                                            key={sIndex}
                                                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                                                            onMouseDown={() => handleSelectSuggestion(index, s)}
                                                                        >
                                                                            <div className="font-semibold text-indigo-600">{s.name}</div>
                                                                            <div className="text-gray-500">{String(s.docs).split("\n")[0].replace("Description:","")}</div>
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <div className="px-4 py-2 text-gray-500 text-sm">No matching functions found.</div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="flex justify-between items-center mt-4 border-t border-gray-200 pt-4">
                                            <button
                                                onClick={handleAddPrompt}
                                                className="flex items-center gap-2 py-2 px-4 rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-200 transition-colors"
                                            >
                                                <Plus size={16} />
                                                <span>Add New Cell</span>
                                            </button>
                                            <button
                                                onClick={handleRunAllTasks}
                                                disabled={globalLoading}
                                                className={`flex items-center gap-2 py-2 px-4 rounded-lg font-bold text-white transition-colors duration-200 ${
                                                    globalLoading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
                                                }`}
                                            >
                                                {globalLoading ? <LoadingSpinner size={18} /> : (
                                                    <>
                                                        <Play size={16} />
                                                        Run All Cells
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                        {error && <ErrorMessage message={error} />}
                                    </div>
                                )}

                                {activeTab === 'envVars' && (
                                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                                        <h3 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-4">Global Environment Variables</h3>
                                        <p className="text-sm text-gray-500 mb-4">
                                            Set key-value pairs that can be referenced in your prompt with the `$NAME` syntax. You can also attach files.
                                        </p>
                                        <div className="space-y-4">
                                            {envVars.map((env, index) => (
                                                <div key={index} className="flex items-center gap-4">
                                                    <div className="relative w-24">
                                                        <Select
                                                            options={[
                                                                { value: 'string', label: 'Text', icon: <Type size={16} /> },
                                                                { value: 'file', label: 'File', icon: <File size={16} /> }
                                                            ]}
                                                            value={{ value: env.type, label: env.type === 'string' ? 'Text' : 'File', icon: env.type === 'string' ? <Type size={16} /> : <File size={16} /> }}
                                                            onChange={(option) => handleEnvVarTypeChange(index, option.value)}
                                                            className="text-sm"
                                                            isSearchable={false}
                                                        />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="NAME"
                                                        value={env.name}
                                                        onChange={(e) => handleEnvVarChange(index, 'name', e.target.value)}
                                                        className="w-48 px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                                                    />
                                                    {env.type === 'string' ? (
                                                        <input
                                                            type="text"
                                                            placeholder="VALUE"
                                                            value={env.value}
                                                            onChange={(e) => handleEnvVarChange(index, 'value', e.target.value)}
                                                            className="flex-1 px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                                                        />
                                                    ) : (
                                                        <input
                                                            type="file"
                                                            onChange={(e) => handleEnvVarChange(index, 'value', e.target.files[0])}
                                                            className="flex-1 px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                                                        />
                                                    )}
                                                    <button
                                                        onClick={() => handleRemoveEnvVar(index)}
                                                        className="p-2 rounded-md text-gray-400 hover:bg-gray-200 hover:text-red-500 transition-colors"
                                                        aria-label="Remove environment variable"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                onClick={handleAddEnvVar}
                                                className="flex items-center gap-2 py-2 px-4 rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-200 transition-colors"
                                            >
                                                <Plus size={16} />
                                                <span>Add Variable</span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'functions' && (
                                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                                        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-4">
                                            <h3 className="text-xl font-bold text-gray-900 ">Available Functions</h3>

                                            <Link
                                                key={'/manage-function?projectId='+selectedProjectId}
                                                to={'/manage-function?projectId='+selectedProjectId} 
                                            >
                                                <button
                                                    onClick={handleCreateFunctionClick}
                                                    className="flex items-center gap-2 py-2 px-4 rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-200 transition-colors"
                                                >
                                                    <LibraryBig size={16} />
                                                    <span>Manage Functions</span>
                                                </button>
                                            </Link>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-4">
                                            These are the internal functions you can call by starting a prompt with `!`.
                                        </p>
                                        <ul className="space-y-4">
                                            {internalFunctions.length === 0 ? (
                                                <p className="text-center text-gray-500">No functions found. Go to "Manage Functions" to create one.</p>
                                            ) : (
                                                internalFunctions.map((func, index) => (
                                                    <li key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-lg font-mono font-bold text-indigo-600">{func.name}</span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mt-2">{String(func.docs).split("\n")[0].replace("Description:","")}</p>
                                                    </li>
                                                ))
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Panel - Results Sidebar */}
                        <div className="w-96 flex-shrink-0 bg-gray-50 overflow-y-auto   border-l border-gray-200">
                            <div className="flex flex-col space-y-4">
                                <QueryResultViewer data={combinedResults} API_URL={window.location.origin+'/api/v1/kingkong/run-tasks'} 
                                    API_KEY={user?.user?.apiKey} payload={responsePayload} />
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Settings Sidebar - Overlaid */}
                <Transition
                    show={showSettings}
                    as={React.Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-x-full"
                    enterTo="opacity-100 translate-x-0"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-x-0"
                    leaveTo="opacity-0 translate-x-full"
                >
                    <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 p-6 border-l border-gray-300">
                        <div className="h-full flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold">Settings</h2>
                                <button onClick={() => setShowSettings(false)} className="p-1 rounded-md text-gray-500 hover:bg-gray-100">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="space-y-6 flex-1 overflow-y-auto">
                                <div>
                                    <h3 className="text-md font-semibold text-gray-700 mb-2">AI Model Selection</h3>
                                    <Select
                                        options={AI_MODELS}
                                        value={AI_MODELS.find(model => model.value === aiSettings.model)}
                                        onChange={(option) => handleAiSettingsChange('model', option.value)}
                                        className="text-sm"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-md font-semibold text-gray-700 mb-2">AI Parameters</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">Temperature</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                max="2"
                                                value={aiSettings.temperature}
                                                onChange={(e) => handleAiSettingsChange('temperature', parseFloat(e.target.value))}
                                                className="w-full mt-1 px-3 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">Top P</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                max="1"
                                                value={aiSettings.topP}
                                                onChange={(e) => handleAiSettingsChange('topP', parseFloat(e.target.value))}
                                                className="w-full mt-1 px-3 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-md font-semibold text-gray-700">Optimize Task</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={aiSettings.optimiseTask}
                                            onChange={(e) => handleAiSettingsChange('optimiseTask', e.target.checked)}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-300 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
        </MainLayout>
    );
};

export default PlaygroundPage;