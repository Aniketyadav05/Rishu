import { useEffect, useRef, useState } from 'preact/hooks';
import './App.css'; // Ensure your CSS is pasted here

export default function App() {
  const [loading, setLoading] = useState(true);
  
  // Refs for direct DOM manipulation (Performance for Cursor)
  const dotRef = useRef(null);
  const outlineRef = useRef(null);
  const glowRef = useRef(null);
  
  // PRELOADER LOGIC
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // CURSOR & SCROLL LOGIC
  useEffect(() => {
    if (loading) return; // Don't run logic until loaded

    // --- Cursor Logic ---
    let mouse = { x: 0, y: 0 };
    let current = { x: 0, y: 0 };
    let requestRef;

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const animateCursor = () => {
      const dot = dotRef.current;
      const outline = outlineRef.current;
      const glow = glowRef.current;

      if (dot && outline && glow) {
        const glowOffset = 300;
        const dotOffset = 3;
        
        glow.style.transform = `translate3d(${mouse.x - glowOffset}px, ${mouse.y - glowOffset}px, 0)`;
        dot.style.transform = `translate3d(${mouse.x - dotOffset}px, ${mouse.y - dotOffset}px, 0)`;

        const speed = 0.15;
        current.x += (mouse.x - current.x) * speed;
        current.y += (mouse.y - current.y) * speed;
        const outlineOffset = 20; 
        
        outline.style.transform = `translate3d(${current.x - outlineOffset}px, ${current.y - outlineOffset}px, 0)`;
      }
      requestRef = requestAnimationFrame(animateCursor);
    };

    window.addEventListener('mousemove', onMouseMove);
    requestRef = requestAnimationFrame(animateCursor);

    // --- Hover Triggers ---
    const triggers = document.querySelectorAll('.hover-trigger, a, button');
    const addHover = () => document.body.classList.add('hovering');
    const removeHover = () => document.body.classList.remove('hovering');

    triggers.forEach(t => {
      t.addEventListener('mouseenter', addHover);
      t.addEventListener('mouseleave', removeHover);
    });

    // --- Scroll Reveal Logic ---
    const revealOnScroll = () => {
      const reveals = document.querySelectorAll('.reveal');
      reveals.forEach((reveal) => {
        if (reveal.getBoundingClientRect().top < window.innerHeight - 100) {
          reveal.classList.add('active');
        }
      });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger once on load

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', revealOnScroll);
      cancelAnimationFrame(requestRef);
      triggers.forEach(t => {
        t.removeEventListener('mouseenter', addHover);
        t.removeEventListener('mouseleave', removeHover);
      });
    };
  }, [loading]);

  return (
    <>
      <div className="noise-overlay"></div>

      {/* Preloader */}
      <div 
        className="preloader" 
        style={{ transform: loading ? 'translateY(0)' : 'translateY(-100%)' }}
      >
        <div className="loader-line" style={{ width: loading ? '0%' : '100%' }}></div>
        <div className="loader-text">ORCHESTRATING EXCELLENCE</div>
      </div>

      {/* Cursor Elements */}
      <div ref={dotRef} className="cursor-dot"></div>
      <div ref={outlineRef} className="cursor-outline"></div>
      <div ref={glowRef} className="cursor-glow"></div>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-title">
          <HeroChar char="R" meaning="RELIABILITY" />
          <HeroChar char="I" meaning="INNOVATION" />
          <HeroChar char="S" meaning="STRATEGY" />
          <HeroChar char="H" meaning="HOSPITALITY" />
          <HeroChar char="U" meaning="UNIQUENESS" />
        </div>
        
        <div className="hero-subtitle">
          <div>Luxury Weddings</div>
          <div className="italic">&</div>
          <div>Corporate Grandeur</div>
        </div>

        <div className="scroll-indicator">
          <span>SCROLL</span>
          <div className="scroll-line"></div>
        </div>
      </section>

      {/* Marquee */}
      <div className="marquee-container">
        <div className="marquee-content">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="marquee-item">
              Strategy • Design • Execution • Hospitality •{' '}
            </span>
          ))}
        </div>
      </div>

      {/* Services Section */}
      <section className="section-padding">
        <div className="reveal">
          <h2 style={{ fontSize: '3rem', marginBottom: '20px' }}>The Craft</h2>
          <p style={{ color: '#888', maxWidth: '500px' }}>
            A comprehensive suite of management solutions for the discerning client.
          </p>
        </div>

        <div className="services-grid">
          <ServiceCard num="01" title="Bespoke Weddings" desc="From palace venues to intimate beachside vows. We handle the aesthetics, the flow, and the emotions." />
          <ServiceCard num="02" title="Corporate Galas" desc="Brand-centric experiences that leave a mark. Product launches, award nights, and networking summits." />
          <ServiceCard num="03" title="Grand Production" desc="We transform empty spaces into dreamscapes. Advanced lighting, structural stage design, and immersive audio." />
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="section-padding">
        <div className="reveal">
          <h2 style={{ fontSize: '3rem', marginBottom: '20px' }}>Selected Works</h2>
        </div>

        <div className="portfolio-grid">
          <ProjectCard 
            img="https://images.unsplash.com/photo-1519225421980-715cb0202128?q=80&w=1200&auto=format&fit=crop"
            title="The Oberoi Udaivilas"
            cat="Royal Wedding Execution"
          />
          <ProjectCard 
            img="https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop"
            title="Global Tech Summit"
            cat="Corporate Production"
          />
          <ProjectCard 
            img="https://images.unsplash.com/photo-1470229722913-7ea038629667?q=80&w=1200&auto=format&fit=crop"
            title="Sunburn Arena"
            cat="Stage & Logistics"
          />
          <ProjectCard 
            img="https://images.unsplash.com/photo-1520342868574-5fa3804e551c?q=80&w=1200&auto=format&fit=crop"
            title="Vogue Gala Night"
            cat="Décor Styling"
          />
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section reveal">
        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>Let's Create History</h2>
        <p style={{ marginTop: '20px', color: '#666' }}>Jaipur, India · Available Worldwide</p>
        <a href="mailto:rishu@email.com" className="cta-button hover-trigger">Inquire Now</a>
      </section>

      <footer>
        <div>© 2025 Rishu Jaiswal</div>
        <div>Luxury Event Management</div>
      </footer>
    </>
  );
}

// --- Helper Components to keep code clean ---

function HeroChar({ char, meaning }) {
  return (
    <span className="char-wrapper hover-trigger">
      <span className="char">{char}</span>
      <span className="meaning">{meaning}</span>
    </span>
  );
}

function ServiceCard({ num, title, desc }) {
  return (
    <div className="service-card reveal hover-trigger">
      <div className="service-num">{num}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

function ProjectCard({ img, title, cat }) {
  return (
    <div className="project-card reveal hover-trigger">
      <img src={img} className="project-img" alt={title} />
      <div className="project-info">
        <h3>{title}</h3>
        <p>{cat}</p>
      </div>
    </div>
  );
}