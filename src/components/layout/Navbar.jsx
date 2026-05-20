import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, User, ShoppingCart } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll for sticky glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOrderOnline = (e) => {
    e.preventDefault();
    if (location.pathname !== '/menu') {
      navigate('/menu');
    }
    setTimeout(() => {
      const menuSection = document.querySelector('.food_section');
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'About', path: '/about' },
    { name: 'Book Table', path: '/book' },
  ];

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 1000,
      transition: 'all 0.3s ease-in-out',
      background: (isScrolled || location.pathname !== '/') ? 'rgba(111, 78, 55, 0.85)' : 'transparent',
      backdropFilter: (isScrolled || location.pathname !== '/') ? 'blur(12px)' : 'none',
      WebkitBackdropFilter: (isScrolled || location.pathname !== '/') ? 'blur(12px)' : 'none',
      boxShadow: (isScrolled || location.pathname !== '/') ? '0 4px 30px rgba(0, 0, 0, 0.15)' : 'none',
      borderBottom: (isScrolled || location.pathname !== '/') ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid transparent',
      padding: (isScrolled || location.pathname !== '/') ? '12px 0' : '20px 0'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Logo - Left */}
        <Link to="/" style={{ textDecoration: 'none', zIndex: 1001 }}>
          <span style={{ 
            fontFamily: "'Poppins', sans-serif", 
            fontWeight: 700, 
            fontSize: '1.5rem', 
            color: '#ffffff',
            letterSpacing: '1px'
          }}>
            Taste<span style={{ color: '#ffbe33' }}>Hub</span>
          </span>
        </Link>

        {/* Navigation Links - Center (Desktop) */}
        <nav className="desktop-nav" style={{ display: 'none', gap: '2rem' }}>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.name} 
                to={link.path}
                style={{
                  position: 'relative',
                  fontFamily: "'Inter', sans-serif",
                  color: isActive ? '#D9A066' : '#ffffff',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  transition: 'color 0.3s ease',
                  padding: '5px 0'
                }}
                className="nav-link-custom"
                onMouseEnter={(e) => { if(!isActive) e.currentTarget.style.color = '#D9A066' }}
                onMouseLeave={(e) => { if(!isActive) e.currentTarget.style.color = '#ffffff' }}
              >
                {link.name}
                <motion.div
                  initial={false}
                  animate={{
                    width: isActive ? '100%' : '0%',
                    opacity: isActive ? 1 : 0
                  }}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    height: '2px',
                    background: '#D9A066',
                    borderRadius: '2px'
                  }}
                  className="nav-underline"
                />
              </Link>
            )
          })}
        </nav>

        {/* Action Buttons - Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', zIndex: 1001 }}>
          
          <Link to="" style={{ color: '#ffffff', transition: 'color 0.3s' }} onMouseEnter={e => e.currentTarget.style.color = '#D9A066'} onMouseLeave={e => e.currentTarget.style.color = '#ffffff'}>
            <User size={20} />
          </Link>
          
          <Link to="/cart" style={{ color: '#ffffff', position: 'relative', transition: 'color 0.3s' }} onMouseEnter={e => e.currentTarget.style.color = '#D9A066'} onMouseLeave={e => e.currentTarget.style.color = '#ffffff'}>
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#D9A066', color: '#fff', borderRadius: '50%', padding: '2px 6px', fontSize: '10px', fontWeight: 'bold' }}>
                {cartCount}
              </span>
            )}
          </Link>
          
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                navigate('/menu');
                setTimeout(() => {
                  const menuSection = document.querySelector('.food_section');
                  if (menuSection) menuSection.scrollIntoView({ behavior: 'smooth' });
                }, 100);
                setIsMobileMenuOpen(false);
              } else {
                setIsSearchOpen(!isSearchOpen);
              }
            }}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <AnimatePresence>
              {isSearchOpen && (
                <motion.input
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: window.innerWidth < 768 ? 100 : 150, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    marginRight: '10px',
                    height: '35px',
                    borderRadius: '20px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    padding: '0 15px',
                    background: 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    outline: 'none',
                    fontFamily: "'Inter', sans-serif"
                  }}
                  autoFocus
                />
              )}
            </AnimatePresence>
            <button
              type="submit"
              onClick={(e) => {
                if (!isSearchOpen) {
                  e.preventDefault();
                  setIsSearchOpen(true);
                }
              }}
              style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', padding: 0, transition: 'color 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#D9A066'} onMouseLeave={e => e.currentTarget.style.color = '#ffffff'}
            >
              <Search size={20} />
            </button>
          </form>

          <a href="#" onClick={handleOrderOnline} className="order-btn" style={{
            background: '#6F4E37',
            color: '#ffffff',
            padding: '8px 20px',
            borderRadius: '50px',
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 500,
            textDecoration: 'none',
            fontSize: '0.9rem',
            transition: 'all 0.3s ease',
            marginLeft: '10px',
            display: 'none' // hidden on mobile by default
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 5px 15px rgba(111, 78, 55, 0.4)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            Order Online
          </a>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              padding: '5px',
              marginLeft: '5px'
            }}
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div key="close" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.2 }}>
                  <X size={28} />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }} transition={{ duration: 0.2 }}>
                  <Menu size={28} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{
              background: 'rgba(30, 30, 30, 0.95)',
              backdropFilter: 'blur(10px)',
              overflow: 'hidden',
              position: 'absolute',
              top: '100%',
              left: 0,
              width: '100%',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }}
          >
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link 
                    key={link.name} 
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      color: isActive ? '#D9A066' : '#ffffff',
                      textDecoration: 'none',
                      fontSize: '1.2rem',
                      fontWeight: 500,
                      padding: '10px 0',
                      borderBottom: '1px solid rgba(255,255,255,0.05)'
                    }}
                  >
                    {link.name}
                  </Link>
                )
              })}
              <a href="#" onClick={handleOrderOnline} style={{
                background: '#6F4E37',
                color: '#ffffff',
                padding: '12px 20px',
                borderRadius: '50px',
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                textDecoration: 'none',
                fontSize: '1rem',
                textAlign: 'center',
                marginTop: '10px'
              }}>
                Order Online
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 992px) {
          .desktop-nav {
            display: flex !important;
          }
          .order-btn {
            display: block !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
        .nav-link-custom:hover .nav-underline {
          width: 100% !important;
          opacity: 1 !important;
          transition: width 0.3s ease, opacity 0.3s ease;
        }
      `}</style>
    </header>
  );
};

export default Navbar;
