import { useState, useEffect } from 'react';
import { createActor } from '../../services/actor';

export default function SoulProfile({ identity }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProfile();
  }, [identity]);

  const loadProfile = async () => {
    console.log('[SOUL DEBUG] Starting loadProfile', { hasIdentity: !!identity });
    if (!identity) return;
    
    try {
      console.log('[SOUL DEBUG] Creating actor for profile loading...');
      const actor = await createActor(identity);
      if (!actor) {
        console.log('[SOUL DEBUG] No actor created');
        setError('Cannot connect to backend');
        return;
      }
      
      console.log('[SOUL DEBUG] Actor created, getting profile for principal:', identity.getPrincipal().toString());
      const userProfile = await actor.getSoulProfile(identity.getPrincipal());
      console.log('[SOUL DEBUG] Profile response:', userProfile);
      setProfile(userProfile[0] || null);
    } catch (err) {
      console.error('[SOUL DEBUG] Error loading profile:', err);
      console.error('[SOUL DEBUG] Error stack:', err.stack);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async () => {
    console.log('[SOUL DEBUG] Starting createProfile', { username, hasIdentity: !!identity });
    if (!username.trim()) {
      console.log('[SOUL DEBUG] No username provided, returning');
      return;
    }
    
    try {
      setLoading(true);
      console.log('[SOUL DEBUG] Creating actor for profile creation...');
      const actor = await createActor(identity);
      console.log('[SOUL DEBUG] Actor created, calling createSoulProfile...');
      const result = await actor.createSoulProfile(username);
      console.log('[SOUL DEBUG] createSoulProfile result:', result);
      
      if ('ok' in result) {
        console.log('[SOUL DEBUG] Profile created successfully:', result.ok);
        setProfile(result.ok);
        setError(null);
      } else {
        console.log('[SOUL DEBUG] Profile creation failed:', result.err);
        setError(result.err);
      }
    } catch (err) {
      console.error('[SOUL DEBUG] Error creating profile:', err);
      console.error('[SOUL DEBUG] Error stack:', err.stack);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const unlockModule = async (moduleName) => {
    try {
      const actor = await createActor(identity);
      const result = await actor.unlockModule(moduleName);
      
      if ('ok' in result) {
        alert(result.ok);
        loadProfile(); // Reload to show updated modules
      } else {
        alert(result.err);
      }
    } catch (err) {
      alert('Error unlocking module: ' + err.message);
    }
  };

  if (loading) return <div className="text-center text-white">Loading...</div>;
  if (error) return <div className="text-red-400 bg-red-900/20 border border-red-500/30 rounded-lg p-4">Error: {error}</div>;

  if (!profile) {
    return (
      <div className="max-w-md mx-auto bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur rounded-lg shadow-lg p-6 border border-slate-700">
        <h2 className="text-2xl font-bold mb-4 text-white">Create Your Soul Profile</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
          />
          <button
            onClick={createProfile}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 px-4 rounded-md hover:from-purple-600 hover:to-blue-600 transition-all"
          >
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur rounded-lg shadow-lg p-6 border border-slate-700">
      <h2 className="text-2xl font-bold mb-4 text-white">Soul Profile</h2>
      <div className="space-y-4">
        <div className="text-white">
          <strong className="text-purple-300">Username:</strong> {profile.username}
        </div>
        <div className="text-white">
          <strong className="text-purple-300">Vibration Level:</strong> {Number(profile.vibration)}/100
        </div>
        <div className="w-full bg-slate-700 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${Number(profile.vibration)}%` }}
            role="progressbar"
            aria-valuenow={Number(profile.vibration)}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-3 text-white">Modules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.modules.map((module, index) => (
              <div key={index} className={`p-4 rounded-lg border backdrop-blur ${
                module.enabled 
                  ? 'bg-green-900/30 border-green-500/30 shadow-green-500/20' 
                  : 'bg-slate-800/50 border-slate-600/50'
              }`}>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-white">{module.name}</span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    module.enabled 
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                      : 'bg-slate-700/50 text-slate-400 border border-slate-600/30'
                  }`}>
                    {module.enabled ? 'Unlocked' : 'Locked'}
                  </span>
                </div>
                {!module.enabled && (
                  <button
                    onClick={() => unlockModule(module.name)}
                    className="mt-2 text-purple-400 hover:text-purple-300 text-sm hover:underline transition-colors"
                  >
                    Try to Unlock
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}