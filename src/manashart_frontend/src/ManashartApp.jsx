import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { idlFactory } from '../../declarations/manashart_backend';
import Universe from './modules/Universe';
import SoulProfile from './modules/SoulProfile';
import ProjectManager from './modules/ProjectManager';
import CryptoTickets from './modules/CryptoTickets';
import Debug from './components/Debug';
import { Home, User, Briefcase, Ticket } from 'lucide-react';

// Navigation Card Component
const NavigationCard = ({ module, Icon, isLocked, userVibration }) => {
  const navigate = useNavigate();
  
  return (
    <button
      onClick={() => !isLocked && navigate(module.path)}
      disabled={isLocked}
      className={`
        relative p-6 rounded-xl transition-all duration-300 ease-in-out
        ${isLocked 
          ? 'bg-gray-800/50 opacity-50 cursor-not-allowed border border-gray-700' 
          : `bg-gradient-to-br ${module.gradient} border border-white/10 hover:border-white/20 hover:scale-105 hover:-translate-y-0.5 cursor-pointer`
        }
      `}
    >
      <Icon className="w-8 h-8 mb-2 text-white" />
      <h3 className="text-white font-semibold">{module.name}</h3>
      <p className="text-white/70 text-xs mt-1">{module.description}</p>
      
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
          <div className="text-center">
            <p className="text-white/70 text-sm">Requires {module.vibrationRequired}Hz</p>
            <p className="text-white/50 text-xs">Current: {userVibration}Hz</p>
          </div>
        </div>
      )}
    </button>
  );
};

// Module Wrapper Component
const ModuleWrapper = ({ module, isAuthenticated, actor, userProfile, refreshProfile }) => {
  const Component = module.component;
  
  if (!isAuthenticated) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold text-white mb-4">Authentication Required</h2>
        <p className="text-white/70">Please login to access {module.name}</p>
      </div>
    );
  }
  
  if (userProfile && userProfile.vibration < module.vibrationRequired) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold text-white mb-4">Insufficient Vibration</h2>
        <p className="text-white/70">
          You need {module.vibrationRequired}Hz to access {module.name}
        </p>
        <p className="text-white/50 mt-2">
          Current vibration: {userProfile.vibration}Hz
        </p>
      </div>
    );
  }
  
  return (
    <Component 
      actor={actor} 
      userProfile={userProfile}
      refreshProfile={refreshProfile}
    />
  );
};

const ManashartApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authClient, setAuthClient] = useState(null);
  const [actor, setActor] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDebug, setShowDebug] = useState(false);
  const [activityLog, setActivityLog] = useState([]);

  // Define the four modules we need
  const modules = [
    {
      name: 'Universe',
      icon: Home,
      path: '/app/',
      gradient: 'from-purple-600 to-blue-600',
      vibrationRequired: 0,
      component: Universe,
      description: 'Explore the Manashart ecosystem'
    },
    {
      name: 'Soul',
      icon: User,
      path: '/app/soul',
      gradient: 'from-pink-600 to-purple-600',
      vibrationRequired: 0,
      component: SoulProfile,
      description: 'Your digital identity and profile'
    },
    {
      name: 'Flow',
      icon: Briefcase,
      path: '/app/flow',
      gradient: 'from-blue-600 to-cyan-600',
      vibrationRequired: 60,
      component: ProjectManager,
      description: 'Manage your creative projects'
    },
    {
      name: 'Tickets',
      icon: Ticket,
      path: '/app/tickets',
      gradient: 'from-green-600 to-teal-600',
      vibrationRequired: 40,
      component: CryptoTickets,
      description: 'Buy event tickets with crypto'
    }
  ];

  const addActivity = (message, type = 'info') => {
    const activity = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    };
    setActivityLog(prev => [activity, ...prev].slice(0, 50));
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      addActivity('Initializing authentication...', 'info');
      const client = await AuthClient.create();
      setAuthClient(client);

      const isAuthenticated = await client.isAuthenticated();
      setIsAuthenticated(isAuthenticated);
      
      if (isAuthenticated) {
        await setupActor(client);
      }
      
      addActivity(`Authentication status: ${isAuthenticated ? 'Authenticated' : 'Not authenticated'}`, isAuthenticated ? 'success' : 'info');
    } catch (error) {
      console.error('Auth initialization error:', error);
      setError('Failed to initialize authentication');
      addActivity('Authentication initialization failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const setupActor = async (client) => {
    try {
      addActivity('Setting up actor connection...', 'info');
      const identity = client.getIdentity();
      const agent = new HttpAgent({ identity });
      
      if (process.env.DFX_NETWORK !== "ic") {
        await agent.fetchRootKey();
      }

      const canisterId = process.env.CANISTER_ID_MANASHART_BACKEND || 
                        (await import('../../declarations/manashart_backend/index.js').then(m => m.canisterId));
      
      const actor = Actor.createActor(idlFactory, {
        agent,
        canisterId,
      });

      setActor(actor);
      await fetchUserProfile(actor);
      addActivity('Actor connection established', 'success');
    } catch (error) {
      console.error('Actor setup error:', error);
      setError('Failed to connect to backend');
      addActivity('Actor setup failed', 'error');
    }
  };

  const fetchUserProfile = async (actorInstance) => {
    try {
      addActivity('Fetching user profile...', 'info');
      const profile = await actorInstance.getProfile();
      
      if (profile && profile.length > 0) {
        setUserProfile(profile[0]);
        addActivity(`Profile loaded: ${profile[0].username} (${profile[0].vibration}Hz)`, 'success');
      } else {
        addActivity('No profile found', 'info');
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      addActivity('Failed to fetch profile', 'error');
    }
  };

  const login = async () => {
    if (!authClient) return;
    
    setIsLoading(true);
    addActivity('Initiating login...', 'info');
    
    await authClient.login({
      identityProvider: process.env.DFX_NETWORK === "ic" 
        ? "https://identity.ic0.app"
        : `http://localhost:4943?canisterId=${process.env.INTERNET_IDENTITY_CANISTER_ID}`,
      onSuccess: async () => {
        setIsAuthenticated(true);
        await setupActor(authClient);
        addActivity('Login successful', 'success');
        setIsLoading(false);
      },
      onError: (error) => {
        console.error('Login error:', error);
        setError('Login failed');
        addActivity('Login failed', 'error');
        setIsLoading(false);
      }
    });
  };

  const logout = async () => {
    if (!authClient) return;
    
    await authClient.logout();
    setIsAuthenticated(false);
    setActor(null);
    setUserProfile(null);
    addActivity('Logged out successfully', 'info');
  };

  const handleFakeLogin = () => {
    setIsAuthenticated(true);
    const fakeProfile = { username: "FakeUser", vibration: 99 };
    setUserProfile(fakeProfile);
    const mockActor = {
      getProfile: async () => [fakeProfile]
    };
    setActor(mockActor);
    addActivity('Fake login successful', 'success');
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        {/* Navigation Header */}
        <nav className="bg-black/30 backdrop-blur-xl border-b border-white/10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                MANASHART
              </h1>
              
              <div className="flex items-center gap-4">
                {isAuthenticated && userProfile && (
                  <div className="text-sm text-white/70">
                    <span className="font-semibold">{userProfile.username}</span>
                    <span className="ml-2 text-purple-400">{userProfile.vibration}Hz</span>
                  </div>
                )}
                
                <button
                  onClick={isAuthenticated ? logout : login}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isLoading ? 'Loading...' : isAuthenticated ? 'Logout' : 'Login'}
                </button>

                {!isAuthenticated && !isLoading && (
                  <button
                    onClick={handleFakeLogin}
                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Fake Login
                  </button>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Module Navigation */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex gap-4 mb-8">
            {modules.map((module) => {
              const Icon = module.icon;
              const isLocked = userProfile && userProfile.vibration < module.vibrationRequired;
              
              return (
                <NavigationCard
                  key={module.name}
                  module={module}
                  Icon={Icon}
                  isLocked={isLocked}
                  userVibration={userProfile?.vibration || 0}
                />
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-4 pb-20">
          {error && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
              {error}
            </div>
          )}
          
          <Routes>
            <Route
              path="/"
              element={
                <ModuleWrapper
                  module={modules[0]}
                  isAuthenticated={isAuthenticated}
                  actor={actor}
                  userProfile={userProfile}
                  refreshProfile={() => fetchUserProfile(actor)}
                />
              }
            />
            <Route
              path="/soul"
              element={
                <ModuleWrapper
                  module={modules[1]}
                  isAuthenticated={isAuthenticated}
                  actor={actor}
                  userProfile={userProfile}
                  refreshProfile={() => fetchUserProfile(actor)}
                />
              }
            />
            <Route
              path="/flow"
              element={
                <ModuleWrapper
                  module={modules[2]}
                  isAuthenticated={isAuthenticated}
                  actor={actor}
                  userProfile={userProfile}
                  refreshProfile={() => fetchUserProfile(actor)}
                />
              }
            />
            <Route
              path="/tickets"
              element={
                <ModuleWrapper
                  module={modules[3]}
                  isAuthenticated={isAuthenticated}
                  actor={actor}
                  userProfile={userProfile}
                  refreshProfile={() => fetchUserProfile(actor)}
                />
              }
            />
          </Routes>
        </main>

        {/* Debug Panel Toggle */}
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="fixed bottom-4 right-4 p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-colors"
          title="Toggle Debug Panel"
        >
          🐛
        </button>

        {/* Debug Panel */}
        {showDebug && (
          <Debug
            isAuthenticated={isAuthenticated}
            actor={actor}
            userProfile={userProfile}
            error={error}
            activityLog={activityLog}
            onLogin={login}
            onLogout={logout}
            onRefreshProfile={() => fetchUserProfile(actor)}
          />
        )}
      </div>
    );
};

export default ManashartApp;

