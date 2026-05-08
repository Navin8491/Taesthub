import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const menuItems = [
  { id: 1, name: "Delicious Pizza", category: "pizza", price: 20, desc: "Veniam debitis quaerat officiis quasi cupiditate quo, quisquam velit, magnam voluptatem repellendus sed eaque", image: "/images/f1.png" },
  { id: 2, name: "Delicious Burger", category: "burger", price: 15, desc: "Veniam debitis quaerat officiis quasi cupiditate quo, quisquam velit, magnam voluptatem repellendus sed eaque", image: "/images/f2.png" },
  { id: 3, name: "Delicious Pizza", category: "pizza", price: 17, desc: "Veniam debitis quaerat officiis quasi cupiditate quo, quisquam velit, magnam voluptatem repellendus sed eaque", image: "/images/f3.png" },
  { id: 4, name: "Delicious Pasta", category: "pasta", price: 18, desc: "Veniam debitis quaerat officiis quasi cupiditate quo, quisquam velit, magnam voluptatem repellendus sed eaque", image: "/images/f4.png" },
  { id: 5, name: "French Fries", category: "fries", price: 10, desc: "Veniam debitis quaerat officiis quasi cupiditate quo, quisquam velit, magnam voluptatem repellendus sed eaque", image: "/images/f5.png" },
  { id: 6, name: "Delicious Pizza", category: "pizza", price: 15, desc: "Veniam debitis quaerat officiis quasi cupiditate quo, quisquam velit, magnam voluptatem repellendus sed eaque", image: "/images/f6.png" },
  { id: 7, name: "Tasty Burger", category: "burger", price: 12, desc: "Veniam debitis quaerat officiis quasi cupiditate quo, quisquam velit, magnam voluptatem repellendus sed eaque", image: "/images/f7.png" },
  { id: 8, name: "Tasty Burger", category: "burger", price: 14, desc: "Veniam debitis quaerat officiis quasi cupiditate quo, quisquam velit, magnam voluptatem repellendus sed eaque", image: "/images/f8.png" },
  { id: 9, name: "Delicious Pasta", category: "pasta", price: 10, desc: "Veniam debitis quaerat officiis quasi cupiditate quo, quisquam velit, magnam voluptatem repellendus sed eaque", image: "/images/f9.png" },
];

const MenuSection = ({ hideHeading = false }) => {
  const [filter, setFilter] = useState('*');
  const [toastMessage, setToastMessage] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);
  const { addToCart } = useCart();
  const location = useLocation();

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
    <motion.section 
      className="food_section layout_padding-bottom"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container-fluid px-4 px-lg-5">
        {!hideHeading && (
          <div className="heading_container heading_center">
            <h2>Our Menu</h2>
          </div>
        )}

        <ul className="filters_menu">
          {filters.map((f) => (
            <li 
              key={f.value} 
              className={filter === f.value ? 'active' : ''} 
              onClick={() => { setFilter(f.value); setVisibleCount(6); }}
              style={{ cursor: 'pointer' }}
            >
              {f.label}
            </li>
          ))}
        </ul>

        <div className="filters-content">
          <motion.div layout className="row grid">
            <AnimatePresence>
              {displayedItems.map((item) => (
                <motion.div 
                  key={item.id} 
                  className={`col-sm-6 col-lg-4 all ${item.category}`}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div className="box" whileHover={{ y: -10 }} transition={{ type: 'spring', stiffness: 300 }}>
                    <div>
                      <div className="img-box">
                        <img src={item.image} alt="" />
                      </div>
                      <div className="detail-box">
                        <h5>{item.name}</h5>
                        <p>{item.desc}</p>
                        <div className="options">
                          <h6>${item.price}</h6>
                          <a href="#" onClick={(e) => { e.preventDefault(); handleAddToCart(item); }}>
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
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
        
        {!hideHeading && location.pathname !== '/menu' && (
          <div className="btn-box">
            <Link to="/menu">View More</Link>
          </div>
        )}

        {location.pathname === '/menu' && (
          <div className="btn-box mt-4 text-center">
            {visibleCount < filteredItems.length ? (
              <a href="#" onClick={handleLoadMore}>View More</a>
            ) : (
              <button disabled style={{ backgroundColor: '#ccc', color: '#666', border: 'none', padding: '10px 45px', borderRadius: '45px', cursor: 'not-allowed', fontWeight: 'bold' }}>
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
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{
              position: 'fixed',
              bottom: '30px',
              right: '30px',
              backgroundColor: '#222831',
              color: '#fff',
              padding: '15px 25px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <i className="fa fa-check-circle" style={{ color: '#28a745', fontSize: '20px' }}></i>
            <span style={{ fontWeight: '500' }}>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default MenuSection;
