import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const slides = [
  {
    id: 1,
    title: "Fast Food Restaurant",
    desc: "Doloremque, itaque aperiam facilis rerum, commodi, temporibus sapiente ad mollitia laborum quam quisquam esse error unde. Tempora ex doloremque, labore, sunt repellat dolore, iste magni quos nihil ducimus libero ipsam.",
  },
  {
    id: 2,
    title: "Fast Food Restaurant",
    desc: "Doloremque, itaque aperiam facilis rerum, commodi, temporibus sapiente ad mollitia laborum quam quisquam esse error unde. Tempora ex doloremque, labore, sunt repellat dolore, iste magni quos nihil ducimus libero ipsam.",
  },
  {
    id: 3,
    title: "Fast Food Restaurant",
    desc: "Doloremque, itaque aperiam facilis rerum, commodi, temporibus sapiente ad mollitia laborum quam quisquam esse error unde. Tempora ex doloremque, labore, sunt repellat dolore, iste magni quos nihil ducimus libero ipsam.",
  }
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="slider_section">
      <div id="customCarousel1" className="carousel slide" data-ride="carousel">
        <div className="carousel-inner" style={{ position: 'relative', height: '400px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="carousel-item active"
              style={{ position: 'absolute', top: 0, left: 0, width: '100%' }}
            >
              <div className="container-fluid px-4 px-lg-5">
                <div className="row">
                  <div className="col-md-7 col-lg-6">
                    <div className="detail-box">
                      <h1>{slides[currentSlide].title}</h1>
                      <p>{slides[currentSlide].desc}</p>
                      <div className="btn-box">
                        <Link to="/menu" className="btn1">
                          Order Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="container-fluid px-4 px-lg-5">
          <ol className="carousel-indicators">
            {slides.map((_, index) => (
              <li
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={currentSlide === index ? 'active' : ''}
                style={{ cursor: 'pointer' }}
              ></li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
