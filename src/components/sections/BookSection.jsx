import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Phone, Clock, Facebook, Twitter, Instagram } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const BookSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger entrance for form and info sections
      const elements = gsap.utils.toArray([".heading_container", ".form_container", ".info_container"]);
      
      gsap.fromTo(elements,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none"
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="book_section layout_padding"
      style={{ backgroundColor: '#F8F5F2', padding: 'clamp(50px, 10vw, 90px) 0', position: 'relative' }}
    >
      <style>
        {`
          .float-group {
            position: relative;
            margin-bottom: 24px;
          }
          .float-input, .float-select {
            width: 100%;
            padding: 16px;
            background: rgba(255, 255, 255, 0.6);
            border: 1px solid rgba(111, 78, 55, 0.2);
            border-radius: 12px;
            outline: none;
            font-family: 'Inter', sans-serif;
            color: #1E1E1E;
            font-size: 1rem;
            transition: all 0.3s ease;
          }
          .float-input:focus, .float-select:focus {
            background: rgba(255, 255, 255, 0.95);
            border-color: #6F4E37;
            box-shadow: 0 0 0 4px rgba(111, 78, 55, 0.1);
          }
          .float-label {
            position: absolute;
            left: 16px;
            top: 16px;
            color: #777;
            font-family: 'Inter', sans-serif;
            font-size: 1rem;
            pointer-events: none;
            transition: all 0.2s ease-out;
            transform-origin: left top;
          }
          .float-input:focus ~ .float-label,
          .float-input:not(:placeholder-shown) ~ .float-label {
            transform: translateY(-26px) scale(0.85);
            color: #6F4E37;
            font-weight: 600;
            background: #F8F5F2; /* Match parent/near parent to block out border */
            padding: 0 4px;
            border-radius: 4px;
          }
          /* Custom styles for select and date to mimic floating label easily */
          .float-select, .float-date {
            padding-top: 16px;
          }
          
          .social-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 45px;
            height: 45px;
            border-radius: 50%;
            background: #FFFFFF;
            color: #6F4E37;
            border: 1px solid rgba(111, 78, 55, 0.1);
            transition: all 0.3s ease;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          }
          .social-btn:hover {
            background: #6F4E37;
            color: #FFFFFF;
            transform: translateY(-3px);
            box-shadow: 0 8px 15px rgba(111, 78, 55, 0.2);
          }
        `}
      </style>

      <div className="container-fluid px-4 px-lg-5" style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div className="heading_container heading_center mb-5">
          <h2 style={{ fontFamily: "'Dancing Script', cursive", fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', color: '#1E1E1E', fontWeight: 'bold' }}>
            Book A Table
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", color: '#666', maxWidth: '600px', margin: '15px auto 0' }}>
            Reserve your spot and experience the finest culinary journey in a luxurious setting.
          </p>
        </div>

        <div className="row g-5">
          {/* Left Column - Contact Form */}
          <div className="col-lg-6 col-md-12">
            <div className="form_container" style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              padding: '40px',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.05)'
            }}>
              <form action="" onSubmit={(e) => e.preventDefault()}>
                
                <div className="float-group">
                  <input type="text" className="float-input" id="name" placeholder=" " required />
                  <label htmlFor="name" className="float-label">Your Name</label>
                </div>
                
                <div className="float-group">
                  <input type="tel" className="float-input" id="phone" placeholder=" " required />
                  <label htmlFor="phone" className="float-label">Phone Number</label>
                </div>
                
                <div className="float-group">
                  <input type="email" className="float-input" id="email" placeholder=" " required />
                  <label htmlFor="email" className="float-label">Your Email</label>
                </div>
                
                <div className="float-group">
                  <select className="float-select" defaultValue="" required style={{ color: '#1E1E1E' }}>
                    <option value="" disabled hidden>How many persons?</option>
                    <option value="2">2 Persons</option>
                    <option value="3">3 Persons</option>
                    <option value="4">4 Persons</option>
                    <option value="5">5+ Persons</option>
                  </select>
                </div>
                
                <div className="float-group">
                  <input type="date" className="float-input float-date" required style={{ color: '#777' }} onChange={(e) => e.target.style.color = '#1E1E1E'} />
                </div>
                
                <div className="btn_box mt-4">
                  <button type="submit" style={{ 
                    width: '100%',
                    backgroundColor: '#1E1E1E', 
                    color: '#fff', 
                    border: 'none', 
                    padding: '16px', 
                    borderRadius: '12px', 
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = '#6F4E37';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 15px 25px rgba(111,78,55,0.2)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = '#1E1E1E';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                  }}
                  >
                    Reserve Now
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Map & Info */}
          <div className="col-lg-6 col-md-12">
            <div className="info_container" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '30px' }}>
              
              {/* Map Container */}
              <div className="map_container" style={{
                flex: 1,
                minHeight: '300px',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                border: '1px solid rgba(255, 255, 255, 0.4)'
              }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387190.279909073!2d-74.25987368715491!3d40.69767006458873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1690000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Maps"
                ></iframe>
              </div>

              {/* Business Info Glass Card */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                padding: '30px',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.05)'
              }}>
                <div className="row">
                  <div className="col-sm-6 mb-4 mb-sm-0">
                    <h5 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#1E1E1E', marginBottom: '20px' }}>Contact Info</h5>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                      <div style={{ color: '#D9A066' }}><MapPin size={24} /></div>
                      <span style={{ fontFamily: "'Inter', sans-serif", color: '#444' }}>123 Luxury Ave, NY 10001</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{ color: '#D9A066' }}><Phone size={24} /></div>
                      <span style={{ fontFamily: "'Inter', sans-serif", color: '#444' }}>+01 123 456 7890</span>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <h5 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#1E1E1E', marginBottom: '20px' }}>Opening Hours</h5>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                      <div style={{ color: '#D9A066' }}><Clock size={24} /></div>
                      <span style={{ fontFamily: "'Inter', sans-serif", color: '#444' }}>Everyday<br/>10:00 AM - 10:00 PM</span>
                    </div>
                  </div>
                </div>

                {/* Social Media Links */}
                <div style={{ display: 'flex', gap: '15px', marginTop: '25px', paddingTop: '20px', borderTop: '1px solid rgba(111,78,55,0.1)' }}>
                  <a href="#" className="social-btn"><Facebook size={20} /></a>
                  <a href="#" className="social-btn"><Twitter size={20} /></a>
                  <a href="#" className="social-btn"><Instagram size={20} /></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookSection;
