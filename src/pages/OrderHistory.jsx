import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ShoppingBag, DollarSign, ChevronDown, ChevronUp, RefreshCw, Check } from 'lucide-react';

const OrderHistory = () => {
  const { currentUser, getUserOrders } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [reorderingId, setReorderingId] = useState(null);
  const [successToast, setSuccessToast] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else {
      setOrders(getUserOrders());
    }
  }, [currentUser, getUserOrders, navigate]);

  if (!currentUser) {
    return null;
  }

  const toggleExpand = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  const handleReorder = (order) => {
    setReorderingId(order.id);
    
    // Simulate minor delay for premium animation feel
    setTimeout(() => {
      order.items.forEach(item => {
        // Prepare item format for CartContext
        // CartContext: addToCart(item)
        addToCart({
          id: item.id,
          name: item.name,
          category: item.category,
          price: item.price,
          image: item.image
        });
      });
      setReorderingId(null);
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 3000);
    }, 1000);
  };

  const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return { bg: '#EBFBEE', text: '#2b8a3e', border: '1px solid rgba(40, 167, 69, 0.15)' };
      case 'preparing':
      case 'in preparation':
        return { bg: '#FFF9DB', text: '#f08c00', border: '1px solid rgba(240, 140, 0, 0.15)' };
      default:
        return { bg: '#E8F7FF', text: '#1c7ed6', border: '1px solid rgba(28, 126, 214, 0.15)' };
    }
  };

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        minHeight: '85vh',
        backgroundColor: '#F8F5F2',
        padding: '80px 0'
      }}
    >
      <div className="container-fluid px-4 px-lg-5" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header */}
        <div className="heading_container heading_center mb-5" style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Dancing Script', cursive", fontSize: '3rem', color: '#1E1E1E', fontWeight: 'bold' }}>
            Your Order History
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", color: '#777', maxWidth: '600px', margin: '15px auto 0' }}>
            Review your past purchases and reorder your favorites in a single click.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center p-5 shadow-sm border-0 bg-white" style={{ borderRadius: '15px' }}>
            <ShoppingBag size={48} color="#6F4E37" className="mb-3" />
            <h4 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>No orders found!</h4>
            <p style={{ color: '#777' }}>You haven't placed any orders yet. Check out our menu to order some delicious items!</p>
            <Link to="/menu" className="btn text-white mt-3" style={{ backgroundColor: '#6F4E37', borderRadius: '50px', padding: '10px 30px', fontWeight: 500 }}>
              Explore Menu
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {orders.map((order) => {
              const isExpanded = expandedOrder === order.id;
              const statusStyle = getStatusColor(order.status);
              
              return (
                <motion.div 
                  key={order.id}
                  layout
                  className="card shadow-sm border-0"
                  style={{ borderRadius: '15px', overflow: 'hidden', backgroundColor: '#FFFFFF' }}
                >
                  <div className="card-body p-4">
                    {/* Header Row */}
                    <div className="row align-items-center">
                      <div className="col-md-3 col-sm-6 mb-3 mb-md-0">
                        <div style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Order ID</div>
                        <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#1E1E1E', fontSize: '15px' }}>{order.id}</div>
                      </div>
                      
                      <div className="col-md-4 col-sm-6 mb-3 mb-md-0">
                        <div style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} /> Placed On
                        </div>
                        <div style={{ fontFamily: "'Inter', sans-serif", color: '#555', fontSize: '14px' }}>{formatDate(order.date)}</div>
                      </div>

                      <div className="col-md-2 col-sm-6 mb-3 mb-md-0">
                        <div style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                          <DollarSign size={12} /> Total
                        </div>
                        <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#6F4E37', fontSize: '16px' }}>${order.total.toFixed(2)}</div>
                      </div>

                      <div className="col-md-3 col-sm-6 d-flex align-items-center justify-content-md-end gap-2">
                        <span style={{ 
                          fontSize: '12px', 
                          fontWeight: 600, 
                          padding: '6px 14px', 
                          borderRadius: '50px',
                          color: statusStyle.text,
                          backgroundColor: statusStyle.bg,
                          border: statusStyle.border,
                          textTransform: 'capitalize'
                        }}>
                          {order.status}
                        </span>
                        
                        <button 
                          onClick={() => toggleExpand(order.id)}
                          className="btn btn-light btn-sm"
                          style={{ borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                        >
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Expandable items section */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <hr style={{ borderTop: '1px solid rgba(0,0,0,0.08)', margin: '20px 0' }} />
                          
                          <div className="mb-4">
                            <h6 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#333', marginBottom: '15px' }}>Items Ordered</h6>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                              {order.items.map((item) => (
                                <div key={item.id} className="d-flex align-items-center justify-content-between p-2" style={{ backgroundColor: '#F8F5F2', borderRadius: '10px' }}>
                                  <div className="d-flex align-items-center">
                                    <img 
                                      src={item.image} 
                                      alt={item.name} 
                                      style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} 
                                    />
                                    <div className="ms-3" style={{ marginLeft: '12px' }}>
                                      <span style={{ fontWeight: 600, display: 'block', fontSize: '14px', color: '#1E1E1E' }}>{item.name}</span>
                                      <span style={{ fontSize: '12px', color: '#777' }}>Qty: {item.quantity}</span>
                                    </div>
                                  </div>
                                  <span style={{ fontWeight: 600, fontSize: '14px', color: '#6F4E37' }}>${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="d-flex flex-wrap justify-content-between align-items-center mt-3 pt-3 border-top" style={{ borderTop: '1px dashed rgba(0,0,0,0.1) !important' }}>
                            <div style={{ fontSize: '13px', color: '#666', maxWidth: '400px' }}>
                              <span style={{ fontWeight: 600, display: 'block' }}>Delivery Address:</span>
                              {order.billingDetails.address}
                            </div>
                            
                            <motion.button 
                              disabled={reorderingId === order.id}
                              onClick={() => handleReorder(order)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="btn text-white mt-3 mt-sm-0 d-flex align-items-center gap-2"
                              style={{ 
                                backgroundColor: '#6F4E37', 
                                borderRadius: '50px', 
                                padding: '10px 25px', 
                                fontWeight: 500,
                                fontSize: '14px'
                              }}
                            >
                              {reorderingId === order.id ? (
                                <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite' }} />
                              ) : (
                                <>
                                  <RefreshCw size={14} /> Reorder All Items
                                </>
                              )}
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reorder Success Toast */}
      <AnimatePresence>
        {successToast && (
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EBFBEE', borderRadius: '50%', padding: '6px' }}>
              <Check color="#28a745" size={16} />
            </div>
            <div>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#1E1E1E', display: 'block' }}>Items Added to Cart!</span>
              <span style={{ fontSize: '12px', color: '#777' }}>
                Your order is ready.{' '}
                <Link to="/cart" style={{ color: '#D9A066', fontWeight: 600, textDecoration: 'none' }}>
                  View Cart
                </Link>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </motion.section>
  );
};

export default OrderHistory;
