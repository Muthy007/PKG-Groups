import React, { useRef } from 'react';
import { Box } from '@mui/material';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, Torus, Environment } from '@react-three/drei';

const FloatingRing = ({ position, scale, rotationSpeed }) => {
  const meshRef = useRef(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * rotationSpeed.x;
      meshRef.current.rotation.y += delta * rotationSpeed.y;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={1} floatingRange={[-0.3, 0.3]}>
      <Torus ref={meshRef} args={[1, 0.04, 16, 48]} position={position} scale={scale}>
        <meshStandardMaterial color="#ffcc00" metalness={0.9} roughness={0.15} />
      </Torus>
    </Float>
  );
};

export default function Hero3D() {
  return (
    <Box sx={{ position: 'absolute', inset: 0, zIndex: 2, overflow: 'hidden', pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }} gl={{ antialias: true, alpha: true }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-10, -10, -10]} intensity={0.5} color="#cc9900" />
        
        <Environment preset="city" />
        
        {/* Floating elegant wedding-style rings */}
        <FloatingRing position={[-6, 3, -4]} scale={2} rotationSpeed={{ x: 0.1, y: 0.2 }} />
        <FloatingRing position={[6, -2, -5]} scale={3} rotationSpeed={{ x: 0.15, y: 0.1 }} />
        <FloatingRing position={[-4, -4, -2]} scale={1.2} rotationSpeed={{ x: 0.2, y: 0.15 }} />
        <FloatingRing position={[5, 4, -8]} scale={1.5} rotationSpeed={{ x: 0.05, y: 0.25 }} />
        
        <Sparkles count={100} scale={20} size={5} speed={0.2} opacity={0.3} color="#ffe082" />
      </Canvas>
    </Box>
  );
}
