import React from 'react';
import { formatDate } from '../../utils/formatters';
import StatusBadge from '../StatusBadge';

const BadmintonCard = ({ item, index, onClick }) => {
  return (
    <div
      className="card-badminton"
      onClick={() => onClick('badminton', item)}
      style={{ animationDelay: `${index * 0.04}s` }}
      role="button"
      tabIndex="0"
      aria-label={`Lihat detail ${item.nama}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick('badminton', item);
      }}
    >
      <div className="card-num">#{String(index + 1).padStart(2, '0')}</div>
      <div className="card-icon-badge">🏸</div>
      <div className="card-name">{item.nama}</div>
      <div className="card-school">🏫 {item.sekolah || 'Sekolah tidak dicantumkan'}</div>
      <div className="card-meta">
        <span className="card-date">📅 {formatDate(item.timestamp)}</span>
        <StatusBadge status={item.status} />
      </div>
    </div>
  );
};

export default BadmintonCard;
