import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, Button, Grid, Container } from "@mui/material";
import { motion, useInView, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const TiltCard = ({ children, style = {} }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  // Rotate X ranges from 15deg to -15deg (tilts up and down)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  // Rotate Y ranges from -15deg to 15deg (tilts left and right)
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        ...style
      }}
    >
      <div style={{ transform: "translateZ(30px)", height: "100%", width: "100%" }}>
        {children}
      </div>
    </motion.div>
  );
};


const AnimatedNumber = ({ value, suffix }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      const end = parseInt(value.replace(/,/g, ''));
      if (isNaN(end)) return;

      let startTimestamp = null;
      const duration = 2000;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // easeOutQuart function
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easeProgress * end));

        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [value, isInView]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

// Icons
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import CelebrationOutlinedIcon from '@mui/icons-material/CelebrationOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import RestaurantMenuOutlinedIcon from '@mui/icons-material/RestaurantMenuOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BrushIcon from '@mui/icons-material/Brush';
import FormatPaintIcon from '@mui/icons-material/FormatPaint';
import InterestsIcon from '@mui/icons-material/Interests';

// Images
import wedding1Img from "../../assets/images/wedding 1.jpg";
import wedding2Img from "../../assets/images/wedding 2.jpg";
import wedding3Img from "../../assets/images/wedding 3.jpg";
import wedding4Img from "../../assets/images/wedding 4.jpg";
import wedding5Img from "../../assets/images/wedding 5.jpg";
import wedding6Img from "../../assets/images/wedding 6.jpg";
import wedding7Img from "../../assets/images/wedding 7.jpg";
import bgFrame1 from "../../assets/how_it_works_bg_1.png";
import bgFrame2 from "../../assets/how_it_works_bg_2.png";

import BentoGallery from "./BentoGallery";
import ThreeBackground from "./ThreeBackground";
import Rope3DBackground from "./Rope3DBackground";
import ServicesScroll from "./ServicesScroll";
import Footer from "./Footer";
import StatsPage from "./StatsPage";
import CherryBlossoms3D from "./CherryBlossoms3D";

