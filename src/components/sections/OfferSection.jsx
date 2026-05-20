import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { CheckCircle2, ShoppingCart } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const OfferSection = () => {
  const { addToCart } = useCart();
  const [toastMessage, setToastMessage] = useState('');
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const boxes = gsap.utils.toArray('.offer-box');
      gsap.fromTo(boxes, 
        { y: 60, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          stagger: 0.2, 
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
  }, []);

  const handleAddToCart = (item) => {
    addToCart(item);
    setToastMessage(`${item.name} added to cart!`);
    setTimeout(() => setToastMessage(''), 3000);
  };
  return (
    <section 
      ref={sectionRef}
      className="offer_section layout_padding-bottom"
    >
      <div className="offer_container">
        <div className="container-fluid px-4 px-lg-5">
          <div className="row">
            <div className="col-md-6 offer-box" style={{ opacity: 0 }}>
              <motion.div 
                className="d-flex flex-column flex-xl-row align-items-center p-4 bg-white" 
                style={{ borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', gap: '24px', height: '100%' }}
                whileHover={{ scale: 1.02, boxShadow: '0 15px 35px rgba(0,0,0,0.12)' }} 
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div style={{ width: '180px', height: '180px', flexShrink: 0, borderRadius: '50%', overflow: 'hidden', border: '5px solid #F8F5F2', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
                  <img src="/images/o1.jpg" alt="Tasty Thursdays" loading="lazy" decoding="async" style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    transition: 'transform 0.6s cubic-bezier(0.33, 1, 0.68, 1)'
                  }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'} />
                </div>
                <div className="d-flex flex-column align-items-xl-start align-items-center text-center text-xl-start">
                  <h5 style={{ fontFamily: "'Dancing Script', cursive", fontSize: '2.5rem', color: '#1E1E1E', margin: 0, fontWeight: 'bold' }}>
                    Tasty Thursdays
                  </h5>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.95rem', color: '#666', margin: '10px 0 15px 0', lineHeight: 1.5 }}>
                    Enjoy our signature premium burger packed with fresh ingredients and a side of crispy golden fries.
                  </p>
                  <h6 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.2rem', color: '#6F4E37', fontWeight: 600, margin: '0 0 20px 0' }}>
                    <span style={{ fontSize: '1.8rem', color: '#D9A066' }}>20%</span> Off
                  </h6>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleAddToCart({ id: 'o1', name: 'Tasty Thursdays Burger', price: 12, category: 'burger', image: '/images/o1.jpg' }); }} className="btn" style={{ backgroundColor: '#D9A066', color: '#fff', borderRadius: '45px', padding: '10px 28px', fontWeight: 600, fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#6F4E37'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#D9A066'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                    Order Now <ShoppingCart size={18} />
                  </a>
                </div>
              </motion.div>
            </div>
            <div className="col-md-6 offer-box" style={{ opacity: 0 }}>
              <motion.div 
                className="d-flex flex-column flex-xl-row align-items-center p-4 bg-white" 
                style={{ borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', gap: '24px', height: '100%' }}
                whileHover={{ scale: 1.02, boxShadow: '0 15px 35px rgba(0,0,0,0.12)' }} 
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div style={{ width: '180px', height: '180px', flexShrink: 0, borderRadius: '50%', overflow: 'hidden', border: '5px solid #F8F5F2', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
                  <img src="/images/o2.jpg" alt="Pizza Days" loading="lazy" decoding="async" style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    transition: 'transform 0.6s cubic-bezier(0.33, 1, 0.68, 1)'
                  }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'} />
                </div>
                <div className="d-flex flex-column align-items-xl-start align-items-center text-center text-xl-start">
                  <h5 style={{ fontFamily: "'Dancing Script', cursive", fontSize: '2.5rem', color: '#1E1E1E', margin: 0, fontWeight: 'bold' }}>
                    Pizza Days
                  </h5>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.95rem', color: '#666', margin: '10px 0 15px 0', lineHeight: 1.5 }}>
                    Savor the taste of Italy with our wood-fired pizza, featuring rich tomato sauce and melted mozzarella.
                  </p>
                  <h6 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.2rem', color: '#6F4E37', fontWeight: 600, margin: '0 0 20px 0' }}>
                    <span style={{ fontSize: '1.8rem', color: '#D9A066' }}>15%</span> Off
                  </h6>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleAddToCart({ id: 'o2', name: 'Pizza Days Special', price: 15, category: 'pizza', image: '/images/o2.jpg' }); }} className="btn" style={{ backgroundColor: '#D9A066', color: '#fff', borderRadius: '45px', padding: '10px 28px', fontWeight: 600, fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#6F4E37'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#D9A066'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                    Order Now <ShoppingCart size={18} />
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{
              position: 'fixed',
              bottom: '30px',
              right: '30px',
              backgroundColor: '#FFFFFF',
              color: '#1E1E1E',
              padding: '15px 25px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <CheckCircle2 color="#28a745" size={20} />
            <span style={{ fontWeight: '500' }}>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default OfferSection;
