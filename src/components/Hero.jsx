import React, { useEffect, useState } from 'react';

const AnimatedCount = ({ target }) => {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!target) return;
    let c = 0;
    const step = Math.ceil(target / 25);
    const t = setInterval(() => {
      c = Math.min(c + step, target); setN(c);
      if (c >= target) clearInterval(t);
    }, 32);
    return () => clearInterval(t);
  }, [target]);
  return <>{n}</>;
};

const Hero = ({ data, loading }) => {
  const total = data.badminton.length + data.mlbb.length + data.dance.length + data.cosplay.length;

  const cats = [
    { cls: 'cat-badminton', icon: '🏸', label: 'Badminton',      count: data.badminton.length },
    { cls: 'cat-mlbb',      icon: '🎮', label: 'Mobile Legends', count: data.mlbb.length     },
    { cls: 'cat-dance',     icon: '💃', label: 'Modern Dance',   count: data.dance.length    },
    { cls: 'cat-cosplay',   icon: '🎭', label: 'Cosplay',        count: data.cosplay.length  },
  ];

  return (
    <div className="hero">
      <div className="hero-inner">
        {/* Left */}
        <div>
          <div className="hero-label">
            <span className="hero-label-dot" />
            Wicida Festival
          </div>
          <h1 className="hero-title">WI<br />FEST<br />2026</h1>
          <p className="hero-desc">
            Informasi &amp; daftar resmi peserta lomba — Badminton, E-Sport, Modern Dance, dan Cosplay se-Kalimantan Timur.
          </p>
          <div className="hero-meta">
            <span className="hero-meta-chip">📅 4–9 Mei 2026</span>
            <span className="hero-meta-chip">📍 STMIK Widya Cipta Dharma, Samarinda</span>
          </div>
        </div>

        {/* Right — stats */}
        <div className="hero-stats-grid">
          <div className="stat-box total">
            <div className="stat-box-icon">🏆</div>
            <div className="stat-box-value">{loading ? '—' : <AnimatedCount target={total} />}</div>
            <div className="stat-box-label">Total Peserta</div>
          </div>
          {cats.map(({ cls, icon, label, count }) => (
            <div key={cls} className={`stat-box ${cls}`}>
              <div className="stat-box-icon">{icon}</div>
              <div className="stat-box-value">{loading ? '—' : <AnimatedCount target={count} />}</div>
              <div className="stat-box-label">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
