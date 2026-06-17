import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../firebaseClient';
import { collection, getDocs } from 'firebase/firestore';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const ClientSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);

  // Load reviews/testimonials dynamically from Firestore
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'reviews'));
        const list = [];
        querySnapshot.forEach((doc) => {
          list.push(doc.data());
        });
        setTestimonials(list);
      } catch (error) {
        console.error("Error fetching reviews from Firestore:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // Responsive check for testimonials count
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // GSAP Scroll Animation
  useEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".heading_container",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );

      gsap.fromTo(".carousel-wrap",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [loading]);

  // Carousel Logic
  useEffect(() => {
    if (loading || testimonials.length === 0) return;
    const timer = setInterval(() => {
      const maxLimit = isMobile ? testimonials.length : testimonials.length - 1;
      if (maxLimit > 0) {
        setCurrent((prev) => (prev + 1) % maxLimit);
      }
    }, 6000);
    return () => clearInterval(timer);
  }, [isMobile, loading, testimonials]);

  const handlePrev = () => {
    if (testimonials.length === 0) return;
    setCurrent((prev) => {
      if (isMobile) {
        return prev === 0 ? testimonials.length - 1 : prev - 1;
      } else {
        return prev === 0 ? testimonials.length - 2 : prev - 1;
      }
    });
  };

  const handleNext = () => {
    if (testimonials.length === 0) return;
    const maxLimit = isMobile ? testimonials.length : testimonials.length - 1;
    if (maxLimit > 0) {
      setCurrent((prev) => (prev + 1) % maxLimit);
    }
  };

  // Render Stars
  const renderStars = (rating) => {
    return (
      <div style={{ display: 'flex', gap: '4px', marginBottom: '15px' }}>
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={16} 
            fill={i < rating ? '#D9A066' : 'transparent'} 
            color={i < rating ? '#D9A066' : '#ccc'} 
          />
        ))}
      </div>
    );
  };

  if (loading || testimonials.length === 0) {
    return null; // Don't show the testimonials block until loaded
  }

  return (
    <section 
      ref={sectionRef}
      className="client_section layout_padding-bottom"
      style={{ padding: 'clamp(50px, 10vw, 90px) 0', backgroundColor: '#F8F5F2' }}
    >
      <div className="container-fluid px-4 px-lg-5" style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div className="heading_container heading_center mb-5">
          <h2 style={{ fontFamily: "'Dancing Script', cursive", fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#1E1E1E', fontWeight: 'bold' }}>
            What Our Customers Say
          </h2>
        </div>
        <div className="carousel-wrap">
          <div className="client_owl-carousel" style={{ position: 'relative', overflow: 'hidden', paddingBottom: '60px' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="row justify-content-center"
              >
                {(isMobile 
                  ? [testimonials[current]] 
                  : [testimonials[current], testimonials[current + 1]].filter(Boolean)
                ).map((testimonial, idx) => (
                  <div key={`${testimonial.reviewId || testimonial.id}-${idx}`} className="col-md-6 mb-4 mb-md-0">
                    <motion.div 
                      className="testimonial-card"
                      whileHover={{ scale: 1.02, y: -5 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.7)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        borderRadius: '24px',
                        padding: 'clamp(20px, 5vw, 40px)',
                        height: '100%',
                        border: '1px solid rgba(255, 255, 255, 0.4)',
                        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.04)',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        zIndex: 1
                      }}
                    >
                      {/* Customer Info Header */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '20px' }}>
                        <div style={{ 
                          width: '80px', 
                          height: '80px', 
                          borderRadius: '50%', 
                          overflow: 'hidden',
                          border: '4px solid #FFFFFF',
                          boxShadow: '0 5px 15px rgba(0,0,0,0.08)'
                        }}>
                          <img src={testimonial.image} alt={testimonial.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div>
                          <h6 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.2rem', fontWeight: 600, color: '#1E1E1E', margin: '0 0 5px 0' }}>
                            {testimonial.name}
                          </h6>
                          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', color: '#6F4E37', margin: 0, fontWeight: 500 }}>
                            {testimonial.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Stars */}
                      {renderStars(testimonial.rating)}

                      {/* Review Text */}
                      <p style={{ 
                        fontFamily: "'Inter', sans-serif", 
                        fontSize: '1.05rem', 
                        color: '#444', 
                        lineHeight: 1.7, 
                        margin: 0,
                        fontStyle: 'italic',
                        position: 'relative'
                      }}>
                        "{testimonial.text}"
                      </p>
                      
                      {/* Decorative Quote Icon Background */}
                      <div style={{
                        position: 'absolute',
                        bottom: '20px',
                        right: '30px',
                        fontSize: '6rem',
                        fontFamily: "serif",
                        color: 'rgba(111, 78, 55, 0.05)',
                        zIndex: -1,
                        lineHeight: 1
                      }}>
                        "
                      </div>
                    </motion.div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Custom Carousel Navigation */}
            <div className="carousel_btn-box" style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '40px' }}>
              <button 
                onClick={handlePrev} 
                className="carousel-control-prev"
                type="button"
                style={{ 
                  position: 'relative', 
                  width: '50px', 
                  height: '50px', 
                  background: '#D9A066', 
                  borderRadius: '50%', 
                  opacity: 1, 
                  border: 'none', 
                  transition: 'all 0.3s ease', 
                  boxShadow: '0 4px 15px rgba(217, 160, 102, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <ChevronLeft color="#FFFFFF" size={24} />
              </button>
              <button 
                onClick={handleNext} 
                className="carousel-control-next"
                type="button" 
                style={{ 
                  position: 'relative', 
                  width: '50px', 
                  height: '50px', 
                  background: '#D9A066', 
                  borderRadius: '50%', 
                  opacity: 1, 
                  border: 'none', 
                  transition: 'all 0.3s ease', 
                  boxShadow: '0 4px 15px rgba(217, 160, 102, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <ChevronRight color="#FFFFFF" size={24} />
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientSection;
