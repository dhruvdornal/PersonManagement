import React, { useRef, useEffect, useState } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';

const PersonHome = () => {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const cursorFollower = document.createElement('div');
    cursorFollower.classList.add('cursor-follower');
  
    const inner = document.createElement('div');
    inner.classList.add('cursor-inner');
  
    const outer = document.createElement('div');
    outer.classList.add('cursor-outer');
  
    cursorFollower.appendChild(outer);
    cursorFollower.appendChild(inner);
    document.body.appendChild(cursorFollower);
  
    const moveCursor = (e) => {
      gsap.to(outer, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.2,
        ease: 'power2.out'
      });
  
      gsap.to(inner, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.05,
        ease: 'power1.out'
      });
    };
  
    document.addEventListener('mousemove', moveCursor);
  
    document.addEventListener('mousedown', () => {
      gsap.to(outer, { scale: 0.8, duration: 0.1 });
      gsap.to(inner, { scale: 0.8, duration: 0.1 });
    });
  
    document.addEventListener('mouseup', () => {
      gsap.to(outer, { scale: 1, duration: 0.1 });
      gsap.to(inner, { scale: 1, duration: 0.1 });
    });
  
    return () => {
      document.body.removeChild(cursorFollower);
      document.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mousedown', () => {});
      document.removeEventListener('mouseup', () => {});
    };
  }, []);
  

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    AOS.init({ duration: 800, once: false, mirror: true });

    // Configure NProgress
    NProgress.configure({ 
      showSpinner: false,
      trickleSpeed: 200,
      minimum: 0.08
    });

    // Scroll progress with NProgress
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const scrollPercent = scrollTop / (docHeight - winHeight);
      setScrollProgress(scrollPercent);
      
      // Update NProgress
      NProgress.set(scrollPercent);
    };

    window.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress();

    // Hero section particles
    const particles = [];
    const heroElement = heroRef.current;
    if (heroElement) {
      const particleContainer = heroElement.querySelector('.hero-particles');
      for (let i = 0; i < 24; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.opacity = Math.random() * 0.5 + 0.2;
        particle.style.width = `${Math.random() * 4 + 2}px`;
        particle.style.height = particle.style.width;
        particleContainer.appendChild(particle);
        particles.push(particle);
        animateParticle(particle);
      }
    }
    
    function animateParticle(particle) {
      const duration = Math.random() * 8 + 4;
      const xDistance = Math.random() * 60 - 30;
      const yDistance = Math.random() * 60 - 30;
      gsap.to(particle, {
        x: xDistance,
        y: yDistance,
        opacity: Math.random() * 0.5 + 0.2,
        duration: duration,
        ease: "sine.inOut",
        onComplete: () => {
          gsap.set(particle, { x: 0, y: 0 });
          animateParticle(particle);
        }
      });
    }

    // Hero background parallax
    gsap.to('.hero-section', {
      backgroundPosition: `50% ${scrollProgress * 60}%`,
      ease: "none",
      scrollTrigger: {
        trigger: '.hero-section',
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    // Features cards animation - staggered appearance
    gsap.set('.feature-card', { y: 100, opacity: 0 });
    
    ScrollTrigger.create({
      trigger: '.features-section',
      start: "top 70%",
      onEnter: () => {
        gsap.to('.feature-card', {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: "back.out(1.2)"
        });
      }
    });

    // Features cards 3D tilt effect
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const xPercent = x / rect.width - 0.5;
        const yPercent = y / rect.height - 0.5;
        
        gsap.to(card, {
          rotationY: xPercent * 10,
          rotationX: yPercent * -10,
          transformPerspective: 1000,
          ease: 'power1.out',
          duration: 0.4
        });
        
        gsap.to(card.querySelector('.feature-icon'), {
          x: xPercent * 15,
          y: yPercent * 15,
          ease: 'power1.out',
          duration: 0.4
        });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotationY: 0,
          rotationX: 0,
          ease: 'power3.out',
          duration: 0.6
        });
        
        gsap.to(card.querySelector('.feature-icon'), {
          x: 0,
          y: 0,
          ease: 'power3.out',
          duration: 0.6
        });
      });
    });

    // About section image float
    gsap.to('.about-img-float', {
      y: -18,
      duration: 2.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Stats counter animation
    ScrollTrigger.create({
      trigger: '.stats-section',
      start: "top 80%",
      onEnter: () => {
        document.querySelectorAll('.counter-item').forEach(item => {
          item.classList.add('counting');
        });
      }
    });

    // CTA button pulse animation
    gsap.to('.pulsing-btn', {
      scale: 1.05,
      boxShadow: '0 8px 28px 0 rgba(58,123,213,0.3)',
      repeat: -1,
      yoyo: true,
      duration: 1.5,
      ease: "sine.inOut"
    });

    // Bottom CTA section reveal
    ScrollTrigger.create({
      trigger: '.cta-section',
      start: "top 80%",
      onEnter: () => {
        gsap.fromTo('.cta-section .container', 
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
        );
      }
    });

    // Clean up
    return () => {
      particles.forEach(particle => particle.remove());
      window.removeEventListener('scroll', updateScrollProgress);
      NProgress.remove();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      AOS.refresh();
    };
  }, [scrollProgress]);

  const navItems = ['home', 'features', 'about', 'stats'];
  const scrollToSection = (sectionId) => {
    gsap.to(window, {
      duration: 1,
      scrollTo: `#${sectionId}`,
      ease: "power3.inOut"
    });
  };

  // Data for features section
  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-person-vcard" viewBox="0 0 16 16">
          <path d="M5 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm4-2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5ZM9 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4A.5.5 0 0 1 9 8Zm1 2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5Z"/>
          <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2ZM1 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4Z"/>
        </svg>
      ),
      title: "Contact Management",
      description: "Easily add, edit, and organize your contacts with our intuitive interface.",
      bgColor: "linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
        </svg>
      ),
      title: "Advanced Search",
      description: "Find contacts quickly with powerful search and filtering capabilities.",
      bgColor: "linear-gradient(135deg, #00b09b 0%, #96c93d 100%)"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-bell" viewBox="0 0 16 16">
          <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
        </svg>
      ),
      title: "Reminders & Alerts",
      description: "Never forget important dates with customizable reminders and notifications.",
      bgColor: "linear-gradient(135deg, #f83600 0%, #f9d423 100%)"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-shield-lock" viewBox="0 0 16 16">
          <path d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z"/>
          <path d="M9.5 6.5a1.5 1.5 0 0 1-1 1.415l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99a1.5 1.5 0 1 1 2-1.415z"/>
        </svg>
      ),
      title: "Data Security",
      description: "Your contact information is secure with our advanced encryption technology.",
      bgColor: "linear-gradient(135deg, #4b6cb7 0%, #182848 100%)"
    }
  ];

  return (
    <div className="person-home" style={{ background: "#f6f7fa" }}>
      {/* Progress Bar */}
      <div className="progress-bar" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '4px',
        width: `${scrollProgress * 100}%`,
        background: 'linear-gradient(90deg, #3a7bd5 0%, #00d2ff 100%)',
        zIndex: 1002,
        transition: 'width 0.2s ease-out'
      }} />

      {/* Navigation Dots */}
      <div className="nav-dots" style={{
        position: 'fixed', right: 24, top: '50%', transform: 'translateY(-50%)', zIndex: 1001, display: 'flex', flexDirection: 'column', gap: 18
      }}>
        {navItems.map((item, index) => (
          <div
            key={item}
            className={`nav-dot${scrollProgress > index / navItems.length - 0.1 && scrollProgress < (index + 1) / navItems.length + 0.1 ? ' active' : ''}`}
            onClick={() => scrollToSection(item)}
            style={{
              width: 13, height: 13, borderRadius: '50%',
              background: scrollProgress > index / navItems.length - 0.1 && scrollProgress < (index + 1) / navItems.length + 0.1
                ? 'linear-gradient(135deg,rgb(7, 8, 11) 0%,rgb(16, 17, 18) 100%)'
                : '#c3cfe2',
              border: '2px solidrgb(10, 11, 14)',
              cursor: 'pointer',
              transition: 'background 0.2s, transform 0.3s',
              transform: scrollProgress > index / navItems.length - 0.1 && scrollProgress < (index + 1) / navItems.length + 0.1 
                ? 'scale(1.2)' : 'scale(1)'
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section
        id="home"
        className="hero-section"
        ref={heroRef}
        style={{
          minHeight: '90vh',
          background: 'linear-gradient(120deg, #3a7bd5 0%, #00d2ff 100%)',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div className="hero-particles" style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1
        }} />
        <div className="hero-overlay" style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: 'linear-gradient(120deg, rgba(58,123,213,0.7) 0%, rgba(0,210,255,0.5) 100%)',
          zIndex: 2
        }} />
        <div className="container hero-content text-center" style={{ position: 'relative', zIndex: 3 }}>
          <motion.h1
            className="display-3 mb-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ fontWeight: 700, letterSpacing: 1 }}
          >
            Person Management System
          </motion.h1>
          <motion.p
            className="lead mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ fontSize: 22, color: '#eaf6fb' }}
          >
            Easily manage contacts with our modern, responsive application
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <button className="btn btn-light btn-lg px-4 shadow pulsing-btn"
              style={{
                fontWeight: 600,
                color: '#3a7bd5',
                borderRadius: 24,
                boxShadow: '0 4px 24px 0 rgba(58,123,213,0.12)'
              }}
            >
              Get Started
            </button>
          </motion.div>
          <div className="scroll-indicator floating-element" style={{ marginTop: 60 }}>
            <div className="mouse" style={{
              width: 28, height: 48, border: '2px solid #fff', borderRadius: 16, margin: '0 auto', position: 'relative'
            }}>
              <div className="wheel" style={{
                width: 6, height: 10, background: '#fff', borderRadius: 4, position: 'absolute', left: '50%', top: 8, transform: 'translateX(-50%)'
              }} />
            </div>
            <div className="arrow-scroll" style={{ textAlign: 'center', marginTop: 8 }}>
              <span style={{
                display: 'block', width: 8, height: 8, borderBottom: '2px solid #fff', borderRight: '2px solid #fff',
                margin: '0 auto', transform: 'rotate(45deg)', marginBottom: 2
              }} />
              <span style={{
                display: 'block', width: 8, height: 8, borderBottom: '2px solid #fff', borderRight: '2px solid #fff',
                margin: '0 auto', transform: 'rotate(45deg)', marginBottom: 2
              }} />
              <span style={{
                display: 'block', width: 8, height: 8, borderBottom: '2px solid #fff', borderRight: '2px solid #fff',
                margin: '0 auto', transform: 'rotate(45deg)'
              }} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section py-5" ref={featuresRef} style={{ 
        background: "#fff",
        position: "relative",
        overflow: "hidden"
      }}>
        <div className="features-bg" style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "radial-gradient(circle at 10% 20%, rgba(216, 241, 250, 0.46) 0%, rgba(255, 255, 255, 0.1) 90.2%)",
          zIndex: 0
        }} />
        
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="text-center mb-5" data-aos="fade-up">
            <h2 className="section-title" style={{ color: "#3a7bd5", fontWeight: 700 }}>Powerful Features</h2>
            <p className="lead" style={{ color: "#5f6c7b", maxWidth: "700px", margin: "0 auto" }}>
              Everything you need to manage your contacts efficiently in one place
            </p>
          </div>
          
          <div className="row g-4">
            {features.map((feature, index) => (
              <div key={index} className="col-lg-6 mb-4" data-aos="fade-up" data-aos-delay={index * 100}>
                <div 
                  className="feature-card" 
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    background: "#fff",
                    borderRadius: "18px",
                    boxShadow: hoveredCard === index ? 
                      "0 15px 35px rgba(58, 123, 213, 0.15)" : 
                      "0 5px 15px rgba(58, 123, 213, 0.06)",
                    padding: "32px",
                    height: "100%",
                    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    transform: hoveredCard === index ? "translateY(-10px)" : "translateY(0)",
                    overflow: "hidden",
                    position: "relative"
                  }}
                >
                  <div 
                    className="feature-bg-shape" 
                    style={{
                      position: "absolute",
                      top: hoveredCard === index ? "-10%" : "-50%",
                      right: hoveredCard === index ? "-10%" : "-50%",
                      width: "200px",
                      height: "200px",
                      borderRadius: "50%",
                      background: feature.bgColor,
                      opacity: hoveredCard === index ? 0.1 : 0,
                      transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                    }}
                  />
                  
                  <div 
                    className="feature-icon"
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "16px",
                      background: feature.bgColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      marginBottom: "24px",
                      position: "relative"
                    }}
                  >
                    {feature.icon}
                  </div>
                  
                  <h3 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "16px" }}>{feature.title}</h3>
                  <p style={{ fontSize: "16px", color: "#5f6c7b", marginBottom: 0 }}>{feature.description}</p>
                  
                  <div 
                    className="learn-more-link"
                    style={{
                      marginTop: "20px",
                      display: "inline-flex",
                      alignItems: "center",
                      color: "#3a7bd5",
                      fontWeight: 600,
                      opacity: hoveredCard === index ? 1 : 0,
                      transform: hoveredCard === index ? "translateY(0)" : "translateY(10px)",
                      transition: "all 0.3s ease"
                    }}
                  >
                    Learn more
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16" style={{ marginLeft: "8px" }}>
                      <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section py-5 bg-light" style={{ background: "#eaf6fb" }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0" data-aos="fade-right">
              <h2 className="mb-4 section-title" style={{ color: "#3a7bd5", fontWeight: 700 }}>About Our Application</h2>
              <p style={{ fontSize: 18 }}>This Person Management System is designed to help you keep track of your contacts efficiently. With an intuitive interface and powerful features, managing contact information has never been easier.</p>
              <p style={{ fontSize: 18 }}>Our system is built as a Progressive Web App (PWA), meaning you can install it on your device and use it offline like a native application.</p>
              <div className="mt-4">
                <button 
                  className="btn btn-primary me-2 btn-with-hover" 
                  style={{
                    background: "linear-gradient(90deg, #3a7bd5 0%, #00d2ff 100%)",
                    border: "none", 
                    fontWeight: 600, 
                    borderRadius: 22,
                    position: "relative",
                    overflow: "hidden"
                  }}
                >
                  <span className="btn-content" style={{ position: "relative", zIndex: 1 }}>Learn More</span>
                  <div className="btn-bg-hover" style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(90deg, #00d2ff 0%, #3a7bd5 100%)",
                    opacity: 0,
                    transition: "opacity 0.3s ease"
                  }} />
                </button>
                <button 
                  className="btn btn-outline-primary btn-with-hover" 
                  style={{
                    border: "2px solid #3a7bd5", 
                    color: "#3a7bd5", 
                    fontWeight: 600, 
                    borderRadius: 22,
                    position: "relative",
                    overflow: "hidden"
                  }}
                >
                  <span className="btn-content" style={{ position: "relative", zIndex: 1 }}>Contact Us</span>
                  <div className="btn-bg-hover" style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "rgba(58, 123, 213, 0.1)",
                    opacity: 0,
                    transition: "opacity 0.3s ease"
                  }} />
                </button>
              </div>
            </div>
            <div className="col-lg-6" data-aos="fade-left" data-aos-delay="200">
              <div className="rounded-3 shadow-lg overflow-hidden about-img-float" style={{
                background: "linear-gradient(120deg, #3a7bd5 0%, #00d2ff 100%)",
                padding: 32, textAlign: "center"
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#fff" className="bi bi-card-checklist" viewBox="0 0 16 16">
                  <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z" />
                  <path d="M7 5.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0zM7 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0z" />
                </svg>
                <h3 className="mt-4" style={{ color: "#fff", fontWeight: 600 }}>Organize your contacts</h3>
                <p style={{ color: "#eaf6fb" }}>Keep all your important contact information in one place</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="stats-section py-5" style={{ background: "#f6f7fa" }}>
        <div className="container">
          <h2 className="text-center mb-5 section-title" data-aos="fade-up" style={{ color: "#3a7bd5", fontWeight: 700 }}>Why Use our System?</h2>
          <div className="row g-4 text-center">
            <div className="col-md-4" data-aos="zoom-in" data-aos-delay="100">
              <div className="counter-item" style={{
                background: "#fff", 
                borderRadius: 18, 
                boxShadow: '0 2px 16px 0 rgba(58,123,213,0.07)', 
                padding: 32,
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-10px)";
                e.currentTarget.style.boxShadow = "0 15px 30px rgba(58,123,213,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 16px 0 rgba(58,123,213,0.07)";
              }}
              >
                <div className="counter-icon" style={{ color: "#3a7bd5", marginBottom: 12 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-phone" viewBox="0 0 16 16">
                    <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h6zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H5z" />
                    <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                  </svg>
                </div>
                <div className="display-4 fw-bold text-primary" style={{ color: "#3a7bd5" }}>
                  <CountUp end={100} suffix="%" duration={2.5} />
                </div>
                <p className="lead" style={{ color: "#3a7bd5" }}>Responsive Design</p>
              </div>
            </div>
            <div className="col-md-4" data-aos="zoom-in" data-aos-delay="200">
              <div className="counter-item" style={{
                background: "#fff", 
                borderRadius: 18, 
                boxShadow: '0 2px 16px 0 rgba(58,123,213,0.07)', 
                padding: 32,
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-10px)";
                e.currentTarget.style.boxShadow = "0 15px 30px rgba(58,123,213,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 16px 0 rgba(58,123,213,0.07)";
              }}
              >
                <div className="counter-icon" style={{ color: "#3a7bd5", marginBottom: 12 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-download" viewBox="0 0 16 16">
                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                    <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                  </svg>
                </div>
                <div className="display-4 fw-bold text-primary" style={{ color: "#3a7bd5" }}>
                  <CountUp end={100} suffix="%" duration={2.5} delay={0.3} />
                </div>
                <p className="lead" style={{ color: "#3a7bd5" }}>Install on any device</p>
              </div>
            </div>
            <div className="col-md-4" data-aos="zoom-in" data-aos-delay="300">
              <div className="counter-item" style={{
                background: "#fff", 
                borderRadius: 18, 
                boxShadow: '0 2px 16px 0 rgba(58,123,213,0.07)', 
                padding: 32,
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-10px)";
                e.currentTarget.style.boxShadow = "0 15px 30px rgba(58,123,213,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 16px 0 rgba(58,123,213,0.07)";
              }}
              >
                <div className="counter-icon" style={{ color: "#3a7bd5", marginBottom: 12 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-clock-history" viewBox="0 0 16 16">
                    <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535zm-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8.073 8.073 0 0 1-.401.432l-.707-.707z" />
                    <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0v1z" />
                    <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z" />
                  </svg>
                </div>
                <div className="display-4 fw-bold text-primary" style={{ color: "#3a7bd5" }}>
                  <CountUp end={24} suffix="/7" duration={2.5} delay={0.6} />
                </div>
                <p className="lead" style={{ color: "#3a7bd5" }}>Offline Access</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5 bg-primary text-white" style={{
        background: "linear-gradient(90deg, #3a7bd5 0%, #00d2ff 100%)",
        position: "relative",
        overflow: "hidden"
      }}>
        <div className="cta-particles" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} />
        
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 mb-4 mb-lg-0" data-aos="fade-right">
              <h2 className="mb-3" style={{ fontWeight: 700 }}>Ready to get started?</h2>
              <p className="lead mb-0" style={{ fontSize: 20 }}>Join thousands of users who trust our Person Management System.</p>
            </div>
            <div className="col-lg-4 text-lg-end" data-aos="fade-left">
              <button className="btn btn-light btn-lg px-4 shadow" style={{
                color: "#3a7bd5", 
                fontWeight: 600, 
                borderRadius: 24,
                transition: "transform 0.3s ease, box-shadow 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.1)";
              }}
              >
                Sign Up Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PersonHome;
