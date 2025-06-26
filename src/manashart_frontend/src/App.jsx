import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './modules/Home';
import ManashartApp from './ManashartApp';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/app/*" element={<ManashartApp />} />
      </Routes>
    </Router>
  );
}

export default App;
