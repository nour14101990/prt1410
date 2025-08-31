import React, { useRef, useEffect } from 'react';
import useMouse from "@react-hook/mouse-position"





// --- Triangulated Network Component Logic ---
const TriangulatedNetwork = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // --- Configuration ---
    const MOUSE_RADIUS = 150; 
    const POINT_COUNT = 100;   
    const MAX_DISTANCE = 120; 

    let points = [];
    let mouse = {
      x: null,
      y: null,
      radius: MOUSE_RADIUS
    };

    // --- Utility Functions ---
    const getDistance = (x1, y1, x2, y2) => {
      const dx = x1 - x2;
      const dy = y1 - y2;
      return Math.sqrt(dx * dx + dy * dy);
    };
    
    // --- Point Class ---
    class Point {
      constructor(x, y, vx, vy, radius = 2) {
        this.x = x;
        this.y = y;
        this.vx = vx; // velocity x
        this.vy = vy; // velocity y
        this.radius = radius;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      }

      update() {
        // Bounce off edges
        if (this.x > canvas.width || this.x < 0) this.vx = -this.vx;
        if (this.y > canvas.height || this.y < 0) this.vy = -this.vy;

        // Apply velocity
        this.x += this.vx;
        this.y += this.vy;

        // --- 👇 THIS IS THE MODIFIED BLOCK ---
        // Strong Mouse Repulsion Logic (Hard Wall Effect)
        const distanceToMouse = getDistance(this.x, this.y, mouse.x, mouse.y);
        
        if (distanceToMouse < mouse.radius) {
          // Calculate angle from mouse to point
          const angle = Math.atan2(this.y - mouse.y, this.x - mouse.x);
          
          // Immediately move the point to the edge of the exclusion zone
          this.x = mouse.x + Math.cos(angle) * mouse.radius;
          this.y = mouse.y + Math.sin(angle) * mouse.radius;
          
          // Give it a velocity boost outwards
          this.vx = Math.cos(angle) * 2;
          this.vy = Math.sin(angle) * 2;
        }
        // --- END OF MODIFIED BLOCK ---
      }
    }

    // --- Initialization ---
    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      mouse = { x: canvas.width / 2, y: canvas.height / 2, radius: MOUSE_RADIUS };
      points = [];
      for (let i = 0; i < POINT_COUNT; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let vx = (Math.random() - 0.5) * 1; 
        let vy = (Math.random() - 0.5) * 1;
        points.push(new Point(x, y, vx, vy));
      }
    };

    // --- Animation Loop ---
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      points.forEach(point => {
        point.update();
        point.draw();
      });

      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dist = getDistance(points[i].x, points[i].y, points[j].x, points[j].y);
          if (dist < MAX_DISTANCE) {
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${1 - dist / MAX_DISTANCE})`;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    };

    // --- Event Listeners ---
    const handleMouseMove = (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };
    
    const handleResize = () => {
        init();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    
    init();
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []); 

  return <canvas ref={canvasRef} />;
};



export default TriangulatedNetwork;