const ProcessScroll = ({ steps }) => {
  const containerRef = useRef(null);
  
  useGSAP(() => {
    const cards = gsap.utils.toArray('.process-step-card');
    const bgWrapper = containerRef.current.querySelector('.process-bg-wrapper');
    const titleBlock = containerRef.current.querySelector('.process-title-block');
    
    // Setup Initial Elegance States
    gsap.set(cards, { y: 150, autoAlpha: 0, scale: 0.95 });
    gsap.set(titleBlock, { autoAlpha: 0, y: 30 });
    
    // Image starts slightly zoomed out with 0 opacity so it can "appear in a smooth continuous way"
    gsap.set(bgWrapper, { scale: 1.05, opacity: 0, transformOrigin: 'center center' });
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${(cards.length + 1.5) * 100}%`,
        pin: true,
        scrub: 1,
      }
    });

    // 1. Image fades into view smoothly exactly as requested
    tl.to(bgWrapper, {
      opacity: 1,
      duration: 1.5,
      ease: 'power2.inOut'
    }, 0);

    // 2. Image continuously smoothly scales and pans for the entirety of the section
    tl.to(bgWrapper, {
      scale: 1.25,
      xPercent: -4,
      yPercent: 4,
      duration: (cards.length * 1.5) + 3, // Spans the entire timeline length
      ease: 'none'
    }, 0); // Starts simultaneously


    // 3. Fade in the title text quickly 
    tl.to(titleBlock, {
      autoAlpha: 1,
      y: 0,
      duration: 0.8,
      ease: 'power1.out'
    }, 0.2);

    // 4. Hide title block as we scroll down before cards show up
    tl.to(titleBlock, {
      autoAlpha: 0,
      y: -50,
      scale: 0.9,
      duration: 0.6,
      ease: 'power2.in'
    }, 1.0);

    // 3. Step by Step Content Reveal over the scrubbed background video
    cards.forEach((card, i) => {
      const startTime = 1.5 + (i * 1.5); 
      
      tl.to(card, { y: 0, autoAlpha: 1, scale: 1, duration: 1.2, ease: 'power2.out' }, startTime);
      
      if (i !== cards.length - 1) {
        tl.to(card, { y: -150, autoAlpha: 0, scale: 0.9, duration: 0.8, ease: 'power2.in' }, startTime + 1.5);
      } else {
        tl.to(card, { duration: 0.5 }, startTime + 1.5); // Let last card breathe
      }
    });

  }, { scope: containerRef });

  return (
    <Box ref={containerRef} sx={{ position: "relative", minHeight: "100vh", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden", py: 4, zIndex: 1, bgcolor: "#0a0f3c" }}>
      
      {/* Decorative 3D Cherry Blossoms on corners integrating into scene */}
      <CherryBlossoms3D />
      
      {/* Smooth Continuous Single Image Layer */}
      <Box className="process-bg-wrapper" sx={{ 
        position: "absolute", 
        inset: "-5vh -5vw", // Slight buffer to allow smooth panning without clipping
        zIndex: 0, 
        overflow: "hidden" 
      }}>
         <img 
           src={bgFrame1} 
           alt="Wedding Illustration" 
           style={{ 
             position: "absolute", 
             width: "100%", 
             height: "100%", 
             objectFit: "cover", 
             filter: "brightness(0.6)" 
           }} 
         />
         <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,15,60,0.95) 0%, rgba(10,15,60,0.1) 100%)", pointerEvents: "none" }} />
      </Box>

      <Box className="process-title-block" sx={{ textAlign: "center", mb: "5vw", zIndex: 2, position: "relative" }}>
        <Typography variant="subtitle1" color="#cc9900" fontWeight="bold" letterSpacing="3px">THE PROCESS</Typography>
        <Typography variant="h3" fontWeight="bold" mt={1} sx={{ fontFamily: "'Playfair Display', serif", color: "#fff", textShadow: "0 5px 15px rgba(0,0,0,0.5)" }}>
          How It Works
        </Typography>
        <Box sx={{ width: "60px", height: "3px", bgcolor: "#cc9900", mx: "auto", mt: 3 }} />
      </Box>

      <Box sx={{ position: "relative", width: "90%", maxWidth: "45vw", height: "35vh", minHeight: "350px", display: "flex", justifyContent: "center", zIndex: 2 }}>
        {steps.map((step, i) => (
          <Box key={i} className="process-step-card" sx={{ 
            position: "absolute", 
            top: 0, 
            width: "100%", 
            height: "100%",
            background: "rgba(255, 255, 255, 0.05)", 
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderTop: "1px solid rgba(255, 255, 255, 0.2)",
            borderLeft: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "24px",
            p: "4vw",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
          }}>
             <Box sx={{ width: "80px", height: "80px", minWidth: "80px", minHeight: "80px", borderRadius: "50%", background: "linear-gradient(135deg, #cc9900, #ffcc00)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", fontWeight: "900", color: "#0a0f3c", mb: 3, boxShadow: "0 10px 25px rgba(255,204,0,0.4)" }}>
               {step.num}
             </Box>
             <Typography variant="h4" fontWeight="bold" sx={{ color: "#fff", mb: 3, fontFamily: "'Playfair Display', serif", letterSpacing: "1px", textShadow: "0 2px 4px rgba(0,0,0,0.5)", fontSize: "clamp(1.2rem, 2.5vw, 2.125rem)" }}>
               {step.title}
             </Typography>
             <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.8, fontSize: "1.1rem" }}>
               {step.desc}
             </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.95]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 70 },
    show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.25, 0.46, 0.45, 0.94] } }
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -50 },
    show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 50 },
    show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const popIn = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1, transition: { type: "spring", bounce: 0.4, duration: 1 } }
  };

  const flipIn3D = {
    hidden: { opacity: 0, rotateX: 90, y: 50 },
    show: { opacity: 1, rotateX: 0, y: 0, transition: { type: "spring", bounce: 0.4, duration: 1.2 } }
  };

  const services = [
    { title: "Corporate Events", icon: <BusinessCenterOutlinedIcon fontSize="large" />, desc: "Premium entertainment and execution for your staff, clients, or stakeholders.", img: wedding7Img },
    { title: "Wedding Events", icon: <CelebrationOutlinedIcon fontSize="large" />, desc: "Expert design, planning, and management for a magical, flawless big day.", img: wedding1Img },
    { title: "Social Events", icon: <PeopleAltOutlinedIcon fontSize="large" />, desc: "Intimate and spectacular celebrations to craft moments of a lifetime with loved ones.", img: wedding6Img },
    { title: "Catering Services", icon: <RestaurantMenuOutlinedIcon fontSize="large" />, desc: "Exquisite culinary experiences tailored to your event, from corporate gatherings to grand weddings.", img: wedding5Img }
  ];

  const steps = [
    { num: "01", title: "Tell Us About Your Event", desc: "Event name, date, location, purpose, and key highlights." },
    { num: "02", title: "Choose Your Package", desc: "Choose your package and get started with the best value for your event or service." },
    { num: "03", title: "Meet Your Coordinator", desc: "Get to know your event expert — here to plan, guide, and make every detail perfect." },
    { num: "04", title: "Polish The Details", desc: "Review every element with care — we refine and perfect every detail before your big day." },
    { num: "05", title: "Trust Our Team", desc: "Trust our experienced team to handle every detail and deliver excellence every time." }
  ];

  const specialities = [
    { name: "South Indian Cuisine", img: wedding5Img },
    { name: "North Indian Cuisine", img: wedding2Img },
    { name: "Continental Flavors", img: wedding3Img },
    { name: "Oriental Tasting", img: wedding4Img }
  ];

  const clients = [
    "ENERGY FITNESS & SPORTS, Coimbatore",
    "Srivaru Convention Centre, Chennai",
    "Ramachandra convention Centre, Thiruvamiyur, Chennai",
    "Inventa (Lightning solution, Pallikaranai, Chennai)",
    "Ajubha Solution, Tidel park, Chennai",
    "Brigade solution, Ambattur",
    "Ashok Leyland",
    "Boat club",
    "Kothari Ltd",
    "Olympia Tech Park",
    "RMZ Porur (Tata consultancy services)",
    "Chennai Trade Centre (Rotary 3230)"
  ];

  return (
    <Box sx={{ overflowX: "hidden", position: "relative" }}>
    
      <Box sx={{ position: 'fixed', inset: 0, bgcolor: '#0a0f3c', zIndex: -2 }} />
      <Rope3DBackground />


      <Box sx={{ position: "relative", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", perspective: 1200, bgcolor: 'transparent' }}>
      
        <ThreeBackground />

      
        <Box sx={{ position: "absolute", inset: 0, zIndex: 1, background: "radial-gradient(circle at center, transparent 0%, rgba(10,15,60,0.8) 100%)" }} />

      
        <Box component={motion.div} style={{ opacity: heroOpacity }} sx={{ position: "absolute", right: "3%", top: "50%", transform: "translateY(-50%)", zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <Box sx={{ width: "1px", height: "120px", background: "linear-gradient(to bottom, transparent, rgba(204, 153, 0, 0.8))" }} />
          <Typography sx={{ color: "#cc9900", writingMode: "vertical-rl", transform: "rotate(180deg)", letterSpacing: "6px", fontSize: "0.85rem", fontWeight: "bold", fontFamily: "'Inter', sans-serif" }}>
            ESTABLISHED 1993
          </Typography>
          <Box sx={{ width: "1px", height: "120px", background: "linear-gradient(to top, transparent, rgba(204, 153, 0, 0.8))" }} />
        </Box>

      

     
        <Box component={motion.div} style={{ opacity: heroOpacity }} sx={{ position: "absolute", bottom: "3%", left: "50%", transform: "translateX(-50%)", zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
          <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.7rem", letterSpacing: "3px", textTransform: "uppercase" }}>Scroll to Explore</Typography>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
            <Box sx={{ width: "1px", height: "40px", background: "linear-gradient(to bottom, #cc9900, transparent)" }} />
          </motion.div>
        </Box>

        <Container component={motion.div} style={{ opacity: heroOpacity, scale: heroScale }} sx={{ position: "relative", zIndex: 4, textAlign: "center", pointerEvents: "none" }}>
          <motion.div variants={staggerContainer} initial="hidden" animate="show" style={{ transformStyle: "preserve-3d" }}>

           
            <motion.div variants={fadeInUp} style={{ x: mousePosition.x * -0.2, y: mousePosition.y * -0.2, rotateX: mousePosition.y * 0.2, rotateY: mousePosition.x * -0.2, transform: "translateZ(20px)" }}>
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "2vw", mb: 3 }}>
                <Box sx={{ width: "6vw", height: "1px", background: "linear-gradient(to right, transparent, #cc9900)" }} />
                <Typography sx={{ color: "#cc9900", letterSpacing: "0.2vw", fontSize: "1vw", fontWeight: "600", textTransform: "uppercase" }}>The Pinnacle of Luxury</Typography>
                <Box sx={{ width: "6vw", height: "1px", background: "linear-gradient(to left, transparent, #cc9900)" }} />
              </Box>
            </motion.div>

            <motion.div variants={fadeInUp} style={{ x: mousePosition.x * -0.5, y: mousePosition.y * -0.5, rotateX: mousePosition.y * 0.4, rotateY: mousePosition.x * -0.4, transform: "translateZ(80px)" }}>
              <Typography variant="h1" sx={{ mb: 2, fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "clamp(3.5rem, 8vw, 6.5rem)", textShadow: "0px 15px 40px rgba(0,0,0,0.8)", background: "linear-gradient(to right, #ffffff, #ffd700, #ffffff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundSize: "200% auto", animation: "shine 6s linear infinite", lineHeight: 1.1, "@keyframes shine": { to: { backgroundPosition: "200% center" } } }}>
                PKG Groups
              </Typography>
            </motion.div>

            <motion.div variants={fadeInUp} style={{ x: mousePosition.x * -0.3, y: mousePosition.y * -0.3, rotateX: mousePosition.y * 0.3, rotateY: mousePosition.x * -0.3, transform: "translateZ(40px)" }}>
              <Typography variant="h5" sx={{ mt: 2, mb: 6, color: "#e0e0e0", fontWeight: 300, letterSpacing: "0.4vw", textTransform: "uppercase", fontSize: "clamp(0.9rem, 1.5vw, 1.2rem)", textShadow: "0px 5px 15px rgba(0,0,0,0.8)" }}>
                Elegance • Dreams • Celebrations
              </Typography>
            </motion.div>

            <motion.div variants={popIn} style={{ transform: "translateZ(60px)", pointerEvents: "auto" }}>
              <motion.div whileHover={{ scale: 1.05, boxShadow: "0px 0px 30px rgba(204, 153, 0, 0.4)" }} whileTap={{ scale: 0.95 }} style={{ display: "inline-block", borderRadius: "30px" }}>
                <Button variant="contained" endIcon={<ArrowForwardIcon />} sx={{ background: "linear-gradient(45deg, #cc9900 0%, #ffcc00 50%, #cc9900 100%)", backgroundSize: "200% auto", color: "#0a0f3c", fontWeight: "900", px: "4vw", py: "1.2vw", fontSize: "clamp(0.8rem, 1.2vw, 1.1rem)", borderRadius: "30px", letterSpacing: "1px", transition: "0.5s", "&:hover": { backgroundPosition: "right center" } }}>
                  GET A QUOTE
                </Button>
              </motion.div>
            </motion.div>

          </motion.div>
        </Container>
      </Box>

  
      <Box sx={{ bgcolor: 'transparent', position: 'relative', zIndex: 1 }}>
        <BentoGallery />
      </Box>

      <Box sx={{ position: "relative" }}>
        
       
        <ServicesScroll services={services} />

        {/* 3. ABOUT US */}
        <Box id="about" sx={{ py: { xs: 8, md: 15 }, position: "relative", overflow: "hidden", zIndex: 1, bgcolor: 'transparent' }}>
          {/* Subtle Decorative Background Elements */}
          <motion.div animate={{ rotate: 360, scale: [1, 1.05, 1] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} style={{ position: "absolute", top: "-10%", right: "-5%", width: "30vw", height: "30vw", background: "radial-gradient(circle, rgba(204,153,0,0.05) 0%, rgba(255,255,255,0) 70%)", borderRadius: "50%" }} />
          <motion.div animate={{ rotate: -360, scale: [1, 1.1, 1] }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} style={{ position: "absolute", bottom: "-10%", left: "-10%", width: "35vw", height: "35vw", background: "radial-gradient(circle, rgba(10,15,60,0.03) 0%, rgba(255,255,255,0) 70%)", borderRadius: "50%" }} />

          <Container maxWidth={false} sx={{ px: "10vw", position: "relative", zIndex: 1 }}>
            <Box sx={{ display: "flex", flexDirection: "row", gap: "6vw", alignItems: "center" }}>

              <Box sx={{ flex: 1, minWidth: 0, width: "100%" }}>
                <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}>
                  <motion.div variants={fadeInUp}>
                    <Typography variant="subtitle1" color="#cc9900" fontWeight="bold" letterSpacing="3px" sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                      <Box sx={{ width: "40px", height: "2px", bgcolor: "#cc9900" }} />OUR STORY
                    </Typography>
                  </motion.div>

                  <motion.div variants={fadeInUp}>
                    <Typography variant="h3" fontWeight="bold" sx={{ color: "#fff", fontFamily: "'Playfair Display', serif", mb: 3, textShadow: "0px 2px 4px rgba(0,0,0,0.4)" }}>
                      PKG Groups
                    </Typography>
                  </motion.div>

                  <motion.div variants={fadeInUp}>
                    <Typography variant="h6" sx={{ color: "#cc9900", mb: 3, fontWeight: "500", fontStyle: "italic", fontSize: "clamp(1.2rem, 1.8vw, 1.4rem)", borderLeft: "4px solid #cc9900", pl: 3, lineHeight: 1.4 }}>
                      “Creating Unforgettable Celebrations That Stay in the Hearts of Your Guests.”
                    </Typography>
                  </motion.div>

                  <motion.div variants={fadeInUp}>
                    <Typography variant="body1" sx={{ color: "#e0e0e0", mb: 5, lineHeight: 1.9, textAlign: "justify", fontSize: "1.05rem" }}>
                      Our journey began with the humble goal of serving people at Madurai. Later we started our branches at Coimbatore and Chennai. With over 3 decades of experience in this profession, we have expanded our horizons significantly all over India. PKG Groups is known for its expertise in Corporate Events, Corporate Catering, Exhibitions, Wedding Events, Wedding catering and Destination Events/catering.
                    </Typography>
                  </motion.div>

                  <motion.div variants={fadeInUp}>
                    <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }} style={{ display: "inline-block", position: "relative" }}>
                      {/* Glowing shadow behind button */}
                      <Box sx={{ position: "absolute", inset: "-3px", borderRadius: "40px", background: "linear-gradient(45deg, #cc9900, #ffcc00, #cc9900)", zIndex: 0, opacity: 0.6, filter: "blur(6px)" }} />
                      <Button variant="contained" endIcon={<ArrowForwardIcon />} sx={{ background: "linear-gradient(45deg, #0a0f3c, #1a237e)", color: "#fff", px: 5, py: 1.8, borderRadius: "40px", fontSize: "1.05rem", fontWeight: "bold", textTransform: "none", boxShadow: "0 10px 25px rgba(10,15,60,0.4)", position: "relative", zIndex: 1, "&:hover": { background: "linear-gradient(45deg, #1a237e, #0a0f3c)" } }}>
                        Explore More
                      </Button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </Box>

              {/* Right Collage */}
              <Box sx={{ flex: 1, minWidth: 0, display: "flex", justifyContent: "flex-end", width: "100%" }}>
                <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={fadeInRight} style={{ width: "100%", maxWidth: "45vw", height: "40vw", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", perspective: 1200 }}>

                  {/* Floating Gold Halo */}
                  <motion.div animate={{ rotate: 360, opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} style={{ position: "absolute", top: "0%", right: "0%", width: "70%", height: "70%", borderRadius: "50%", background: "radial-gradient(circle, rgba(204,153,0,0.15) 0%, rgba(204,153,0,0) 70%)", zIndex: 0 }} />

                  {/* Main Primary Image */}
                  <motion.div animate={{ y: [0, -15, 0], rotateY: [-5, 5, -5], rotateX: [2, -2, 2] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} style={{ position: "absolute", left: '0%', top: '5%', width: "65%", height: "75%", zIndex: 1, borderRadius: "20px", overflow: "hidden", boxShadow: "0 25px 50px rgba(0,0,0,0.25)", backgroundImage: `url(${wedding1Img})`, backgroundSize: "cover", backgroundPosition: "center", transformOrigin: "center" }}>
                    <Box sx={{ position: "absolute", inset: 0, border: "2px solid rgba(255,215,0,0.5)", borderRadius: "20px", m: 1, pointerEvents: "none" }} />
                  </motion.div>

                  {/* Secondary Overlapping Image */}
                  <motion.div animate={{ y: [0, 15, 0], rotateY: [5, -5, 5], rotateX: [-2, 2, -2] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }} style={{ position: "absolute", right: '0%', bottom: '5%', width: "55%", height: "60%", zIndex: 2, borderRadius: "20px", overflow: "hidden", boxShadow: "0 30px 60px rgba(10,15,60,0.35)", border: "8px solid #fff", backgroundImage: `url(${wedding2Img})`, backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.9)", transformOrigin: "center" }} />

                  {/* Spinning Badge */}
                  <Box sx={{ position: "absolute", bottom: "10%", left: "-5%", zIndex: 3, width: "12vw", height: "12vw", minWidth: "120px", minHeight: "120px", display: "flex", alignItems: "center", justifyContent: "center", transform: "translateZ(80px)" }}>
                    {/* Rotating Outer Ring */}
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px dashed #cc9900", opacity: 0.6 }} />

                    {/* Static Inner Badge */}
                    <Box sx={{ width: "85%", height: "85%", borderRadius: "50%", background: "linear-gradient(135deg, #cc9900, #ffcc00)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 20px rgba(204,153,0,0.3)", border: "3px solid #fff" }}>
                      <Typography sx={{ color: "#0a0f3c", fontFamily: "'Playfair Display', serif", fontWeight: 900, textAlign: "center", fontSize: { xs: "0.75rem", md: "0.85vw" }, lineHeight: 1.2 }}>
                        30+ YEARS<br />EXCELLENCE
                      </Typography>
                    </Box>
                  </Box>

                </motion.div>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* 4. HOW IT WORKS */}
        <ProcessScroll steps={steps} />

        <Box sx={{ pb: "10vw", bgcolor: "transparent", position: "relative", zIndex: 1 }}>
          <Container maxWidth={false} sx={{ px: "10vw" }}>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeInUp} style={{ textAlign: "center", marginTop: "40px" }}>
              <Typography variant="h6" sx={{ color: "#fff", mb: 4, fontWeight: "normal", fontSize: "clamp(1rem, 1.5vw, 1.2rem)" }}>
                Call us now <span style={{ color: "#ffcc00", fontWeight: "bold" }}>+91 94436 69212</span> or request a quote without obligation.
              </Typography>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ display: 'inline-block' }}>
                <Button variant="contained" sx={{ background: "linear-gradient(45deg, #cc9900 0%, #ffcc00 50%, #cc9900 100%)", backgroundSize: "200% auto", color: "#0a0f3c", fontWeight: "bold", px: 5, py: 1.5, fontSize: "1.05rem", textTransform: "none", borderRadius: "30px", "&:hover": { backgroundPosition: "right center" } }}>
                  Request a Quote Now
                </Button>
              </motion.div>
            </motion.div>
          </Container>
        </Box>

        {/* 5. OUR SPECIALITIES */}
        <Box sx={{ py: "10vw", position: "relative", zIndex: 1, bgcolor: 'transparent' }}>
          <Container maxWidth={false} sx={{ px: "10vw" }}>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp} style={{ textAlign: "center", marginBottom: "60px" }}>
              <Typography variant="subtitle1" color="#cc9900" fontWeight="bold" letterSpacing="3px">EXQUISITE MENU</Typography>
              <Typography variant="h3" fontWeight="bold" mt={1} sx={{ fontFamily: "'Playfair Display', serif", color: "#fff" }}>
                Our Specialities
              </Typography>
              <Box sx={{ width: "60px", height: "3px", bgcolor: "#cc9900", mx: "auto", mt: 3 }} />
            </motion.div>

            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5vw", width: "100%" }}>
              {specialities.map((cuisine, i) => (
                <Box key={i}>
                  <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} variants={flipIn3D} style={{ width: "100%", height: "100%" }}>
                    <TiltCard style={{ width: "100%", aspectRatio: "21/9", minHeight: "200px", borderRadius: "12px" }}>
                      <Box sx={{ width: "100%", height: "100%", overflow: "hidden", borderRadius: "12px", position: "relative", border: "1px solid rgba(255,215,0,0.15)", boxShadow: "0 15px 30px rgba(0,0,0,0.08)" }}>
                        <motion.div whileHover={{ scale: 1.08 }} transition={{ duration: 1, ease: "easeOut" }} style={{ width: "100%", height: "100%" }}>
                          <Box component="img" src={cuisine.img} alt={cuisine.name} sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "brightness(0.85)", transition: "filter 0.5s", "&:hover": { filter: "brightness(1)" } }} />
                        </motion.div>
                        {/* Overlay */}
                        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to top, rgba(10,15,60,0.9) 0%, rgba(0,0,0,0) 70%)', display: 'flex', alignItems: 'flex-end', justifyContent: "center", p: { xs: 3, md: "2vw" }, pointerEvents: 'none' }}>
                          <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", color: '#ffcc00', fontWeight: "bold", textAlign: "center", textShadow: "0 4px 8px rgba(0,0,0,0.6)", fontSize: "clamp(1.5rem, 2vw, 3rem)", letterSpacing: "1px", transform: "translateZ(30px)" }}>
                            {cuisine.name}
                          </Typography>
                        </Box>
                      </Box>
                    </TiltCard>
                  </motion.div>
                </Box>
              ))}
            </Box>
          </Container>
        </Box>

        {/* 7. STATS & OUR CLIENTS */}
        <Box sx={{ bgcolor: "transparent", position: "relative", zIndex: 1 }}>

          {/* Stats Page Integration */}
          <StatsPage />

          {/* Clients Section */}
          <Box sx={{ py: "10vw", position: "relative", zIndex: 1, bgcolor: 'transparent' }}>
            <Container maxWidth={false} sx={{ px: "10vw" }}>
              <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeInUp} style={{ textAlign: "center", marginBottom: "60px" }}>
                <Typography variant="subtitle1" color="#cc9900" fontWeight="bold" letterSpacing="3px">TRUSTED BY</Typography>
                <Typography variant="h3" fontWeight="bold" mt={1} sx={{ color: "#fff", fontFamily: "'Playfair Display', serif" }}>
                  Our Esteemed Clients
                </Typography>
                <Box sx={{ width: "60px", height: "3px", bgcolor: "#cc9900", mx: "auto", mt: 3 }} />
              </motion.div>

              <Grid container spacing={8} alignItems="center">
                <Grid item xs={7}>
                  <Grid container spacing={3}>
                    {clients.map((client, i) => (
                      <Grid item xs={6} key={i}>
                        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0, transition: { delay: i * 0.05 + 0.1 } } }}>
                          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, p: 2, borderRadius: "10px", transition: "all 0.3s ease", "&:hover": { bgcolor: "rgba(255,255,255,0.08)", transform: "translateX(5px)" } }}>
                            <CheckCircleIcon sx={{ color: "#cc9900", fontSize: "22px", mt: 0.2 }} />
                            <Typography variant="body1" sx={{ color: "#e0e0e0", fontWeight: "500", lineHeight: 1.4 }}>
                              {client}
                            </Typography>
                          </Box>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
                <Grid item xs={5}>
                  <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeInRight}>
                    <Box sx={{ overflow: "hidden", borderRadius: "20px", boxShadow: "0 20px 40px rgba(0,0,0,0.15)", position: "relative", height: "35vw" }}>
                      <motion.img whileHover={{ scale: 1.05 }} transition={{ duration: 0.8 }} src={wedding3Img} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      {/* Overlay decorative badge */}
                      <Box sx={{ position: "absolute", bottom: "-20px", left: "-20px", width: "12vw", height: "12vw", borderRadius: "50%", background: "linear-gradient(45deg, #cc9900, #ffcc00)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 20px rgba(204,153,0,0.4)", zIndex: 10, p: 2, textAlign: "center" }}>
                        <Typography variant="subtitle2" sx={{ color: "#0a0f3c", fontWeight: "bold", fontSize: "0.85rem", lineHeight: 1.3 }}>
                          100% Client <br /> Satisfaction
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>
                </Grid>
              </Grid>
            </Container>
          </Box>
        </Box>
        
        {/* FOOTER PLACED INSIDE TO KEEP ROPE STICKY */}
        <Footer />
        
      </Box>
    </Box>
  );
}