import React, { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { Box } from '@mui/material';

// --- Procedural Photorealistic Textures ---
const createTextures = () => {
    // 1. FULL OPEN FLOWER TEXTURE
    const fCanvas = document.createElement("canvas");
    fCanvas.width = 512;
    fCanvas.height = 512;
    const ctx = fCanvas.getContext("2d");
    
    ctx.clearRect(0, 0, 512, 512);
    ctx.translate(256, 256);
    
    for (let i = 0; i < 5; i++) {
        ctx.save();
        ctx.rotate((Math.PI * 2 / 5) * i);
        
        ctx.beginPath();
        ctx.moveTo(0, 0); 
        ctx.bezierCurveTo(45, -40, 95, -170, 75, -230); 
        ctx.quadraticCurveTo(35, -250, 18, -230); 
        ctx.quadraticCurveTo(0, -210, 0, -210); 
        ctx.quadraticCurveTo(-18, -230, -35, -250); 
        ctx.quadraticCurveTo(-75, -230, -95, -170); 
        ctx.bezierCurveTo(-45, -40, 0, 0, 0, 0); 
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, 0, 0, -250);
        grad.addColorStop(0, "rgba(230, 20, 80, 1)"); 
        grad.addColorStop(0.25, "rgba(255, 140, 180, 0.95)"); 
        grad.addColorStop(0.75, "rgba(255, 230, 245, 0.9)"); 
        grad.addColorStop(1, "rgba(255, 255, 255, 0.75)"); 
        
        ctx.fillStyle = grad;
        ctx.fill();
        
        ctx.globalCompositeOperation = "source-atop";
        for (let j = 0; j < 25; j++) {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            const endX = (Math.random() - 0.5) * 110;
            const endY = -90 - Math.random() * 140;
            ctx.quadraticCurveTo(endX * 0.5, -90, endX, endY);
            ctx.strokeStyle = `rgba(220, 20, 60, ${0.03 + Math.random() * 0.1})`;
            ctx.lineWidth = 0.5 + Math.random() * 1.5;
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    ctx.globalCompositeOperation = "source-over";
    
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.fillStyle = "#8b0000";
    ctx.fill();
    
    for (let i = 0; i < 35; i++) {
        ctx.save();
        ctx.rotate((Math.PI * 2 / 35) * i + (Math.random() - 0.5) * 0.1);
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        const length = 20 + Math.random() * 25;
        ctx.lineTo(0, -length);
        ctx.strokeStyle = "rgba(255, 120, 160, 0.7)";
        ctx.lineWidth = 1.2;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(0, -length, 2.5 + Math.random(), 0, Math.PI * 2);
        ctx.fillStyle = Math.random() > 0.5 ? "#ffd700" : "#ff8c00"; 
        ctx.fill();
        
        ctx.restore();
    }
    
    const flowerTex = new THREE.CanvasTexture(fCanvas);
    flowerTex.anisotropy = 16;
    flowerTex.needsUpdate = true;

    // 2. SINGLE FALLING PETAL TEXTURE
    const pCanvas = document.createElement("canvas");
    pCanvas.width = 256;
    pCanvas.height = 256;
    const pCtx = pCanvas.getContext("2d");

    pCtx.clearRect(0,0,256,256);
    pCtx.translate(128, 220); 

    pCtx.beginPath();
    pCtx.moveTo(0, 0); 
    pCtx.bezierCurveTo(55, -40, 95, -140, 75, -200); 
    pCtx.quadraticCurveTo(35, -220, 18, -200); 
    pCtx.quadraticCurveTo(0, -185, 0, -185); 
    pCtx.quadraticCurveTo(-18, -200, -35, -220); 
    pCtx.quadraticCurveTo(-75, -200, -95, -140); 
    pCtx.bezierCurveTo(-55, -40, 0, 0, 0, 0); 
    pCtx.closePath();

    const pGrad = pCtx.createLinearGradient(0, 0, 0, -210);
    pGrad.addColorStop(0, "rgba(220, 20, 80, 1)"); 
    pGrad.addColorStop(0.3, "rgba(255, 140, 180, 0.95)"); 
    pGrad.addColorStop(0.8, "rgba(255, 230, 245, 0.9)"); 
    pGrad.addColorStop(1, "rgba(255, 255, 255, 0.8)"); 
    
    pCtx.fillStyle = pGrad;
    pCtx.fill();

    const singlePetalTex = new THREE.CanvasTexture(pCanvas);
    singlePetalTex.anisotropy = 16;
    singlePetalTex.needsUpdate = true;

    // 3. GREENERY (LEAF) TEXTURE
    const lCanvas = document.createElement("canvas");
    lCanvas.width = 256;
    lCanvas.height = 256;
    const lCtx = lCanvas.getContext("2d");
    
    lCtx.clearRect(0,0,256,256);
    lCtx.translate(128, 128);
    lCtx.rotate(Math.PI / 4);
    
    lCtx.beginPath();
    lCtx.moveTo(0, 100);
    lCtx.quadraticCurveTo(70, -20, 0, -100); 
    lCtx.quadraticCurveTo(-70, -20, 0, 100); 
    lCtx.closePath();
    
    const lGrad = lCtx.createLinearGradient(0, 100, 0, -100);
    lGrad.addColorStop(0, "rgba(25, 80, 25, 1)");
    lGrad.addColorStop(1, "rgba(100, 160, 50, 0.9)");
    
    lCtx.fillStyle = lGrad;
    lCtx.fill();
    
    lCtx.beginPath();
    lCtx.moveTo(0, 100);
    lCtx.lineTo(0, -90);
    lCtx.strokeStyle = "rgba(10, 50, 10, 0.4)";
    lCtx.lineWidth = 2.5;
    lCtx.stroke();
    
    const leafTex = new THREE.CanvasTexture(lCanvas);
    leafTex.anisotropy = 16;
    leafTex.needsUpdate = true;

    return { flowerTex, singlePetalTex, leafTex };
};

// --- Components ---

const FullFlower3D = ({ position, rotation, scale, textures, speedMultiplier = 1 }) => {
    return (
        <Float speed={1.5 * speedMultiplier} rotationIntensity={0.8} floatIntensity={1.5}>
            <mesh position={position} rotation={rotation} scale={scale}>
                <planeGeometry args={[2, 2]} />
                <meshStandardMaterial 
                    map={textures.flowerTex} 
                    transparent={true} 
                    side={THREE.DoubleSide} 
                    roughness={0.5} 
                    alphaTest={0.05} 
                    depthWrite={false}
                />
            </mesh>
        </Float>
    );
};

const RealisticLeaf3D = ({ position, rotation, scale, textures, speedMultiplier = 1 }) => {
    return (
        <Float speed={1.5 * speedMultiplier} rotationIntensity={2} floatIntensity={1.5}>
            <mesh position={position} rotation={rotation} scale={scale}>
                <planeGeometry args={[1.5, 1.5]} />
                <meshStandardMaterial 
                    map={textures.leafTex} 
                    transparent={true} 
                    side={THREE.DoubleSide} 
                    roughness={0.6} 
                    alphaTest={0.05}
                    depthWrite={false}
                />
            </mesh>
        </Float>
    );
};

// --- Dynamic Responsiveness Layouts ---

const CornerClusters = ({ textures }) => {
    const { viewport } = useThree();

    const elements = useMemo(() => {
        const items = [];
        
        const createSideFlow = (isRight) => {
            const sideSign = isRight ? 1 : -1;
            
            // Generate 5-6 lush, fully uncropped flowers anchoring strictly to the left & right sides
            const numFlowers = 6;
            for (let i = 0; i < numFlowers; i++) {
                // Ensure they are fully visible by pushing them safely inwards from the edge (Width/2)
                const isMobile = viewport.width < 10;
                const safeInsetMargin = (isMobile ? 0.2 : 1.5) + Math.random() * (isMobile ? 0.5 : 1.5); 
                const xPos = (viewport.width / 2 - safeInsetMargin) * sideSign;
                
                // Spread out significantly along the vertical screen height
                const ySpread = viewport.height * 0.85; 
                const yPos = (viewport.height / 2 - 1) - (i / (numFlowers - 1)) * ySpread + (Math.random() - 0.5) * 2;
                
                items.push(
                    <FullFlower3D 
                        key={`b-${isRight}-${i}`}
                        position={[xPos, yPos, (Math.random() - 0.5) * 2]}
                        rotation={[
                            (Math.random() - 0.5) * 0.3, 
                            (Math.random() - 0.5) * 0.3, 
                            Math.random() * Math.PI * 2  
                        ]}
                        scale={0.45 + Math.random() * 0.4} 
                        textures={textures}
                        speedMultiplier={0.4 + Math.random() * 0.6}
                    />
                );
            }
            
            // Populate the perimeter elegantly with trailing leaves
            const numLeaves = 8;
            for (let i = 0; i < numLeaves; i++) {
                const isMobile = viewport.width < 10;
                const safeInsetMargin = (isMobile ? 0.1 : 1.0) + Math.random() * (isMobile ? 0.4 : 2.5); 
                const xPos = (viewport.width / 2 - safeInsetMargin) * sideSign;
                
                const ySpread = viewport.height * 0.9;
                const yPos = (viewport.height / 2) - (i / (numLeaves - 1)) * ySpread + (Math.random() - 0.5) * 2;
                
                items.push(
                    <RealisticLeaf3D 
                        key={`l-${isRight}-${i}`}
                        position={[xPos, yPos, -1 + (Math.random() - 0.5) * 3]}
                        rotation={[Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]}
                        scale={0.3 + Math.random() * 0.3}
                        textures={textures}
                        speedMultiplier={0.3 + Math.random() * 0.5}
                    />
                );
            }
        };

        createSideFlow(false); 
        createSideFlow(true);  
        
        return items;
    }, [viewport.width, viewport.height, textures]);

    return <>{elements}</>;
};

const FallingPetal = ({ bounds, startPos, textures, speed }) => {
    const ref = useRef();
    const [offset] = useState(() => Math.random() * 100);
    const [rotSpeeds] = useState(() => [Math.random()*1.5, Math.random()*1.5, Math.random()*0.8]);
    const { viewport } = useThree(); 

    useFrame((state, delta) => {
        if (!ref.current) return;
        
        ref.current.position.y -= speed * delta;
        ref.current.position.x += Math.sin(state.clock.elapsedTime * 0.8 + offset) * speed * 0.5 * delta;
        
        ref.current.rotation.x += delta * rotSpeeds[0];
        ref.current.rotation.y += delta * rotSpeeds[1];
        ref.current.rotation.z += delta * rotSpeeds[2];

        // Loop seamlessly, spanning the full dynamic viewport width
        if (ref.current.position.y < bounds.minY) {
            ref.current.position.y = bounds.maxY + Math.random() * 5;
            ref.current.position.x = (Math.random() - 0.5) * viewport.width;
        }
    });

    return (
        <group ref={ref} position={startPos} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
            <mesh scale={0.25 + Math.random() * 0.2}>
                <planeGeometry args={[1, 1]} />
                <meshStandardMaterial 
                    map={textures.singlePetalTex} 
                    transparent={true} 
                    side={THREE.DoubleSide} 
                    roughness={0.4} 
                    alphaTest={0.05}
                    depthWrite={false}
                />
            </mesh>
        </group>
    );
};

const FallingPetalsRain = ({ textures }) => {
    const { viewport } = useThree();
    
    const bounds = {
        minY: -viewport.height / 2 - 2,
        maxY: viewport.height / 2 + 2,
    };

    const elements = useMemo(() => {
        const items = [];
        for (let i = 0; i < 12; i++) {
            const xOffset = (Math.random() - 0.5) * viewport.width;
            const yOffset = bounds.maxY + Math.random() * viewport.height; 
            const zOffset = -2 + Math.random() * 5; 
            
            items.push(
                <FallingPetal 
                    key={`fall-${i}`} 
                    startPos={[xOffset, yOffset, zOffset]} 
                    bounds={bounds} 
                    textures={textures} 
                    speed={1.0 + Math.random() * 1.5} 
                />
            );
        }
        return items;
    }, [viewport.width, viewport.height, bounds.maxY, textures]);

    return <>{elements}</>;
};

const CherryBlossomsScene = () => {
    const textures = useMemo(() => createTextures(), []);

    return (
        <>
            <ambientLight intensity={2.2} color="#ffffff" />
            <directionalLight position={[5, 10, 10]} intensity={2.0} color="#fffcf2" />
            <directionalLight position={[-5, 5, -5]} intensity={1.5} color="#ffb7c5" />
            
            <CornerClusters textures={textures} />
            <FallingPetalsRain textures={textures} />
        </>
    );
};

export default function CherryBlossoms3D() {
    return (
        <Box sx={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 10 }}>
            {/* 
              Utilize antialiasing and alpha projection perfectly aligning over your container
            */}
            <Canvas camera={{ position: [0, 0, 16], fov: 45 }} gl={{ alpha: true, antialias: true }} dpr={[1, 1.5]}>
                <CherryBlossomsScene />
            </Canvas>
        </Box>
    );
}
