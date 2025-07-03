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
