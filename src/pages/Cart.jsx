import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  return (
    <motion.section 
      className="cart_section layout_padding"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{ minHeight: '80vh', backgroundColor: '#f8f9fa' }}
    >
      <div className="container-fluid px-4 px-lg-5">
        <div className="heading_container heading_center mb-5">
          <h2>Your Cart</h2>
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
                  <div className="table-responsive">
                    <table className="table align-middle">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Price</th>
                          <th>Quantity</th>
                          <th>Total</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartItems.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '10px' }} />
                                <div className="ms-3" style={{ marginLeft: '15px' }}>
                                  <h6 className="mb-0 fw-bold">{item.name}</h6>
                                  <small className="text-muted">{item.category}</small>
                                </div>
                              </div>
                            </td>
                            <td>${item.price.toFixed(2)}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <button onClick={() => updateQuantity(item.id, -1)} className="btn btn-sm btn-outline-secondary" style={{ width: '30px', height: '30px', borderRadius: '50%', padding: '0' }}>-</button>
                                <span className="mx-2" style={{ margin: '0 10px' }}>{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, 1)} className="btn btn-sm btn-outline-secondary" style={{ width: '30px', height: '30px', borderRadius: '50%', padding: '0' }}>+</button>
                              </div>
                            </td>
                            <td>${(item.price * item.quantity).toFixed(2)}</td>
                            <td>
                              <button onClick={() => removeFromCart(item.id)} className="btn btn-sm btn-danger" style={{ borderRadius: '5px' }}>
                                <i className="fa fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card shadow-sm border-0" style={{ borderRadius: '15px', backgroundColor: '#222831', color: '#fff' }}>
                <div className="card-body p-4">
                  <h4 className="mb-4" style={{ fontFamily: "'Dancing Script', cursive", fontWeight: 'bold' }}>Cart Summary</h4>
                  
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

                  <Link to="/checkout" className="btn w-100" style={{ backgroundColor: '#ffbe33', color: '#fff', borderRadius: '45px', padding: '12px', fontWeight: 'bold', fontSize: '18px' }}>
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default Cart;
