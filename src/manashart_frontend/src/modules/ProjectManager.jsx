import React from 'react';

const ProjectManager = ({ actor, userProfile, refreshProfile }) => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl shadow-2xl p-8 w-full max-w-2xl border border-white/10">
        <h2 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
          Project Manager
        </h2>
        <p className="text-center text-white/70">
          Manage your creative projects here. (Coming Soon)
        </p>
      </div>
    </div>
  );
};

export default ProjectManager;
