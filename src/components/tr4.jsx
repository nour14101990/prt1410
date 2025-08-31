import React, { useRef, useEffect } from 'react';

const TriangulatedNetwork = () => {
  const canvasRef = useRef(null);
  const pointsRef = useRef([]);
  const mousePosRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef(null);

  // Initialize points and animation
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initPoints();
    };
    
    // Initialize points with only linear movement
    const initPoints = () => {
      const points = [];
      const numPoints = 120;
      
      for (let i = 0; i < numPoints; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        
        points.push({
          id: i,
          x,
          y,
          // Linear movement only
          direction: Math.random() * Math.PI * 2,
          speed: 0.5 + Math.random() * 1.5,
          pointRadius: Math.random() * 2 + 1,
          originalRadius: Math.random() * 2 + 1,
          connections: [],
          pulseOffset: Math.random() * Math.PI * 2,
          maxConnections: Math.floor(Math.random() * 3) + 4,
        });
      }
      
      pointsRef.current = points;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Function to calculate distance between two points
    const distance = (p1, p2) => {
      return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
    };
    
    // Update point positions with mouse exclusion field
    const updatePointPositions = () => {
      const points = pointsRef.current;
      const mousePos = mousePosRef.current;
      
      points.forEach(point => {
        // Calculate normal movement
        let targetX = point.x + Math.cos(point.direction) * point.speed;
        let targetY = point.y + Math.sin(point.direction) * point.speed;
        
        // Bounce off edges
        if (targetX < 0 || targetX > canvas.width) {
          point.direction = Math.PI - point.direction;
          targetX = Math.max(0, Math.min(canvas.width, targetX));
        }
        if (targetY < 0 || targetY > canvas.height) {
          point.direction = -point.direction;
          targetY = Math.max(0, Math.min(canvas.height, targetY));
        }
        
        // Occasionally change direction slightly for organic movement
        if (Math.random() < 0.01) {
          point.direction += (Math.random() - 0.5) * 0.3;
        }
        
        // Apply mouse exclusion field effect
        const dx = targetX - mousePos.x;
        const dy = targetY - mousePos.y;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        const exclusionRadius = 80;
        
        if (distToMouse < exclusionRadius) {
          // Calculate direction away from mouse
          const angle = Math.atan2(dy, dx);
          
          // Push point away from mouse with stronger force when closer
          const force = (exclusionRadius - distToMouse) / exclusionRadius;
          targetX += Math.cos(angle) * force * 15;
          targetY += Math.sin(angle) * force * 15;
          
          // Also adjust direction to move away from mouse
          point.direction = angle + (Math.random() - 0.5) * 0.5;
        }
        
        // Update point position
        point.x = targetX;
        point.y = targetY;
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
            if (dist < 150) {
              potentialConnections.push({
                point: other,
                distance: dist
              });
            }
          }
        });
        
        // Sort by distance (closest first)
        potentialConnections.sort((a, b) => a.distance - b.distance);
        
        // Connect to the closest points
        for (let i = 0; i < Math.min(point.maxConnections, potentialConnections.length); i++) {
          const other = potentialConnections[i].point;
          
          if (other.connections.length < other.maxConnections) {
            point.connections.push(other);
            other.connections.push(point);
          }
        }
      });
    };
    
    // Draw everything
    const draw = () => {
      const points = pointsRef.current;
      const mousePos = mousePosRef.current;
      
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw the mouse exclusion field
      ctx.beginPath();
      ctx.arc(mousePos.x, mousePos.y, 80, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(30, 60, 120, 0.1)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(100, 150, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw connections
      const time = Date.now() / 1000;
      
      points.forEach(point => {
        point.connections.forEach(connectedPoint => {
          if (point.id < connectedPoint.id) {
            const dist = distance(point, connectedPoint);
            const strength = 1 - (dist / 120);
            
            const centerX = (point.x + connectedPoint.x) / 2;
            const centerY = (point.y + connectedPoint.y) / 2;
            
            const distToMouse = Math.sqrt(
              (centerX - mousePos.x) ** 2 + 
              (centerY - mousePos.y) ** 2
            );
            
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(connectedPoint.x, connectedPoint.y);
            
            const pulse = Math.sin(time * 3) * 0.1 + 0.9;
            
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
        const pulse = Math.sin(time * 2 + point.pulseOffset) * 0.2 + 0.8;
        
        const dx = point.x - mousePos.x;
        const dy = point.y - mousePos.y;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        
        if (distToMouse < 100) {
          const intensity = (100 - distToMouse) / 100;
          point.pointRadius = point.originalRadius + intensity * 2;
        } else {
          point.pointRadius = point.originalRadius;
        }
        
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
      draw();
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Clean up function
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);
  
  // Track mouse movement
  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    mousePosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };
  
  // Track mouse leaving
  const handleMouseLeave = () => {
    mousePosRef.current = { x: -1000, y: -1000 };
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
    }}>
      <canvas 
        ref={canvasRef} 
        style={{
          width: '100%',
          height: '100%'
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
    </div>
  );
};

// Demo component
const DemoPage = () => {
  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
      <TriangulatedNetwork />
      
    </div>
  );
};

export default DemoPage;