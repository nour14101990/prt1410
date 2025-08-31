import React, { useRef, useEffect, useState } from 'react';

const TriangulatedNetwork = () => {
  const canvasRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const pointsRef = useRef([]);
  const animationRef = useRef(null);

  // Initialize points and animation
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Generate initial points with paths - exactly 50 points
    const generatePoints = () => {
      const points = [];
      const numPoints = 120; // Fixed number of points
      
      for (let i = 0; i < numPoints; i++) {
        // Create a circular or linear path for the point to follow
        const pathType = Math.random() > 0.5 ? 'circular' : 'linear';
        const centerX = Math.random() * canvas.width;
        const centerY = Math.random() * canvas.height;
        const orbitalRadius = 50 + Math.random() * 100;
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.01 + Math.random() * 0.02;
        
        points.push({
          id: i,
          x: centerX + (pathType === 'circular' ? Math.cos(angle) * orbitalRadius : 0),
          y: centerY + (pathType === 'circular' ? Math.sin(angle) * orbitalRadius : 0),
          pathType, // Type of path: 'circular' or 'linear'
          centerX,   // Center X for circular motion
          centerY,   // Center Y for circular motion
          orbitalRadius, // Radius for circular motion
          angle,     // Current angle for circular motion
          speed,     // Speed of movement
          linearDirection: Math.random() * Math.PI * 2, // Direction for linear motion
          linearSpeed: 0.5 + Math.random() * 1, // Speed for linear motion
          pointRadius: Math.random() * 2 + 1, // Visual radius of the point
          originalRadius: Math.random() * 2 + 1, // Base radius without mouse interaction
          connections: [], // Array to store connected points
          pulseOffset: Math.random() * Math.PI * 2, // Offset for pulsing animation
          maxConnections: Math.floor(Math.random() * 3) + 4, // Each point can have 2-4 connections
        });
      }
      
      return points;
    };
    
    // Set canvas size to match window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Regenerate points when window is resized to maintain density
      pointsRef.current = generatePoints();
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    pointsRef.current = generatePoints();
    
    // Function to calculate distance between two points
    const distance = (p1, p2) => {
      return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
    };
    
    // Update point positions along their paths
    const updatePointPositions = () => {
      const points = pointsRef.current;
      
      points.forEach(point => {
        if (point.pathType === 'circular') {
          // Move along circular path
          point.angle += point.speed;
          point.x = point.centerX + Math.cos(point.angle) * point.orbitalRadius;
          point.y = point.centerY + Math.sin(point.angle) * point.orbitalRadius;
        } else {
          // Move along linear path
          point.x += Math.cos(point.linearDirection) * point.linearSpeed;
          point.y += Math.sin(point.linearDirection) * point.linearSpeed;
          
          // Bounce off edges and change direction slightly
          if (point.x < 0 || point.x > canvas.width) {
            point.linearDirection = Math.PI - point.linearDirection;
            point.x = Math.max(0, Math.min(canvas.width, point.x));
          }
          if (point.y < 0 || point.y > canvas.height) {
            point.linearDirection = -point.linearDirection;
            point.y = Math.max(0, Math.min(canvas.height, point.y));
          }
          
          // Occasionally change direction slightly for more organic movement
          if (Math.random() < 0.01) {
            point.linearDirection += (Math.random() - 0.5) * 0.3;
          }
        }
      });
    };
    
    // Update connections between points
    const updateConnections = () => {
      const points = pointsRef.current;
      
      // Reset connections
      points.forEach(point => {
        point.connections = [];
      });
      
      // Find potential connections for each point
      points.forEach(point => {
        const potentialConnections = [];
        
        // Find all points within connection range
        points.forEach(other => {
          if (point.id !== other.id) {
            const dist = distance(point, other);
            if (dist < 150) { // Connection range
              potentialConnections.push({
                point: other,
                distance: dist
              });
            }
          }
        });
        
        // Sort by distance (closest first)
        potentialConnections.sort((a, b) => a.distance - b.distance);
        
        // Connect to the closest points, up to the maximum allowed
        for (let i = 0; i < Math.min(point.maxConnections, potentialConnections.length); i++) {
          const other = potentialConnections[i].point;
          
          // Only create connection if the other point hasn't reached its max connections
          if (other.connections.length < other.maxConnections) {
            point.connections.push(other);
            other.connections.push(point); // Make it bidirectional
          }
        }
      });
    };
    
    // Draw everything
    const draw = (ctx) => {
      const points = pointsRef.current;
      
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections
      const time = Date.now() / 1000; // Current time for animations
      
      // First draw all connections
      points.forEach(point => {
        point.connections.forEach(connectedPoint => {
          // Only draw each connection once
          if (point.id < connectedPoint.id) {
            const dist = distance(point, connectedPoint);
            const strength = 1 - (dist / 120); // Strength based on distance
            
            // Calculate center point for mouse interaction
            const centerX = (point.x + connectedPoint.x) / 2;
            const centerY = (point.y + connectedPoint.y) / 2;
            
            // Calculate distance to mouse for interaction
            const distToMouse = Math.sqrt(
              (centerX - mousePosition.x) ** 2 + 
              (centerY - mousePosition.y) ** 2
            );
            
            // Draw the connection line
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(connectedPoint.x, connectedPoint.y);
            
            // Pulsing effect for connections
            const pulse = Math.sin(time * 3) * 0.1 + 0.9;
            
            // Set connection color based on mouse proximity
            if (distToMouse < 100) {
              const intensity = (100 - distToMouse) / 100;
              ctx.strokeStyle = `rgba(70, 130, 230, ${0.8 * strength * pulse * intensity})`;
            } else {
              ctx.strokeStyle = `rgba(70, 130, 230, ${0.6 * strength * pulse})`;
            }
            
            ctx.lineWidth = 1.5 * strength;
            ctx.stroke();
          }
        });
      });
      
      // Draw points
      points.forEach(point => {
        // Pulsing effect for points
        const pulse = Math.sin(time * 2 + point.pulseOffset) * 0.2 + 0.8;
        
        // Mouse influence on point appearance
        const dx = point.x - mousePosition.x;
        const dy = point.y - mousePosition.y;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        
        // Adjust point size based on mouse proximity
        if (distToMouse < 100) {
          const intensity = (100 - distToMouse) / 100;
          point.pointRadius = point.originalRadius + intensity * 2;
        } else {
          point.pointRadius = point.originalRadius;
        }
        
        // Draw point
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.pointRadius * pulse, 0, Math.PI * 2);
        ctx.fillStyle = distToMouse < 100 ? 
          `rgba(100, 150, 255, ${0.9 * pulse})` : 
          `rgba(70, 130, 230, ${0.8 * pulse})`;
        ctx.fill();
      });
    };
    
    // Animation loop
    const animate = () => {
      updatePointPositions();
      updateConnections();
      draw(ctx);
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Clean up function
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [mousePosition]);
  
  // Track mouse movement
  const handleMouseMove = (e) => {
    setMousePosition({
      x: e.clientX,
      y: e.clientY
    });
  };
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #0a1929, #1a2b4d)'
    }} onMouseMove={handleMouseMove}>
      <canvas 
        ref={canvasRef} 
        style={{
          width: '100%',
          height: '100%'
        }} 
      />
    </div>
  );
};

// Demo component to show the background with some content
const DemoPage = () => {
  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
      <TriangulatedNetwork />
      <div style={{
        position: 'relative',
        zIndex: 1,
        color: 'white',
        textAlign: 'center',
        padding: '2rem',
        fontFamily: 'Arial, sans-serif'
      }}>
       
        
        
      </div>
    </div>
  );
};

export default DemoPage;