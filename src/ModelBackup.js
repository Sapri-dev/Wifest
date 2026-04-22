export default class Model {
  constructor() {
    this.SHEET_ID = '1kiEFtOnXAQ0lZS67DJEqwXkk5SeLytR00TLT3kYeGHg';
    this.SHEET_GID = '1787104703';
    this.CSV_URL = `https://docs.google.com/spreadsheets/d/${this.SHEET_ID}/export?format=csv&gid=${this.SHEET_GID}`;

    this.state = {
      badminton: [],
      mlbb: [],
      dance: [],
      cosplay: [],
      activeTab: 'badminton',
      search: '',
      filterStatus: 'all',
    };
  }

  async fetchData() {
    const res = await fetch(this.CSV_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    const rows = this.parseCSV(text);
    const { badminton, mlbb, dance, cosplay } = this.parseData(rows);

    this.state.badminton = badminton;
    this.state.mlbb = mlbb;
    this.state.dance = dance;
    this.state.cosplay = cosplay;
  }

  // RFC 4180 compliant CSV parser
  parseCSV(text) {
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
  }

  parseData(rows) {
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
          kartuPelajar: r[6] || '',
          buktiTF: r[7] || '',
          status: this.normalizeStatus(r[8] || ''),
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
          kartuPelajar: r[23] || '',
          buktiTF: r[24] || '',
          status: this.normalizeStatus(r[25] || ''),
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
          upload: (r[danceStartIdx + 1] || '').trim(),
          jumlahAnggota: (r[danceStartIdx + 2] || members.length || '?').toString().trim(),
          members,
          telepon: (r[danceStartIdx + 4] || '').trim(),
          setuju: (r[danceStartIdx + 5] || '').trim(),
          status: this.normalizeStatus((r[danceStartIdx + 6] || '').trim()),
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
          upload: (r[ageIdx + 7] || '').trim(),
          setuju: (r[ageIdx + 8] || '').trim(),
          bersedia: (r[ageIdx + 9] || '').trim(),
          status: this.normalizeStatus((r[ageIdx + 10] || '').trim()),
        };
        if (entry.namaLengkap || entry.namaPanggung) cosplay.push(entry);
      }
    }

    return { badminton, mlbb, dance, cosplay };
  }

  normalizeStatus(s) {
    const v = s.toLowerCase().trim();
    if (v === 'valid' || v === 'ya') return 'valid';
    if (v.includes('tidak') || v.includes('invalid')) return 'invalid';
    return 'pending';
  }

  getFilteredData() {
    const items = this.state[this.state.activeTab];
    const q = this.state.search.toLowerCase().trim();
    const s = this.state.filterStatus;

    return items.filter(item => {
      if (s !== 'all') {
        if (s === 'valid' && item.status !== 'valid') return false;
        if (s === 'invalid' && item.status !== 'invalid') return false;
      }
      if (!q) return true;

      // Tab specific search
      if (this.state.activeTab === 'badminton') {
        return [item.nama, item.sekolah, item.kategori].some(v => v && v.toLowerCase().includes(q));
      }
      if (this.state.activeTab === 'mlbb') {
        return [item.teamName, item.school, item.players.map(p => p.name).join(' ')].some(v => v && v.toLowerCase().includes(q));
      }
      if (this.state.activeTab === 'dance') {
        return [item.teamName, item.members.join(' ')].some(v => v && v.toLowerCase().includes(q));
      }
      if (this.state.activeTab === 'cosplay') {
        return [item.namaLengkap, item.namaPanggung, item.karakter, item.asalKarakter].some(v => v && v.toLowerCase().includes(q));
      }
      return true;
    });
  }

  getItemById(type, id) {
    return this.state[type].find(x => x.id === id);
  }

  getStats() {
    return {
      total: this.state.badminton.length + this.state.mlbb.length + this.state.dance.length + this.state.cosplay.length,
      badminton: this.state.badminton.length,
      mlbb: this.state.mlbb.length,
      dance: this.state.dance.length,
      cosplay: this.state.cosplay.length
    };
  }

  setTab(tab) { this.state.activeTab = tab; }
  setSearch(q) { this.state.search = q; }
  setFilter(status) { this.state.filterStatus = status; }
}
