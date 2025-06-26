import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-6">
      <div className="text-center">
        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mb-8">
          <Sparkles className="w-16 h-16 text-white" />
        </div>
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          MANASHART
        </h1>
        <p className="text-xl text-purple-200 mb-8">
          Ecosistema Digital Consciente
        </p>
        <button
          onClick={() => navigate('/app')}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
        >
          Entrar al Universo
        </button>
      </div>
    </div>
  );
};

export default Home;
