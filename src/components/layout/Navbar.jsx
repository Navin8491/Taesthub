import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, User, ShoppingCart, LogOut, ShoppingBag } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { currentUser, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
          
          {/* User Icon & Dropdown */}
          <div 
            style={{ position: 'relative' }}
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            {currentUser ? (
              <>
                <button
                  onClick={() => navigate('/profile')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    cursor: 'pointer',
                    padding: '5px 0',
                    transition: 'color 0.3s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#D9A066'}
                  onMouseLeave={e => e.currentTarget.style.color = '#ffffff'}
                >
                  <User size={20} />
                  <span style={{ fontSize: '13px', fontWeight: 500, fontFamily: "'Inter', sans-serif" }} className="user-nav-name">
                    {currentUser.firstName}
                  </span>
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        width: '200px',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                        border: '1px solid rgba(0, 0, 0, 0.05)',
                        padding: '10px 0',
                        zIndex: 1002,
                        marginTop: '5px',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Greeting */}
                      <div style={{
                        padding: '8px 20px',
                        fontSize: '13px',
                        borderBottom: '1px solid #F3F3F3',
                        color: '#6F4E37',
                        fontWeight: 600,
                        fontFamily: "'Poppins', sans-serif"
                      }}>
                        Hello, {currentUser.firstName}!
                      </div>

                      {/* Links */}
                      <Link 
                        to="/profile" 
                        onClick={() => setIsDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 20px',
                          color: '#1E1E1E',
                          fontSize: '14px',
                          fontFamily: "'Inter', sans-serif",
                          textDecoration: 'none',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8F5F2'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <User size={14} color="#6F4E37" />
                        My Profile
                      </Link>

                      <Link 
                        to="/orders" 
                        onClick={() => setIsDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 20px',
                          color: '#1E1E1E',
                          fontSize: '14px',
                          fontFamily: "'Inter', sans-serif",
                          textDecoration: 'none',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8F5F2'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <ShoppingBag size={14} color="#6F4E37" />
                        Order History
                      </Link>

                      <div style={{ borderTop: '1px solid #F3F3F3', marginTop: '5px', paddingTop: '5px' }} />

                      <button
                        onClick={() => {
                          logout();
                          setIsDropdownOpen(false);
                          navigate('/');
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          width: '100%',
                          border: 'none',
                          background: 'none',
                          padding: '10px 20px',
                          color: '#DE3434',
                          fontSize: '14px',
                          fontFamily: "'Inter', sans-serif",
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FDF2F2'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <LogOut size={14} />
                        Log Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <Link 
                to="/login" 
                style={{ color: '#ffffff', display: 'flex', alignItems: 'center', padding: '5px 0', transition: 'color 0.3s' }} 
                onMouseEnter={e => e.currentTarget.style.color = '#D9A066'} 
                onMouseLeave={e => e.currentTarget.style.color = '#ffffff'}
              >
                <User size={20} />
              </Link>
            )}
          </div>
          
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
            onClick={() => setIsMobileMenuOpen(true)}
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
            <Menu size={28} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Slide-in Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                zIndex: 9999
              }}
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                width: '300px',
                height: '100vh',
                background: 'rgba(111, 78, 55, 0.96)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.25)',
                zIndex: 10000,
                padding: '100px 30px 40px 30px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              {/* Close button inside drawer */}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  position: 'absolute',
                  top: '25px',
                  right: '25px',
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  padding: '5px'
                }}
              >
                <X size={28} />
              </button>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link 
                      key={link.name} 
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        color: isActive ? '#ffbe33' : '#ffffff',
                        textDecoration: 'none',
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        padding: '10px 0',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'color 0.3s ease'
                      }}
                    >
                      {link.name}
                    </Link>
                  )
                })}

                {/* Mobile Account Links */}
                {currentUser ? (
                  <>
                    <div style={{
                      color: '#ffbe33',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginTop: '15px'
                    }}>
                      Account: {currentUser.firstName}
                    </div>
                    <Link 
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        color: location.pathname === '/profile' ? '#ffbe33' : '#ffffff',
                        textDecoration: 'none',
                        fontSize: '1.15rem',
                        fontWeight: 500,
                        padding: '5px 0',
                        transition: 'color 0.3s ease'
                      }}
                    >
                      My Profile
                    </Link>
                    <Link 
                      to="/orders"
                      onClick={() => setIsMobileMenuOpen(false)}
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        color: location.pathname === '/orders' ? '#ffbe33' : '#ffffff',
                        textDecoration: 'none',
                        fontSize: '1.15rem',
                        fontWeight: 500,
                        padding: '5px 0',
                        transition: 'color 0.3s ease'
                      }}
                    >
                      Order History
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                        navigate('/');
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ff6b6b',
                        fontFamily: "'Poppins', sans-serif",
                        textDecoration: 'none',
                        fontSize: '1.15rem',
                        fontWeight: 600,
                        padding: '5px 0',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'color 0.3s ease'
                      }}
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <Link 
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      color: location.pathname === '/login' ? '#ffbe33' : '#ffffff',
                      textDecoration: 'none',
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      padding: '10px 0',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'color 0.3s ease'
                    }}
                  >
                    Log In / Sign Up
                  </Link>
                )}
              </div>

              <div>
                <a href="#" onClick={handleOrderOnline} style={{
                  display: 'block',
                  background: '#ffbe33',
                  color: '#1E1E1E',
                  padding: '14px 20px',
                  borderRadius: '50px',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  textDecoration: 'none',
                  fontSize: '1.1rem',
                  textAlign: 'center',
                  boxShadow: '0 8px 20px rgba(255, 190, 51, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  Order Online
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .user-nav-name {
          display: none;
        }
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
          .user-nav-name {
            display: inline !important;
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
