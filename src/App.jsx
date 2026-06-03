import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Sections
import HeroSection from './components/sections/HeroSection';
import OfferSection from './components/sections/OfferSection';
import MenuSection from './components/sections/MenuSection';
import AboutSection from './components/sections/AboutSection';
import BookSection from './components/sections/BookSection';

// Lazy loaded components below the fold
const ClientSection = React.lazy(() => import('./components/sections/ClientSection'));
const GallerySection = React.lazy(() => import('./components/sections/GallerySection'));

// Lazy loaded pages
const Menu = React.lazy(() => import('./pages/Menu'));
const About = React.lazy(() => import('./pages/About'));
const Book = React.lazy(() => import('./pages/Book'));
const Cart = React.lazy(() => import('./pages/Cart'));
const Checkout = React.lazy(() => import('./pages/Checkout'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Profile = React.lazy(() => import('./pages/Profile'));
const OrderHistory = React.lazy(() => import('./pages/OrderHistory'));

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

  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -10 }
  };
  const pageTransition = { type: "tween", ease: "anticipate", duration: 0.4 };

  const SuspenseFallback = () => (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#F8F5F2' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid rgba(111,78,55,0.2)', borderTopColor: '#6F4E37', animation: 'spin 1s ease-in-out infinite' }}></div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <>
      <div className="hero_area">
        <div className="bg-box" style={{ overflow: 'hidden' }}>
          <img src="/images/hero-bg-new.png" alt="" className="hero-bg-img" />
          <div className="bg-overlay" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1 }}></div>
        </div>
        <Navbar />
        {isHome && <HeroSection />}
      </div>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
              <OfferSection />
              <MenuSection />
              <AboutSection />
              <BookSection />
              <Suspense fallback={<SuspenseFallback />}>
                <ClientSection />
                <GallerySection />
              </Suspense>
            </motion.div>
          } />
          <Route path="/menu" element={<Suspense fallback={<SuspenseFallback />}><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Menu /></motion.div></Suspense>} />
          <Route path="/about" element={<Suspense fallback={<SuspenseFallback />}><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><About /></motion.div></Suspense>} />
          <Route path="/book" element={<Suspense fallback={<SuspenseFallback />}><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Book /></motion.div></Suspense>} />
          <Route path="/checkout" element={<Suspense fallback={<SuspenseFallback />}><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Checkout /></motion.div></Suspense>} />
          <Route path="/cart" element={<Suspense fallback={<SuspenseFallback />}><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Cart /></motion.div></Suspense>} />
          <Route path="/login" element={<Suspense fallback={<SuspenseFallback />}><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Login /></motion.div></Suspense>} />
          <Route path="/register" element={<Suspense fallback={<SuspenseFallback />}><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Register /></motion.div></Suspense>} />
          <Route path="/profile" element={<Suspense fallback={<SuspenseFallback />}><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Profile /></motion.div></Suspense>} />
          <Route path="/orders" element={<Suspense fallback={<SuspenseFallback />}><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><OrderHistory /></motion.div></Suspense>} />
          <Route path="*" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><div className="text-center py-5"><h2>Page Not Found</h2><Link to="/" className="btn btn-warning mt-3">Go Home</Link></div></motion.div>} />
        </Routes>
      </AnimatePresence>

      <Footer />
    </>
  );
};

import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </CartProvider>
  );
}

export default App;
