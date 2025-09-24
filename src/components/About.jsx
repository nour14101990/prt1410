import React, { memo, useMemo } from "react"
import { FileText, Code, Award, Globe, ArrowUpRight, Sparkles, Briefcase, GraduationCap, Star } from "lucide-react"
import { motion } from 'framer-motion'
// Memoized Components

const Header = memo(() => (
  <motion.div 
    className="text-center lg:mb-8 mb-2 px-[5%]"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: false }}
  >
    {/* Title */}
    <div className="inline-block relative group">
      <h2
        className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300"
      >
        About Me
      </h2>
    </div>

    {/* Description */}
    <p
      className="mt-2 text-slate-300 max-w-2xl mx-auto text-sm sm:text-base flex items-center justify-center gap-2"
    >
      <Sparkles className="w-5 h-5 text-purple-300" />
      Transforming Concepts into Robust Desktop Applications
      <Sparkles className="w-5 h-5 text-purple-300" />
    </p>
  </motion.div>
));

const StatCard = memo(({ icon: Icon, value, label, description }) => (
  <motion.div 
    className="relative group"
    whileHover={{ scale: 1.05 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <div className="relative z-10 bg-slate-900/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 overflow-hidden transition-all duration-300 hover:border-purple-500/50 h-full flex flex-col justify-between">
      {/* Subtle gradient background */}
      <div className={`absolute -z-10 inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-300`}></div>
      <div className="flex items-center justify-between mb-4">
        <div className="w-14 h-14 rounded-full flex items-center justify-center bg-slate-800/50 transition-transform group-hover:rotate-6 border border-slate-700/50">
          <Icon className="w-6 h-6 text-slate-200" />
        </div>
        <span className="text-3xl font-bold text-slate-200">
          {value}
        </span>
      </div>

      <div>
        <p className="text-xs uppercase tracking-wider text-slate-400 mb-2">
          {label}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-400">
            {description}
          </p>
          <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-200 transition-colors" />
        </div>
      </div>
    </div>
  </motion.div>
));

const SkillPill = memo(({ skill }) => (
  <motion.div 
    whileHover={{ y: -3 }}
    className="px-4 py-2 rounded-full bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 text-sm text-slate-200 hover:bg-slate-800/50 transition-all duration-300"
  >
    {skill}
  </motion.div>
));

const TimelineItem = memo(({ year, title, description, icon: Icon }) => (
  <motion.div 
    className="relative pl-8 pb-8 border-l-2 border-purple-500/30 last:pb-0"
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: false }}
  >
    <div className="absolute left-[-10px] top-0 w-5 h-5 rounded-full bg-purple-500/50 border-2 border-purple-500 flex items-center justify-center">
      <Icon className="w-3 h-3 text-purple-300" />
    </div>
    <p className="text-sm text-slate-400 mb-1">{year}</p>
    <h4 className="text-lg font-semibold text-slate-200 mb-2">{title}</h4>
    <p className="text-sm text-slate-300">{description}</p>
  </motion.div>
));

