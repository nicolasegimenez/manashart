import React, { useState, useEffect, useCallback } from 'react';
import { 
  Heart, CheckCircle, Activity, Wallet, ShoppingBag, Play, Home, Bell, 
  User, Search, ChevronLeft, Menu, X, Volume2, ExternalLink, Vote, 
  TrendingUp, Users, Lock, Sparkles, Zap, Shield, Award, Star,
  Music, Radio, Headphones, Mic, Calendar, Globe, Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';
import { createActor } from './services/actor';
import SoulProfile from './modules/soul/SoulProfile';
import ProjectManager from './modules/flow/ProjectManager';

const ManashartApp = () => {
  const [currentView, setCurrentView] = useState('universe');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [actor, setActor] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vibrationLevel, setVibrationLevel] = useState(50);
  const [unlockedModules, setUnlockedModules] = useState(['SOUL']);
  const [moduleAnimations, setModuleAnimations] = useState({});
  
  // Debug states
  const [debugMode, setDebugMode] = useState(true);
  const [debugLogs, setDebugLogs] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  
  // Debug logger
  const debugLog = (message, data = null) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = { timestamp, message, data };
    console.log(`[DEBUG ${timestamp}] ${message}`, data || '');
    setDebugLogs(prev => [...prev.slice(-50), logEntry]); // Keep last 50 logs
  };

  // Navigation with module states
  const navigation = [
    { 
      id: 'universe', 
      label: 'Universe', 
      icon: Home, 
      vibrationRequired: 0,
      color: 'from-purple-500 to-violet-500',
      planet: 'Saturn',
      description: 'Exploración del ecosistema'
    },
    { 
      id: 'soul', 
      label: 'Soul', 
      icon: CheckCircle, 
      vibrationRequired: 0,
      color: 'from-yellow-500 to-orange-500',
      planet: 'Sol',
      description: 'Tu identidad y propósito'
    },
    { 
      id: 'flow', 
      label: 'Flow', 
      icon: Layers, 
      vibrationRequired: 60,
      color: 'from-indigo-500 to-blue-500',
      planet: 'Júpiter',
      description: 'Gestión de proyectos'
    },
    { 
      id: 'store', 
      label: 'Store', 
      icon: ShoppingBag, 
      vibrationRequired: 70,
      color: 'from-pink-500 to-rose-500',
      planet: 'Venus',
      description: 'Marketplace de arte y servicios'
    },
    { 
      id: 'wallet', 
      label: 'Wallet', 
      icon: Wallet, 
      vibrationRequired: 65,
      color: 'from-orange-500 to-amber-500',
      planet: 'Mercurio',
      description: 'Tu billetera digital'
    },
    { 
      id: 'stream', 
      label: 'Stream', 
      icon: Play, 
      vibrationRequired: 75,
      color: 'from-blue-500 to-cyan-500',
      planet: 'Neptuno',
      description: 'Contenido audiovisual'
    },
    { 
      id: 'invest', 
      label: 'Invest', 
      icon: TrendingUp, 
      vibrationRequired: 80,
      color: 'from-red-500 to-orange-500',
      planet: 'Marte',
      description: 'Inversiones descentralizadas'
    },
    { 
      id: 'connect', 
      label: 'Connect', 
      icon: Radio, 
      vibrationRequired: 85,
      color: 'from-cyan-500 to-teal-500',
      planet: 'Urano',
      description: 'Comunicación interna'
    },
    { 
      id: 'dao', 
      label: 'DAO', 
      icon: Vote, 
      vibrationRequired: 90,
      color: 'from-purple-500 to-indigo-500',
      planet: 'Plutón',
      description: 'Gobernanza colectiva'
    }
  ];

  // Initialize IC connection
  useEffect(() => {
    debugLog('App initializing...');
    initializeIC();
  }, []);

  const initializeIC = async () => {
    try {
      debugLog('Starting IC initialization');
      setConnectionStatus('connecting');
      
      const authClient = await AuthClient.create();
      debugLog('AuthClient created', { authClient: !!authClient });
      
      const isAuth = await authClient.isAuthenticated();
      debugLog('Authentication check', { isAuthenticated: isAuth });
      
      if (isAuth) {
        debugLog('User already authenticated, loading profile');
        const userIdentity = authClient.getIdentity();
        const actorInstance = await createActor(userIdentity);
        setActor(actorInstance);
        setIdentity(userIdentity);
        setIsAuthenticated(true);
        setConnectionStatus('connected');
        await loadUserProfile(actorInstance, userIdentity);
      } else {
        debugLog('User not authenticated, ready for manual login');
        setConnectionStatus('ready');
      }
      
      setLoading(false);
      debugLog('IC initialization complete');
    } catch (error) {
      debugLog('IC initialization failed', error);
      setConnectionStatus('error');
      setLoading(false);
    }
  };

  const loadUserProfile = async (actorInstance, userIdentity) => {
    try {
      debugLog('Starting profile load');
      
      if (!actorInstance) {
        debugLog('ERROR: No actor instance available');
        throw new Error('Actor instance not available');
      }
      
      const principal = userIdentity.getPrincipal();
      debugLog('Loading profile for principal', { 
        principal: principal.toString(),
        principalType: typeof principal 
      });
      
      // Test actor connectivity
      debugLog('Testing actor connectivity...');
      const profileResponse = await actorInstance.getSoulProfile(principal);
      debugLog('Raw profile response', { 
        response: profileResponse,
        type: typeof profileResponse,
        length: profileResponse?.length,
        isArray: Array.isArray(profileResponse)
      });
      
      if (profileResponse && profileResponse.length > 0) {
        // Response is an array with one element
        const profile = profileResponse[0];
        debugLog('Profile found and extracted', { 
          profile,
          username: profile.username,
          vibration: profile.vibration,
          modules: profile.modules?.length
        });
        
        setUserProfile(profile);
        const vibration = Number(profile.vibration);
        setVibrationLevel(vibration);
        
        const unlocked = profile.modules
          .filter(m => m.enabled)
          .map(m => m.name);
        setUnlockedModules(unlocked);
        
        debugLog('Profile state updated', { 
          vibration,
          unlockedModules: unlocked,
          totalModules: profile.modules?.length
        });
      } else {
        debugLog('No profile found, using fallback state');
        const fallbackProfile = {
          username: 'TestUser',
          vibration: 90,
          modules: [{ name: 'SOUL', enabled: true, level: 1 }]
        };
        setUserProfile(fallbackProfile);
        setVibrationLevel(90);
        setUnlockedModules(['SOUL']);
        debugLog('Fallback profile set', fallbackProfile);
      }
    } catch (error) {
      debugLog('Profile loading failed', { 
        error: error.message,
        stack: error.stack,
        name: error.name
      });
      
      // Set emergency fallback state
      const emergencyProfile = {
        username: 'TestUser (Emergency)',
        vibration: 90,
        modules: [{ name: 'SOUL', enabled: true, level: 1 }]
      };
      setUserProfile(emergencyProfile);
      setVibrationLevel(90);
      setUnlockedModules(['SOUL']);
      debugLog('Emergency fallback activated', emergencyProfile);
    }
  };

  const handleLogin = async () => {
    try {
      debugLog('=== Starting manual login process ===');
      setConnectionStatus('connecting');
      
      // Create test identity for local development
      const testPrincipalText = "wglbq-n3s36-eqjnp-3yc2v-cncyg-h3lts-cae2k-dy56r-ptabd-x3xv3-dae";
      debugLog('Creating test principal', { principalText: testPrincipalText });
      
      const testPrincipal = Principal.fromText(testPrincipalText);
      const testIdentity = {
        getPrincipal: () => testPrincipal
      };
      debugLog('Test identity created', { 
        principal: testPrincipal.toString(),
        identityType: typeof testIdentity
      });
      
      // Create actor
      debugLog('Creating actor instance...');
      const actorInstance = await createActor();
      debugLog('Actor creation result', { 
        actorExists: !!actorInstance,
        actorType: typeof actorInstance
      });
      
      if (!actorInstance) {
        debugLog('ERROR: Actor creation failed');
        setConnectionStatus('error');
        throw new Error('Failed to create actor instance');
      }
      
      debugLog('Setting authentication state...');
      setActor(actorInstance);
      setIdentity(testIdentity);
      setIsAuthenticated(true);
      setConnectionStatus('connected');
      
      debugLog('Authentication state set, loading profile...');
      await loadUserProfile(actorInstance, testIdentity);
      
      debugLog('=== Login process completed successfully ===');
      
    } catch (error) {
      debugLog('=== Login process failed ===', {
        error: error.message,
        stack: error.stack,
        name: error.name
      });
      setConnectionStatus('error');
      alert('Error connecting: ' + error.message);
    }
  };

  const handleUnlockModule = async (moduleName) => {
    if (!actor) {
      console.log('No actor available for unlock');
      return;
    }
    
    try {
      console.log('Attempting to unlock module:', moduleName);
      
      // For testing, just unlock locally if vibration is sufficient
      const moduleInfo = navigation.find(n => n.label.toUpperCase() === moduleName);
      if (vibrationLevel >= moduleInfo.vibrationRequired) {
        setUnlockedModules([...unlockedModules, moduleName]);
        setModuleAnimations({ ...moduleAnimations, [moduleName]: 'unlocking' });
        
        setTimeout(() => {
          setModuleAnimations({ ...moduleAnimations, [moduleName]: 'unlocked' });
        }, 1000);
        
        console.log('Module unlocked locally:', moduleName);
      } else {
        alert(`Necesitas ${moduleInfo.vibrationRequired} Hz para desbloquear ${moduleName}`);
      }
    } catch (error) {
      console.error('Failed to unlock module:', error);
    }
  };

  // Sacred Geometry Component with Animation
  const SacredGeometry = ({ size = 300, vibration = 50, interactive = false }) => (
    <div className="flex justify-center">
      <div className={`relative ${interactive ? 'cursor-pointer' : ''}`} style={{ width: size, height: size }}>
        <svg width={size} height={size} className="text-purple-300">
          <defs>
            <radialGradient id="mandala-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgb(147 51 234)" stopOpacity={vibration / 100} />
              <stop offset="50%" stopColor="rgb(168 85 247)" stopOpacity={vibration / 100} />
              <stop offset="100%" stopColor="rgb(192 132 252)" stopOpacity={vibration / 200} />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Animated outer rings */}
          {[...Array(3)].map((_, i) => (
            <circle
              key={`ring-${i}`}
              cx={size/2}
              cy={size/2}
              r={size/2 - 20 - (i * 30)}
              fill="none"
              stroke="url(#mandala-gradient)"
              strokeWidth="1"
              opacity={0.3 + (vibration / 200)}
              className="animate-pulse"
              style={{ animationDelay: `${i * 0.5}s` }}
            />
          ))}
          
          {/* Module nodes */}
          {navigation.map((module, i) => {
            const angle = (i * 40) - 90; // 360/9 modules
            const radius = size/2 - 60;
            const x = size/2 + radius * Math.cos(angle * Math.PI / 180);
            const y = size/2 + radius * Math.sin(angle * Math.PI / 180);
            const isUnlocked = unlockedModules.includes(module.label.toUpperCase());
            const Icon = module.icon;
            
            return (
              <g key={module.id} className="cursor-pointer group">
                {/* Connection lines */}
                {isUnlocked && (
                  <line
                    x1={size/2}
                    y1={size/2}
                    x2={x}
                    y2={y}
                    stroke="url(#mandala-gradient)"
                    strokeWidth="1"
                    opacity="0.3"
                    className="animate-pulse"
                  />
                )}
                
                {/* Module circle */}
                <circle
                  cx={x}
                  cy={y}
                  r="25"
                  fill={isUnlocked ? "url(#mandala-gradient)" : "rgba(0,0,0,0.5)"}
                  stroke={isUnlocked ? "url(#mandala-gradient)" : "rgba(255,255,255,0.1)"}
                  strokeWidth="2"
                  filter={isUnlocked ? "url(#glow)" : ""}
                  onClick={() => {
                    if (isUnlocked) {
                      setCurrentView(module.id);
                    } else if (vibrationLevel >= module.vibrationRequired) {
                      handleUnlockModule(module.label.toUpperCase());
                    }
                  }}
                  className={`transition-all duration-300 ${
                    isUnlocked ? 'group-hover:r-30' : 'group-hover:stroke-2'
                  }`}
                />
                
                {/* Module icon */}
                <foreignObject x={x - 12} y={y - 12} width="24" height="24">
                  <Icon 
                    className={`w-6 h-6 ${
                      isUnlocked ? 'text-white' : 'text-gray-600'
                    }`}
                  />
                </foreignObject>
                
                {/* Lock icon for locked modules */}
                {!isUnlocked && (
                  <foreignObject x={x + 8} y={y - 20} width="16" height="16">
                    <Lock className="w-4 h-4 text-gray-500" />
                  </foreignObject>
                )}
                
                {/* Vibration requirement */}
                {!isUnlocked && vibrationLevel < module.vibrationRequired && (
                  <text
                    x={x}
                    y={y + 40}
                    textAnchor="middle"
                    className="fill-gray-500 text-xs"
                  >
                    {module.vibrationRequired} Hz
                  </text>
                )}
              </g>
            );
          })}
          
          {/* Center core */}
          <circle 
            cx={size/2} 
            cy={size/2} 
            r="40" 
            fill="url(#mandala-gradient)" 
            opacity="0.3"
            className="animate-pulse"
          />
          <circle 
            cx={size/2} 
            cy={size/2} 
            r="15" 
            fill="url(#mandala-gradient)"
            filter="url(#glow)"
          />
          
          {/* Vibration level text */}
          <text
            x={size/2}
            y={size/2 + 5}
            textAnchor="middle"
            className="fill-white text-lg font-bold"
          >
            {vibrationLevel}
          </text>
          <text
            x={size/2}
            y={size/2 + 20}
            textAnchor="middle"
            className="fill-white text-xs opacity-70"
          >
            Hz
          </text>
        </svg>
      </div>
    </div>
  );

  // Enhanced Sidebar with Module States
  const Sidebar = () => (
    <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-900 transform ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    } transition-transform lg:translate-x-0 lg:static lg:inset-0 backdrop-blur-xl`}>
      <div className="flex items-center justify-between p-6 border-b border-purple-800/30">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold text-white">MANASHART</span>
            <div className="text-xs text-purple-300">v4.0 Cosmos</div>
          </div>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {/* User Vibration Status */}
      {isAuthenticated && userProfile && (
        <div className="px-6 py-4 border-b border-purple-800/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-purple-300">Vibración Actual</span>
            <span className="text-sm font-bold text-white">{vibrationLevel} Hz</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000"
              style={{ width: `${vibrationLevel}%` }}
            />
          </div>
        </div>
      )}
      
      <nav className="mt-6 px-3">
        {navigation.map(({ id, label, icon: Icon, vibrationRequired, color, planet }) => {
          const isUnlocked = unlockedModules.includes(label.toUpperCase());
          const canUnlock = vibrationLevel >= vibrationRequired && !isUnlocked;
          const animationState = moduleAnimations[label.toUpperCase()];
          
          return (
            <button
              key={id}
              onClick={() => {
                if (isUnlocked) {
                  setCurrentView(id);
                  setSidebarOpen(false);
                } else if (canUnlock) {
                  handleUnlockModule(label.toUpperCase());
                }
              }}
              disabled={!isUnlocked && !canUnlock}
              className={`w-full flex items-center justify-between px-4 py-3 mb-2 rounded-xl text-left transition-all duration-300 group ${
                currentView === id 
                  ? `bg-gradient-to-r ${color} text-white shadow-lg` 
                  : isUnlocked
                    ? 'bg-slate-800/50 text-gray-300 hover:bg-slate-700 hover:text-white'
                    : canUnlock
                      ? 'bg-slate-800/30 text-gray-500 hover:bg-purple-900/30 hover:text-purple-300 border border-purple-700/50'
                      : 'bg-slate-900/50 text-gray-600 cursor-not-allowed'
              } ${animationState === 'unlocking' ? 'animate-pulse' : ''}`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  currentView === id || animationState === 'unlocking'
                    ? 'bg-white/20' 
                    : isUnlocked 
                      ? 'bg-slate-700' 
                      : 'bg-slate-800'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium">{label}</div>
                  <div className="text-xs opacity-70">{planet}</div>
                </div>
              </div>
              
              {!isUnlocked && (
                <div className="flex items-center space-x-2">
                  {canUnlock ? (
                    <Zap className="w-4 h-4 text-purple-400" />
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span className="text-xs">{vibrationRequired} Hz</span>
                    </>
                  )}
                </div>
              )}
              
              {animationState === 'unlocked' && (
                <Award className="w-5 h-5 text-yellow-400 animate-bounce" />
              )}
            </button>
          );
        })}
      </nav>
      
      {/* LAIA Assistant Preview */}
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-purple-800/30">
        <div className="flex items-center space-x-3 text-purple-300 cursor-pointer hover:text-purple-200 transition-colors">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-medium">LAIA</div>
            <div className="text-xs opacity-70">Tu guía lunar</div>
          </div>
        </div>
      </div>
    </div>
  );

  // Enhanced Header with Vibration Controls
  const Header = () => (
    <header className="bg-slate-900/80 backdrop-blur-xl border-b border-purple-800/30 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400">
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-white capitalize flex items-center space-x-2">
            <span>{currentView}</span>
            {navigation.find(n => n.id === currentView)?.planet && (
              <span className="text-sm text-purple-400">
                • {navigation.find(n => n.id === currentView).planet}
              </span>
            )}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Vibration Booster (for testing) */}
          {isAuthenticated && (
            <button
              onClick={() => setVibrationLevel(Math.min(100, vibrationLevel + 5))}
              className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 px-3 py-1 rounded-lg text-sm transition-colors flex items-center space-x-1"
            >
              <Zap className="w-4 h-4" />
              <span>+5 Hz</span>
            </button>
          )}
          
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar en el cosmos..." 
              className="bg-slate-800/50 text-white pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none backdrop-blur"
            />
          </div>
          
          <button className="relative text-gray-400 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
          </button>
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-gray-300">{userProfile?.username || 'Usuario'}</span>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Conectar
            </button>
          )}
        </div>
      </div>
    </header>
  );

  // Enhanced Universe View with Sacred Geometry
  const UniverseView = () => (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Message */}
        {!isAuthenticated && (
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-8 mb-8 backdrop-blur">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Bienvenido al Universo MANASHART
              </h2>
              <p className="text-purple-200 mb-6 max-w-2xl mx-auto">
                Un ecosistema digital consciente donde tu vibración desbloquea nuevas dimensiones. 
                Conecta tu identidad para comenzar tu viaje evolutivo.
              </p>
              <button
                onClick={handleLogin}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
              >
                Iniciar Viaje
              </button>
            </div>
          </div>
        )}
        
        {/* Sacred Geometry Mandala */}
        <div className="bg-gradient-to-br from-indigo-950/50 via-purple-950/50 to-slate-950/50 rounded-3xl p-8 backdrop-blur mb-8">
          <h3 className="text-2xl font-bold text-white text-center mb-6">
            Tu Mandala Personal
          </h3>
          <SacredGeometry size={400} vibration={vibrationLevel} interactive={true} />
          
          {/* Module Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            {navigation.slice(1).map(({ id, label, icon: Icon, color, vibrationRequired, description }) => {
              const isUnlocked = unlockedModules.includes(label.toUpperCase());
              const canUnlock = vibrationLevel >= vibrationRequired;
              
              return (
                <div
                  key={id}
                  className={`relative p-4 rounded-xl transition-all duration-300 ${
                    isUnlocked 
                      ? `bg-gradient-to-br ${color} cursor-pointer hover:scale-105 shadow-lg` 
                      : canUnlock
                        ? 'bg-slate-800/50 border-2 border-purple-500/50 hover:border-purple-400'
                        : 'bg-slate-900/50 opacity-50'
                  }`}
                  onClick={() => {
                    if (isUnlocked) {
                      setCurrentView(id);
                    } else if (canUnlock) {
                      handleUnlockModule(label.toUpperCase());
                    }
                  }}
                >
                  {!isUnlocked && !canUnlock && (
                    <Lock className="absolute top-2 right-2 w-4 h-4 text-gray-500" />
                  )}
                  
                  <Icon className={`w-8 h-8 mb-2 ${
                    isUnlocked ? 'text-white' : 'text-gray-400'
                  }`} />
                  
                  <h4 className={`font-semibold mb-1 ${
                    isUnlocked ? 'text-white' : 'text-gray-300'
                  }`}>
                    {label}
                  </h4>
                  
                  <p className={`text-xs ${
                    isUnlocked ? 'text-white/80' : 'text-gray-500'
                  }`}>
                    {description}
                  </p>
                  
                  {!isUnlocked && (
                    <div className="mt-2 text-xs text-gray-400">
                      Requiere: {vibrationRequired} Hz
                    </div>
                  )}
                  
                  {canUnlock && !isUnlocked && (
                    <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                      ¡Desbloqueame!
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold text-white mb-4">Actividad Reciente</h3>
            <div className="space-y-4">
              {[
                { user: 'Luna123', action: 'desbloqueó', module: 'FLOW', time: 'hace 2h', vibration: 62 },
                { user: 'SolarArtist', action: 'creó proyecto en', module: 'STORE', time: 'hace 4h', vibration: 78 },
                { user: 'CosmicDev', action: 'votó en', module: 'DAO', time: 'hace 6h', vibration: 92 },
              ].map((activity, index) => (
                <div key={index} className="bg-slate-800/50 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full" />
                    <div>
                      <p className="text-white">
                        <span className="font-semibold">{activity.user}</span> {activity.action}{' '}
                        <span className="text-purple-400">{activity.module}</span>
                      </p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-purple-300">{activity.vibration} Hz</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Tu Progreso</h3>
            <div className="bg-slate-800/50 rounded-xl p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Módulos Desbloqueados</span>
                    <span className="text-white font-medium">{unlockedModules.length}/9</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
                      style={{ width: `${(unlockedModules.length / 9) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Nivel de Conciencia</span>
                    <span className="text-white font-medium">Explorador</span>
                  </div>
                  <div className="flex space-x-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${
                          i < Math.floor(vibrationLevel / 20) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-600'
                        }`} 
                      />
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-700">
                  <p className="text-xs text-gray-400 mb-2">Próximo desbloqueo:</p>
                  {navigation.find(m => !unlockedModules.includes(m.label.toUpperCase()) && m.vibrationRequired <= vibrationLevel + 10) && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white">
                        {navigation.find(m => !unlockedModules.includes(m.label.toUpperCase()) && m.vibrationRequired <= vibrationLevel + 10)?.label}
                      </span>
                      <span className="text-xs text-purple-400">
                        {navigation.find(m => !unlockedModules.includes(m.label.toUpperCase()) && m.vibrationRequired <= vibrationLevel + 10)?.vibrationRequired - vibrationLevel} Hz más
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Enhanced Soul View - use the new component
  const SoulView = () => (
    <div className="p-6">
      <SoulProfile identity={identity} />
    </div>
  );

  // Flow View - use the new component
  const FlowView = () => (
    <div className="p-6">
      <ProjectManager identity={identity} />
    </div>
  );

  // Enhanced Wallet View
  const WalletView = () => {
    const walletData = {
      totalValue: 5750.20,
      tokens: [
        { name: 'MHT', fullName: 'Manashart Token', amount: 124180, price: 0.046, change: 12.5, icon: '⚙️' },
        { name: 'VYBRA', fullName: 'Vibration Token', amount: 8430, price: 0.012, change: -2.3, icon: '🌊' },
        { name: 'ICP', fullName: 'Internet Computer', amount: 15.5, price: 12.30, change: 8.7, icon: '∞' },
        { name: 'ckBTC', fullName: 'Chain Key Bitcoin', amount: 0.29, price: 67340, change: 5.2, icon: '₿' },
      ],
      nfts: [
        { id: 1, name: 'Genesis Soul #142', collection: 'MANASHART Genesis', image: '🌟' },
        { id: 2, name: 'Vibration Art #23', collection: 'Frequency Collection', image: '🎨' },
        { id: 3, name: 'DAO Member Badge', collection: 'Governance NFTs', image: '🏛️' },
      ]
    };
    
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Portfolio Overview */}
          <div className="bg-gradient-to-br from-orange-900/20 to-amber-900/20 rounded-3xl p-8 mb-8 backdrop-blur">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h2 className="text-4xl font-bold text-white mb-2">
                  ${walletData.totalValue.toLocaleString()}
                </h2>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-medium">+12.5%</span>
                  </div>
                  <span className="text-gray-400">Últimas 24h</span>
                </div>
                
                <div className="flex space-x-4">
                  <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                    </svg>
                    <span>Enviar</span>
                  </button>
                  <button className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 13l5 5m0 0l5-5m-5 5V6" />
                    </svg>
                    <span>Recibir</span>
                  </button>
                  <button className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <span>Intercambiar</span>
                  </button>
                </div>
              </div>
              
              <div className="bg-black/20 rounded-2xl p-6">
                <h3 className="text-sm text-orange-300 mb-4">Distribución</h3>
                <div className="space-y-3">
                  {walletData.tokens.slice(0, 3).map((token) => {
                    const percentage = ((token.amount * token.price) / walletData.totalValue) * 100;
                    return (
                      <div key={token.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{token.icon}</span>
                          <span className="text-sm text-white">{token.name}</span>
                        </div>
                        <span className="text-sm text-gray-300">{percentage.toFixed(1)}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          
          {/* Tokens & NFTs Tabs */}
          <div className="bg-slate-800/50 rounded-2xl p-6">
            <div className="flex space-x-6 border-b border-slate-700 mb-6">
              <button className="pb-3 border-b-2 border-orange-500 text-white font-medium">
                Tokens
              </button>
              <button className="pb-3 text-gray-400 hover:text-white transition-colors">
                NFTs ({walletData.nfts.length})
              </button>
              <button className="pb-3 text-gray-400 hover:text-white transition-colors">
                Actividad
              </button>
            </div>
            
            <div className="space-y-4">
              {walletData.tokens.map((token) => (
                <div key={token.name} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl hover:bg-slate-900/70 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-2xl">
                      {token.icon}
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{token.fullName}</h4>
                      <p className="text-gray-400 text-sm">{token.name}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-white font-medium">
                      {token.amount.toLocaleString()} {token.name}
                    </p>
                    <p className="text-gray-400 text-sm">
                      ${(token.amount * token.price).toLocaleString()}
                    </p>
                  </div>
                  
                  <div className={`text-sm font-medium ${
                    token.change >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {token.change >= 0 ? '+' : ''}{token.change}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render content based on current view
  const renderContent = () => {
    switch (currentView) {
      case 'universe':
        return <UniverseView />;
      case 'soul':
        return <SoulView />;
      case 'flow':
        return unlockedModules.includes('FLOW') ? <FlowView /> : <LockedModuleView module="FLOW" />;
      case 'wallet':
        return unlockedModules.includes('WALLET') ? <WalletView /> : <LockedModuleView module="WALLET" />;
      default:
        return <UniverseView />;
    }
  };

  // Locked Module View
  const LockedModuleView = ({ module }) => {
    const moduleInfo = navigation.find(n => n.label.toUpperCase() === module);
    
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <div className="text-center max-w-md">
          <div className="w-32 h-32 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-16 h-16 text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Módulo Bloqueado
          </h2>
          <p className="text-gray-400 mb-6">
            Necesitas {moduleInfo.vibrationRequired} Hz de vibración para desbloquear {moduleInfo.label}.
            Tu vibración actual es {vibrationLevel} Hz.
          </p>
          <div className="bg-slate-800 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-400 mb-2">Progreso</p>
            <div className="w-full h-2 bg-slate-700 rounded-full">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
                style={{ width: `${(vibrationLevel / moduleInfo.vibrationRequired) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Te faltan {moduleInfo.vibrationRequired - vibrationLevel} Hz
            </p>
          </div>
          <button
            onClick={() => setCurrentView('universe')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Volver al Universo
          </button>
        </div>
      </div>
    );
  };

  // Debug Panel Component
  const DebugPanel = () => (
    debugMode && (
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur text-green-400 p-4 max-h-64 overflow-y-auto z-50 font-mono text-xs border-t border-green-500">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-green-300 font-bold">🐛 DEBUG PANEL</h3>
          <div className="flex items-center space-x-4">
            <span className={`px-2 py-1 rounded text-xs ${
              connectionStatus === 'connected' ? 'bg-green-800 text-green-200' :
              connectionStatus === 'connecting' ? 'bg-yellow-800 text-yellow-200' :
              connectionStatus === 'error' ? 'bg-red-800 text-red-200' :
              'bg-gray-800 text-gray-200'
            }`}>
              {connectionStatus.toUpperCase()}
            </span>
            <button 
              onClick={() => setDebugMode(false)}
              className="text-red-400 hover:text-red-300"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {/* States */}
          <div>
            <h4 className="text-green-300 mb-1">STATES:</h4>
            <div className="space-y-1 text-xs">
              <div>Auth: {isAuthenticated ? '✅' : '❌'}</div>
              <div>Actor: {actor ? '✅' : '❌'}</div>
              <div>Profile: {userProfile?.username || 'None'}</div>
              <div>Vibration: {vibrationLevel}Hz</div>
              <div>Modules: {unlockedModules.join(', ')}</div>
              <div>View: {currentView}</div>
            </div>
          </div>
          
          {/* Recent Logs */}
          <div>
            <h4 className="text-green-300 mb-1">RECENT LOGS:</h4>
            <div className="space-y-1 text-xs max-h-32 overflow-y-auto">
              {debugLogs.slice(-8).map((log, i) => (
                <div key={i} className="flex space-x-2">
                  <span className="text-gray-500">[{log.timestamp}]</span>
                  <span className="text-green-400">{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="mt-2 flex space-x-2">
          <button 
            onClick={() => debugLog('Manual test log')}
            className="bg-green-800 hover:bg-green-700 px-2 py-1 rounded text-xs"
          >
            Test Log
          </button>
          <button 
            onClick={() => setDebugLogs([])}
            className="bg-yellow-800 hover:bg-yellow-700 px-2 py-1 rounded text-xs"
          >
            Clear Logs
          </button>
          <button 
            onClick={handleLogin}
            className="bg-blue-800 hover:bg-blue-700 px-2 py-1 rounded text-xs"
          >
            Force Login
          </button>
        </div>
      </div>
    )
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full animate-pulse mx-auto mb-4" />
          <p className="text-white">Cargando el cosmos...</p>
          <button 
            onClick={() => setDebugMode(true)}
            className="mt-4 text-green-400 text-xs hover:text-green-300"
          >
            Enable Debug Mode
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/10 to-slate-950 text-white">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div className="flex min-h-screen">
        <Sidebar />
        
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-auto bg-gradient-to-br from-transparent via-purple-900/5 to-transparent">
            {renderContent()}
          </main>
        </div>
      </div>
      
      {/* Floating LAIA Assistant */}
      <div className="fixed bottom-6 right-6 z-30">
        <button className="w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full shadow-lg shadow-purple-500/25 flex items-center justify-center hover:scale-110 transition-transform">
          <Globe className="w-7 h-7 text-white" />
        </button>
      </div>
      
      {/* Debug Toggle Button */}
      {!debugMode && (
        <button 
          onClick={() => setDebugMode(true)}
          className="fixed bottom-24 right-6 z-30 bg-green-600 hover:bg-green-700 text-white p-2 rounded-full text-xs"
          title="Enable Debug Mode"
        >
          🐛
        </button>
      )}
      
      {/* Debug Panel */}
      <DebugPanel />
    </div>
  );
};

export default ManashartApp;
