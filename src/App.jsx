import { useEffect, useRef, useState } from 'preact/hooks';
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring, 
  useVelocity, 
  useAnimationFrame, 
  useMotionValue 
} from 'framer-motion';
import { wrap } from '@motionone/utils';
import './App.css';

export default function App() {
  const [loading, setLoading] = useState(true);
  
  // PRELOADER
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // SMOOTH SCROLL BAR
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <>
      <div className="noise-overlay"></div>
      <motion.div className="progress-bar" style={{ scaleX }} />

      {/* --- PRELOADER --- */}
      <motion.div 
        className="preloader"
        initial={{ y: 0 }}
        animate={{ y: loading ? 0 : "-100%" }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      >
        <div className="loader-content">
          <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.5 }} className="loader-line" />
          <h2 className="loader-text">RISHU JAISWAL</h2>
        </div>
      </motion.div>

      {/* --- HERO SECTION --- */}
      <section className="hero">
        <div className="hero-title-container">
          <HeroChar char="R" meaning="RELIABILITY" delay={2.0} />
          <HeroChar char="I" meaning="INNOVATION" delay={2.1} />
          <HeroChar char="S" meaning="STRATEGY" delay={2.2} />
          <HeroChar char="H" meaning="HOSPITALITY" delay={2.3} />
          <HeroChar char="U" meaning="UNIQUENESS" delay={2.4} />
        </div>
        
        <motion.div 
          className="hero-sub"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.6 }}
        >
          EXPERIENCE ARCHITECT
        </motion.div>
      </section>

      {/* --- VELOCITY MARQUEE --- */}
      <section className="marquee-section">
        <VelocityText baseVelocity={-2}>Strategy Design Execution Hospitality</VelocityText>
        <VelocityText baseVelocity={2}>Luxury Corporate Bespoke Grandeur</VelocityText>
      </section>

      {/* --- SERVICES (HOVER REVEAL) --- */}
      <section className="section-padding services-container">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          THE CRAFT
        </motion.h2>
        
        <div className="service-list">
          <ServiceItem 
            title="Bespoke Weddings" 
            cat="Design & Production" 
            img="https://images.unsplash.com/photo-1519225421980-715cb0202128?q=80&w=1200"
          />
          <ServiceItem 
            title="Corporate Galas" 
            cat="Brand Experience" 
            img="https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200"
          />
          <ServiceItem 
            title="Grand Production" 
            cat="Technical Direction" 
            img="https://images.unsplash.com/photo-1470229722913-7ea038629667?q=80&w=1200"
          />
          <ServiceItem 
            title="Artist Management" 
            cat="Logistics & Hospitality" 
            img="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1200"
          />
        </div>
      </section>

      {/* --- PORTFOLIO (HORIZONTAL SCROLL) --- */}
      <HorizontalScrollSection />

      {/* --- CONTACT --- */}
      <ContactSection />

      <footer>
        <div className="footer-content">
          <span>© 2025 RJ Experience</span>
          <span>Jaipur · Worldwide</span>
        </div>
      </footer>
    </>
  );
}

/* ================= COMPONENT LOGIC ================= */

// 1. HERO CHARACTERS (Modern Font)
function HeroChar({ char, meaning, delay }) {
  return (
    <div style={{ overflow: 'hidden' }}>
      <motion.div
        className="hero-char-wrapper"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1, delay: delay, ease: [0.76, 0, 0.24, 1] }}
      >
        <span className="hero-char">{char}</span>
        <span className="hero-meaning">{meaning}</span>
      </motion.div>
    </div>
  );
}

// 2. VELOCITY MARQUEE
function VelocityText({ children, baseVelocity = 100 }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);
  const directionFactor = useRef(1);

  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    if (velocityFactor.get() < 0) directionFactor.current = -1;
    else if (velocityFactor.get() > 0) directionFactor.current = 1;
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="parallax">
      <motion.div className="scroller" style={{ x }}>
        <span>{children} </span>
        <span>{children} </span>
        <span>{children} </span>
        <span>{children} </span>
      </motion.div>
    </div>
  );
}

// 3. SERVICE ITEM (Hover Image Reveal)
function ServiceItem({ title, cat, img }) {
  const [isHovered, setHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMove = (e) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  return (
    <motion.div 
      className="service-item"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMove}
      initial={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
      whileHover={{ borderBottom: "1px solid rgba(212, 175, 55, 1)", paddingLeft: "20px" }}
    >
      <div className="service-text">
        <h3>{title}</h3>
        <span className="service-cat">{cat}</span>
      </div>

      {/* Floating Image */}
      <motion.div
        className="service-img-float"
        style={{ 
          x: mouseX, 
          y: mouseY, 
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.5,
        }}
      >
        <img src={img} alt={title} />
      </motion.div>
    </motion.div>
  );
}

// 4. HORIZONTAL SCROLL SECTION
function HorizontalScrollSection() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-75%"]);

  return (
    <section ref={targetRef} className="horizontal-scroll-section">
      <div className="sticky-wrapper">
        <motion.h2 style={{ opacity: scrollYProgress }} className="horizontal-title">SELECTED WORKS</motion.h2>
        <motion.div style={{ x }} className="card-container">
          <Card url="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000" title="The Royal Palace" />
          <Card url="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1000" title="Tech Summit 2024" />
          <Card url="https://images.unsplash.com/photo-1514525253440-b393452e3720?q=80&w=1000" title="Fashion Week" />
          <Card url="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000" title="Concert Arena" />
          <Card url="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000" title="Private Gala" />
        </motion.div>
      </div>
    </section>
  );
}

function Card({ url, title }) {
  return (
    <div className="horizontal-card">
      <div className="card-img-box">
        <img src={url} alt={title} />
      </div>
      <h4>{title}</h4>
    </div>
  );
}

// 5. CONTACT & MAGNETIC BUTTON
function ContactSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  return (
    <section ref={ref} className="new-contact">
      <div className="contact-container">
        <motion.div style={{ opacity: scrollYProgress }} className="contact-header">
          <p>Got an idea?</p>
          <h2>LET'S CREATE<br />HISTORY</h2>
        </motion.div>
        <div className="magnetic-area">
          <MagneticButton>
            <a href="mailto:rishu@email.com" className="magnetic-link">EMAIL ME</a>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}

function MagneticButton({ children }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    setPosition({ x: (clientX - (left + width/2)) * 0.35, y: (clientY - (top + height/2)) * 0.35 });
  };
  const reset = () => setPosition({ x: 0, y: 0 });
  const { x, y } = position;
  return (
    <motion.div
      ref={ref} className="magnetic-wrap" animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      onMouseMove={handleMouse} onMouseLeave={reset}
    >
      {children}
    </motion.div>
  );
}