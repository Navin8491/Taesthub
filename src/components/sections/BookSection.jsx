import { motion } from 'framer-motion';

const BookSection = () => {
  return (
    <motion.section 
      className="book_section layout_padding"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container-fluid px-4 px-lg-5">
        <div className="heading_container">
          <h2>
            Book A Table
          </h2>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="form_container">
              <form action="" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <input type="text" className="form-control" placeholder="Your Name" />
                </div>
                <div>
                  <input type="text" className="form-control" placeholder="Phone Number" />
                </div>
                <div>
                  <input type="email" className="form-control" placeholder="Your Email" />
                </div>
                <div>
                  <select className="form-control nice-select wide" defaultValue="">
                    <option value="" disabled>
                      How many persons?
                    </option>
                    <option value="2">
                      2
                    </option>
                    <option value="3">
                      3
                    </option>
                    <option value="4">
                      4
                    </option>
                    <option value="5">
                      5
                    </option>
                  </select>
                </div>
                <div>
                  <input type="date" className="form-control" />
                </div>
                <div className="btn_box">
                  <button type="submit">
                    Book Now
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="col-md-6">
            <div className="map_container ">
              <div id="googleMap">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387190.279909073!2d-74.25987368715491!3d40.69767006458873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1690000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Maps"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default BookSection;
