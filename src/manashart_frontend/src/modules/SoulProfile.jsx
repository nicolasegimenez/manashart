import React from 'react';

const SoulProfile = ({ userProfile, actor, refreshProfile }) => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl shadow-2xl p-8 w-full max-w-2xl border border-white/10">
        <h2 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
          Soul Profile
        </h2>
        {userProfile ? (
          <div className="space-y-4 text-white/80">
            <p><span className="font-semibold text-white">Username:</span> {userProfile.username}</p>
            <p><span className="font-semibold text-white">Vibration:</span> {userProfile.vibration}Hz</p>
            {/* Add more profile details here */}
          </div>
        ) : (
          <p className="text-center text-white/70">No profile data available. Please log in.</p>
        )}
      </div>
    </div>
  );
};

export default SoulProfile;
