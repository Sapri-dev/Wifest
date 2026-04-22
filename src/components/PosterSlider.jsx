import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

/* ── Poster data — disesuaikan dengan lomba Wifest 2026 ──────── */
const POSTERS = [
  {
    src:         '/posters/poster-utama.jpg',
    name:        'WIFEST 2026',
    designation: 'Wicida Festival · STMIK Widya Cipta Dharma',
    quote:       'Festival kompetisi antar pelajar dan umum se-Kalimantan Timur. Empat cabang lomba: Bulu Tangkis, Mobile Legends, Modern Dance, dan Cosplay. Pendaftaran Gratis, terbuka untuk semua!',
    color:       '#e8a020',
  },
  {
    src:         '/posters/poster-badminton.jpg',
    name:        'Badminton Competition',
    designation: 'Ganda Campuran · Pelajar SMA/MA/SMK se-Kaltim',
    quote:       'Unjukkan kehebatan smash dan taktik kamu bersama pasangan terbaikmu! Sistem gugur Knockout, best of 3 (Bo3). Slot hanya untuk 16 Tim — daftarkan sekarang sebelum penuh!',
    color:       '#22c55e',
  },
  {
    src:         '/posters/poster-mlbb.jpg',
    name:        'Mobile Legends Competition',
    designation: 'E-Sport · Pelajar SMA/MA/SMK se-Kaltim',
    quote:       'Tunjukkan skill dan strategi tim Mobile Legends kamu di atas panggung kompetisi! Format Best of 1 babak awal, Best of 5 Final. Slot terbuka untuk 32 Tim terbaik!',
    color:       '#818cf8',
  },
  {
    src:         '/posters/poster-dance.jpg',
    name:        'Modern Dance Competition',
    designation: 'Terbuka untuk Umum · 4–15 Anggota per Tim',
    quote:       'Ekspresikan kreativitas dan kekompakan gerak dalam satu penampilan epik. Durasi 3–5 menit, koreografi bebas atau dance cover. Tampilkan jiwa senimu di atas panggung WIFEST!',
    color:       '#f472b6',
  },
  {
    src:         '/posters/poster-cosplay.jpg',
    name:        'Cosplay Competition',
    designation: 'Individu · Masyarakat Umum & Pelajar',
    quote:       'Hidupkan karakter anime, game, atau tokusatsu favoritmu! Tampil solo di depan juri selama 1 menit penuh gaya. Kostum sesuai tema mendapatkan nilai tambahan. Untuk 20 peserta!',
    color:       '#fb923c',
  },
];

/* ── Gap kalkulasi responsif (dari komponen asli) ─────────────── */
function calculateGap(width) {
  const minWidth = 1024, maxWidth = 1456;
  const minGap = 50,    maxGap = 80;
  if (width <= minWidth) return minGap;
  if (width >= maxWidth) return Math.max(minGap, maxGap + 0.06018 * (width - maxWidth));
  return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth));
}

