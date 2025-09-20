import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import WelcomeScreen from './components/WelcomeScreen';
import Home from './components/HomePage';
import About from './components/About';
import AnimatedBackground from "./components/AnimatedBackground";
import Navbar from "./components/Navbar";
import Portfolio from "./components/Portofolio";
import ProjectDetails from "./components/ProjectDetail";
import Footer from "./components/Footer";
import ContactPage from "./components/Contact";

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
            <About />
            <Portfolio />
            <ContactPage />
          </main>
          <Footer />
        </>
      )}
    </>
  );
};
const ProjectPageLayout = () => (
  <>
    <ProjectDetails />
    <Footer />

  </>
);
function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage showWelcome={showWelcome} setShowWelcome={setShowWelcome} />} />
        <Route path="/project/:id" element={<ProjectPageLayout />} />
           
      
      </Routes>
    </BrowserRouter>
  );
}

export default App;
