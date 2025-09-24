import React, { useState, useEffect, useCallback, memo, useRef } from "react";
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, ExternalLink, Instagram, Sparkles } from "lucide-react";
import TriangulatedNetwork from './TriangulatedNetwork';
import CursorPointer from "./CursorPointer";

// Reusable animated social button
const SocialButton = ({ href = '#', children, label }) => (
  <motion.a
    whileHover={{ y: -4, scale: 1.06 }}
    whileFocus={{ y: -4, scale: 1.06 }}
    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    href={href}
    aria-label={label}
    target="_blank"
    rel="noreferrer"
    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-900/60 backdrop-blur-md border border-indigo-700 hover:bg-indigo-900/40 transition-all duration-300"
  >
    {children}
  </motion.a>
);

// CTAButton with new gradient and improved hover effects
const CTAButton = memo(({ href, text, icon: Icon, onClick }) => (
  <a href={href} onClick={onClick}>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileFocus={{ scale: 1.05 }}
      className="group relative w-[180px]"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl blur opacity-40 group-hover:opacity-60 transition duration-500"></div>
      <div className="relative h-12 bg-slate-900/70 backdrop-blur-xl rounded-xl border border-indigo-700 leading-none overflow-hidden">
        <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-400 bg-gradient-to-r from-purple-400/20 to-indigo-400/20"></div>
        <span className="absolute inset-0 flex items-center justify-center gap-2 text-base group-hover:gap-3 transition-all duration-300">
          <span className="bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent font-semibold z-10">{text}</span>
          <Icon className="w-5 h-5 text-purple-300 transform transition-all duration-300 z-10" />
        </span>
      </div>
    </motion.button>
  </a>
));

const TechPill = memo(({ children }) => (
  <motion.div 
    whileHover={{ y: -3 }} 
    whileFocus={{ y: -3 }}
    className="px-5 py-2.5 rounded-full bg-slate-900/50 backdrop-blur-md border border-indigo-700 text-sm text-slate-200 hover:bg-indigo-900/30 transition-all duration-300"
  >
    {children}
  </motion.div>
));

// Constants
const TYPING_SPEED = 80;
const ERASING_SPEED = 40;
const PAUSE_DURATION = 1500;
const WORDS = ["Desktop Application Developer", "Software Innovator", "Cross-Platform Expert", "UI/UX Specialist"];
const TECH_STACK = ["ASP.NET Core", "C#", "WPF", "AvaloniaUI", "REST APIs"];
const SOCIAL_LINKS = [
  { icon: Github, link: "https://github.com/znono7" },
  { icon: Linkedin, link: "https://www.linkedin.com/in/zakhrouf-noureddine" },
  { icon: Instagram, link: "https://www.instagram.com/no.ureddine7828/" }
];

const Home = () => {
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDarkMode] = useState(true);

  const containerRef = useRef(null);

  useEffect(() => {
    setIsLoaded(true);
    return () => setIsLoaded(false);
  }, []);

  const handleTyping = useCallback(() => {
    if (isTyping) {
      if (charIndex < WORDS[wordIndex].length) {
        setText(prev => prev + WORDS[wordIndex][charIndex]);
        setCharIndex(prev => prev + 1);
      } else {
        setTimeout(() => setIsTyping(false), PAUSE_DURATION);
      }
    } else {
      if (charIndex > 0) {
        setText(prev => prev.slice(0, -1));
        setCharIndex(prev => prev - 1);
      } else {
        setWordIndex(prev => (prev + 1) % WORDS.length);
        setIsTyping(true);
      }
    }
  }, [charIndex, isTyping, wordIndex]);

  useEffect(() => {
    const timeout = setTimeout(handleTyping, isTyping ? TYPING_SPEED : ERASING_SPEED);
    return () => clearTimeout(timeout);
  }, [handleTyping]);

  // Motion variants with parallax effect
  const wrapper = {
    hidden: { opacity: 0, y: 20 }, 
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, when: 'beforeChildren', ease: 'easeOut' } }
  };

  const item = { 
    hidden: { opacity: 0, y: 15 }, 
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } 
  };

  return (
    <section id="Home" className="home-section relative min-h-screen flex items-center justify-center">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <TriangulatedNetwork />
      </div>
      
      <CursorPointer 
        dotSize={16} 
        offsetY={16} 
        color="rgba(59,130,246,0.95)" 
        followSpeed={0.18}
      >
        <div 
          style={{ WebkitFontSmoothing: 'antialiased', textRendering: 'optimizeLegibility' }}
          className={`relative z-10 w-full flex items-center justify-center text-center px-6 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}
        >
          <div className={`relative transition-opacity duration-500 py-10 md:py-16 px-6 md:px-8 lg:px-12 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <motion.div initial="hidden" animate="show" variants={wrapper} className="container mx-auto">
              <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center gap-8 py-10">
                <motion.div variants={item} className="max-w-4xl">
                  <motion.div className="inline-block animate-bounce mb-4">
                    <div className="relative group inline-block">
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                      <div className="relative px-4 py-2.5 rounded-full bg-slate-900/60 backdrop-blur-md border border-indigo-700">
                        <span className="bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent text-sm font-medium flex items-center">
                          <Sparkles className="w-4 h-4 mr-2 text-purple-300" />
                          Open to Opportunities
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.h1 variants={item} className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                    <span className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-indigo-200">Desktop</span>
                    <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-indigo-200">Application Developer</span>
                  </motion.h1>

                  <motion.div variants={item} className="h-12 flex items-center justify-center mt-4">
                    <span className="text-2xl md:text-3xl bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent font-semibold">{text}</span>
                    <span className="w-1 h-10 bg-gradient-to-t from-purple-300 to-indigo-300 ml-2 animate-pulse"></span>
                  </motion.div>

                  <motion.p variants={item} className="text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed font-light mt-6 mx-auto">
                    Crafting scalable, user-centric desktop solutions that drive business efficiency and innovation.
                  </motion.p>

                  <motion.div variants={item} className="flex flex-wrap justify-center gap-4 mt-8">
                    {TECH_STACK.map((t, i) => <TechPill key={i}>{t}</TechPill>)}
                  </motion.div>

                  <motion.div variants={item} className="flex flex-row justify-center gap-4 mt-8">
                    <CTAButton 
                      href="#Portfolio" 
                      text="Explore Projects" 
                      icon={ExternalLink} 
                    />
                    <CTAButton href="#Contact" text="Connect Now" icon={Mail} />
                  </motion.div>

                  <motion.div variants={item} className="flex justify-center gap-5 mt-8">
                    {SOCIAL_LINKS.map((s, i) => (
                      <SocialButton key={i} href={s.link} label={s.link}>
                        <s.icon className="w-5 h-5 text-slate-200" />
                      </SocialButton>
                    ))}
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Scroll indicator */}
            <motion.p 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.8 }} 
              className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-slate-400 font-light"
            >
              Crafted with Passion — Scroll to Explore
            </motion.p>
          </div>
        </div>
      </CursorPointer>
    </section>
  );
};

export default memo(Home);