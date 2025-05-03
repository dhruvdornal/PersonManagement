// PersonHome.js
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
  const [scrollProgress, setScrollProgress] = useState(0);

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

    // Features cards animation
    gsap.utils.toArray('.feature-card').forEach((card, i) => {
      gsap.from(card, {
        opacity: 0,
        y: 80,
        duration: 0.7,
        delay: i * 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
        }
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

  return (
    <div className="person-home" style={{ background: "#f6f7fa" }}>
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
              transition: 'background 0.2s'
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
      

      {/* About Section */}
      <section id="about" className="about-section py-5 bg-light" style={{ background: "#eaf6fb" }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0" data-aos="fade-right">
              <h2 className="mb-4 section-title" style={{ color: "#3a7bd5", fontWeight: 700 }}>About Our Application</h2>
              <p style={{ fontSize: 18 }}>This Person Management System is designed to help you keep track of your contacts efficiently. With an intuitive interface and powerful features, managing contact information has never been easier.</p>
              <p style={{ fontSize: 18 }}>Our system is built as a Progressive Web App (PWA), meaning you can install it on your device and use it offline like a native application.</p>
              <div className="mt-4">
                <button className="btn btn-primary me-2 btn-with-hover" style={{
                  background: "linear-gradient(90deg, #3a7bd5 0%, #00d2ff 100%)",
                  border: "none", fontWeight: 600, borderRadius: 22
                }}>Learn More</button>
                <button className="btn btn-outline-primary btn-with-hover" style={{
                  border: "2px solid #3a7bd5", color: "#3a7bd5", fontWeight: 600, borderRadius: 22
                }}>Contact Us</button>
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
                background: "#fff", borderRadius: 18, boxShadow: '0 2px 16px 0 rgba(58,123,213,0.07)', padding: 32
              }}>
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
                background: "#fff", borderRadius: 18, boxShadow: '0 2px 16px 0 rgba(58,123,213,0.07)', padding: 32
              }}>
                <div className="counter-icon" style={{ color: "#3a7bd5", marginBottom: 12 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-download" viewBox="0 0 16 16">
                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                    <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                  </svg>
                </div>
                <div className="display-4 fw-bold text-primary" style={{ color: "#3a7bd5" }}>PWA</div>
                <p className="lead" style={{ color: "#3a7bd5" }}>Install on any device</p>
              </div>
            </div>
            <div className="col-md-4" data-aos="zoom-in" data-aos-delay="300">
              <div className="counter-item" style={{
                background: "#fff", borderRadius: 18, boxShadow: '0 2px 16px 0 rgba(58,123,213,0.07)', padding: 32
              }}>
                <div className="counter-icon" style={{ color: "#3a7bd5", marginBottom: 12 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-clock-history" viewBox="0 0 16 16">
                    <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535zm-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8.073 8.073 0 0 1-.401.432l-.707-.707z" />
                    <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0v1z" />
                    <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z" />
                  </svg>
                </div>
                <div className="display-4 fw-bold text-primary" style={{ color: "#3a7bd5" }}>24/7</div>
                <p className="lead" style={{ color: "#3a7bd5" }}>Offline Access</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5 bg-primary text-white" style={{
        background: "linear-gradient(90deg, #3a7bd5 0%, #00d2ff 100%)"
      }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 mb-4 mb-lg-0" data-aos="fade-right">
              <h2 className="mb-3" style={{ fontWeight: 700 }}>Ready to get started?</h2>
              <p className="lead mb-0" style={{ fontSize: 20 }}>Join thousands of users who trust our Person Management System.</p>
            </div>
            <div className="col-lg-4 text-lg-end" data-aos="fade-left">
              <button className="btn btn-light btn-lg px-4 shadow" style={{
                color: "#3a7bd5", fontWeight: 600, borderRadius: 24
              }}>Sign Up Now</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PersonHome;