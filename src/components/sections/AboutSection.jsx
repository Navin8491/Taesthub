import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AboutSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image sliding in from left
      gsap.fromTo(".img-box",
        { x: -100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          clearProps: "all",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
            once: true
          }
        }
      );

      // Text elements staggering in from bottom
      const detailElements = gsap.utils.toArray(".detail-box > *");
      gsap.fromTo(detailElements,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          clearProps: "all",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
            once: true
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="about_section layout_padding"
    >
      <div className="container-fluid px-4 px-lg-5">
        <div className="row align-items-center">
          <div className="col-lg-6 mb-5 mb-lg-0">
            <div className="img-box position-relative" style={{ paddingRight: '20px' }}>
              <div style={{ position: 'absolute', top: '-15px', right: '5px', bottom: '15px', left: '15px', backgroundColor: '#F8F5F2', borderRadius: '20px', zIndex: 0 }}></div>
              <img src="/images/about-img.png" alt="About TasteHub" loading="lazy" decoding="async" style={{ width: '100%', height: 'auto', borderRadius: '20px', position: 'relative', zIndex: 1, boxShadow: '0 15px 35px rgba(0,0,0,0.1)' }} />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="detail-box ps-lg-5">
              <div className="heading_container mb-4">
                <h2 style={{ fontFamily: "'Dancing Script', cursive", fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', color: '#1E1E1E', fontWeight: 'bold' }}>
                  We Are TasteHub
                </h2>
              </div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.05rem', color: '#555', lineHeight: 1.7, marginBottom: '25px' }}>
                At TasteHub, we believe that great food brings people together. Born from a passion for culinary excellence and a love for authentic, high-quality ingredients, our café serves as a warm, inviting space where every meal is an experience.
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.05rem', color: '#555', lineHeight: 1.7, marginBottom: '35px' }}>
                Whether you're stopping by for your morning artisan coffee, enjoying our signature wood-fired pizzas, or treating yourself to our handcrafted pastries, we are dedicated to providing a premium dining experience that feels like home.
              </p>
              <Link 
                to="/about" 
                onClick={() => window.scrollTo(0, 0)}
                className="btn"
                style={{
                  backgroundColor: '#1E1E1E',
                  color: '#FFFFFF',
                  padding: '12px 30px',
                  borderRadius: '45px',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  fontSize: '1rem',
                  textDecoration: 'none',
                  display: 'inline-block',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                  position: 'relative',
                  zIndex: 10,
                  cursor: 'pointer',
                  pointerEvents: 'auto'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#D9A066';
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
                  e.currentTarget.style.boxShadow = '0 14px 30px rgba(217, 160, 102, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#1E1E1E';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                }}
              >
                Read More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
