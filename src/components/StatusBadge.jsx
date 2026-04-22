import React from 'react';

const StatusBadge = ({ status }) => {
  if (status === 'valid')   return <span className="badge badge-valid">✓ Valid</span>;
  if (status === 'invalid') return <span className="badge badge-invalid">✕ Tidak Valid</span>;
  return <span className="badge badge-pending">· Menunggu</span>;
};

export default StatusBadge;
