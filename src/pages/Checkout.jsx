import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, ShoppingBag } from 'lucide-react';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { currentUser, addOrder } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [newOrderId, setNewOrderId] = useState('');

  // Prefill details if user is logged in
  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.firstName || '');
      setLastName(currentUser.lastName || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
      setAddress(currentUser.address || '');
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const totalAmount = cartTotal + 5;
      const billingDetails = { firstName, lastName, email, phone, address };

      let orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

      if (currentUser) {
        // Save to user order history
        const order = await addOrder(
          cartItems.map(item => ({
            id: item.id,
            name: item.name,
            category: item.category,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          })),
          totalAmount,
          billingDetails
        );
        if (order) orderId = order.id;
      }

      setNewOrderId(orderId);
      setLoading(false);
      setOrderSuccess(true);
      clearCart();
    } catch (err) {
      setLoading(false);
      console.error("Order placement failed:", err);
    }
  };

  return (
    <motion.section 
      className="checkout_section layout_padding"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      style={{ minHeight: '85vh', backgroundColor: '#F8F5F2', padding: '80px 0' }}
    >
      <div className="container-fluid px-4 px-lg-5" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="heading_container heading_center mb-5" style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Dancing Script', cursive", fontSize: '3rem', color: '#1E1E1E', fontWeight: 'bold' }}>
            Checkout
          </h2>
        </div>
        
        {cartItems.length === 0 && !orderSuccess ? (
          <div className="text-center p-5 shadow-sm border-0 bg-white" style={{ borderRadius: '15px' }}>
            <ShoppingBag size={48} color="#6F4E37" className="mb-3" />
            <h3 style={{ fontFamily: "'Poppins', sans-serif', fontWeight: 600" }}>Your cart is empty!</h3>
            <p style={{ color: '#777' }}>Please add some items to your cart before checking out.</p>
            <Link to="/menu" className="btn text-white mt-3" style={{ borderRadius: '45px', padding: '10px 30px', backgroundColor: '#6F4E37' }}>
              Back to Menu
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Left Column: Billing Form */}
              <div className="col-lg-8 mb-4">
                {/* Guest Checkout Alert */}
                {!currentUser && (
                  <div className="alert alert-warning border-0 p-3 mb-4 d-flex align-items-center gap-2" style={{ borderRadius: '12px', backgroundColor: '#FFF9DB', color: '#f08c00', fontSize: '14.5px' }}>
                    <AlertCircle size={20} style={{ flexShrink: 0 }} />
                    <div>
                      Checking out as Guest. <Link to="/login" style={{ color: '#6F4E37', fontWeight: 700, textDecoration: 'underline' }}>Log In</Link> or <Link to="/register" style={{ color: '#6F4E37', fontWeight: 700, textDecoration: 'underline' }}>Create Account</Link> to save order history.
                    </div>
                  </div>
                )}

                <div className="card shadow-sm border-0" style={{ borderRadius: '15px', backgroundColor: '#FFFFFF' }}>
                  <div className="card-body p-4 p-md-5">
                    <h4 className="mb-4" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: '600', color: '#1E1E1E' }}>Billing Details</h4>
                    
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label" style={{ fontWeight: 500 }}>First Name</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          required 
                          placeholder="John"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          style={{ borderRadius: '10px', height: '45px' }} 
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label" style={{ fontWeight: 500 }}>Last Name</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          required 
                          placeholder="Doe"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          style={{ borderRadius: '10px', height: '45px' }} 
                        />
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label" style={{ fontWeight: 500 }}>Email Address</label>
                      <input 
                        type="email" 
                        className="form-control" 
                        required 
                        placeholder="john.doe@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ borderRadius: '10px', height: '45px' }} 
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label" style={{ fontWeight: 500 }}>Phone Number</label>
                      <input 
                        type="tel" 
                        className="form-control" 
                        required 
                        placeholder="+1 (555) 019-2834"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={{ borderRadius: '10px', height: '45px' }} 
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label" style={{ fontWeight: 500 }}>Delivery Address</label>
                      <textarea 
                        className="form-control" 
                        rows="3" 
                        required 
                        placeholder="Street Address, Suite/Apt, City, State, ZIP Code"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        style={{ borderRadius: '10px' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Order Summary */}
              <div className="col-lg-4">
                <div className="card shadow-sm border-0" style={{ borderRadius: '15px', backgroundColor: '#FFFFFF', color: '#1E1E1E' }}>
                  <div className="card-body p-4">
                    <h4 className="mb-4" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: '600', color: '#1E1E1E' }}>Order Summary</h4>
                    
                    <div className="order-items mb-4" style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '5px' }}>
                      {cartItems.map((item) => (
                        <div key={item.id} className="d-flex justify-content-between mb-3 border-bottom pb-2" style={{ borderColor: '#F1F1F1' }}>
                          <span style={{ fontSize: '14px', color: '#555' }}>
                            {item.name} <strong style={{ color: '#1E1E1E' }}>x {item.quantity}</strong>
                          </span>
                          <span style={{ fontWeight: 600, fontSize: '14px' }}>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="d-flex justify-content-between mb-2" style={{ fontSize: '14.5px', color: '#666' }}>
                      <span>Subtotal</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3" style={{ fontSize: '14.5px', color: '#666' }}>
                      <span>Delivery Fee</span>
                      <span>$5.00</span>
                    </div>
                    
                    <div className="d-flex justify-content-between mb-4 mt-2 pt-3 border-top" style={{ borderColor: '#F1F1F1', fontSize: '18px', fontWeight: '700', color: '#6F4E37' }}>
                      <span>Total</span>
                      <span>${(cartTotal + 5).toFixed(2)}</span>
                    </div>

                    <button 
                      type="submit"
                      disabled={loading || cartItems.length === 0}
                      className="btn w-100 text-white d-flex align-items-center justify-content-center gap-2" 
                      style={{ 
                        backgroundColor: '#6F4E37', 
                        borderRadius: '45px', 
                        padding: '12px', 
                        fontWeight: 'bold', 
                        fontSize: '18px',
                        boxShadow: '0 8px 20px rgba(111, 78, 55, 0.2)'
                      }}
                    >
                      {loading ? (
                        <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite' }} />
                      ) : (
                        "Place Order"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Success Modal Overlay */}
      <AnimatePresence>
        {orderSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 99999,
              padding: '20px'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white text-center p-5 shadow-lg"
              style={{ borderRadius: '20px', maxWidth: '500px', width: '100%' }}
            >
              <div className="mb-4" style={{ display: 'flex', justifyContent: 'center' }}>
                <CheckCircle size={72} color="#28a745" />
              </div>
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#1E1E1E' }}>Order Placed!</h2>
              <p style={{ color: '#555', fontSize: '15px', marginTop: '10px' }}>
                Your order was successfully placed. Your order reference ID is <strong style={{ color: '#6F4E37' }}>{newOrderId}</strong>.
              </p>

              <div className="d-flex flex-column gap-2 mt-4">
                {currentUser ? (
                  <button 
                    onClick={() => { setOrderSuccess(false); navigate('/orders'); }}
                    className="btn text-white w-100" 
                    style={{ backgroundColor: '#6F4E37', borderRadius: '50px', padding: '12px', fontWeight: 600 }}
                  >
                    View Order History
                  </button>
                ) : (
                  <button 
                    onClick={() => { setOrderSuccess(false); navigate('/menu'); }}
                    className="btn text-white w-100" 
                    style={{ backgroundColor: '#6F4E37', borderRadius: '50px', padding: '12px', fontWeight: 600 }}
                  >
                    Explore Menu
                  </button>
                )}
                
                <button 
                  onClick={() => { setOrderSuccess(false); navigate('/'); }}
                  className="btn btn-outline-secondary w-100" 
                  style={{ borderRadius: '50px', padding: '12px', fontWeight: 600 }}
                >
                  Go back to Home
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </motion.section>
  );
};

export default Checkout;
