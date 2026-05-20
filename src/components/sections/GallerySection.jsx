import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Maximize2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const galleryImages = [
  { id: 1, src: '/images/cafe_interior.png', alt: 'Luxurious modern cafe interior', height: '400px' },
  { id: 2, src: '/images/f1.png', alt: 'Gourmet Pizza', height: '250px' },
  { id: 3, src: '/images/cafe_barista.png', alt: 'Barista pouring latte art', height: '350px' },
  { id: 4, src: '/images/f4.png', alt: 'Creamy truffle pasta', height: '300px' },
  { id: 5, src: '/images/cafe_pastry.png', alt: 'Flaky croissant with espresso', height: '450px' },
  { id: 6, src: '/images/hero-bg-new.png', alt: 'Artisan burger and coffee', height: '250px' },
];

const GallerySection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".heading_container",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );

      const items = gsap.utils.toArray(".masonry-item");
      gsap.fromTo(items,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none"
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      style={{ padding: 'clamp(50px, 10vw, 90px) 0', backgroundColor: '#FFFFFF', overflow: 'hidden' }}
    >
      <style>
        {`
          .masonry-grid {
            column-count: 3;
            column-gap: 24px;
            padding: 0 15px;
          }
          .masonry-item {
            break-inside: avoid;
            margin-bottom: 24px;
            border-radius: 20px;
            overflow: hidden;
            position: relative;
            cursor: pointer;
            box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          }
          .masonry-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
            display: block;
          }
          .masonry-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(111,78,55,0.4));
            opacity: 0;
            transition: opacity 0.4s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1;
          }
          .masonry-icon {
            color: #FFFFFF;
            transform: scale(0.5);
            opacity: 0;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(5px);
            padding: 15px;
            border-radius: 50%;
          }
          .masonry-item:hover .masonry-img {
            transform: scale(1.08);
          }
          .masonry-item:hover .masonry-overlay {
            opacity: 1;
          }
          .masonry-item:hover .masonry-icon {
            transform: scale(1);
            opacity: 1;
          }
          @media (max-width: 991px) {
            .masonry-grid { column-count: 2; }
          }
          @media (max-width: 575px) {
            .masonry-grid { column-count: 1; }
          }
        `}
      </style>

      <div className="container-fluid px-4 px-lg-5" style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div className="heading_container heading_center mb-5">
          <h2 style={{ fontFamily: "'Dancing Script', cursive", fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', color: '#1E1E1E', fontWeight: 'bold' }}>
            Culinary Gallery
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", color: '#666', maxWidth: '600px', margin: '15px auto 0' }}>
            A visual journey through our luxurious ambiance and beautifully crafted dishes.
          </p>
        </div>

        <div className="masonry-grid">
          {galleryImages.map((img) => (
            <div key={img.id} className="masonry-item">
              <img 
                src={img.src} 
                alt={img.alt} 
                className="masonry-img" 
                loading="lazy" 
                style={{ height: img.height }}
              />
              <div className="masonry-overlay">
                <div className="masonry-icon">
                  <Maximize2 size={28} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
