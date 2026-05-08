import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Checkout = () => {
  const { cartItems, cartTotal } = useCart();

  return (
    <motion.section 
      className="checkout_section layout_padding"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{ minHeight: '80vh', backgroundColor: '#f8f9fa' }}
    >
      <div className="container-fluid px-4 px-lg-5">
        <div className="heading_container heading_center mb-5">
          <h2>Checkout</h2>
        </div>
        
        {cartItems.length === 0 ? (
          <div className="text-center">
            <h3>Your cart is empty!</h3>
            <p>Please add some items to your cart before checking out.</p>
            <Link to="/menu" className="btn btn-warning mt-3" style={{ borderRadius: '45px', padding: '10px 30px', color: '#fff' }}>
              Back to Menu
            </Link>
          </div>
        ) : (
          <div className="row">
            <div className="col-lg-8 mb-4">
              <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
                <div className="card-body p-4">
                  <h4 className="mb-4" style={{ fontFamily: "'Dancing Script', cursive", fontWeight: 'bold' }}>Billing Details</h4>
                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">First Name</label>
                        <input type="text" className="form-control" required style={{ borderRadius: '10px' }} />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Last Name</label>
                        <input type="text" className="form-control" required style={{ borderRadius: '10px' }} />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email Address</label>
                      <input type="email" className="form-control" required style={{ borderRadius: '10px' }} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Phone Number</label>
                      <input type="tel" className="form-control" required style={{ borderRadius: '10px' }} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Delivery Address</label>
                      <textarea className="form-control" rows="3" required style={{ borderRadius: '10px' }}></textarea>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card shadow-sm border-0" style={{ borderRadius: '15px', backgroundColor: '#222831', color: '#fff' }}>
                <div className="card-body p-4">
                  <h4 className="mb-4" style={{ fontFamily: "'Dancing Script', cursive", fontWeight: 'bold' }}>Order Summary</h4>
                  <div className="order-items mb-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="d-flex justify-content-between mb-3 border-bottom pb-2" style={{ borderColor: 'rgba(255,255,255,0.1) !important' }}>
                        <span>{item.name} x {item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-4">
                    <span>Delivery Fee</span>
                    <span>$5.00</span>
                  </div>
                  <div className="d-flex justify-content-between mb-4 mt-3 pt-3 border-top" style={{ borderColor: 'rgba(255,255,255,0.1) !important', fontSize: '20px', fontWeight: 'bold', color: '#ffbe33' }}>
                    <span>Total</span>
                    <span>${(cartTotal + 5).toFixed(2)}</span>
                  </div>

                  <button className="btn w-100" style={{ backgroundColor: '#ffbe33', color: '#fff', borderRadius: '45px', padding: '12px', fontWeight: 'bold', fontSize: '18px' }}>
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default Checkout;
