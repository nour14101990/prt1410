
const TechStackIcon = ({ TechStackIcon, Language }) => {
  return (
    <div className="group p-6 rounded-2xl bg-slate-800/50 backdrop-blur-sm hover:bg-slate-700/50 transition-all duration-300 ease-in-out flex flex-col items-center justify-center gap-3 hover:scale-105 cursor-pointer shadow-lg hover:shadow-green-500/10 border border-slate-700">
      {/* Gradient Overlay */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-teal-400 rounded-full opacity-0 group-hover:opacity-30 blur transition duration-300"></div>
        <img
          src={TechStackIcon}
          alt={`${Language} icon`}
          className="relative h-16 w-16 md:h-20 md:w-20 transform transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* Language Name */}
      <span className="text-slate-300 font-semibold text-sm md:text-base tracking-wide group-hover:text-white transition-colors duration-300">
        {Language}
      </span>
    </div>
  );
};

export default TechStackIcon;