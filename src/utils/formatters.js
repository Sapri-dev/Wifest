export const formatDate = (ts) => {
  if (!ts) return '—';
  const parts = ts.split(' ')[0].split('/');
  if (parts.length < 3) return ts;
  const [dd, mm, yyyy] = parts;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${parseInt(dd)} ${months[parseInt(mm) - 1]} ${yyyy}`;
};