/* ── Main Component ──────────────────────────────────────────── */
export const PosterSlider = () => {
  const [activeIndex, setActiveIndex]       = useState(0);
  const [hoverPrev, setHoverPrev]           = useState(false);
  const [hoverNext, setHoverNext]           = useState(false);
  const [containerWidth, setContainerWidth] = useState(600);

  const imageContainerRef  = useRef(null);
  const autoplayRef        = useRef(null);
  const total              = POSTERS.length;
  const active             = POSTERS[activeIndex];

  /* Responsive width tracking */
  useEffect(() => {
    const measure = () => {
      if (imageContainerRef.current)
        setContainerWidth(imageContainerRef.current.offsetWidth);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  /* Auto-play */
  const startAutoplay = useCallback(() => {
    clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() =>
      setActiveIndex(p => (p + 1) % total), 5000
    );
  }, [total]);

  useEffect(() => { startAutoplay(); return () => clearInterval(autoplayRef.current); }, [startAutoplay]);

  /* Keyboard */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft')  handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeIndex]);

  const handleNext = useCallback(() => {
    clearInterval(autoplayRef.current);
    setActiveIndex(p => (p + 1) % total);
    startAutoplay();
  }, [total, startAutoplay]);

  const handlePrev = useCallback(() => {
    clearInterval(autoplayRef.current);
    setActiveIndex(p => (p - 1 + total) % total);
    startAutoplay();
  }, [total, startAutoplay]);

  /* 3D image transform per index */
  const getImageStyle = (index) => {
    const gap        = calculateGap(containerWidth);
    const maxStickUp = gap * 0.75;
    const isActive   = index === activeIndex;
    const isLeft     = (activeIndex - 1 + total) % total === index;
    const isRight    = (activeIndex + 1) % total === index;

    if (isActive) return {
      zIndex: 3, opacity: 1, pointerEvents: 'auto',
      transform: 'translateX(0) translateY(0) scale(1) rotateY(0deg)',
      transition: 'all 0.75s cubic-bezier(.4,2,.3,1)',
    };
    if (isLeft) return {
      zIndex: 2, opacity: 1, pointerEvents: 'auto',
      transform: `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.82) rotateY(14deg)`,
      transition: 'all 0.75s cubic-bezier(.4,2,.3,1)',
    };
    if (isRight) return {
      zIndex: 2, opacity: 1, pointerEvents: 'auto',
      transform: `translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.82) rotateY(-14deg)`,
      transition: 'all 0.75s cubic-bezier(.4,2,.3,1)',
    };
    return {
      zIndex: 1, opacity: 0, pointerEvents: 'none',
      transition: 'all 0.75s cubic-bezier(.4,2,.3,1)',
    };
  };

  /* Quote word-by-word reveal (dari komponen asli) */
  const quoteVariants = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0  },
    exit:    { opacity: 0, y: -16 },
  };

  return (
    <div className="ct-root">
      <div className="ct-grid">

        {/* ── Left: 3D Image Carousel ─── */}
        <div className="ct-images" ref={imageContainerRef}>
          {POSTERS.map((p, i) => (
            <img
              key={p.src}
              src={p.src}
              alt={p.name}
              className="ct-img"
              style={getImageStyle(i)}
            />
          ))}
        </div>

        {/* ── Right: Content ─── */}
        <div className="ct-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              variants={quoteVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.28, ease: 'easeInOut' }}
            >
              {/* Category color dot */}
              <div className="ct-dot-row">
                <span className="ct-dot" style={{ background: active.color }} />
                <span className="ct-cat" style={{ color: active.color }}>
                  {activeIndex === 0 ? 'Wicida Festival' : `Lomba #${String(activeIndex).padStart(2,'0')}`}
                </span>
              </div>

              <h3 className="ct-name">{active.name}</h3>
              <p  className="ct-desg">{active.designation}</p>

              {/* Word-by-word blur reveal */}
              <motion.p className="ct-quote">
                {active.quote.split(' ').map((w, i) => (
                  <motion.span
                    key={i}
                    initial={{ filter: 'blur(8px)', opacity: 0, y: 4  }}
                    animate={{ filter: 'blur(0)',   opacity: 1, y: 0  }}
                    transition={{ duration: 0.2, ease: 'easeOut', delay: 0.02 * i }}
                    style={{ display: 'inline-block' }}
                  >
                    {w}&nbsp;
                  </motion.span>
                ))}
              </motion.p>
            </motion.div>
          </AnimatePresence>

          {/* Arrows + dot counter */}
          <div className="ct-controls">
            <div className="ct-arrows">
              <button
                className="ct-arrow"
                onClick={handlePrev}
                onMouseEnter={() => setHoverPrev(true)}
                onMouseLeave={() => setHoverPrev(false)}
                style={{ background: hoverPrev ? active.color : '#ffffff' }}
                aria-label="Sebelumnya"
              >
                <FaArrowLeft size={16} color={hoverPrev ? "#fff" : "#0f0c1a"} />
              </button>
              <button
                className="ct-arrow"
                onClick={handleNext}
                onMouseEnter={() => setHoverNext(true)}
                onMouseLeave={() => setHoverNext(false)}
                style={{ background: hoverNext ? active.color : '#ffffff' }}
                aria-label="Berikutnya"
              >
                <FaArrowRight size={16} color={hoverNext ? "#fff" : "#0f0c1a"} />
              </button>
            </div>

            {/* Dots */}
            <div className="ct-dots">
              {POSTERS.map((_, i) => (
                <button
                  key={i}
                  className={`ct-dot-btn ${i === activeIndex ? 'active' : ''}`}
                  style={i === activeIndex ? { background: active.color } : {}}
                  onClick={() => { clearInterval(autoplayRef.current); setActiveIndex(i); startAutoplay(); }}
                  aria-label={`Poster ${i + 1}`}
                />
              ))}
            </div>

            <span className="ct-counter">
              <span style={{ color: active.color, fontWeight: 700 }}>{String(activeIndex + 1).padStart(2,'0')}</span>
              <span className="ct-counter-sep"> / {String(total).padStart(2,'0')}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosterSlider;
