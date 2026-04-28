import React from 'react';

const EVENTS = [
  { icon: '📋', label: 'Pendaftaran Gelombang I',  date: '1 – 30 Maret 2026',  color: '#7c3aed' },
  { icon: '📝', label: 'Pendaftaran Gelombang II', date: '1 – 18 April 2026',  color: '#0ea5e9' },
  { icon: '🗓️', label: 'Technical Meeting',        date: '27 – 30 April 2026', color: '#f59e0b' },
  { icon: '🏆', label: 'Pelaksanaan Kegiatan',     date: '4 – 8 Mei 2026',    color: '#16a34a' },
  { icon: '🎉', label: 'Pengumuman Pemenang',      date: '11 Mei 2026',        color: '#db2777' },
];

export const EventTimeline = () => (
  <section className="tl-section">
    <div className="tl-inner">
      <p className="tl-eyebrow">Timeline</p>
      <div className="tl-row">
        {EVENTS.map((ev, i) => (
          <React.Fragment key={i}>
            <div className="tl-item">
              <div className="tl-node" style={{ background: ev.color }}>
                {ev.icon}
              </div>
              <div className="tl-label">{ev.label}</div>
              <div className="tl-date">{ev.date}</div>
            </div>
            {i < EVENTS.length - 1 && <div className="tl-connector" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  </section>
);

export default EventTimeline;
