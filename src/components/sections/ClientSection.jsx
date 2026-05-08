import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    name: "Moana Michell",
    subtitle: "magna aliqua",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
    image: "/images/client1.jpg"
  },
  {
    id: 2,
    name: "Mike Hamell",
    subtitle: "magna aliqua",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
    image: "/images/client2.jpg"
  },
  {
    id: 3,
    name: "John Doe",
    subtitle: "magna aliqua",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
    image: "/images/client1.jpg"
  },
  {
    id: 4,
    name: "Jane Smith",
    subtitle: "magna aliqua",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
    image: "/images/client2.jpg"
  }
];

const ClientSection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % (testimonials.length - 1)); // -1 because we show 2 at a time
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? testimonials.length - 2 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % (testimonials.length - 1));
  };

  return (
    <motion.section 
      className="client_section layout_padding-bottom"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container-fluid px-4 px-lg-5">
        <div className="heading_container heading_center psudo_white_primary mb_45">
          <h2>What Says Our Customers</h2>
        </div>
        <div className="carousel-wrap">
          <div className="client_owl-carousel" style={{ position: 'relative', overflow: 'hidden', paddingBottom: '60px' }}>
            <AnimatePresence mode="popLayout">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="row"
              >
                {[testimonials[current], testimonials[current + 1]].map((testimonial, idx) => (
                  <div key={`${testimonial.id}-${idx}`} className="col-md-6 mb-4 mb-md-0">
                    <div className="item">
                      <div className="box">
                        <div className="detail-box">
                          <p>{testimonial.text}</p>
                          <h6>{testimonial.name}</h6>
                          <p>{testimonial.subtitle}</p>
                        </div>
                        <div className="img-box">
                          <img src={testimonial.image} alt="" className="box-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Custom Carousel Navigation */}
            <div className="owl-nav" style={{ display: 'flex', justifyContent: 'center', marginTop: '45px', padding: '0 15px' }}>
              <button 
                onClick={handlePrev} 
                style={{ width: '45px', height: '45px', backgroundColor: '#ffbe33', color: '#ffffff', outline: 'none', border: 'none', fontSize: '24px', margin: '0 5px', borderRadius: '100%', cursor: 'pointer' }}
              >
                <i className="fa fa-angle-left" aria-hidden="true"></i>
              </button>
              <button 
                onClick={handleNext} 
                style={{ width: '45px', height: '45px', backgroundColor: '#ffbe33', color: '#ffffff', outline: 'none', border: 'none', fontSize: '24px', margin: '0 5px', borderRadius: '100%', cursor: 'pointer' }}
              >
                <i className="fa fa-angle-right" aria-hidden="true"></i>
              </button>
            </div>

          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ClientSection;
