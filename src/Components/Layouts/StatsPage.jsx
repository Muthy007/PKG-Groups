import React, { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import jonathanImg from "../../assets/jonathan-borba-VUgodwDcTrc-unsplash.jpg";

gsap.registerPlugin(ScrollTrigger);

const AnimatedStat = ({ stat, play }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (play) {
      const end = parseInt(stat.number);
      if (isNaN(end)) return;

      let startTimestamp = null;
      const duration = 2000;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 4); // easeOutQuart
        setCount(Math.floor(easeProgress * end));

        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    } else {
        setCount(0);
    }
  }, [play, stat.number]);

  return (
    <Box sx={{ flex: "1 1 auto", textAlign: "center", minWidth: "150px" }}>
        <Typography 
          variant="h2" 
          sx={{ 
            color: "#ffffff", 
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500, 
            fontSize: "clamp(2.5rem, 5vw, 6rem)",
            letterSpacing: "-0.03em",
            lineHeight: 1,
            mb: 1,
          }}
        >
          {count.toLocaleString()}{stat.suffix}
        </Typography>
        
        <Typography 
          variant="subtitle2" 
          sx={{ 
            color: "#ffffff",
            fontFamily: "'Inter', sans-serif",
            fontSize: "clamp(0.8rem, 1.2vw, 1.4rem)",
            fontWeight: 400
          }}
        >
          {stat.label}
        </Typography>
    </Box>
  );
};

export default function StatsPage() {
  const sectionRef = useRef(null);
  const imageContainerRef = useRef(null);
  const overlayRef = useRef(null);
  const textContainerRef = useRef(null);
  const imageRef = useRef(null);
  const [playNumbers, setPlayNumbers] = useState(false);

  const stats = [
    { number: "30", suffix: "+", label: "Years Experience" },
    { number: "35", suffix: "+", label: "Professions" },
    { number: "2000", suffix: "+", label: "Events" },
    { number: "15000", suffix: "+", label: "Serving Capacity" }
  ];

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 320px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=200%",
          scrub: 0.5,
          pin: true,
          onUpdate: (self) => {
            if (self.progress > 0.4 && !playNumbers) {
              setPlayNumbers(true);
            } else if (self.progress < 0.3 && playNumbers) {
              setPlayNumbers(false);
            }
          }
        }
      });

      // Zoom out effect on the image container
      tl.to(imageContainerRef.current, {
        width: "100%",
        height: "100vh",
        borderRadius: "0px",
        ease: "none",
        duration: 1
      }, 0);
      
      // Slight scale effect on the image inside to create parallax
      tl.to(imageRef.current, {
        scale: 1, // Let's set initial scale to 1.1 and end at 1.05
        ease: "none",
        duration: 1
      }, 0);

      // Darken overlay
      tl.to(overlayRef.current, {
        opacity: 0.4,
        ease: "none",
        duration: 0.4
      }, 0.5); // Starts half way through the scroll

      // Fade in texts
      tl.fromTo(textContainerRef.current, {
        opacity: 0,
        y: 40
      }, {
        opacity: 1,
        y: 0,
        ease: "power2.out",
        duration: 0.5
      }, 0.5);

    });

    return () => mm.revert();
  }, [playNumbers]);

  return (
    <Box 
      ref={sectionRef}
      sx={{ 
        position: "relative", 
        width: "100%", 
        height: "100vh",
        bgcolor: "#efebe3", // Light beige matching the reference
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden"
      }}
    >
      <Box 
        ref={imageContainerRef}
        sx={{
          position: "relative",
          width: "70%",
          height: "40vw",
          borderRadius: "32px",
          overflow: "hidden",
          willChange: "width, height, border-radius"
        }}
      >
        <Box
          ref={imageRef}
          component="img"
          src={jonathanImg}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            transform: "scale(1.1)", // Starts slightly zoomed in
            willChange: "transform"
          }}
        />
        
        <Box 
          ref={overlayRef}
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "#000",
            opacity: 0,
            pointerEvents: "none"
          }}
        />

        <Box 
          ref={textContainerRef}
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            opacity: 0, // Starts hidden
            p: "4vw"
          }}
        >
            <Typography
              variant="h4"
              sx={{
                  color: "white",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  fontSize: "clamp(1rem, 2vw, 2.5rem)",
                  mb: "4vw"
              }}
            >
                PKG-Groups produces
            </Typography>
            
          <Box 
            sx={{ 
              display: "flex", 
              flexWrap: "wrap", 
              width: "100%", 
              justifyContent: "center", 
              alignItems: "center", 
              gap: "6vw"
            }}
          >
            {stats.map((stat, i) => (
              <AnimatedStat key={i} stat={stat} play={playNumbers} />
            ))}
          </Box>
        </Box>

      </Box>
    </Box>
  );
}
