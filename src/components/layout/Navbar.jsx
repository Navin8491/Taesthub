import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleOrderOnline = (e) => {
    e.preventDefault();
    if (location.pathname !== '/menu') {
      navigate('/menu');
    }
    // Scroll to menu section smoothly
    setTimeout(() => {
      const menuSection = document.querySelector('.food_section');
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <header className="header_section">
      <div className="container-fluid px-4 px-lg-5">
        <nav className="navbar navbar-expand-lg custom_nav-container">
          <Link className="navbar-brand" to="/">
            <span>TasteHub</span>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className=""> </span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mx-auto">
              <li className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
                <Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
              </li>
              <li className={`nav-item ${location.pathname === '/menu' ? 'active' : ''}`}>
                <Link className="nav-link" to="/menu">Menu</Link>
              </li>
              <li className={`nav-item ${location.pathname === '/about' ? 'active' : ''}`}>
                <Link className="nav-link" to="/about">About</Link>
              </li>
              <li className={`nav-item ${location.pathname === '/book' ? 'active' : ''}`}>
                <Link className="nav-link" to="/book">Book Table</Link>
              </li>
            </ul>
            <div className="user_option">
              <Link to="" className="user_link">
                <i className="fa fa-user" aria-hidden="true"></i>
              </Link>
              <Link 
                className="cart_link" 
                to="/cart"
                style={{ position: 'relative' }}
              >
                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 456.029 456.029" style={{ enableBackground: 'new 0 0 456.029 456.029' }} xmlSpace="preserve">
                  <g>
                    <g>
                      <path d="M345.6,338.862c-29.184,0-53.248,23.552-53.248,53.248c0,29.184,23.552,53.248,53.248,53.248 c29.184,0,53.248-23.552,53.248-53.248C398.336,362.926,374.784,338.862,345.6,338.862z" />
                    </g>
                  </g>
                  <g>
                    <g>
                      <path d="M439.296,84.91c-1.024,0-2.56-0.512-4.096-0.512H112.64l-5.12-34.304C104.448,27.566,84.992,10.67,61.952,10.67H20.48 C9.216,10.67,0,19.886,0,31.15c0,11.264,9.216,20.48,20.48,20.48h41.472c2.56,0,4.608,2.048,5.12,4.608l31.744,216.064 c4.096,27.136,27.648,47.616,55.296,47.616h212.992c26.624,0,49.664-18.944,55.296-45.056l33.28-166.4 C457.728,97.71,450.56,86.958,439.296,84.91z" />
                    </g>
                  </g>
                  <g>
                    <g>
                      <path d="M215.04,389.55c-1.024-28.16-24.576-50.688-52.736-50.688c-29.696,1.536-52.224,26.112-51.2,55.296 c1.024,28.16,24.064,50.688,52.224,50.688h1.024C193.536,443.31,216.576,418.734,215.04,389.55z" />
                    </g>
                  </g>
                </svg>
                {cartCount > 0 && (
                  <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#ffbe33', color: '#fff', borderRadius: '50%', padding: '2px 6px', fontSize: '10px', fontWeight: 'bold' }}>
                    {cartCount}
                  </span>
                )}
              </Link>
              <form 
                className="form-inline" 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    navigate('/menu');
                    setTimeout(() => {
                      const menuSection = document.querySelector('.food_section');
                      if (menuSection) menuSection.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
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
                      animate={{ width: 150, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      type="text"
                      className="form-control"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ 
                        marginRight: '10px', 
                        height: '35px', 
                        borderRadius: '20px', 
                        border: '1px solid #ccc',
                        padding: '0 15px',
                        outline: 'none'
                      }}
                      autoFocus
                    />
                  )}
                </AnimatePresence>
                <button 
                  className="btn my-2 my-sm-0 nav_search-btn" 
                  type="submit"
                  onClick={(e) => {
                    if (!isSearchOpen) {
                      e.preventDefault();
                      setIsSearchOpen(true);
                    }
                  }}
                >
                  <i className="fa fa-search" aria-hidden="true"></i>
                </button>
              </form>
              <a href="#" className="order_online" onClick={handleOrderOnline}>
                Order Online
              </a>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
