import React, { useRef, useEffect, useState } from 'react';

const TriangulatedNetwork = () => {
  const canvasRef = useRef(null);
  const pointsRef = useRef([]);
  const connectionsRef = useRef(new Map());
  const animationRef = useRef(null);
  const [mouse, setMouse] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Function to generate points all with random motion paths
    // Each point has properties for position, movement, color, pulsing phase, and max connections
    const generatePoints = (num = 100) => {
      pointsRef.current = [];
      for (let i = 0; i < num; i++) {
        const phase = Math.random() * 2 * Math.PI; // Random phase for pulsing
        const color = `hsl(${200 + Math.random() * 40}, 80%, ${40 + Math.random() * 20}%)`; // Subtle blue variations
        const maxConn = Math.floor(Math.random() * 3) + 6; // 2-4 max connections per point
        const x = Math.random() * width;
        const y = Math.random() * height;
        const direction = Math.random() * 2 * Math.PI;
        const speed = Math.random() * 0.7 + 0.7; // Faster linear speed
        const vx = speed * Math.cos(direction);
        const vy = speed * Math.sin(direction);
        const point = { vx, vy, phase, color, maxConn, x, y };
        pointsRef.current.push(point);
      }
    };

    generatePoints();

    // Function to update positions of all points
    // All points follow random motion paths with bouncing off edges
    // Add circular mouse repulsion: points are pushed away radially from the mouse if within range
    const updatePositions = () => {
      pointsRef.current.forEach((p) => {
        // Add random turn for random motion path
        const turn = (Math.random() - 0.5) * 0.1; // Small random turn in radians
        const angle = Math.atan2(p.vy, p.vx) + turn;
        const speed = Math.sqrt(p.vx ** 2 + p.vy ** 2);
        p.vx = speed * Math.cos(angle);
        p.vy = speed * Math.sin(angle);

        p.x += p.vx;
        p.y += p.vy;
        // Bounce off canvas edges
        if (p.x < 0 || p.x > width) p.vx = -p.vx;
        if (p.y < 0 || p.y > height) p.vy = -p.vy;
      });

      // Apply mouse repulsion after normal position updates
      const repulsionRadius = 200;
      const maxPush = 2; // Slow push for graceful movement
      pointsRef.current.forEach((p) => {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < repulsionRadius && dist > 0) {
          const push = (repulsionRadius - dist) / repulsionRadius * maxPush;
          const dirX = dx / dist;
          const dirY = dy / dist;
          p.x += dirX * push;
          p.y += dirY * push;
        }
      });
    };

    // Helper function to calculate distance between two points
    const getDistance = (p1, p2) => Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

    // Function to draw the background, connections, and points
    // Connections are managed with smooth fading in/out using lerp on opacity
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw dark blue gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#0a1929');
      gradient.addColorStop(1, '#1a2b4d');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      const time = Date.now() / 1000; // Time for pulsing effects
      const maxDist = 100;
      const fadeSpeed = 0.03; // Gradual opacity change (0.02-0.05)
      const mouseRange = 100;

      // Update connections: find potential connections based on nearest neighbors
      const potential = new Map();
      pointsRef.current.forEach((p1, i) => {
        let neighbors = [];
        pointsRef.current.forEach((p2, j) => {
          if (i === j) return;
          const dist = getDistance(p1, p2);
          if (dist < maxDist) {
            neighbors.push({ j, dist });
          }
        });
        neighbors.sort((a, b) => a.dist - b.dist);
        neighbors = neighbors.slice(0, p1.maxConn);
        neighbors.forEach((n) => {
          const minIdx = Math.min(i, n.j);
          const maxIdx = Math.max(i, n.j);
          const key = `${minIdx}-${maxIdx}`;
          const targetOp = (maxDist - n.dist) / maxDist * 0.5;
          // Use the maximum target if selected by both sides (though rare)
          const existingTarget = potential.get(key) || 0;
          potential.set(key, Math.max(targetOp, existingTarget));
        });
      });

      // Update existing connections' targets
      const connections = connectionsRef.current;
      for (let [key, conn] of connections) {
        conn.target = potential.has(key) ? potential.get(key) : 0;
      }

      // Add new connections
      for (let [key, target] of potential) {
        if (!connections.has(key)) {
          connections.set(key, { opacity: 0, target });
        }
      }

      // Update opacities with lerp and remove fully faded
      for (let [key, conn] of [...connections.entries()]) {
        conn.opacity += (conn.target - conn.opacity) * fadeSpeed;
        if (conn.opacity < 0.01 && conn.target === 0) {
          connections.delete(key);
        }
      }

      // Draw connections
      for (let [key, conn] of connections) {
        if (conn.opacity <= 0) continue;
        const [minIdx, maxIdx] = key.split('-').map(Number);
        const p1 = pointsRef.current[minIdx];
        const p2 = pointsRef.current[maxIdx];
        // Base opacity from connection
        let opacity = conn.opacity;
        // Add subtle pulsing
        const pulsePhase = (p1.phase + p2.phase) / 2;
        opacity *= (0.8 + 0.2 * Math.sin(time * 0.5 + pulsePhase)); // Slow pulse
        // Increase opacity if mouse is nearby either point
        const distToMouse1 = getDistance(p1, mouse);
        const distToMouse2 = getDistance(p2, mouse);
        if (distToMouse1 < mouseRange || distToMouse2 < mouseRange) {
          const boost = Math.max(
            distToMouse1 < mouseRange ? (mouseRange - distToMouse1) / mouseRange : 0,
            distToMouse2 < mouseRange ? (mouseRange - distToMouse2) / mouseRange : 0
          );
          opacity += boost * 0.3;
          opacity = Math.min(1, opacity);
        }
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw points
      pointsRef.current.forEach((p) => {
        let radius = 2;
        // Add subtle pulsing
        radius += 0.5 * Math.sin(time * 0.5 + p.phase);
        // Grow slightly if mouse is nearby
        const distToMouse = getDistance(p, mouse);
        if (distToMouse < mouseRange) {
          radius += 2 * (1 - distToMouse / mouseRange);
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = p.color;
        ctx.fill();
      });
    };

    // Animation loop using requestAnimationFrame
    const animate = () => {
      updatePositions();
      draw();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize: update dimensions
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    // Handle mouse movement for interactivity
    const handleMouseMove = (e) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup: remove event listeners and stop animation
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Render the canvas (assume it's styled to cover the background via CSS)
  return <canvas ref={canvasRef} style={{ display: 'block' }} />;
};

export default TriangulatedNetwork;