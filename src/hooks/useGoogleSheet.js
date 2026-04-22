import { useState, useEffect } from 'react';

const SHEET_ID = '1kiEFtOnXAQ0lZS67DJEqwXkk5SeLytR00TLT3kYeGHg';
const SHEET_GID = '1787104703';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${SHEET_GID}`;

const normalizeStatus = (s) => {
  const v = s.toLowerCase().trim();
  if (v === 'valid' || v === 'ya') return 'valid';
  if (v.includes('tidak') || v.includes('invalid')) return 'invalid';
  return 'pending';
};

const parseCSV = (text) => {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  let i = 0;

  while (i < text.length) {
    const ch = text[i];
    const nextCh = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && nextCh === '"') {
        field += '"';
        i += 2;
        continue;
      }
      if (ch === '"') {
        inQuotes = false;
        i++;
        continue;
      }
      field += ch;
      i++;
    } else {
      if (ch === '"') {
        inQuotes = true;
        i++;
        continue;
      }
      if (ch === ',') {
        row.push(field.trim());
        field = '';
        i++;
        continue;
      }
      if (ch === '\r' && nextCh === '\n') {
        row.push(field.trim());
        rows.push(row);
        row = [];
        field = '';
        i += 2;
        continue;
      }
      if (ch === '\n' || ch === '\r') {
        row.push(field.trim());
        rows.push(row);
        row = [];
        field = '';
        i++;
        continue;
      }
      field += ch;
      i++;
    }
  }

  if (field || row.length > 0) {
    row.push(field.trim());
    rows.push(row);
  }

  return rows;
};

const parseData = (rows) => {
  const badminton = [];
  const mlbb = [];
  const dance = [];
  const cosplay = [];

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r || r.length < 2) continue;

    const timestamp = r[0] || '';
    const category = (r[1] || '').toLowerCase().trim();

    if (!timestamp || !category) continue;

    if (category === 'badminton') {
      const entry = {
        id: i,
        timestamp,
        nama: r[2] || '',
        sekolah: r[3] || '',
        kategori: r[4] || 'Ganda Campuran',
        telepon: r[5] || '',
        status: normalizeStatus(r[8] || ''),
      };
      if (entry.nama) badminton.push(entry);
    } else if (category.includes('mobile') || category.includes('e - sport') || category.includes('e-sport')) {
      const players = [];
      const playerNames = [r[11], r[13], r[15], r[17], r[19], r[21]];
      const playerNicks = [r[12], r[14], r[16], r[18], r[20], r[22]];
      for (let p = 0; p < 6; p++) {
        if (playerNames[p] && playerNames[p].trim()) {
          players.push({ name: playerNames[p].trim(), nick: (playerNicks[p] || '').trim() });
        }
      }

      const teamRaw = r[9] || '';
      let school = '', teamName = '';
      if (teamRaw.includes(':')) {
        const parts = teamRaw.split(':');
        school = parts[0].trim();
        teamName = parts.slice(1).join(':').trim();
      } else {
        teamName = teamRaw.trim();
        school = '';
      }

      const entry = {
        id: i,
        timestamp,
        teamRaw,
        teamName: teamName || teamRaw,
        school,
        telepon: r[10] || '',
        players,
        status: normalizeStatus(r[25] || ''),
      };
      if (entry.teamRaw) mlbb.push(entry);
    } else if (category.includes('modern dance') || category.includes('dance')) {
      let danceStartIdx = -1;
      for (let c = 9; c < r.length; c++) {
        const v = (r[c] || '').trim();
        if (v && !v.startsWith('http') && !/^\d{10,}$/.test(v)) {
          danceStartIdx = c;
          break;
        }
      }
      if (danceStartIdx === -1) danceStartIdx = 25;

      const membersRaw = (r[danceStartIdx + 3] || '').trim();
      const members = membersRaw.split('\n').map(m => m.replace(/^\d+\.\s*/, '').trim()).filter(Boolean);

      const entry = {
        id: i,
        timestamp,
        teamName: (r[danceStartIdx] || '').trim(),
        jumlahAnggota: (r[danceStartIdx + 2] || members.length || '?').toString().trim(),
        members,
        telepon: (r[danceStartIdx + 4] || '').trim(),
        status: normalizeStatus((r[danceStartIdx + 6] || '').trim()),
      };
      if (entry.teamName) dance.push(entry);
    } else if (category.includes('cosplay')) {
      let ageIdx = -1;
      for (let c = 2; c < r.length; c++) {
        const v = (r[c] || '').trim();
        if (v === '14-17' || v === '18+') {
          ageIdx = c;
          break;
        }
      }
      if (ageIdx === -1) ageIdx = 32;

      const entry = {
        id: i,
        timestamp,
        ageGroup: (r[ageIdx] || '').trim(),
        namaLengkap: (r[ageIdx + 1] || '').trim(),
        namaPanggung: (r[ageIdx + 2] || '').trim(),
        noWA: (r[ageIdx + 3] || '').trim(),
        karakter: (r[ageIdx + 4] || '').trim(),
        asalKarakter: (r[ageIdx + 5] || '').trim(),
        kostum: (r[ageIdx + 6] || '').trim(),
        status: normalizeStatus((r[ageIdx + 10] || '').trim()),
      };
      if (entry.namaLengkap || entry.namaPanggung) cosplay.push(entry);
    }
  }

  return { badminton, mlbb, dance, cosplay };
};

export const useGoogleSheet = () => {
  const [data, setData] = useState({ badminton: [], mlbb: [], dance: [], cosplay: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState('');

  const fetchSpreadsheetData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(CSV_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const rows = parseCSV(text);
      const parsedData = parseData(rows);
      setData(parsedData);
      
      const now = new Date();
      setLastUpdate(now.toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpreadsheetData();
  }, []);

  return { data, loading, error, lastUpdate, refetch: fetchSpreadsheetData };
};
