import React, { useEffect, useRef } from 'react';
import { formatDate } from '../utils/formatters';
import StatusBadge from './StatusBadge';

const Modal = ({ item, type, onClose }) => {
  const overlayRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  if (!item) return null;

  return (
    <div
      className="modal-overlay"
      ref={overlayRef}
      onMouseDown={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-content">
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Tutup modal"
          autoFocus
        >
          ✕
        </button>
        <div className="modal-body">
          {type === 'badminton' && <BadmintonModalBody item={item} />}
          {type === 'mlbb' && <MLBBModalBody item={item} />}
          {type === 'dance' && <DanceModalBody item={item} />}
          {type === 'cosplay' && <CosplayModalBody item={item} />}
        </div>
      </div>
    </div>
  );
};

const BadmintonModalBody = ({ item }) => (
  <>
    <div className="modal-hero">
      <div className="modal-big-icon">🏸</div>
      <div>
        <div className="modal-title">{item.nama}</div>
        <div className="modal-subtitle">Badminton — Ganda Campuran</div>
      </div>
    </div>
    <div className="modal-section">
      <div className="modal-section-title">Informasi Peserta</div>
      <Row label="📋 Nama Peserta" value={item.nama} />
      <Row label="🏫 Asal Sekolah" value={item.sekolah || '—'} />
      <Row label="🏸 Kategori" value={item.kategori} />
      <Row label="📞 Telepon" value={item.telepon || '—'} />
      <Row label="📅 Daftar" value={formatDate(item.timestamp)} />
      <Row label="✅ Status" value={<StatusBadge status={item.status} />} />
    </div>
  </>
);

const MLBBModalBody = ({ item }) => (
  <>
    <div className="modal-hero">
      <div className="modal-big-icon">🎮</div>
      <div>
        <div className="modal-title">{item.teamName}</div>
        <div className="modal-subtitle">E-Sport Mobile Legends: Bang-Bang</div>
      </div>
    </div>
    <div className="modal-section">
      <div className="modal-section-title">Informasi Tim</div>
      <Row label="🏟️ Nama Tim" value={item.teamName} />
      <Row label="🏫 Asal Sekolah" value={item.school || '—'} />
      <Row label="📞 Kontak" value={item.telepon || '—'} />
      <Row label="📅 Daftar" value={formatDate(item.timestamp)} />
      <Row label="✅ Status" value={<StatusBadge status={item.status} />} />
    </div>
    {item.players.length > 0 && (
      <div className="modal-section">
        <div className="modal-section-title">Anggota Tim ({item.players.length} Player)</div>
        <ul className="player-list">
          {item.players.map((p, i) => (
            <li key={i} className="player-item">
              <div className="player-num">{i + 1}</div>
              <div className="player-info">
                <div className="player-fullname">{p.name}</div>
                {p.nick && <div className="player-nick">{p.nick}</div>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    )}
  </>
);

const DanceModalBody = ({ item }) => (
  <>
    <div className="modal-hero">
      <div className="modal-big-icon">💃</div>
      <div>
        <div className="modal-title">{item.teamName}</div>
        <div className="modal-subtitle">Modern Dance</div>
      </div>
    </div>
    <div className="modal-section">
      <div className="modal-section-title">Informasi Tim</div>
      <Row label="💃 Nama Tim" value={item.teamName} />
      <Row label="👥 Jumlah Anggota" value={`${item.jumlahAnggota} orang`} />
      <Row label="📞 Kontak" value={item.telepon || '—'} />
      <Row label="📅 Daftar" value={formatDate(item.timestamp)} />
      <Row label="✅ Status" value={<StatusBadge status={item.status} />} />
    </div>
    {item.members.length > 0 && (
      <div className="modal-section">
        <div className="modal-section-title">Daftar Anggota</div>
        <ul className="player-list">
          {item.members.map((m, i) => (
            <li key={i} className="player-item">
              <div className="player-num">{i + 1}</div>
              <div className="player-info">
                <div className="player-fullname">{m}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )}
  </>
);

const CosplayModalBody = ({ item }) => (
  <>
    <div className="modal-hero">
      <div className="modal-big-icon">🎭</div>
      <div>
        <div className="modal-title">{item.namaLengkap}</div>
        <div className="modal-subtitle">
          {item.namaPanggung ? `✨ ${item.namaPanggung} · ` : ''}Cosplay
        </div>
      </div>
    </div>
    <div className="modal-section">
      <div className="modal-section-title">Informasi Peserta</div>
      <Row label="👤 Nama Lengkap" value={item.namaLengkap} />
      {item.namaPanggung && <Row label="✨ Nama Panggung" value={item.namaPanggung} />}
      <Row label="🎂 Kategori Usia" value={item.ageGroup || '—'} />
      <Row label="📞 WhatsApp" value={item.noWA || '—'} />
    </div>
    <div className="modal-section">
      <div className="modal-section-title">Detail Cosplay</div>
      <Row label="🎬 Karakter" value={item.karakter || '—'} />
      <Row label="📺 Asal Karakter" value={item.asalKarakter || '—'} />
      <Row label="👗 Kostum" value={item.kostum || '—'} />
      <Row label="📅 Daftar" value={formatDate(item.timestamp)} />
      <Row label="✅ Status" value={<StatusBadge status={item.status} />} />
    </div>
  </>
);

const Row = ({ label, value }) => (
  <div className="modal-row">
    <span className="modal-row-label">{label}</span>
    <span className="modal-row-value">{value}</span>
  </div>
);

export default Modal;
