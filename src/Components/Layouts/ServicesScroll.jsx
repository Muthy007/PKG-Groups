import React, { useRef } from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const ServicesScroll = ({ services }) => {
  const containerRef = useRef(null);

  const enrichedServices = services.map((service, index) => {
    switch(index) {
        case 0: 
            return { ...service, metadata: [
                { label: "GUEST CAPACITY", value: "50 TO 5,000+ DELEGATES" },
                { label: "VIBE & ATMOSPHERE", value: "INNOVATIVE & PROFESSIONAL" },
                { label: "EVENT TYPE", value: "B2B CONFERENCES & GALAS" }
            ] };
        case 1: 
            return { ...service, metadata: [
                { label: "GUEST CAPACITY", value: "100 TO 3,000+ GUESTS" },
                { label: "VIBE & ATMOSPHERE", value: "ELEGANT & ROMANTIC" },
                { label: "EVENT TYPE", value: "LUXURY CELEBRATIONS" }
            ] };
        case 2: 
            return { ...service, metadata: [
                { label: "GUEST CAPACITY", value: "20 TO 1,000+ GUESTS" },
                { label: "VIBE & ATMOSPHERE", value: "INTIMATE & SPECTACULAR" },
                { label: "EVENT TYPE", value: "MILESTONE PARTIES" }
            ] };
        case 3: 
            return { ...service, metadata: [
                { label: "SERVICE SCOPE", value: "EXCLUSIVE PREMIUM DINING" },
                { label: "CUISINE EXPERTISE", value: "GLOBAL MULTI-CUISINE" },
                { label: "DELIVERY", value: "IMPECCABLE PRECISION" }
            ] };
        default: return { ...service, metadata: [] };
    }
  });

  useGSAP(() => {
    const panels = gsap.utils.toArray('.service-left-panel');
    const rightCards = gsap.utils.toArray('.service-right-card');
    
   
    gsap.set(rightCards, { autoAlpha: 0, y: 50 });
    gsap.set(rightCards[0], { autoAlpha: 1, y: 0 });
    
   
    panels.forEach((panel, i) => {
      const imgWrap = panel.querySelector('.service-img-wrap');
      const title = panel.querySelector('.service-title');
      if (i === 0) {
        gsap.set(imgWrap, { height: '16vh', opacity: 1, marginTop: '15px' });
        gsap.set(title, { color: '#ffffff', scale: 1, transformOrigin: 'left center' });
      } else {
        gsap.set(imgWrap, { height: 0, opacity: 0, marginTop: '0px' });
        gsap.set(title, { color: 'rgba(255,255,255,0.4)', scale: 0.85, transformOrigin: 'left center' });
      }
    });

    const totalPanels = panels.length;
    containerRef.current.dataset.activeIndex = "0";

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: `+=${totalPanels * 100}%`, 
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        let index = Math.floor(self.progress * totalPanels);
        if (index === totalPanels) index = totalPanels - 1;

        if (containerRef.current.dataset.activeIndex !== String(index)) {
          containerRef.current.dataset.activeIndex = index;

         
          rightCards.forEach((card, i) => {
            if (i === index) {
              gsap.to(card, { autoAlpha: 1, y: 0, duration: 0.5, overwrite: "auto", ease: "power2.out" });
            } else {
              gsap.to(card, { autoAlpha: 0, y: i < index ? -50 : 50, duration: 0.4, overwrite: "auto", ease: "power2.in" });
            }
          });

          
          panels.forEach((panel, i) => {
            const imgWrap = panel.querySelector('.service-img-wrap');
            const title = panel.querySelector('.service-title');
            if (i === index) {
              gsap.to(imgWrap, { height: '16vh', opacity: 1, marginTop: '15px', duration: 0.5, ease: "power3.inOut", overwrite: "auto" });
              gsap.to(title, { color: '#ffffff', scale: 1, duration: 0.4, ease: "power2.out", overwrite: "auto" });
            } else {
              gsap.to(imgWrap, { height: 0, opacity: 0, marginTop: '0px', duration: 0.5, ease: "power3.inOut", overwrite: "auto" });
              gsap.to(title, { color: 'rgba(255,255,255,0.4)', scale: 0.85, duration: 0.4, ease: "power2.out", overwrite: "auto" });
            }
          });
        }
      }
    });
  }, { scope: containerRef });

  return (
    <Box ref={containerRef} id="services" sx={{ position: "relative", minHeight: "100vh", width: "100%", zIndex: 1, bgcolor: 'transparent', display: 'flex', overflow: 'hidden' }}>
      <Container maxWidth={false} sx={{ px: "8vw", pt: "8vw", pb: "6vw", height: '100%', display: 'flex', alignItems: 'center' }}>
        
        <Grid container sx={{ flex: 1, alignItems: 'center' }} spacing={6}>
     
          <Grid item xs={5} lg={4} sx={{ display: 'flex', flexDirection: 'column', gap: "1.5vw", justifyContent: 'center' }}>
            
            <Box sx={{ mb: "1.5vw" }}>
                <Typography variant="subtitle1" color="#cc9900" fontWeight="bold" letterSpacing="3px">WHAT WE DO</Typography>
                <Typography variant="h3" fontWeight="bold" mt={1} sx={{ color: "#fff", fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 2.5vw, 2.8rem)", lineHeight: 1.2 }}>
                    Masterpieces in<br/>Decorations
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: "1.2vw" }}>
              {enrichedServices.map((service, i) => (
                <Box key={i} className="service-left-panel" sx={{ borderBottom: "1px solid rgba(255,255,255,0.1)", pb: "1vw", cursor: 'default' }}>
                  <Typography className="service-title" variant="h4" sx={{ fontWeight: 600, fontFamily: "'Inter', sans-serif", fontSize: "clamp(1.2rem, 1.6vw, 1.8rem)", m: 0, transformOrigin: 'left center' }}>
                    {service.title}
                  </Typography>
                  <Box className="service-img-wrap" sx={{ width: '100%', height: 0, overflow: 'hidden', opacity: 0, borderRadius: '12px' }}>
                    <Box component="img" src={service.img} alt={service.title} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>

          
          <Grid item xs={7} lg={8} sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'grid', width: '100%' }}>
             {enrichedServices.map((service, i) => (
                 <Box key={i} className="service-right-card" sx={{ 
                     gridArea: '1 / 1', 
                     width: '100%',
                     background: 'rgba(255, 255, 255, 0.03)',
                     backdropFilter: 'blur(30px)',
                     WebkitBackdropFilter: 'blur(30px)',
                     border: '1px solid rgba(255, 255, 255, 0.1)',
                     borderRadius: '24px',
                     p: "3vw",
                     display: 'flex',
                     flexDirection: 'column',
                     boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
                     borderTop: '1px solid rgba(255,255,255,0.2)',
                     borderLeft: '1px solid rgba(255,255,255,0.2)'
                 }}>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                        <Box sx={{ color: '#cc9900', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, borderRadius: '50%', background: 'rgba(204,153,0,0.1)' }}>
                            {service.icon}
                        </Box>
                        <Typography variant="h2" sx={{ color: '#fff', fontWeight: 800, fontFamily: "'Inter', sans-serif", fontSize: "clamp(1.8rem, 2.8vw, 3.2rem)", wordBreak: 'break-word', lineHeight: 1.1 }}>
                            {service.title.toUpperCase()}
                        </Typography>
                    </Box>

                    
                    <Grid container spacing={4} sx={{ mb: 5 }}>
                        {service.metadata.map((meta, idx) => (
                            <Grid item xs={6} key={idx}>
                                <Typography sx={{ color: '#cc9900', fontSize: 'clamp(0.6rem, 0.8vw, 0.8rem)', fontWeight: 700, letterSpacing: '2px', mb: 1, textTransform: 'uppercase' }}>
                                    {meta.label}
                                </Typography>
                                <Typography sx={{ color: '#fff', fontSize: 'clamp(0.9rem, 1.2vw, 1.2rem)', fontWeight: 500 }}>
                                    {meta.value}
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>

                    
                    <Box sx={{ height: '1px', width: '100%', background: 'linear-gradient(90deg, rgba(255,255,255,0.2), transparent)', mb: 4 }} />
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(0.9rem, 1vw, 1.1rem)', lineHeight: 1.8, maxWidth: '90%' }}>
                        {service.desc}
                    </Typography>
                 </Box>
             ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ServicesScroll;
