import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { db } from '../../firebaseClient';
import { collection, getDocs } from 'firebase/firestore';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShoppingCart, Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const MenuSection = ({ hideHeading = false }) => {
  const [filter, setFilter] = useState('*');
  const [toastMessage, setToastMessage] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { addToCart } = useCart();
  const location = useLocation();
  const gridRef = useRef(null);

  // Fetch products and categories dynamically from Firestore
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        // Fetch Categories
        const catSnapshot = await getDocs(collection(db, 'categories'));
        const catList = [];
        catSnapshot.forEach((doc) => {
          catList.push(doc.data());
        });
        setCategories(catList);

        // Fetch Products
        const prodSnapshot = await getDocs(collection(db, 'products'));
        const prodList = [];
        prodSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.isAvailable !== false) {
            prodList.push({
              id: data.productId,
              name: data.name,
              category: data.categoryId,
              price: data.price,
              desc: data.description,
              image: data.image
            });
          }
        });
        setProducts(prodList);
      } catch (error) {
        console.error("Error fetching menu data from Firestore:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  const handleAddToCart = (item) => {
    addToCart(item);
    setToastMessage(`${item.name} added to cart!`);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const filteredItems = filter === '*' 
    ? products 
    : products.filter(item => `.${item.category}` === filter);

  const displayedItems = filteredItems.slice(0, visibleCount);

  // GSAP ScrollTrigger & Stagger Animation for Grid
  useEffect(() => {
    if (!loading && gridRef.current) {
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
  }, [filter, visibleCount, loading]);

  const handleLoadMore = (e) => {
    e.preventDefault();
    setVisibleCount(prev => prev + 6);
  };

  const filters = [
    { label: 'All', value: '*' },
    ...categories.map(c => ({ label: c.name, value: `.${c.categoryId}` }))
  ];

  if (loading) {
    return (
      <div style={{ height: '50vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#F8F5F2' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid rgba(111,78,55,0.2)', borderTopColor: '#6F4E37', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

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
