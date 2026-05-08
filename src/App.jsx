import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Sections
import HeroSection from './components/sections/HeroSection';
import OfferSection from './components/sections/OfferSection';
import MenuSection from './components/sections/MenuSection';
import AboutSection from './components/sections/AboutSection';
import BookSection from './components/sections/BookSection';
import ClientSection from './components/sections/ClientSection';

import Menu from './pages/Menu';
import About from './pages/About';
import Book from './pages/Book';
import Checkout from './pages/Checkout';
import Cart from './pages/Cart';

const AppContent = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    if (isHome) {
      document.body.classList.remove('sub_page');
    } else {
      document.body.classList.add('sub_page');
    }
  }, [isHome]);

  return (
    <>
      <div className="hero_area">
        <div className="bg-box">
          <img src="/images/hero-bg.jpg" alt="" />
        </div>
        <Navbar />
        {isHome && <HeroSection />}
      </div>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <OfferSection />
              <MenuSection />
              <AboutSection />
              <BookSection />
              <ClientSection />
            </motion.div>
          } />
          <Route path="/menu" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Menu /></motion.div>} />
          <Route path="/about" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><About /></motion.div>} />
          <Route path="/book" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Book /></motion.div>} />
          <Route path="/checkout" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Checkout /></motion.div>} />
          <Route path="/cart" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Cart /></motion.div>} />
          <Route path="*" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><div className="text-center py-5"><h2>Page Not Found</h2><Link to="/" className="btn btn-warning mt-3">Go Home</Link></div></motion.div>} />
        </Routes>
      </AnimatePresence>

      <Footer />
    </>
  );
};

import { CartProvider } from './context/CartContext';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function App() {
  return (
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  );
}

export default App;
