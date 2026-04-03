import React, { useRef, useMemo, useEffect } from 'react';
import { Box } from '@mui/material';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleSystem = () => {
  const pointsRef = useRef();
  
  // Custom scroll tracking to only move on scroll
  const scrollData = useRef({ current: 0, target: 0 });

  const particlesCount = 5000;
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    
    const colorTheme = [
      new THREE.Color('#ffcc00'), // Gold
      new THREE.Color('#ffffff'), // White
      new THREE.Color('#ffca28'), // Light Gold
      new THREE.Color('#40e0d0'), // Turquoise
      new THREE.Color('#dda0dd'), // Plum / light pink
    ];

    for (let i = 0; i < particlesCount; i++) {
      // Create an immersive galaxy arch / tunnel
      const radius = 2 + Math.random() * 25;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 40;
      
      const pushOut = Math.abs(height) * 0.2;
      const x = Math.cos(angle) * (radius + pushOut);
      const z = Math.sin(angle) * (radius + pushOut);
      const y = height;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const randomColor = colorTheme[Math.floor(Math.random() * colorTheme.length)];
      colors[i * 3] = randomColor.r;
      colors[i * 3 + 1] = randomColor.g;
      colors[i * 3 + 2] = randomColor.b;
    }
    
    return [positions, colors];
  }, []);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      // Update target based on raw scroll position
      scrollData.current.target = window.scrollY;
      
      // Interpolate current scroll for maximum smoothness
      scrollData.current.current = THREE.MathUtils.lerp(
        scrollData.current.current,
        scrollData.current.target,
        delta * 6
      );
      
      // Calculate rotation/translation EXCLUSIVELY based on the scroll position
      // Notice: we do NOT add state.clock.getElapsedTime(). 
      // This means if scroll is stationary, the animation absolutely STOPS.
      pointsRef.current.rotation.y = scrollData.current.current * 0.001;
      pointsRef.current.rotation.x = scrollData.current.current * 0.0002;
      pointsRef.current.position.y = scrollData.current.current * 0.008;
      
      // Gentle depth parallax
      pointsRef.current.position.z = Math.sin(scrollData.current.current * 0.002) * 2;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={particlesCount} 
          array={positions} 
          itemSize={3} 
        />
        <bufferAttribute 
          attach="attributes-color" 
          count={particlesCount} 
          array={colors} 
          itemSize={3} 
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.06} 
        vertexColors 
        transparent 
        opacity={0.8} 
        sizeAttenuation 
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export default function ThreeBackground() {
  return (
    <Box sx={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }} gl={{ antialias: false, alpha: true }} dpr={[1, 1.5]}>
        <ParticleSystem />
      </Canvas>
    </Box>
  );
}
