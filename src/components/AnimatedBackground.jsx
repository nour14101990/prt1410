import { useEffect, useRef, useState } from "react";

const AnimatedBackground = () => {
  const blobRefs = useRef([]);
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({ 
    width: window.innerWidth, 
    height: window.innerHeight 
  });

  const initialPositions = [
    { x: -4, y: 0 },
    { x: -4, y: 0 },
    { x: 20, y: -8 },
    { x: 20, y: -8 },
  ];

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Blob animation with smoother scroll interaction
  useEffect(() => {
    let currentScroll = 0;
    let requestId;

    const handleScroll = () => {
      const newScroll = window.pageYOffset;
      const scrollDelta = newScroll - currentScroll;
      currentScroll = newScroll;

      blobRefs.current.forEach((blob, index) => {
        if (!blob) return;
        
        const initialPos = initialPositions[index];
        const xOffset = Math.sin(newScroll / 120 + index * 0.6) * 280;
        const yOffset = Math.cos(newScroll / 120 + index * 0.6) * 50;
        const x = initialPos.x + xOffset;
        const y = initialPos.y + yOffset;

        blob.style.transform = `translate(${x}px, ${y}px)`;
        blob.style.transition = "transform 1.2s ease-out";
      });

      requestId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(requestId);
    };
  }, []);

  // Particle animation with updated colors and improved connections
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    const particles = [];
    const particleCount = 120; // Slightly increased for density
    const colors = [
      'rgba(167, 139, 250, 0.5)', // Indigo-400
      'rgba(192, 132, 252, 0.5)', // Purple-400
      'rgba(245, 243, 255, 0.5)', // Light lavender
      'rgba(129, 140, 248, 0.5)'  // Indigo-500
    ];
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2.5 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
      });
    }
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connecting lines with softer opacity
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) { // Increased connection distance
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 - distance/1500})`;
            ctx.lineWidth = 0.4;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      
      // Draw and update particles
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Bounce off walls with wrap-around for smoother feel
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
      });
    };
    
    animate();
  }, [dimensions]);

  return (
    <div className="fixed inset-0 overflow-hidden -z-20">
      {/* Updated base gradient to purple-indigo theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950"></div>
      
      {/* Animated particles canvas with lower opacity for subtlety */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 opacity-30"
      />
      
      {/* Enhanced Blobs with purple-indigo gradients */}
      <div className="absolute inset-0">
        {/* Blob 1 - Purple-indigo */}
        <div
          ref={(ref) => (blobRefs.current[0] = ref)}
          className="absolute top-0 -left-4 md:w-[520px] md:h-[520px] w-80 h-80 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mix-blend-soft-light filter blur-[130px] opacity-60 animate-pulse"
          style={{ 
            animation: 'pulse 7s infinite ease-in-out',
          }}
        ></div>

        {/* Blob 2 - Indigo-violet */}
        <div
          ref={(ref) => (blobRefs.current[1] = ref)}
          className="absolute top-0 -right-4 md:w-[520px] md:h-[520px] w-80 h-80 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full mix-blend-soft-light filter blur-[130px] opacity-60 hidden sm:block"
          style={{ 
            animation: 'pulse 9s infinite ease-in-out',
            animationDelay: '1.5s'
          }}
        ></div>

        {/* Blob 3 - Purple-lavender */}
        <div
          ref={(ref) => (blobRefs.current[2] = ref)}
          className="absolute -bottom-8 left-[-40%] md:left-20 md:w-[520px] md:h-[520px] w-80 h-80 bg-gradient-to-r from-purple-400 to-lavender-400 rounded-full mix-blend-soft-light filter blur-[130px] opacity-60"
          style={{ 
            animation: 'pulse 11s infinite ease-in-out',
            animationDelay: '2.5s'
          }}
        ></div>

        {/* Blob 4 - Indigo-blue */}
        <div
          ref={(ref) => (blobRefs.current[3] = ref)}
          className="absolute -bottom-10 right-20 md:w-[520px] md:h-[520px] w-80 h-80 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full mix-blend-soft-light filter blur-[130px] opacity-60 hidden sm:block"
          style={{ 
            animation: 'pulse 8s infinite ease-in-out',
            animationDelay: '3.5s'
          }}
        ></div>
      </div>

      {/* Updated Grid Overlay with slower animation and theme color */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#c7d2fe08_1px,transparent_1px),linear-gradient(to_bottom,#c7d2fe08_1px,transparent_1px)] bg-[size:72px_72px] animate-grid-move"
        style={{ 
          animation: 'gridMove 30s linear infinite',
        }}
      ></div>

      {/* Enhanced radial gradient for more depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(199,210,254,0.08)_0%,transparent_75%)]"></div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.04); }
        }
        
        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 72px 72px; }
        }
      `}</style>
    </div>
  );
};

export default AnimatedBackground;