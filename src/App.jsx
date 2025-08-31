import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import WelcomeScreen from './components/WelcomeScreen';
import Home from './components/HomePage';

import AnimatedBackground from "./components/AnimatedBackground";
import Navbar from "./components/Navbar";
const LandingPage = ({ showWelcome, setShowWelcome }) => {
  return (
    <>
      <AnimatePresence mode="wait">
        {showWelcome && (
          <WelcomeScreen onLoadingComplete={() => setShowWelcome(false)} />
        )}
      </AnimatePresence>

      {!showWelcome && (
        <>
        <Navbar/>
        <AnimatedBackground />
          <main className="relative z-10">
            <Home />
          </main>
        </>
      )}
    </>
  );
};

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage showWelcome={showWelcome} setShowWelcome={setShowWelcome} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
{/*import React from 'react';
import TriangulatedNetwork from './components/TriangulatedNetwork';
import CursorPointer from "./components/CursorPointer";

function App() {
  return (
    <div>
     <CursorPointer dotSize={16} offsetY={16} color="rgba(59,130,246,0.95)" followSpeed={0.18}>
            <TriangulatedNetwork />

    </CursorPointer>
    </div>
  );
}

export default App;*/}