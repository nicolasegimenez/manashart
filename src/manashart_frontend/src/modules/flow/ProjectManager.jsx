import { useState, useEffect } from 'react';
import { createActor } from '../../services/actor';

export default function ProjectManager({ identity }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tokenized: false
  });

  useEffect(() => {
    loadProjects();
  }, [identity]);

  const loadProjects = async () => {
    console.log('[FLOW DEBUG] Starting loadProjects', { hasIdentity: !!identity });
    if (!identity) return;
    
    try {
      console.log('[FLOW DEBUG] Creating actor for project loading...');
      const actor = await createActor(identity);
      if (!actor) {
        console.log('[FLOW DEBUG] No actor created, returning');
        return;
      }
      
      console.log('[FLOW DEBUG] Actor created, getting projects for principal:', identity.getPrincipal().toString());
      const userProjects = await actor.getProjects(identity.getPrincipal());
      console.log('[FLOW DEBUG] Projects loaded:', { count: userProjects.length, projects: userProjects });
      setProjects(userProjects);
    } catch (err) {
      console.error('[FLOW DEBUG] Error loading projects:', err);
      console.error('[FLOW DEBUG] Error stack:', err.stack);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async () => {
    console.log('[FLOW DEBUG] Starting createProject', { formData, hasIdentity: !!identity });
    if (!formData.title.trim()) {
      console.log('[FLOW DEBUG] No title provided, returning');
      return;
    }
    
    try {
      setLoading(true);
      console.log('[FLOW DEBUG] Creating actor for project creation...');
      const actor = await createActor(identity);
      console.log('[FLOW DEBUG] Actor created, calling createProject method...');
      
      const result = await actor.createProject(
        formData.title,
        formData.description,
        formData.tokenized
      );
      
      console.log('[FLOW DEBUG] createProject result:', result);
      
      if ('ok' in result) {
        console.log('[FLOW DEBUG] Project created successfully:', result.ok);
        setProjects([...projects, result.ok]);
        setFormData({ title: '', description: '', tokenized: false });
        setShowCreateForm(false);
      } else {
        console.log('[FLOW DEBUG] Project creation failed:', result.err);
        alert('Error: ' + result.err);
      }
    } catch (err) {
      console.error('[FLOW DEBUG] Error creating project:', err);
      console.error('[FLOW DEBUG] Error stack:', err.stack);
      alert('Error creating project: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusMap = {
      Planning: 'bg-yellow-100 text-yellow-800',
      Active: 'bg-green-100 text-green-800',
      Completed: 'bg-blue-100 text-blue-800',
      Cancelled: 'bg-red-100 text-red-800'
    };
    return statusMap[Object.keys(status)[0]] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <div className="text-center">Loading projects...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">FLOW - Project Manager</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          {showCreateForm ? 'Cancel' : 'New Project'}
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Create New Project</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Project Title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <textarea
              placeholder="Project Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md h-24"
            />
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.tokenized}
                onChange={(e) => setFormData({...formData, tokenized: e.target.checked})}
                className="rounded"
              />
              <span>Tokenize this project</span>
            </label>
            <button
              onClick={createProject}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Create Project
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold">{project.title}</h3>
              <span className={`px-2 py-1 rounded text-xs ${getStatusColor(project.status)}`}>
                {Object.keys(project.status)[0]}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-3">{project.description}</p>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Budget:</span>
                <span>{Number(project.budget)} tokens</span>
              </div>
              <div className="flex justify-between">
                <span>Tokenized:</span>
                <span>{project.tokenized ? 'Yes' : 'No'}</span>
              </div>
              {project.venue && (
                <div className="flex justify-between">
                  <span>Venue:</span>
                  <span>{project.venue}</span>
                </div>
              )}
            </div>

            {project.services.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-sm mb-2">Services:</h4>
                <div className="space-y-1">
                  {project.services.map((service, index) => (
                    <div key={index} className="flex justify-between text-xs">
                      <span>{service.name}</span>
                      <span className={service.confirmed ? 'text-green-600' : 'text-yellow-600'}>
                        {service.confirmed ? '✓' : '⏳'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No projects yet</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600"
          >
            Create Your First Project
          </button>
        </div>
      )}
    </div>
  );
}