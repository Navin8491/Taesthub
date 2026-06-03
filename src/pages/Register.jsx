import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, MapPin, Eye, EyeOff, UserPlus } from 'lucide-react';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const res = await register({
        firstName,
        lastName,
        email,
        phone,
        address,
        password
      });

      setLoading(false);
      if (res.success) {
        navigate('/profile');
      } else {
        setError(res.message);
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'An unexpected error occurred');
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
        display: 'flex',
        alignItems: 'center',
        padding: '60px 0'
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-7 col-xl-6">
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
              className="card shadow-lg border-0"
              style={{
                borderRadius: '20px',
                overflow: 'hidden',
                backgroundColor: '#ffffff'
              }}
            >
              {/* Card Accent Top Bar */}
              <div style={{ height: '6px', background: 'linear-gradient(90deg, #6F4E37 0%, #D9A066 100%)' }} />

              <div className="card-body p-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <span style={{ 
                    fontFamily: "'Dancing Script', cursive", 
                    fontSize: '3rem', 
                    color: '#6F4E37',
                    fontWeight: 'bold',
                    display: 'block'
                  }}>
                    Create Account
                  </span>
                  <p style={{ fontFamily: "'Inter', sans-serif", color: '#777', fontSize: '0.95rem', marginTop: '-5px' }}>
                    Join TasteHub today and enjoy fresh coffee delivered to your door
                  </p>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="alert alert-danger text-center p-2 mb-4"
                    style={{ borderRadius: '10px', fontSize: '14px', border: 'none', backgroundColor: '#FDF2F2', color: '#DE3434' }}
                  >
                    {error}
                  </motion.div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  {/* Name Row */}
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.9rem', fontWeight: 500, color: '#333' }}>
                        First Name
                      </label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#999', display: 'flex', alignItems: 'center' }}>
                          <User size={18} />
                        </span>
                        <input 
                          type="text" 
                          className="form-control" 
                          required 
                          placeholder="John"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          style={{
                            height: '50px',
                            paddingLeft: '45px',
                            borderRadius: '12px',
                            border: '1px solid #E5E4E7',
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '0.95rem',
                            outline: 'none',
                            transition: 'all 0.3s'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#6F4E37';
                            e.target.style.boxShadow = '0 0 0 4px rgba(111, 78, 55, 0.1)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '#E5E4E7';
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.9rem', fontWeight: 500, color: '#333' }}>
                        Last Name
                      </label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#999', display: 'flex', alignItems: 'center' }}>
                          <User size={18} />
                        </span>
                        <input 
                          type="text" 
                          className="form-control" 
                          required 
                          placeholder="Doe"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          style={{
                            height: '50px',
                            paddingLeft: '45px',
                            borderRadius: '12px',
                            border: '1px solid #E5E4E7',
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '0.95rem',
                            outline: 'none',
                            transition: 'all 0.3s'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#6F4E37';
                            e.target.style.boxShadow = '0 0 0 4px rgba(111, 78, 55, 0.1)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '#E5E4E7';
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email & Phone Row */}
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.9rem', fontWeight: 500, color: '#333' }}>
                        Email Address
                      </label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#999', display: 'flex', alignItems: 'center' }}>
                          <Mail size={18} />
                        </span>
                        <input 
                          type="email" 
                          className="form-control" 
                          required 
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          style={{
                            height: '50px',
                            paddingLeft: '45px',
                            borderRadius: '12px',
                            border: '1px solid #E5E4E7',
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '0.95rem',
                            outline: 'none',
                            transition: 'all 0.3s'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#6F4E37';
                            e.target.style.boxShadow = '0 0 0 4px rgba(111, 78, 55, 0.1)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '#E5E4E7';
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.9rem', fontWeight: 500, color: '#333' }}>
                        Phone Number
                      </label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#999', display: 'flex', alignItems: 'center' }}>
                          <Phone size={18} />
                        </span>
                        <input 
                          type="tel" 
                          className="form-control" 
                          required 
                          placeholder="+1 (555) 000-0000"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          style={{
                            height: '50px',
                            paddingLeft: '45px',
                            borderRadius: '12px',
                            border: '1px solid #E5E4E7',
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '0.95rem',
                            outline: 'none',
                            transition: 'all 0.3s'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#6F4E37';
                            e.target.style.boxShadow = '0 0 0 4px rgba(111, 78, 55, 0.1)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '#E5E4E7';
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="mb-3">
                    <label className="form-label" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.9rem', fontWeight: 500, color: '#333' }}>
                      Delivery Address
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '15px', top: '15px', color: '#999', display: 'flex', alignItems: 'center' }}>
                        <MapPin size={18} />
                      </span>
                      <textarea 
                        className="form-control" 
                        required 
                        rows="2"
                        placeholder="Street address, City, State, ZIP code"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        style={{
                          paddingLeft: '45px',
                          borderRadius: '12px',
                          border: '1px solid #E5E4E7',
                          fontFamily: "'Inter', sans-serif",
                          fontSize: '0.95rem',
                          outline: 'none',
                          transition: 'all 0.3s'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#6F4E37';
                          e.target.style.boxShadow = '0 0 0 4px rgba(111, 78, 55, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#E5E4E7';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>

                  {/* Password Row */}
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label className="form-label" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.9rem', fontWeight: 500, color: '#333' }}>
                        Password
                      </label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#999', display: 'flex', alignItems: 'center' }}>
                          <Lock size={18} />
                        </span>
                        <input 
                          type={showPassword ? "text" : "password"} 
                          className="form-control" 
                          required 
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          style={{
                            height: '50px',
                            paddingLeft: '45px',
                            paddingRight: '40px',
                            borderRadius: '12px',
                            border: '1px solid #E5E4E7',
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '0.95rem',
                            outline: 'none',
                            transition: 'all 0.3s'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#6F4E37';
                            e.target.style.boxShadow = '0 0 0 4px rgba(111, 78, 55, 0.1)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '#E5E4E7';
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            border: 'none',
                            background: 'none',
                            color: '#999',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            padding: 0
                          }}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <label className="form-label" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.9rem', fontWeight: 500, color: '#333' }}>
                        Confirm Password
                      </label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#999', display: 'flex', alignItems: 'center' }}>
                          <Lock size={18} />
                        </span>
                        <input 
                          type={showConfirmPassword ? "text" : "password"} 
                          className="form-control" 
                          required 
                          placeholder="Confirm"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          style={{
                            height: '50px',
                            paddingLeft: '45px',
                            paddingRight: '40px',
                            borderRadius: '12px',
                            border: '1px solid #E5E4E7',
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '0.95rem',
                            outline: 'none',
                            transition: 'all 0.3s'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#6F4E37';
                            e.target.style.boxShadow = '0 0 0 4px rgba(111, 78, 55, 0.1)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '#E5E4E7';
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            border: 'none',
                            background: 'none',
                            color: '#999',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            padding: 0
                          }}
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button 
                    type="submit" 
                    disabled={loading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="btn w-100 mt-2" 
                    style={{
                      height: '50px',
                      backgroundColor: '#6F4E37',
                      color: '#ffffff',
                      borderRadius: '50px',
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 600,
                      fontSize: '1rem',
                      boxShadow: '0 8px 20px rgba(111, 78, 55, 0.25)',
                      transition: 'background-color 0.3s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5c402d'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6F4E37'}
                  >
                    {loading ? (
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite' }} />
                    ) : (
                      <>
                        <UserPlus size={18} /> Sign Up
                      </>
                    )}
                  </motion.button>
                </form>

                {/* Footer Links */}
                <div className="text-center mt-4">
                  <p style={{ fontFamily: "'Inter', sans-serif", color: '#777', fontSize: '0.9rem' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#D9A066', fontWeight: 600, textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.color = '#6F4E37'} onMouseLeave={e => e.currentTarget.style.color = '#D9A066'}>
                      Log In
                    </Link>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Register;
