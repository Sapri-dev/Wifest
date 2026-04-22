import React from 'react';
import { formatDate } from '../../utils/formatters';
import StatusBadge from '../StatusBadge';

const DanceCard = ({ item, index, onClick }) => {
  return (
    <div
      className="card-dance"
      onClick={() => onClick('dance', item)}
      style={{ animationDelay: `${index * 0.04}s` }}
      role="button"
      tabIndex="0"
      aria-label={`Lihat detail tim ${item.teamName}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick('dance', item);
      }}
    >
      <div className="card-num">#{String(index + 1).padStart(2, '0')}</div>
      <div className="card-icon-badge">💃</div>
      <div className="card-dance-name">{item.teamName}</div>
      <div className="card-member-count">👥 {item.jumlahAnggota} Anggota</div>
      <div className="card-meta">
        <span className="card-date">📅 {formatDate(item.timestamp)}</span>
        <StatusBadge status={item.status} />
      </div>
    </div>
  );
};

export default DanceCard;
