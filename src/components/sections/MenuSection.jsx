import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShoppingCart, Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

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

  // GSAP ScrollTrigger & Stagger Animation for Grid
  useEffect(() => {
    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll('.menu-card-wrapper');
      
      // Reset previous ScrollTriggers for this element
      ScrollTrigger.getAll().forEach(t => {
        if (t.vars.trigger === gridRef.current) {
          t.kill();
        }
      });

      // If category has changed and page is scrolled past the grid header, animate immediately
      const isScrolledPast = gridRef.current.getBoundingClientRect().top < window.innerHeight;
      
      if (isScrolledPast) {
        gsap.fromTo(cards, 
          { opacity: 0, y: 30, scale: 0.95 }, 
          { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            duration: 0.5, 
            stagger: 0.06, 
            ease: "power2.out",
            clearProps: "opacity,transform"
          }
        );
      } else {
        gsap.fromTo(cards, 
          { opacity: 0, y: 50, scale: 0.95 }, 
          { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            duration: 0.6, 
            stagger: 0.08, 
            ease: "power2.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 85%",
              once: true
            },
            onComplete: () => {
              gsap.set(cards, { clearProps: "opacity,transform" });
            }
          }
        );
      }
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
                className={`category-filter-btn ${isActive ? 'active' : ''}`}
              >
                {f.label}
              </button>
            )
          })}
        </div>

        {/* Grid Container */}
        <div 
          ref={gridRef} 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
          style={{ maxWidth: '1200px', margin: '0 auto' }}
        >
          {displayedItems.map((item) => (
            <div key={item.id} className="menu-card-wrapper" style={{ height: '100%' }}>
              <div className="premium-menu-card">
                {/* Price Badge */}
                <div className="price-badge">
                  ${item.price}
                </div>

                {/* Image Container */}
                <div className="image-container">
                  <img src={item.image} alt={item.name} loading="lazy" decoding="async" />
                </div>

                {/* Content */}
                <div className="card-content">
                  <h5 className="food-title">
                    {item.name}
                  </h5>
                  <p className="food-desc">
                    {item.desc}
                  </p>

                  <button 
                    onClick={(e) => { e.preventDefault(); handleAddToCart(item); }}
                    className="add-cart-btn"
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
