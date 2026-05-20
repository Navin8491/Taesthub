import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Star, Users, Utensils, Leaf } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const AboutSection = () => {
  const sectionRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background glow elements animation
      gsap.to(".glow-circle", {
        scale: 1.2,
        opacity: 0.8,
        duration: 4,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: 1
      });

      // Image entrance and floating loop
      gsap.fromTo(".img-box", 
        { x: -100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true
          },
          onComplete: () => {
            gsap.to(".img-box", {
              y: 15,
              duration: 2.5,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1
            });
          }
        }
      );

      // Heading slide-in
      gsap.from(".about-title", {
        x: -80,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        clearProps: "all",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true
        }
      });

      // Paragraphs stagger fade-up
      const textElements = gsap.utils.toArray(".about-text-content > p");
      gsap.from(textElements, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        clearProps: "all",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true
        }
      });

      // Stats cards stagger reveal
      const statCards = gsap.utils.toArray(".stat-card");
      gsap.from(statCards, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.2)",
        clearProps: "all",
        scrollTrigger: {
          trigger: ".stats-container",
          start: "top 90%",
          once: true
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { icon: <Star size={28} color="#D9A066" />, title: "10+ Years", subtitle: "Experience" },
    { icon: <Users size={28} color="#D9A066" />, title: "5000+", subtitle: "Happy Customers" },
    { icon: <Utensils size={28} color="#D9A066" />, title: "50+", subtitle: "Signature Dishes" },
    { icon: <Leaf size={28} color="#D9A066" />, title: "Fresh", subtitle: "Ingredients Daily" }
  ];

  return (
    <section
      ref={sectionRef}
      className="about_section layout_padding position-relative"
      style={{
        background: 'linear-gradient(135deg, #FDFBF7 0%, #F3EBE1 100%)',
        overflow: 'hidden'
      }}
    >
      {/* Decorative Glow Circles */}
      <div className="glow-circle" style={{ position: 'absolute', top: '10%', left: '-5%', width: '300px', height: '300px', background: 'rgba(217, 160, 102, 0.15)', borderRadius: '50%', filter: 'blur(80px)', zIndex: 0 }}></div>
      <div className="glow-circle" style={{ position: 'absolute', bottom: '10%', right: '-5%', width: '400px', height: '400px', background: 'rgba(111, 78, 55, 0.1)', borderRadius: '50%', filter: 'blur(100px)', zIndex: 0 }}></div>

      <div className="container-fluid px-4 px-lg-5 position-relative" style={{ zIndex: 1 }}>
        <div className="row align-items-center mb-5">
          {/* Left Side: Image */}
          <div className="col-lg-6 mb-5 mb-lg-0">
            <div 
              className="img-box position-relative" 
              style={{ paddingRight: '20px', cursor: 'pointer' }}
              onMouseEnter={(e) => {
                const img = e.currentTarget.querySelector('img');
                if(img) {
                  img.style.transform = 'scale(1.05)';
                  img.style.transition = 'transform 0.5s ease';
                }
              }}
              onMouseLeave={(e) => {
                const img = e.currentTarget.querySelector('img');
                if(img) {
                  img.style.transform = 'scale(1)';
                }
              }}
            >
              <div style={{ position: 'absolute', top: '-15px', right: '5px', bottom: '15px', left: '15px', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '20px', zIndex: 0, backdropFilter: 'blur(5px)' }}></div>
              <img src="/images/about-img.png" alt="About TasteHub" loading="lazy" decoding="async" style={{ width: '100%', height: 'auto', borderRadius: '20px', position: 'relative', zIndex: 1, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }} />
            </div>
          </div>

          {/* Right Side: Content */}
          <div className="col-lg-6">
            <div className="about-text detail-box ps-lg-5 relative z-10 opacity-100 visible" style={{ opacity: 1, visibility: 'visible', display: 'block' }}>
              <div className="heading_container mb-4">
                <h2 className="about-title" style={{ fontFamily: "'Dancing Script', cursive", fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#2d2d2d', fontWeight: 'bold', lineHeight: 1.2 }}>
                  We Are TasteHub
                </h2>
              </div>
              
              <div className="about-text-content">
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.1rem', color: '#333', lineHeight: 1.8, marginBottom: '25px', maxWidth: '600px' }}>
                  At TasteHub, we believe that great food brings people together. Born from a passion for culinary excellence and a love for authentic, high-quality ingredients, our café serves as a warm, inviting space where every meal is an experience.
                </p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.1rem', color: '#333', lineHeight: 1.8, marginBottom: '30px', maxWidth: '600px' }}>
                  Whether you're stopping by for your morning artisan coffee, enjoying our signature wood-fired pizzas, or treating yourself to our handcrafted pastries, we are dedicated to providing a premium dining experience that feels like home.
                </p>
              </div>

              {/* Accordion Hidden Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.04, 0.62, 0.23, 0.98] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ paddingTop: '10px', paddingBottom: '30px', maxWidth: '600px' }}>
                      <h4 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.2rem', color: '#1E1E1E', fontWeight: 600, marginBottom: '15px' }}>Our Philosophy</h4>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.1rem', color: '#333', lineHeight: 1.8, marginBottom: '20px' }}>
                        We adhere to a strict handmade food philosophy. Every dish is crafted from scratch using fresh ingredients delivered daily from local farms. Our chefs blend traditional techniques with modern culinary innovation.
                      </p>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.1rem', color: '#333', lineHeight: 1.8, marginBottom: '10px' }}>
                        Step into our warm café environment, designed with minimal luxury in mind, and let our dedicated team provide you with a truly premium service experience.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Read More / Show Less Button */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="btn"
                style={{
                  background: 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)',
                  color: '#FFFFFF',
                  padding: '14px 35px',
                  borderRadius: '50px',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  fontSize: '1rem',
                  border: '1px solid rgba(255,255,255,0.1)',
                  outline: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                  position: 'relative',
                  zIndex: 10,
                  cursor: 'pointer',
                  pointerEvents: 'auto'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #D9A066 0%, #B8804A 100%)';
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(217, 160, 102, 0.4)';
                  e.currentTarget.style.borderColor = 'rgba(217, 160, 102, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                }}
              >
                {isExpanded ? 'Show Less' : 'Read More'}
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.4, ease: "backOut" }}
                >
                  <ChevronDown size={22} />
                </motion.div>
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards Section */}
        <div className="row mt-5 stats-container pt-4" style={{ borderTop: '1px solid rgba(217, 160, 102, 0.2)' }}>
          {stats.map((stat, index) => (
            <div key={index} className="col-md-6 col-lg-3 mb-4 mb-lg-0">
              <div 
                className="stat-card"
                style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(15px)',
                  WebkitBackdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  borderRadius: '20px',
                  padding: '30px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                  transition: 'all 0.4s ease',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(217, 160, 102, 0.15)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)';
                }}
              >
                <div style={{ marginBottom: '15px', background: 'rgba(217, 160, 102, 0.1)', padding: '15px', borderRadius: '50%' }}>
                  {stat.icon}
                </div>
                <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.4rem', fontWeight: 700, color: '#1E1E1E', marginBottom: '5px' }}>
                  {stat.title}
                </h3>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.95rem', color: '#666', margin: 0 }}>
                  {stat.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default AboutSection;
