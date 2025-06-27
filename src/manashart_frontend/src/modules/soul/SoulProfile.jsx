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

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  if (!profile) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Create Your Soul Profile</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={createProfile}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Soul Profile</h2>
      <div className="space-y-4">
        <div>
          <strong>Username:</strong> {profile.username}
        </div>
        <div>
          <strong>Vibration Level:</strong> {Number(profile.vibration)}/100
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${Number(profile.vibration)}%` }}
            role="progressbar"
            aria-valuenow={Number(profile.vibration)}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-3">Modules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.modules.map((module, index) => (
              <div key={index} className={`p-4 rounded-lg border ${
                module.enabled ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex justify-between items-center">
                  <span className="font-medium">{module.name}</span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    module.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {module.enabled ? 'Unlocked' : 'Locked'}
                  </span>
                </div>
                {!module.enabled && (
                  <button
                    onClick={() => unlockModule(module.name)}
                    className="mt-2 text-blue-500 hover:text-blue-700 text-sm"
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