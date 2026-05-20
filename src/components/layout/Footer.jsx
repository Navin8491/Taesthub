import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Clock, ChevronRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer_section" style={{ backgroundColor: '#1E1E1E', color: '#CCCCCC', paddingTop: 'clamp(50px, 10vw, 80px)', paddingBottom: '30px', borderTop: '1px solid rgba(111,78,55,0.2)' }}>
      <style>
        {`
          .footer-heading {
            font-family: 'Poppins', sans-serif;
            color: #FFFFFF;
            font-size: 1.3rem;
            font-weight: 600;
            margin-bottom: 25px;
            position: relative;
            display: inline-block;
          }
          .footer-heading::after {
            content: '';
            position: absolute;
            left: 0;
            bottom: -8px;
            width: 40px;
            height: 2px;
            background-color: #D9A066;
            transition: width 0.3s ease;
          }
          .footer-col:hover .footer-heading::after {
            width: 60px;
          }
          .footer-text {
            font-family: 'Inter', sans-serif;
            line-height: 1.8;
            font-size: 0.95rem;
          }
          .footer-link {
            display: flex;
            align-items: center;
            color: #CCCCCC;
            text-decoration: none;
            margin-bottom: 12px;
            transition: all 0.3s ease;
            font-family: 'Inter', sans-serif;
          }
          .footer-link:hover {
            color: #D9A066;
            transform: translateX(5px);
          }
          .footer-icon-wrapper {
            margin-right: 12px;
            color: #D9A066;
          }
          .footer-social-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.05);
            color: #FFFFFF;
            margin-right: 10px;
            transition: all 0.3s ease;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          .footer-social-btn:hover {
            background: #D9A066;
            color: #FFFFFF;
            transform: translateY(-3px);
            border-color: #D9A066;
          }
          .footer-divider {
            height: 1px;
            background-color: rgba(255, 255, 255, 0.1);
            margin: 50px 0 25px;
          }
          .footer-copyright {
            font-family: 'Inter', sans-serif;
            font-size: 0.9rem;
            text-align: center;
            color: #888;
          }
        `}
      </style>

      <div className="container-fluid px-4 px-lg-5" style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div className="row g-5">
          
          {/* Column 1: Brand */}
          <div className="col-lg-3 col-md-6 footer-col">
            <Link to="/" style={{ textDecoration: 'none' }}>
              <h3 style={{ fontFamily: "'Dancing Script', cursive", color: '#FFFFFF', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: '20px' }}>
                TasteHub
              </h3>
            </Link>
            <p className="footer-text mb-4">
              Experience the finest culinary journey in a luxurious setting. We blend tradition with modern flavors to create unforgettable moments.
            </p>
            <div>
              <a href="#" className="footer-social-btn"><Facebook size={18} /></a>
              <a href="#" className="footer-social-btn"><Twitter size={18} /></a>
              <a href="#" className="footer-social-btn"><Instagram size={18} /></a>
              <a href="#" className="footer-social-btn"><Linkedin size={18} /></a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="col-lg-3 col-md-6 footer-col">
            <h4 className="footer-heading">Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
              <Link to="/" className="footer-link">
                <ChevronRight size={16} className="footer-icon-wrapper" style={{ color: '#D9A066' }} /> Home
              </Link>
              <Link to="/menu" className="footer-link">
                <ChevronRight size={16} className="footer-icon-wrapper" style={{ color: '#D9A066' }} /> Our Menu
              </Link>
              <Link to="/about" className="footer-link">
                <ChevronRight size={16} className="footer-icon-wrapper" style={{ color: '#D9A066' }} /> About Us
              </Link>
              <Link to="/book" className="footer-link">
                <ChevronRight size={16} className="footer-icon-wrapper" style={{ color: '#D9A066' }} /> Book a Table
              </Link>
            </div>
          </div>

          {/* Column 3: Contact Info */}
          <div className="col-lg-3 col-md-6 footer-col">
            <h4 className="footer-heading">Contact Info</h4>
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div className="footer-icon-wrapper" style={{ marginTop: '2px' }}><MapPin size={20} /></div>
                <span className="footer-text">123 Luxury Avenue,<br/>New York, NY 10001</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <div className="footer-icon-wrapper"><Phone size={20} /></div>
                <span className="footer-text">+01 123 456 7890</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="footer-icon-wrapper"><Mail size={20} /></div>
                <span className="footer-text">hello@tastehub.com</span>
              </div>
            </div>
          </div>

          {/* Column 4: Opening Hours */}
          <div className="col-lg-3 col-md-6 footer-col">
            <h4 className="footer-heading">Opening Hours</h4>
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <div className="footer-icon-wrapper"><Clock size={20} /></div>
                <span className="footer-text"><strong>Mon - Sun:</strong><br/>10:00 AM - 10:00 PM</span>
              </div>
              <p className="footer-text" style={{ fontStyle: 'italic', color: '#999', marginTop: '10px' }}>
                *Kitchen closes at 9:30 PM.
              </p>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="footer-divider"></div>

        {/* Copyright */}
        <div className="footer-copyright">
          <p className="m-0">
            &copy; {new Date().getFullYear()} TasteHub. All Rights Reserved. Crafted with passion for culinary excellence.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
