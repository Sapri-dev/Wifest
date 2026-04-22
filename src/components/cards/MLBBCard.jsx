import React from 'react';
import { formatDate } from '../../utils/formatters';
import StatusBadge from '../StatusBadge';

const MLBBCard = ({ item, index, onClick }) => {
  const previewPlayers = item.players.slice(0, 3);
  const more = item.players.length - 3;

  return (
    <div
      className="card-mlbb"
      onClick={() => onClick('mlbb', item)}
      style={{ animationDelay: `${index * 0.04}s` }}
      role="button"
      tabIndex="0"
      aria-label={`Lihat detail tim ${item.teamName}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick('mlbb', item);
      }}
    >
      <div className="card-num">#{String(index + 1).padStart(2, '0')}</div>
      <div className="card-icon-badge">🎮</div>
      <div className="card-team-name">{item.teamName}</div>
      <div className="card-school-name">🏫 {item.school || 'Tidak dicantumkan'}</div>
      <div className="card-players-preview">
        {previewPlayers.map((p, i) => (
          <span key={i} className="player-chip">
            {p.name.split(' ')[0]}
          </span>
        ))}
        {more > 0 && <span className="player-chip">+{more} lagi</span>}
      </div>
      <div className="card-footer">
        <span className="card-date">📅 {formatDate(item.timestamp)}</span>
        <StatusBadge status={item.status} />
      </div>
    </div>
  );
};

export default MLBBCard;
