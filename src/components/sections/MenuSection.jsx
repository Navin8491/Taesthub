import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import gsap from 'gsap';
import { ShoppingCart, Check } from 'lucide-react';

const menuItems = [
  { id: 1, name: "Delicious Pizza", category: "pizza", price: 20, desc: "Premium mozzarella, fresh basil, and our signature tomato sauce on a hand-tossed crust.", image: "/images/f1.png" },
  { id: 2, name: "Delicious Burger", category: "burger", price: 15, desc: "Wagyu beef patty with caramelized onions, cheddar cheese, and house sauce on a brioche bun.", image: "/images/f2.png" },
  { id: 3, name: "Delicious Pizza", category: "pizza", price: 17, desc: "Wood-fired pizza topped with spicy pepperoni, jalapenos, and a drizzle of hot honey.", image: "/images/f3.png" },
  { id: 4, name: "Delicious Pasta", category: "pasta", price: 18, desc: "Handmade fettuccine tossed in a rich, creamy truffle alfredo sauce with shaved parmesan.", image: "/images/f4.png" },
  { id: 5, name: "French Fries", category: "fries", price: 10, desc: "Crispy golden fries seasoned with sea salt and rosemary, served with garlic aioli.", image: "/images/f5.png" },
  { id: 6, name: "Delicious Pizza", category: "pizza", price: 15, desc: "Classic Margherita pizza with fresh heirloom tomatoes, basil, and a balsamic glaze.", image: "/images/f6.png" },
  { id: 7, name: "Tasty Burger", category: "burger", price: 12, desc: "Crispy fried chicken sandwich with spicy mayo, pickles, and crisp lettuce.", image: "/images/f7.png" },
  { id: 8, name: "Tasty Burger", category: "burger", price: 14, desc: "Double smash burger with American cheese, pickles, and our secret house spread.", image: "/images/f8.png" },
  { id: 9, name: "Delicious Pasta", category: "pasta", price: 10, desc: "Spaghetti tossed in a vibrant basil pesto with pine nuts and cherry tomatoes.", image: "/images/f9.png" },
];

