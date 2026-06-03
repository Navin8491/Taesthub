import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, KeyRound } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
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
          <div className="col-md-8 col-lg-5">
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
                    Welcome Back
                  </span>
                  <p style={{ fontFamily: "'Inter', sans-serif", color: '#777', fontSize: '0.95rem', marginTop: '-5px' }}>
                    Log in to order your favorite warm brew
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
                  {/* Email Input */}
                  <div className="mb-4">
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
                          outline: 'none',
                          fontSize: '0.95rem',
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

                  {/* Password Input */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <label className="form-label mb-0" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.9rem', fontWeight: 500, color: '#333' }}>
                        Password
                      </label>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#999', display: 'flex', alignItems: 'center' }}>
                        <Lock size={18} />
                      </span>
                      <input 
                        type={showPassword ? "text" : "password"} 
                        className="form-control" 
                        required 
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                          height: '50px',
                          paddingLeft: '45px',
                          paddingRight: '45px',
                          borderRadius: '12px',
                          border: '1px solid #E5E4E7',
                          fontFamily: "'Inter', sans-serif",
                          outline: 'none',
                          fontSize: '0.95rem',
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
                          right: '15px',
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
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button 
                    type="submit" 
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
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
                        <KeyRound size={18} /> Log In
                      </>
                    )}
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  </motion.button>
                </form>

                {/* Footer Links */}
                <div className="text-center mt-4">
                  <p style={{ fontFamily: "'Inter', sans-serif", color: '#777', fontSize: '0.9rem' }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: '#D9A066', fontWeight: 600, textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.color = '#6F4E37'} onMouseLeave={e => e.currentTarget.style.color = '#D9A066'}>
                      Sign Up
                    </Link>
                  </p>
                  <div style={{ fontSize: '13px', color: '#999', borderTop: '1px solid #E5E4E7', paddingTop: '15px', marginTop: '15px' }}>
                    <span style={{ fontWeight: 500 }}>Demo Login:</span> john.doe@example.com / password123
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Login;
