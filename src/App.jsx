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
import Img1 from './assets/Img1.jpeg';
import Img2  from './assets/Img2.jpeg';
import Img3  from './assets/Img3.jpeg';
import Img4  from './assets/Img4.jpeg';
import Img5  from './assets/Img5.jpeg';
import './App.css';

// --- UTILITY: Wrap Function (Internalized to fix import error) ---
const wrap = (min, max, v) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export default function App() {
  const [loading, setLoading] = useState(true);
  
  // --- CURSOR REFS ---
  const dotRef = useRef(null);
  const outlineRef = useRef(null);
  const glowRef = useRef(null);

  // --- CURSOR LOGIC ---
  useEffect(() => {
    // Disable on mobile
    if (window.matchMedia("(max-width: 768px)").matches) return;

    let mouse = { x: 0, y: 0 };
    let current = { x: 0, y: 0 };
    let reqId;

    const manageMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const animate = () => {
      const dot = dotRef.current;
      const outline = outlineRef.current;
      const glow = glowRef.current;

      if (dot && outline && glow) {
        // Dot & Glow follow instantly
        dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;
        glow.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;

        // Outline follows with delay (Smooth Physics)
        const speed = 0.15;
        current.x += (mouse.x - current.x) * speed;
        current.y += (mouse.y - current.y) * speed;
        outline.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`;
      }
      reqId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", manageMouseMove);
    reqId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", manageMouseMove);
      cancelAnimationFrame(reqId);
    };
  }, []);

  // --- PRELOADER ---
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

      {/* --- CUSTOM CURSOR ELEMENTS --- */}
      <div ref={dotRef} className="cursor-dot"></div>
      <div ref={outlineRef} className="cursor-outline"></div>
      <div ref={glowRef} className="cursor-glow"></div>

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
          EXPERIENCE THE EXTRAORDINARY
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
            title="SHADI WALA" 
            cat="Design & Production" 
            img={Img1}
          />
          <ServiceItem 
            title="UTSAV WEDDINGS" 
            cat="INFIELD PRODUCTION" 
            img={Img2}  
          />
          <ServiceItem 
            title="DEVSHREE EVENTS" 
            cat="OVERALL MANAGEMENT" 
            img={Img3}
          />
          <ServiceItem 
            title="SPARKLE EVENTS" 
            cat="Logistics & Hospitality" 
            img={Img4}
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

// 1. HERO CHARACTERS
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

// 2. OPTIMIZED VELOCITY MARQUEE (Fixes Lag)
function VelocityText({ children, baseVelocity = 100 }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  
  // Smoother physics settings
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 300 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(0, -25, v)}%`);
  const directionFactor = useRef(1);

  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    if (velocityFactor.get() !== 0) {
      if (velocityFactor.get() < 0) directionFactor.current = -1;
      else if (velocityFactor.get() > 0) directionFactor.current = 1;
      moveBy += directionFactor.current * moveBy * velocityFactor.get();
    }
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

// 3. SERVICE ITEM
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
  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-90%"]);

  return (
    <section ref={targetRef} className="horizontal-scroll-section">
      <div className="sticky-wrapper">
        <motion.h2 style={{ opacity: scrollYProgress }} className="horizontal-title">SELECTED WORKS</motion.h2>
        <motion.div style={{ x }} className="card-container">
          <Card url={Img1} title="LEELA PALACE" />
          <Card url={Img2} title="TAJ AMER" />
          <Card url={Img3} title="LE MERIDIEN" />
          <Card url={Img4} title="FAIRMONT" />
          <Card url={Img5} title="RAMBAGH" />
          
          
          
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
            <a href="mailto:rish541232u@gmail.com" className="magnetic-link">EMAIL ME</a>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}

// Replace the old MagneticButton function with this one
function MagneticButton({ children }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.35, y: middleY * 0.35 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });
  const { x, y } = position;

  return (
    <motion.div
      ref={ref}
      className="magnetic-wrap"
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      // Make the whole div clickable
      onClick={() => window.location.href = "mailto:rishu@email.com"}
    >
      {children}
    </motion.div>
  );
}