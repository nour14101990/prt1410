import React, { useEffect, useState, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, Github, Code2, Star, Layers } from "lucide-react";
import Swal from 'sweetalert2';
import GifPopup from "./GifPopup";
import { motion } from 'framer-motion';
import AnimatedBackground from "./AnimatedBackground";

const HEADER_HEIGHT = 64; // px

const TECH_ICONS = {
  React: "⚛️",
  Tailwind: "🔷",
  Express: "🚂",
  Python: "🐍",
  Javascript: "✨",
  HTML: "🟧",
  CSS: "🎨",
  'ASP.NET Core': "🔧",
  'C#': "#",
  WPF: "🖼️",
  default: "📦",
};

const TechBadge = memo(({ tech }) => (
  <div className="inline-flex items-center gap-2 px-3 py-1 text-sm">
    <span className="text-[14px]">{TECH_ICONS[tech] || TECH_ICONS.default}</span>
    <span className="whitespace-nowrap text-slate-100">{tech}</span>
  </div>
));

const FeatureItem = memo(({ text }) => (
  <li className="flex items-start gap-3 p-1">
    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 mt-2" />
    <p className="text-sm text-slate-200">{text}</p>
  </li>
));

const ProjectDetailsFullscreenV2 = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [relatedProjects, setRelatedProjects] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const stored = JSON.parse(localStorage.getItem('projects') || '[]');
    const found = stored.find(p => String(p.id) === String(id));
    if (!found) return;

    setProject({
      ...found,
      Features: found.Features || [],
      TechStack: found.TechStack || [],
      Github: found.Github || '',
      Year: found.Year || 'N/A',
      KnownAs: found.KnownAs || found.DisplayName || ''
    });

    const others = stored.filter(p => String(p.id) !== String(id));
    const shuffled = others.sort(() => 0.5 - Math.random()).slice(0, 4);
    setRelatedProjects(shuffled);
  }, [id]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') navigate(-1); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);

  if (!project) return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin mx-auto" />
        <h2 className="text-xl text-slate-200">Loading project...</h2>
      </div>
    </div>
  );

  const openGithub = (link) => {
    if (!link || link.toLowerCase() === 'private') {
      Swal.fire({ icon: 'info', title: 'Repository Private', text: 'This project repository is private.', confirmButtonColor: '#818cf8', background: '#0f172a', color: '#fff' });
      return;
    }
    window.open(link, '_blank', 'noopener');
  };

  // image height: big and responsive
  const imageHeight = 'calc(80vh - 96px)';

  return (
    <motion.div className="min-h-screen bg-transparent text-slate-100 overflow-auto relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <AnimatedBackground />

      {/* Fixed header */}
      <header style={{ height: HEADER_HEIGHT }} className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-transparent border-b border-slate-800/20">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between" style={{ height: HEADER_HEIGHT }}>
          <div className="flex items-center gap-3">
            <button aria-label="Back" onClick={() => navigate(-1)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-100/90 hover:opacity-90 transition-opacity">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </button>
            <div className="ml-3 text-sm text-slate-300 hidden sm:inline">Projects / <span className="text-white">{project.Title}</span></div>
          </div>

          <div className="flex items-center gap-3">
            {project.Link && (
              <a href={project.Link} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-md text-sm hover:underline">
                <ExternalLink className="w-4 h-4 inline" /> <span className="ml-1">Demo</span>
              </a>
            )}
            <button
  type="button"
  onClick={() => openGithub(project.Github)}
  title="Open source repository"
  aria-label="Open source repository"
  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-transform focus:outline-none focus:ring-2 focus:ring-indigo-400"
>
  <Github className="w-4 h-4" />
  <span>Source</span>
</button>

          </div>
        </div>
      </header>

      <main className="w-full px-6 pt-[calc(64px+16px)] pb-12 z-30 relative">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* Left: coherent program definition (half width) */}
          <motion.article initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="p-0">
            <header className="mb-6">
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-100 leading-tight">{project.Title}</h1>
              {project.KnownAs && <p className="mt-2 text-slate-300 italic">Also known as: <span className="text-slate-100">{project.KnownAs}</span></p>}

              <div className="mt-6 prose prose-invert max-w-none text-base md:text-lg text-slate-300">
                <p>{project.FullDescription || project.Description}</p>

                {project.Objectives && (
                  <>
                    <h4>Objectives</h4>
                    <p>{project.Objectives}</p>
                  </>
                )}
                {project.Audience && (
                  <>
                    <h4>Target Audience</h4>
                    <p>{project.Audience}</p>
                  </>
                )}
                {project.Notes && (
                  <>
                    <h4>Notes</h4>
                    <p>{project.Notes}</p>
                  </>
                )}

                {project.LongContent && (
                  <div className="mt-6">{project.LongContent}</div>
                )}
              </div>
            </header>

           

            <section className="mb-6">
              <h3 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2"><Layers className="w-4 h-4 text-indigo-300"/> Technologies</h3>
              <div className="flex flex-wrap gap-3 text-slate-100">
                {project.TechStack.length ? project.TechStack.map((t, i) => <TechBadge key={i} tech={t} />) : <p className="text-slate-400">No tech listed.</p>}
              </div>
            </section>

            {relatedProjects.length > 0 && (
              <section className="mt-6">
                <h3 className="text-lg font-semibold text-slate-200 mb-3">Related Projects</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {relatedProjects.map(r => (
                    <article key={r.id} onClick={() => navigate(`/project/${r.id}`)} className="p-3 hover:underline cursor-pointer">
                      <h4 className="font-semibold text-slate-100">{r.Title}</h4>
                      <p className="text-sm text-slate-400 line-clamp-2">{r.Description}</p>
                    </article>
                  ))}
                </div>
              </section>
            )}

           
          </motion.article>

          {/* Right: large image (half width) + keys directly beneath with small space */}
          <motion.aside initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative overflow-visible flex flex-col items-center justify-start">
            <div style={{ height: imageHeight, maxHeight: '80vh', width: '100%' }} className="flex items-center justify-center w-full">
              <div className="w-full h-full flex items-center justify-center">
                {/* Make GifPopup fill container and keep aspect with object-fit */}
                <div className="w-full h-full">
                  <GifPopup gifSrc={project.ImgDesc} usePreviewStyle onThumbLoad={() => {}} style={{ width: '100%', height: '100%' }} />
                </div>
              </div>
            </div>

            {/* small space then keys */}
            <div className="w-full mt-3">
              <h3 className="text-lg font-semibold text-slate-200 mb-2 flex items-center gap-2"><Star className="w-4 h-4 text-purple-300"/> Key Features</h3>
              {project.Features.length ? (
                <ul className="space-y-2">
                  {project.Features.map((f, i) => <FeatureItem key={i} text={f} />)}
                </ul>
              ) : (
                <p className="text-slate-400">No features listed.</p>
              )}
            </div>

          </motion.aside>

        </div>
      </main>

      <style>{` .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; } `}</style>
    </motion.div>
  );
};

export default memo(ProjectDetailsFullscreenV2);
