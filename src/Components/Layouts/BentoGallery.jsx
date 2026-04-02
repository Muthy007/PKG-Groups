import React, { useRef } from 'react';
import { Box, Typography } from '@mui/material';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { useGSAP } from '@gsap/react';

import wedding1Img from '../../assets/images/wedding 1.jpg';
import wedding2Img from '../../assets/images/wedding 2.jpg';
import wedding3Img from '../../assets/images/wedding 3.jpg';
import wedding4Img from '../../assets/images/wedding 4.jpg';
import wedding5Img from '../../assets/images/wedding 5.jpg';
import wedding6Img from '../../assets/images/wedding 6.jpg';
import wedding7Img from '../../assets/images/wedding 7.jpg';

gsap.registerPlugin(ScrollTrigger, Flip);

const BentoGallery = () => {
  const containerRef = useRef(null);
  const galleryRef = useRef(null);
  const textRef = useRef(null);

  useGSAP(() => {
    let galleryElement = galleryRef.current;
    let textElement = textRef.current;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=200%", 
        scrub: 1, // Add slight smoothing so it doesn't instantly snap disappear
        pin: true
      }
    });

    tl.fromTo(galleryElement, 
      { scale: 3 }, 
      { scale: 1, ease: "power2.inOut" },
      0
    );

    // Guaranteed explicit tween bound directly to DOM Node (bypasses classname weirdness)
    tl.fromTo(textElement,
      { opacity: 1, y: 0, scale: 1 },
      { opacity: 0, y: -50, scale: 0.95, duration: 0.4, ease: "power2.inOut" },
      0 // Start exactly identically with the scale
    );

    tl.fromTo(
      ".gallery-content",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.2 },
      "-=0.2" 
    );

    return () => {
      gsap.set(galleryElement, { clearProps: "all" });
    };
  }, { scope: containerRef });

  return (
    <Box ref={containerRef} sx={{ position: 'relative', width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', bgcolor: 'transparent' }}>

      
      <Box
        ref={galleryRef}
        className="gallery--bento"
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: '100%',
          flex: 'none',
          display: 'grid',
          gap: '1vh',
          gridTemplateColumns: 'repeat(3, 32.5vw)',
          gridTemplateRows: 'repeat(4, 21vw)',
          justifyContent: 'center',
          alignContent: 'center',
          // Simplified native styling

          '& .gallery__item': {
            backgroundPosition: '50% 50%',
            backgroundSize: 'cover',
            flex: 'none',
            position: 'relative',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            '& img': {
              objectFit: 'cover',
              width: '100%',
              height: '100%',
            }
          },
          
          '& .gallery__item:nth-of-type(1)': { gridArea: '1 / 1 / 3 / 2' },
          '& .gallery__item:nth-of-type(2)': { gridArea: '1 / 2 / 2 / 3' },
          '& .gallery__item:nth-of-type(3)': { gridArea: '2 / 2 / 4 / 3' },
          '& .gallery__item:nth-of-type(4)': { gridArea: '1 / 3 / 3 / 3' },
          '& .gallery__item:nth-of-type(5)': { gridArea: '3 / 1 / 3 / 2' },
          '& .gallery__item:nth-of-type(6)': { gridArea: '3 / 3 / 5 / 4' },
          '& .gallery__item:nth-of-type(7)': { gridArea: '4 / 1 / 5 / 3' },
        }}
      >
        <Box className="gallery__item"><img src={wedding1Img} alt="Luxury Wedding Decor" /></Box>
        <Box className="gallery__item"><img src={wedding2Img} alt="Elegant Event Arrangement" /></Box>
        <Box className="gallery__item"><img src={wedding3Img} alt="Premium Stage Setup" /></Box>
        <Box className="gallery__item"><img src={wedding4Img} alt="Sophisticated Celebration" /></Box>
        <Box className="gallery__item"><img src={wedding5Img} alt="Grand Gala Dinner" /></Box>
        <Box className="gallery__item"><img src={wedding6Img} alt="Exquisite Floral Design" /></Box>
        <Box className="gallery__item"><img src={wedding7Img} alt="Corporate Event Excellence" /></Box>
      </Box>

      {/* Hero Text Overlay that starts fully visible and fades out using explicit DOM node ref */}
      <Box 
        ref={textRef}
        sx={{ 
          position: "absolute", 
          inset: 0,
          zIndex: 50, 
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
          px: 2
        }}
      >
        <Typography sx={{ 
          textAlign: "center", 
          fontFamily: "'Inter', sans-serif", 
          fontWeight: 600, 
          color: "#fff", 
          fontSize: "clamp(2.5rem, 4.5vw, 4.5rem)",
          lineHeight: 1.1,
          letterSpacing: "-0.5px",
          textShadow: "0 10px 40px rgba(0,0,0,0.8), 0 2px 10px rgba(0,0,0,0.5)" 
        }}>
          Your 360° partner for premium<br />events and celebrations
        </Typography>
      </Box>

      <Box sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        p: "4vw",
        zIndex: 10,
        textAlign: 'center',
        background: 'linear-gradient(to top, rgba(10,15,60,0.95) 0%, rgba(10,15,60,0) 100%)',
        color: '#fff',
        pointerEvents: 'none', 
      }}
        className="gallery-content"
      >
        <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 'bold', mb: 1, textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
          Captured Moments
        </Typography>
        <Typography variant="body1" sx={{ color: '#e0e0e0', fontSize: '1.2rem', textShadow: '0 2px 5px rgba(0,0,0,0.5)' }}>
          Experience the finest celebrations crafted with premium elegance and precision.
        </Typography>
      </Box>
    </Box>
  );
};

export default BentoGallery;
