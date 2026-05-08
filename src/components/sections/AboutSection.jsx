import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AboutSection = () => {
  return (
    <motion.section 
      className="about_section layout_padding"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container-fluid px-4 px-lg-5">
        <div className="row">
          <div className="col-md-6 ">
            <div className="img-box">
              <img src="/images/about-img.png" alt="" />
            </div>
          </div>
          <div className="col-md-6">
            <div className="detail-box">
              <div className="heading_container">
                <h2>
                  We Are Feane
                </h2>
              </div>
              <p>
                There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration
                in some form, by injected humour, or randomised words which don't look even slightly believable. If you
                are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in
                the middle of text. All
              </p>
              <Link 
                to="/about" 
                onClick={() => window.scrollTo(0, 0)}
              >
                Read More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutSection;
