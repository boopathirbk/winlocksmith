import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Author from './pages/Author';
import FAQ from './pages/FAQ';
import Donate from './pages/Donate';
import Config from './pages/Config';

// Make sure to define basename for GitHub Pages if needed. 
// Using undefined since vite base will handle it, or pass "/winlocksmith" explicitly.
// Assuming vite config base: "/winlocksmith/" will handle asset paths,
// Router basename should be consistent.
const basename = import.meta.env.BASE_URL;

const App: React.FC = () => {
  return (
    <Router basename={basename}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/config" element={<Config />} />
          <Route path="/author" element={<Author />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;