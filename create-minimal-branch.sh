#!/bin/bash

# CREATE MINIMAL BRANCH WITH UNIVERSE, SOUL & FLOW
# ================================================

echo "🌟 Creating Minimal Manashart Branch"
echo "==================================="
echo "Modules to keep: Universe, Soul, Flow"
echo ""

# 1. Create and checkout new branch
echo "📝 Creating new branch..."
git checkout -b minimal-universe-soul-flow
echo "✅ Branch created and checked out"

# 2. Create modified ManashartApp.jsx
echo ""
echo "🔧 Modifying ManashartApp.jsx..."
cat > src/manashart_frontend/src/ManashartApp.jsx << 'EOF'
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { idlFactory } from '../../declarations/manashart_backend';
import Universe from './modules/Universe';
import SoulProfile from './modules/SoulProfile';
import ProjectManager from './modules/ProjectManager';
import Debug from './components/Debug';
import { Home, User, Briefcase } from 'lucide-react';

const ManashartApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authClient, setAuthClient] = useState(null);
  const [actor, setActor] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDebug, setShowDebug] = useState(false);
  const [activityLog, setActivityLog] = useState([]);

  // Define only the three modules we need
  const modules = [
    {
      name: 'Universe',
      icon: Home,
      path: '/',
      gradient: 'from-purple-600 to-blue-600',
      vibrationRequired: 0,
      component: Universe,
      description: 'Explore the Manashart ecosystem'
    },
    {
      name: 'Soul',
      icon: User,
      path: '/soul',
      gradient: 'from-pink-600 to-purple-600',
      vibrationRequired: 0,
      component: SoulProfile,
      description: 'Your digital identity and profile'
    },
    {
      name: 'Flow',
      icon: Briefcase,
      path: '/flow',
      gradient: 'from-blue-600 to-cyan-600',
      vibrationRequired: 60,
      component: ProjectManager,
      description: 'Manage your creative projects'
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
                        (await import('../../declarations/manashart_backend').then(m => m.canisterId));
      
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

  return (
    <Router>
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
            {modules.map((module) => (
              <Route
                key={module.path}
                path={module.path}
                element={
                  <ModuleWrapper
                    module={module}
                    isAuthenticated={isAuthenticated}
                    actor={actor}
                    userProfile={userProfile}
                    refreshProfile={() => fetchUserProfile(actor)}
                  />
                }
              />
            ))}
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
    </Router>
  );
};

// Navigation Card Component
const NavigationCard = ({ module, Icon, isLocked, userVibration }) => {
  const navigate = useNavigate();
  
  return (
    <button
      onClick={() => !isLocked && navigate(module.path)}
      disabled={isLocked}
      className={`
        relative p-6 rounded-xl transition-all duration-300
        ${isLocked 
          ? 'bg-gray-800/50 opacity-50 cursor-not-allowed' 
          : `bg-gradient-to-br ${module.gradient} hover:scale-105 cursor-pointer`
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

export default ManashartApp;
EOF

echo "✅ ManashartApp.jsx updated with only Universe, Soul, and Flow"

# 3. Update Universe.jsx to only show these three modules
echo ""
echo "🔧 Updating Universe.jsx..."
cat > src/manashart_frontend/src/modules/Universe.jsx << 'EOF'
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, User, Briefcase } from 'lucide-react';

const Universe = ({ userProfile }) => {
  const navigate = useNavigate();

  const modules = [
    {
      name: 'Soul',
      icon: User,
      path: '/soul',
      color: 'from-pink-500 to-purple-500',
      description: 'Your digital identity',
      vibrationRequired: 0,
      size: 'large'
    },
    {
      name: 'Flow',
      icon: Briefcase,
      path: '/flow',
      color: 'from-blue-500 to-cyan-500',
      description: 'Creative projects',
      vibrationRequired: 60,
      size: 'large'
    }
  ];

  const userVibration = userProfile?.vibration || 0;

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="relative">
        {/* Central Universe Hub */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
            <Home className="w-16 h-16 text-white" />
          </div>
          <p className="text-center mt-4 text-white font-bold">UNIVERSE</p>
        </div>

        {/* Orbiting Modules */}
        <div className="relative w-[500px] h-[500px]">
          {modules.map((module, index) => {
            const Icon = module.icon;
            const isLocked = userVibration < module.vibrationRequired;
            const angle = (index * 180) - 90; // Position at 180 degrees apart
            const radius = 200;
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;

            return (
              <div
                key={module.name}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`
                }}
              >
                <button
                  onClick={() => !isLocked && navigate(module.path)}
                  disabled={isLocked}
                  className={`
                    relative group transition-all duration-300
                    ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 cursor-pointer'}
                  `}
                >
                  <div className={`
                    w-24 h-24 rounded-full flex items-center justify-center
                    bg-gradient-to-br ${module.color}
                    ${!isLocked && 'shadow-lg hover:shadow-2xl'}
                  `}>
                    <Icon className="w-12 h-12 text-white" />
                  </div>
                  
                  <div className="text-center mt-2">
                    <p className="text-white font-semibold">{module.name}</p>
                    <p className="text-white/60 text-xs">{module.description}</p>
                    {isLocked && (
                      <p className="text-red-400 text-xs mt-1">
                        Requires {module.vibrationRequired}Hz
                      </p>
                    )}
                  </div>

                  {/* Orbit line */}
                  <svg
                    className="absolute top-1/2 left-1/2 -z-10"
                    style={{
                      transform: `translate(-50%, -50%) translate(${-x}px, ${-y}px)`,
                      width: Math.abs(x) * 2 + 100,
                      height: Math.abs(y) * 2 + 100,
                    }}
                  >
                    <line
                      x1="50%"
                      y1="50%"
                      x2={`${50 + (x / 4)}%`}
                      y2={`${50 + (y / 4)}%`}
                      stroke="rgba(255, 255, 255, 0.2)"
                      strokeWidth="2"
                      strokeDasharray="5 5"
                    />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>

        {/* User Info */}
        {userProfile && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center">
            <p className="text-white/70">
              Current Vibration: <span className="text-purple-400 font-bold">{userVibration}Hz</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Universe;
EOF

echo "✅ Universe.jsx updated"

# 4. Create a simplified README for this branch
echo ""
echo "📝 Creating README for minimal branch..."
cat > README-minimal.md << 'EOF'
# Manashart Minimal - Universe, Soul & Flow

This is a simplified version of Manashart focusing on the core three modules:

## 🌟 Active Modules

1. **Universe** (0 Hz) - Central navigation hub
2. **Soul** (0 Hz) - User profile and identity
3. **Flow** (60 Hz) - Project management

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start local IC network
dfx start --clean --background

# Deploy canisters
dfx deploy

# Start frontend
npm start
```

## 📋 Features in this Branch

- ✅ Simplified navigation with only 3 modules
- ✅ Clean UI focused on core functionality
- ✅ All authentication and backend features intact
- ✅ Vibration system active (Flow requires 60Hz)

## 🔧 Disabled Modules

The following modules are disabled in this branch:
- Store
- Wallet
- Stream
- Invest
- Connect
- DAO

To re-enable them, switch back to the main branch.

## 🎯 Purpose

This minimal version is perfect for:
- Initial development and testing
- MVP demonstrations
- Understanding the core architecture
- Focused feature development

## 🔄 Switching Back

To return to the full version:
```bash
git checkout main
```
EOF

echo "✅ README-minimal.md created"

# 5. Commit changes
echo ""
echo "📝 Committing changes..."
git add -A
git commit -m "feat: Create minimal version with Universe, Soul and Flow only

- Simplified ManashartApp.jsx to include only 3 modules
- Updated Universe.jsx to show only Soul and Flow orbits
- Removed references to other modules
- Maintained all core functionality
- Added README-minimal.md for branch documentation"

echo ""
echo "✨ MINIMAL BRANCH CREATED! ✨"
echo "=========================="
echo ""
echo "Current branch: minimal-universe-soul-flow"
echo "Active modules: Universe, Soul, Flow"
echo ""
echo "Next steps:"
echo "1. Restart your development server: npm start"
echo "2. The app will now show only the 3 core modules"
echo "3. Flow still requires 60Hz vibration to unlock"
echo ""
echo "To switch back to full version: git checkout main"
echo ""
echo "Happy coding! 🚀"
