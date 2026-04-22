import React from 'react';
import { formatDate } from '../../utils/formatters';
import StatusBadge from '../StatusBadge';

const CosplayCard = ({ item, index, onClick }) => {
  return (
    <div
      className="card-cosplay"
      onClick={() => onClick('cosplay', item)}
      style={{ animationDelay: `${index * 0.04}s` }}
      role="button"
      tabIndex="0"
      aria-label={`Lihat detail ${item.namaLengkap}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick('cosplay', item);
      }}
    >
      <div className="card-num">#{String(index + 1).padStart(2, '0')}</div>
      <div className="card-icon-badge">🎭</div>
      <div className="cosplay-name">
        {item.namaLengkap || item.namaPanggung || '—'}
      </div>
      {item.namaPanggung && (
        <div className="cosplay-stagename">✨ {item.namaPanggung}</div>
      )}
      <div className="cosplay-character">
        <span className="cosplay-char-icon">🎬</span>
        <div className="cosplay-char-text">
          <div className="cosplay-char-name">{item.karakter || '—'}</div>
          <div className="cosplay-char-from">{item.asalKarakter || ''}</div>
        </div>
      </div>
      <div className="card-meta">
        {item.ageGroup ? (
          <span className="age-badge">🎂 {item.ageGroup}</span>
        ) : (
          <span></span>
        )}
        <StatusBadge status={item.status} />
      </div>
    </div>
  );
};

export default CosplayCard;
