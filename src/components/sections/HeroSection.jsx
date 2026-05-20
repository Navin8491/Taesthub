import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ChevronDown } from 'lucide-react';

const HeroSection = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background Zoom Animation
      gsap.fromTo(".hero-bg-img", 
        { scale: 1.1 }, 
        { scale: 1, duration: 2.5, ease: "power3.out" }
      );

      // Hero content entrance animations
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(".hero-title", 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0.2 }
      )
      .fromTo(".hero-subtitle",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.6"
      )
      .fromTo(".hero-buttons .btn",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.15 },
        "-=0.5"
      )
      .fromTo(".scroll-indicator",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 1 },
        "-=0.2"
      );
      
      // Floating animation for scroll indicator
      gsap.to(".scroll-icon", {
        y: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        duration: 1.5
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero-section" ref={containerRef} style={{ position: 'relative', zIndex: 2, height: 'calc(100vh - 130px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px' }}>
      
      <div className="glass-container" style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '24px',
        padding: '3rem 2rem',
        maxWidth: '800px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <h1 className="hero-title" style={{
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 700,
          color: '#ffffff',
          fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
          lineHeight: 1.2,
          marginBottom: '1rem',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>
          Savor the Exceptional
        </h1>
        
        <p className="hero-subtitle" style={{
          fontFamily: "'Inter', sans-serif",
          color: '#e2e8f0',
          fontSize: 'clamp(1rem, 2vw, 1.25rem)',
          lineHeight: 1.6,
          marginBottom: '2.5rem',
          maxWidth: '600px',
          margin: '0 auto 2.5rem auto'
        }}>
          Experience a culinary journey where premium ingredients meet modern gastronomy in an unforgettable atmosphere.
        </p>

        <div className="hero-buttons" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/menu" className="btn" style={{
            background: '#6F4E37',
            color: '#ffffff',
            padding: '12px 32px',
            borderRadius: '50px',
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            textDecoration: 'none',
            fontSize: '1rem',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(111, 78, 55, 0.3)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            Explore Menu
          </Link>
          <Link to="/book" className="btn" style={{
            background: 'transparent',
            color: '#ffffff',
            padding: '12px 32px',
            borderRadius: '50px',
            border: '2px solid #ffffff',
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            textDecoration: 'none',
            fontSize: '1rem',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.color = '#1E1E1E'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#ffffff'; }}
          >
            Order Now
          </Link>
        </div>
      </div>

      <div className="scroll-indicator" style={{
        position: 'absolute',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: '#ffffff',
        fontFamily: "'Inter', sans-serif",
        fontSize: '0.875rem',
        letterSpacing: '1px',
        opacity: 0.8
      }}>
        <span style={{ marginBottom: '0.5rem' }}>SCROLL</span>
        <div className="scroll-icon">
          <ChevronDown size={24} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
