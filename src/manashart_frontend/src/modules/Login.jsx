import React from 'react';

const Login = ({ setIsAuthenticated }) => {
  const handleLogin = () => {
    // Mock authentication
    setIsAuthenticated(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-xl rounded-lg shadow-lg p-8 border border-white/10">
        <h2 className="text-3xl font-bold text-center text-white mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          MANASHART
        </h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              className="shadow appearance-none border border-white/10 rounded w-full py-2 px-3 bg-gray-700/50 text-white leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-purple-500"
              id="username"
              type="text"
              placeholder="Username"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border border-white/10 rounded w-full py-2 px-3 bg-gray-700/50 text-white mb-3 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-purple-500"
              id="password"
              type="password"
              placeholder="******************"
            />
          </div>
          <div className="flex items-center justify-center mt-6">
            <button
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl focus:outline-none focus:shadow-outline transition-all duration-200 transform hover:scale-105"
              type="button"
              onClick={handleLogin}
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
