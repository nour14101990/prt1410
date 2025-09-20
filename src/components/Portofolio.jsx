import React, { useEffect, useState, useCallback } from "react";
import Box from "@mui/material/Box"; // still using Box for layout padding
import CardProject from "./CardProject";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

// Reuse your ToggleButton (copied here for completeness)
const ToggleButton = ({ onClick, isShowingMore }) => (
  <button
    onClick={onClick}
    className="
      px-3 py-1.5
      text-slate-200 
      hover:text-white 
      text-sm 
      font-medium 
      transition-all 
      duration-300 
      ease-in-out
      flex 
      items-center 
      gap-2
      bg-slate-800/50 
      hover:bg-slate-700/50
      rounded-md
      border 
      border-slate-700
      hover:border-slate-600
      backdrop-blur-sm
      group
      relative
      overflow-hidden
    "
  >
    <span className="relative z-10 flex items-center gap-2">
      {isShowingMore ? "See Less" : "See More"}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-transform duration-300 ${isShowingMore ? "group-hover:-translate-y-0.5" : "group-hover:translate-y-0.5"}`}
      >
        <polyline points={isShowingMore ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
      </svg>
    </span>
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400/50 transition-all duration-300 group-hover:w-full"></span>
  </button>
);

export default function ProjectsOnly() {
  const [projects, setProjects] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [isMobile] = useState(() => window.innerWidth < 768);
  const initialItems = isMobile ? 4 : 6;

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("/data.json");
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();

      const projectData = (data.projects || []).map((project) => ({
        ...project,
        TechStack: project.TechStack || [],
      }));

      setProjects(projectData);
      localStorage.setItem("projects", JSON.stringify(projectData));
    } catch (error) {
      console.error("Error setting data:", error);
      // fallback: try reading from localStorage
      try {
        const cached = localStorage.getItem("projects");
        if (cached) setProjects(JSON.parse(cached));
      } catch {}
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const displayed = showAll ? projects : projects.slice(0, initialItems);

  return (
    <div className="md:px-[10%] px-[5%] w-full sm:mt-0 mt-[3rem] bg-transparent overflow-hidden" id="Portfolio">
      <div className="text-center pb-10">
        <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300">
          Projects
        </h2>
        <p className="mt-2 text-slate-300 max-w-2xl mx-auto text-base sm:text-lg flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          A curated list of my projects — click any card to view details or open the live link.
          <Sparkles className="w-5 h-5 text-purple-400" />
        </p>
      </div>

     <Box sx={{ width: "100%" }}>
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35 }}
  >
    <div className="container mx-auto flex justify-center items-center overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
        <AnimatePresence>
          {displayed.map((project, index) => (
            <motion.div
              key={project.id ?? index}
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
            >
              <CardProject
                Img={project.Img}
                Title={project.Title}
                Description={project.Description}
                Link={project.Link}
                id={project.id}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>

    {projects.length > initialItems && (
      <div className="mt-6 w-full flex justify-start">
        <ToggleButton onClick={() => setShowAll(prev => !prev)} isShowingMore={showAll} />
      </div>
    )}
  </motion.div>
</Box>

    </div>
  );
}
