import React, { useRef, useMemo } from 'react';
import { Box } from '@mui/material';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Center } from '@react-three/drei';
import * as THREE from 'three';

// Procedural 3D Flower Component
const Flower = ({ position, rotation, scale = 1, color1 = "#ffffff", color2 = "#ffd700", centerColor = "#ffcc00", spinSpeed, initialAngle, initialU }) => {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      // Unconditionally face the exact world camera to cancel out any parent object rotations
      const localCamPos = groupRef.current.parent.worldToLocal(state.camera.position.clone());
      groupRef.current.lookAt(localCamPos);

      if (rotation) {
        groupRef.current.rotateX(rotation[0]);
        groupRef.current.rotateY(rotation[1]);
        groupRef.current.rotateZ(rotation[2]);
      }

      if (spinSpeed !== undefined && spinSpeed !== 0) {
        // Continuous organic flow animation
        groupRef.current.rotateZ(state.clock.elapsedTime * spinSpeed + (initialAngle || 0));
        groupRef.current.rotateX(-0.2 + Math.sin(state.clock.elapsedTime * 1.5 + (initialU || 0)) * 0.1);
        groupRef.current.rotateY(0.1 + Math.cos(state.clock.elapsedTime * 1.2 + (initialAngle || 0)) * 0.1);
      } else {
        // Subtle ambient floating animation for static elements
        groupRef.current.rotateZ(state.clock.elapsedTime * 0.1);
        groupRef.current.rotateX(Math.sin(state.clock.elapsedTime * 0.5 + (position ? position[0] : 0)) * 0.1);
      }
    }
  });

  return (
    <group position={position} scale={scale} ref={groupRef}>
      {/* Center of the flower */}
      <mesh position={[0, 0, 0.15]}>
        <sphereGeometry args={[0.2, 32, 16]} />
        <meshStandardMaterial color={centerColor} roughness={0.7} metalness={0.2} emissive={centerColor} emissiveIntensity={0.2} />
      </mesh>
      
      {/* Outer Petals */}
      {Array.from({ length: 5 }).map((_, i) => {
        const angle = (i / 5) * Math.PI * 2;
        return (
          <group key={`outer-${i}`} rotation={[0, 0, angle]}>
            <mesh position={[0, 0.5, 0]} scale={[0.6, 1.4, 0.1]} rotation={[0.3, 0, 0]}>
              <sphereGeometry args={[0.4, 32, 16]} />
              <meshStandardMaterial color={color1} roughness={0.3} metalness={0.2} />
            </mesh>
          </group>
        );
      })}

      {/* Inner Petals */}
      {Array.from({ length: 5 }).map((_, i) => {
        const angle = (i / 5) * Math.PI * 2 + (Math.PI / 5);
        return (
          <group key={`inner-${i}`} rotation={[0, 0, angle]}>
            <mesh position={[0, 0.35, 0.05]} scale={[0.5, 1.0, 0.1]} rotation={[0.4, 0, 0]}>
              <sphereGeometry args={[0.4, 32, 16]} />
              <meshStandardMaterial color={color2} roughness={0.2} metalness={0.1} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

// Procedural Leaf Component
const Leaf = ({ position, rotation, scale = 1, spinSpeed, initialAngle, initialU }) => {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      // Unconditionally face the exact world camera
      const localCamPos = groupRef.current.parent.worldToLocal(state.camera.position.clone());
      groupRef.current.lookAt(localCamPos);

      if (rotation) {
        groupRef.current.rotateX(rotation[0]);
        groupRef.current.rotateY(rotation[1]);
        groupRef.current.rotateZ(rotation[2]);
      }

      if (spinSpeed !== undefined && spinSpeed !== 0) {
        groupRef.current.rotateZ(Math.sin(state.clock.elapsedTime * spinSpeed) * 0.5 + (initialAngle || 0));
        groupRef.current.rotateX(-0.1 + Math.sin(state.clock.elapsedTime * 1.5 + (initialU || 0)) * 0.2);
        groupRef.current.rotateY(0.1 + Math.cos(state.clock.elapsedTime * 1.2 + (initialAngle || 0)) * 0.2);
      }
    }
  });

  return (
    <group position={position} scale={scale} ref={groupRef}>
      <mesh position={[0, 0.5, 0]} scale={[0.5, 1.5, 0.05]} rotation={[0.2, 0, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#388e3c" roughness={0.4} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.3, 0.02]} scale={[0.4, 1.2, 0.05]} rotation={[0.4, 0.2, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#2e7d32" roughness={0.5} metalness={0.1} />
      </mesh>
    </group>
  );
};

// Flowing Element (Flower or Leaf) that moves along the rope and weaves in front of it
const FlowingElement = ({ curve, isFlower, palette, initialU, speedU, initialAngle, speedAngle, scale, orbitRadius, spinSpeed }) => {
  const ref = useRef();
  const stateU = useRef(initialU);
  const stateAngle = useRef(initialAngle);

  useFrame((state, delta) => {
    if (!ref.current) return;
    
    // Flow along the curve continuously
    stateU.current += delta * speedU;
    if (stateU.current >= 1) stateU.current -= 1;
    if (stateU.current < 0) stateU.current += 1;
    
    // Angle for weaving left and right
    stateAngle.current += delta * speedAngle;

    const u = THREE.MathUtils.clamp(stateU.current, 0.001, 0.999);
    
    const pt = curve.getPoint(u);
    const tangent = curve.getTangent(u).normalize();
    
    // Reverse the global twist of the scene so camera coordinate tracking is flawless
    const inverseSceneRotY = -ref.current.parent.rotation.y;
    const cameraVector = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), inverseSceneRotY);

    // screenX points perfectly left/right horizontally relative to the curve
    let screenX = new THREE.Vector3().crossVectors(cameraVector, tangent).normalize();
    if (screenX.lengthSq() < 0.001) screenX.set(1, 0, 0);

    // screenZ points directly towards the camera relative to the curve
    const screenZ = new THREE.Vector3().crossVectors(tangent, screenX).normalize();
    
    // Weave side-to-side in X
    const weaveOffset = Math.sin(stateAngle.current) * orbitRadius;
    
    // Calculate a safe depth so it NEVER goes behind the rope
    const baseDepth = 2.0 + (orbitRadius * 0.3);
    const depthOffset = baseDepth + Math.cos(stateAngle.current) * (orbitRadius * 0.5);
    
    const offset = new THREE.Vector3()
      .addScaledVector(screenX, weaveOffset)
      .addScaledVector(screenZ, depthOffset);
      
    ref.current.position.copy(pt).add(offset);
  });

  return (
    <group ref={ref}>
      {isFlower ? (
        <Flower spinSpeed={spinSpeed} initialAngle={initialAngle} initialU={initialU} scale={scale * 1.2} color1={palette.c1} color2={palette.c2} centerColor={palette.center} />
      ) : (
        <Leaf spinSpeed={spinSpeed} initialAngle={initialAngle} initialU={initialU} scale={scale * 1.5} />
      )}
    </group>
  );
};

// Manager component that renders all flowing flowers and leaves
const FlowingDecorations = ({ curve, count = 250 }) => {
  const items = useMemo(() => {
    const list = [];
    const colorPalettes = [
      { c1: "#ffffff", c2: "#fdfdfd", center: "#ffcc00" }, // White
      { c1: "#ffb6c1", c2: "#ffc0cb", center: "#ffeb3b" }, // Pink
      { c1: "#ffd700", c2: "#ffea00", center: "#ff8f00" }, // Gold
      { c1: "#fce4ec", c2: "#f8bbd0", center: "#ffcc00" }, // Rose
      { c1: "#ff1744", c2: "#f50057", center: "#ffea00" }, // Vibrant Red
      { c1: "#ab47bc", c2: "#8e24aa", center: "#ffcc00" }, // Purple
      { c1: "#29b6f6", c2: "#03a9f4", center: "#ffeb3b" }, // Light Blue
    ];

    for (let i = 0; i < count; i++) {
      list.push({
        id: i,
        // 65% flowers, 35% leaves for a rich look
        isFlower: Math.random() > 0.35, 
        palette: colorPalettes[Math.floor(Math.random() * colorPalettes.length)],
        initialU: Math.random(),
        // Moves smoothly along the path
        speedU: 0.005 + Math.random() * 0.012,
        initialAngle: Math.random() * Math.PI * 2,
        // Wrapping around the curve continuously
        speedAngle: (Math.random() - 0.5) * 2.0,
        // IMPORTANT: Orbit radius Detaches them from the rope surface so they float and flow AROUND it
        orbitRadius: 1.5 + Math.random() * 3.5,
        // Elegant, slow spin  
        spinSpeed: (Math.random() - 0.5) * 1.5,
        scale: 0.8 + Math.random() * 0.8
      });
    }
    return list;
  }, [count]);

  return (
    <>
      {items.map(item => (
        <FlowingElement key={item.id} curve={curve} {...item} />
      ))}
    </>
  );
};

// Flower that constantly follows the scroll side-by-side with the vine
const FollowerFlower = ({ curve, scrollData }) => {
  const followerRef = useRef();

  useFrame((state, delta) => {
    if (!followerRef.current) return;
    
    // Lerped scroll position tracking the universe movement
    const targetY = scrollData.current.current * 0.025;
    
    // Stay horizontally aligned near the center-screen Y
    const visibleWorldY = -2; // Slightly below center so it's clearly visible
    
    // Find where that world Y falls on the moving scene's local coordinate system
    const localY = visibleWorldY - targetY;
    
    // Map localY to curve parameter 'u'. Since curve Y goes 50 -> -170 linearly over 0 -> 1:
    let u = (50 - localY) / 220;
    u = THREE.MathUtils.clamp(u, 0.001, 0.999);
    
    const pos = curve.getPoint(u);
    
    // Counteract the scene rotation to genuinely float on the left side of the screen
    const inverseSceneRotY = -followerRef.current.parent.rotation.y;
    const cameraVector = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), inverseSceneRotY);
    const screenLeft = new THREE.Vector3(-1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), inverseSceneRotY);

    const offset = new THREE.Vector3()
      .addScaledVector(screenLeft, 5.5)
      .addScaledVector(cameraVector, 2);
    
    followerRef.current.position.copy(pos).add(offset);
  });

  return (
    <group ref={followerRef}>
      <Flower rotation={[-0.2, 0.3, 0]} scale={1.2} color1="#ff1744" color2="#f50057" centerColor="#ffea00" />
    </group>
  );
};