const AboutPage = () => {
  // Memoized calculations
  const { totalProjects, totalCertificates, YearExperience } = useMemo(() => {
    const startDate = new Date("2022-01-01");
    const today = new Date();
    const experience = today.getFullYear() - startDate.getFullYear() -
      (today < new Date(today.getFullYear(), startDate.getMonth(), startDate.getDate()) ? 1 : 0);

    return {
      totalProjects: 4,
      totalCertificates: 1,
      YearExperience: experience
    };
  }, []);

  // Sample data for new sections
  const skills = useMemo(() => [
    "ASP.NET Core", "C#", "WPF", "AvaloniaUI", "REST APIs", "Electron", "Blazor", "SQL", "Git", "Agile Methodology"
  ], []);

  const timeline = useMemo(() => [
    {
      year: "2022",
      title: "Started Career",
      description: "Began journey as a Desktop Application Developer, focusing on .NET technologies.",
      icon: Briefcase
    },
    {
      year: "2022",
      title: "First Major Project",
      description: "Hospital Patient & Prescription Management (EPSP) Released.",
      icon: Code
    },
    
    {
      year: "2024",
      title: "Certification Achieved",
      description: "Master en Informatique: Systèmes d'informations et décision.",
      icon: GraduationCap
    },
    {
      year: "2025",
      title: "Current Focus",
      description: "Specializing in modern UI frameworks and API integrations for enterprise solutions.",
      icon: Star
    }
  ], []);
  

  return (
    <div
      className="h-auto pb-[10%] text-white overflow-hidden px-[5%] sm:px-[5%] lg:px-[10%] mt-10 sm-mt-0" 
      id="About"
    >
      {/* Header */}
      <Header />

      <div className="w-full mx-auto pt-8 sm:pt-12 relative">
        <div className="flex flex-col gap-10 items-center">
          {/* Text Content - Centered without image */}
          <div className="space-y-6 text-center max-w-3xl mx-auto">
            <motion.h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: false }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300">
                Hello, I'm
              </span>
              <span className="block mt-2 text-slate-200">
                Zakhrouf Noureddine
              </span>
            </motion.h2>

            <motion.p
              className="text-base sm:text-lg lg:text-xl text-slate-300 leading-relaxed text-justify pb-4 sm:pb-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: false }}
            >
              A passionate Desktop Application developer specializing in creating scalable, user-friendly software using .NET technologies. 
              With a focus on cross-platform development and API integrations, I transform complex requirements into elegant solutions that enhance business productivity.
            </motion.p>

            {/* Buttons with updated theme */}
            <div className="flex flex-col lg:flex-row items-center gap-4 w-full justify-center">
              <a href="https://1drv.ms/b/c/d3d21e180cddc5fb/EaDDYcBk3EpIi17LqV5hfwQBWq0tKya7xs3OemedlTO1tA?e=PBI7QL" className="w-full lg:w-auto">
                <motion.button
                  className="w-full lg:w-auto sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-slate-200 font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5" /> Download CV
                </motion.button>
              </a>
              <a href="#Portfolio" className="w-full lg:w-auto">
                <motion.button
                  className="w-full lg:w-auto sm:px-6 py-2 sm:py-3 rounded-full border border-slate-700/50 text-slate-200 font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 bg-slate-900/50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Code className="w-4 h-4 sm:w-5 sm:h-5 text-slate-200" /> View Projects
                </motion.button>
              </a>
            </div>
          </div>
        </div>

        {/* Expanded Stats Section */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, staggerChildren: 0.2 }}
          viewport={{ once: false }}
        >
          <StatCard 
            icon={Code} 
            value={totalProjects} 
            label="Total Projects" 
            description="Innovative desktop solutions delivered" 
          />
          <StatCard 
            icon={Award} 
            value={totalCertificates} 
            label="Certificates" 
            description="Validated expertise in .NET technologies" 
          />
          <StatCard 
            icon={Globe} 
            value={YearExperience} 
            label="Years Experience" 
            description="Building reliable software" 
          />
        </motion.div>

        {/* New Skills Section */}
        <motion.section 
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false }}
        >
          <h3 className="text-2xl font-bold text-slate-200 mb-6 flex items-center gap-2 justify-center">
            <Star className="w-6 h-6 text-purple-400" />
            Core Skills
          </h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {skills.map((skill, index) => (
              <SkillPill key={index} skill={skill} />
            ))}
          </div>
        </motion.section>

        {/* New Timeline Section */}
        <motion.section 
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, staggerChildren: 0.2 }}
          viewport={{ once: false }}
        >
          <h3 className="text-2xl font-bold text-slate-200 mb-6 flex items-center gap-2 justify-center">
            <Briefcase className="w-6 h-6 text-indigo-400" />
            Professional Journey
          </h3>
          <div className="space-y-4 max-w-2xl mx-auto">
            {timeline.map((item, index) => (
              <TimelineItem key={index} {...item} />
            ))}
          </div>
        </motion.section>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse-slow {
          animation: pulse 3s infinite;
        }
      `}</style>
    </div>
  );
};

export default memo(AboutPage);