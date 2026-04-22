import React from 'react';
import { formatDate } from '../../utils/formatters';
import StatusBadge from '../StatusBadge';

export const BadmintonCard = ({ item, index, onClick }) => (
  <div
    className="participant-card card-badminton"
    onClick={() => onClick('badminton', item)}
    style={{ animationDelay: `${index * 0.04}s` }}
    role="button" tabIndex={0}
    onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onClick('badminton', item)}
  >
    <div className="card-index">#{String(index + 1).padStart(2, '0')} · Badminton</div>
    <div className="card-title">{item.nama || '—'}</div>
    <div className="card-sub">{item.sekolah || 'Sekolah tidak dicantumkan'}</div>
    <div className="card-footer">
      <span className="card-date">{formatDate(item.timestamp)}</span>
      <StatusBadge status={item.status} />
    </div>
  </div>
);

export const MLBBCard = ({ item, index, onClick }) => {
  const preview = item.players.slice(0, 4);
  const more = item.players.length - 4;
  return (
    <div
      className="participant-card card-mlbb"
      onClick={() => onClick('mlbb', item)}
      style={{ animationDelay: `${index * 0.04}s` }}
      role="button" tabIndex={0}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onClick('mlbb', item)}
    >
      <div className="card-index">#{String(index + 1).padStart(2, '0')} · E-Sport</div>
      <div className="card-title">{item.teamName || '—'}</div>
      <div className="card-sub">{item.school || 'Sekolah tidak dicantumkan'}</div>
      <div className="card-chips">
        {preview.map((p, i) => (
          <span key={i} className="chip">{p.name.split(' ')[0]}</span>
        ))}
        {more > 0 && <span className="chip">+{more}</span>}
      </div>
      <div className="card-footer">
        <span className="card-date">{formatDate(item.timestamp)}</span>
        <StatusBadge status={item.status} />
      </div>
    </div>
  );
};

export const DanceCard = ({ item, index, onClick }) => (
  <div
    className="participant-card card-dance"
    onClick={() => onClick('dance', item)}
    style={{ animationDelay: `${index * 0.04}s` }}
    role="button" tabIndex={0}
    onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onClick('dance', item)}
  >
    <div className="card-index">#{String(index + 1).padStart(2, '0')} · Modern Dance</div>
    <div className="card-title">{item.teamName || '—'}</div>
    <div className="card-sub">{item.jumlahAnggota} anggota</div>
    {item.members.length > 0 && (
      <div className="card-chips">
        {item.members.slice(0, 3).map((m, i) => (
          <span key={i} className="chip">{m.split(' ')[0]}</span>
        ))}
        {item.members.length > 3 && <span className="chip">+{item.members.length - 3}</span>}
      </div>
    )}
    <div className="card-footer">
      <span className="card-date">{formatDate(item.timestamp)}</span>
      <StatusBadge status={item.status} />
    </div>
  </div>
);

export const CosplayCard = ({ item, index, onClick }) => (
  <div
    className="participant-card card-cosplay"
    onClick={() => onClick('cosplay', item)}
    style={{ animationDelay: `${index * 0.04}s` }}
    role="button" tabIndex={0}
    onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onClick('cosplay', item)}
  >
    <div className="card-index">#{String(index + 1).padStart(2, '0')} · Cosplay</div>
    <div className="card-title">{item.namaLengkap || item.namaPanggung || '—'}</div>
    {item.namaPanggung && item.namaLengkap && (
      <div className="stagename-tag">✦ {item.namaPanggung}</div>
    )}
    {item.karakter && (
      <div className="cosplay-char-block">
        <span className="char-icon">🎬</span>
        <div className="char-info">
          <div className="char-name">{item.karakter}</div>
          {item.asalKarakter && <div className="char-from">{item.asalKarakter}</div>}
        </div>
      </div>
    )}
    <div className="card-footer">
      {item.ageGroup ? <span className="age-chip">{item.ageGroup}</span> : <span />}
      <StatusBadge status={item.status} />
    </div>
  </div>
);