const ScrollScene = () => {
  const sceneRef = useRef();

  // Generate a thick, very long vine curve
  const curve = useMemo(() => {
    const points = [];
    const segments = 300; 
    const vineLength = 220; // Shortened from 1000 so the rope visual physically ends
    
    for (let i = 0; i <= segments; i++) {
      const y = 50 - (i / segments) * vineLength;
      
      // Wide sweeping organic curves
      const x = Math.sin(i * 0.15) * 12 + Math.cos(i * 0.05) * 5;
      const z = Math.cos(i * 0.12) * 8 - 4;
      
      points.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.CatmullRomCurve3(points, false, 'chordal', 1);
  }, []);

// Static decorators removed intentionally in favor of FlowingDecorations

  const scrollData = useRef({ current: 0, target: 0 });

  useFrame((state, delta) => {
    if (sceneRef.current) {
      scrollData.current.target = window.scrollY;
      
      // Smooth interpolation tied to window.scroll
      scrollData.current.current = THREE.MathUtils.lerp(
        scrollData.current.current,
        scrollData.current.target,
        delta * 5
      );
      
      // Translate the entire universe upwards 
      const targetY = scrollData.current.current * 0.025; 
      sceneRef.current.position.y = targetY;
      
      // Subtle global twist on scroll
      sceneRef.current.rotation.y = scrollData.current.current * 0.0003;
    }
  });

  return (
    <group ref={sceneRef}>
      {/* 1. THE MAIN CONTINUOUS VINE */}
      <mesh>
        <tubeGeometry args={[curve, 400, 0.5, 32, false]} />
        <meshStandardMaterial color="#cca700" metalness={0.8} roughness={0.2} />
      </mesh>

{/* Smoothly flowing flowers and leaves around the vine */}
      <FlowingDecorations curve={curve} count={250} />

      {/* Hero Section Static Flowers (Page Load) */}
      
      {/* Top Left Bloom */}
      <Float speed={1.5} rotationIntensity={1} floatIntensity={2} floatingRange={[-0.2, 0.5]}>
        <Flower position={[-8, 6, -2]} scale={2.2} color1="#ffb6c1" color2="#ffc0cb" />
        <Flower position={[-6, 8, -4]} scale={1.5} color1="#ffffff" color2="#fdfdfd" />
        <Flower position={[-10, 4, -3]} scale={1.8} color1="#ffd700" color2="#ffea00" />
      </Float>

      {/* Bottom Right Bloom */}
      <Float speed={2} rotationIntensity={1.5} floatIntensity={1.5} floatingRange={[-0.5, 0.2]}>
        <Flower position={[8, -2, 1]} scale={2.5} color1="#fce4ec" color2="#f8bbd0" />
        <Flower position={[6, -5, -1]} scale={1.6} color1="#ffd700" color2="#ffcc00" />
        <Flower position={[10, 1, -2]} scale={1.8} color1="#ffffff" color2="#fdfdfd" />
      </Float>

      {/* 2. FLOATING BACKGROUND DECORATIONS (Replaced Rings and Balls) */}
      
      {/* 3. SCROLL-FOLLOWING CONSTANT FLOWER */}
      <FollowerFlower curve={curve} scrollData={scrollData} />
      
      {/* Section 2 Depth */}
      <Float speed={2} rotationIntensity={1} floatIntensity={2} floatingRange={[-0.5, 0.5]}>
        <Flower position={[-6, 5, -2]} scale={1.8} color1="#ffffff" color2="#fdfdfd" />
        <Flower position={[7, -2, -4]} scale={1.3} color1="#ffb6c1" color2="#ffc0cb" />
      </Float>

      {/* Section 3 Depth */}
      <Float speed={1.5} rotationIntensity={1.5} floatIntensity={2}>
        <Flower position={[6, -20, -3]} scale={2.2} color1="#ffd700" color2="#ffea00" />
        <Flower position={[-7, -26, -5]} scale={1.8} color1="#fce4ec" color2="#f8bbd0" />
      </Float>

      {/* Section 4 Depth */}
      <Float speed={2.5} rotationIntensity={0.5} floatIntensity={1.5}>
        <Flower position={[-5, -45, -4]} scale={1.5} color1="#ffffff" color2="#f0f0f0" />
        <Flower position={[7, -52, -2]} scale={1.8} color1="#ffd700" color2="#ffcc00" />
      </Float>

      {/* Section 5 Depth */}
      <Float speed={1.5} rotationIntensity={2} floatIntensity={2}>
        <Flower position={[6, -70, -5]} scale={2.5} color1="#ffb6c1" color2="#ffc0cb" />
        <Flower position={[-6, -80, -3]} scale={1.7} color1="#ffffff" color2="#fdfdfd" />
      </Float>

      {/* Section 7 Depth */}
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Flower position={[-5, -100, -6]} scale={2.8} color1="#ffd700" color2="#ffea00" />
        <Flower position={[6, -112, -2]} scale={1.5} color1="#fce4ec" color2="#f8bbd0" />
      </Float>

    </group>
  );
};

export default function Rope3DBackground() {
  return (
    <Box sx={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none', overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={1} color="#cc9900" />
        <Environment preset="city" />
        
        <ScrollScene />
      </Canvas>
    </Box>
  );
}