const MenuSection = ({ hideHeading = false }) => {
  const [filter, setFilter] = useState('*');
  const [toastMessage, setToastMessage] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);
  const { addToCart } = useCart();
  const location = useLocation();
  const gridRef = useRef(null);

  const handleAddToCart = (item) => {
    addToCart(item);
    setToastMessage(`${item.name} added to cart!`);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const filteredItems = filter === '*' 
    ? menuItems 
    : menuItems.filter(item => `.${item.category}` === filter);

  const displayedItems = filteredItems.slice(0, visibleCount);

  // GSAP Stagger Animation for Grid
  useEffect(() => {
    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll('.menu-card-wrapper');
      gsap.fromTo(cards, 
        { opacity: 0, y: 50, scale: 0.95 }, 
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 0.6, 
          stagger: 0.1, 
          ease: "back.out(1.2)",
          clearProps: "all" 
        }
      );
    }
  }, [filter, visibleCount]);

  const handleLoadMore = (e) => {
    e.preventDefault();
    setVisibleCount(prev => prev + 6);
  };

  const filters = [
    { label: 'All', value: '*' },
    { label: 'Burger', value: '.burger' },
    { label: 'Pizza', value: '.pizza' },
    { label: 'Pasta', value: '.pasta' },
    { label: 'Fries', value: '.fries' },
  ];

  return (
    <section 
      className="food_section layout_padding-bottom" 
      style={{ backgroundColor: '#F8F5F2', padding: '90px 0', minHeight: '100vh' }}
    >
      <div className="container-fluid px-4 px-lg-5" style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {!hideHeading && (
          <div className="heading_container heading_center mb-5" style={{ textAlign: 'center' }}>
            <h2 style={{ fontFamily: "'Dancing Script', cursive", fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#1E1E1E', fontWeight: 'bold' }}>Our Premium Menu</h2>
            <p style={{ fontFamily: "'Inter', sans-serif", color: '#666', maxWidth: '600px', margin: '15px auto 0' }}>
              Discover our carefully curated selection of artisanal dishes, crafted with the finest ingredients.
            </p>
          </div>
        )}

        {/* Category Filters */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap', marginBottom: '50px' }}>
          {filters.map((f) => {
            const isActive = filter === f.value;
            return (
              <button 
                key={f.value} 
                onClick={() => { setFilter(f.value); setVisibleCount(6); }}
                style={{ 
                  padding: '10px 24px', 
                  borderRadius: '50px',
                  border: isActive ? 'none' : '1px solid rgba(111, 78, 55, 0.2)',
                  backgroundColor: isActive ? '#6F4E37' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#1E1E1E',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 500,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: isActive ? '0 8px 20px rgba(111, 78, 55, 0.3)' : '0 2px 10px rgba(0,0,0,0.02)'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = '#6F4E37';
                    e.currentTarget.style.color = '#6F4E37';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = 'rgba(111, 78, 55, 0.2)';
                    e.currentTarget.style.color = '#1E1E1E';
                  }
                }}
              >
                {f.label}
              </button>
            )
          })}
        </div>

        {/* Grid Container */}
        <div ref={gridRef} className="row g-4 justify-content-center">
          {displayedItems.map((item) => (
            <div key={item.id} className="col-sm-6 col-lg-4 col-xl-4 menu-card-wrapper">
              <div 
                className="menu-card" 
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  padding: '20px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(111,78,55,0.15)';
                  const img = e.currentTarget.querySelector('.card-image');
                  if (img) img.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
                  const img = e.currentTarget.querySelector('.card-image');
                  if (img) img.style.transform = 'scale(1)';
                }}
              >
                {/* Price Badge */}
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  backgroundColor: '#D9A066',
                  color: '#FFFFFF',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  zIndex: 2,
                  boxShadow: '0 4px 10px rgba(217, 160, 102, 0.4)'
                }}>
                  ${item.price}
                </div>

                {/* Image Container */}
                <div style={{
                  height: '220px',
                  width: '100%',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  backgroundColor: '#F8F5F2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  <img src={item.image} alt={item.name} loading="lazy" decoding="async" style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'contain',
                            filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.15))',
                            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                          }} />
                </div>

                {/* Content */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h5 style={{ 
                    fontFamily: "'Poppins', sans-serif", 
                    fontWeight: 600, 
                    color: '#1E1E1E', 
                    fontSize: '1.25rem',
                    marginBottom: '10px'
                  }}>
                    {item.name}
                  </h5>
                  <p style={{ 
                    fontFamily: "'Inter', sans-serif", 
                    color: '#666', 
                    fontSize: '0.95rem',
                    lineHeight: 1.5,
                    flex: 1,
                    marginBottom: '20px'
                  }}>
                    {item.desc}
                  </p>

                  <button 
                    onClick={(e) => { e.preventDefault(); handleAddToCart(item); }}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '12px',
                      border: 'none',
                      backgroundColor: '#1E1E1E',
                      color: '#FFFFFF',
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 600,
                      fontSize: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      transition: 'all 0.3s ease',
                      marginTop: 'auto'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#6F4E37';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#1E1E1E';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <ShoppingCart size={18} /> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* View More Buttons */}
        {!hideHeading && location.pathname !== '/menu' && (
          <div className="btn-box mt-5 text-center">
            <Link to="/menu" style={{
              display: 'inline-block',
              padding: '12px 40px',
              backgroundColor: '#6F4E37',
              color: '#FFFFFF',
              borderRadius: '50px',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 20px rgba(111,78,55,0.3)'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              View Full Menu
            </Link>
          </div>
        )}

        {location.pathname === '/menu' && (
          <div className="btn-box mt-5 text-center">
            {visibleCount < filteredItems.length ? (
              <a href="#" onClick={handleLoadMore} style={{
                display: 'inline-block',
                padding: '12px 40px',
                backgroundColor: '#6F4E37',
                color: '#FFFFFF',
                borderRadius: '50px',
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                boxShadow: '0 10px 20px rgba(111,78,55,0.3)'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Load More
              </a>
            ) : (
              <button disabled style={{ 
                backgroundColor: '#e9ecef', 
                color: '#adb5bd', 
                border: 'none', 
                padding: '12px 40px', 
                borderRadius: '50px', 
                cursor: 'not-allowed', 
                fontWeight: 600,
                fontFamily: "'Poppins', sans-serif"
              }}>
                All Items Loaded
              </button>
            )}
          </div>
        )}
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            style={{
              position: 'fixed',
              bottom: '30px',
              right: '30px',
              backgroundColor: '#FFFFFF',
              color: '#1E1E1E',
              padding: '16px 24px',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontFamily: "'Inter', sans-serif",
              border: '1px solid rgba(0,0,0,0.05)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Check color="#28a745" size={14} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E1E1E' }}>Added to Cart</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default MenuSection;
