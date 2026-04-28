import React, { useState, useMemo } from 'react';
import Hero from './components/Hero';
import Tabs from './components/Tabs';
import SearchFilter from './components/SearchFilter';
import PosterSlider from './components/PosterSlider';
import EventTimeline from './components/EventTimeline';
import { BadmintonCard, MLBBCard, DanceCard, CosplayCard } from './components/cards/AllCards';
import Modal from './components/Modal';
import { useGoogleSheet } from './hooks/useGoogleSheet';
import './index.css';

const SECTION = {
  badminton: { title: 'Badminton — Ganda Campuran', sub: 'Pelajar SMA/MA/SMK se-Kalimantan Timur', line: 'line-badminton' },
  mlbb:      { title: 'E-Sport Mobile Legends',     sub: 'Pelajar SMA/MA/SMK se-Kalimantan Timur', line: 'line-mlbb'      },
  dance:     { title: 'Modern Dance',               sub: 'Terbuka untuk umum · 4–15 anggota',      line: 'line-dance'     },
  cosplay:   { title: 'Cosplay',                    sub: 'Individu · terbuka untuk umum',           line: 'line-cosplay'   },
};

const CARD = { badminton: BadmintonCard, mlbb: MLBBCard, dance: DanceCard, cosplay: CosplayCard };

const App = () => {
  const { data, loading, error, lastUpdate, refetch } = useGoogleSheet();
  const [activeTab, setActiveTab] = useState('badminton');
  const [search, setSearch]       = useState('');
  const [filterStatus, setFilter] = useState('all');
  const [selected, setSelected]   = useState(null);

  const items = data[activeTab] ?? [];

  const filtered = useMemo(() => {
    if (loading) return [];
    const q = search.toLowerCase().trim();
    return items.filter(item => {
      if (filterStatus === 'valid'   && item.status !== 'valid')   return false;
      if (filterStatus === 'invalid' && item.status !== 'invalid') return false;
      if (!q) return true;
      const searchable = {
        badminton: [item.nama, item.sekolah],
        mlbb:      [item.teamName, item.school, item.players?.map(p => p.name).join(' ')],
        dance:     [item.teamName, item.members?.join(' ')],
        cosplay:   [item.namaLengkap, item.namaPanggung, item.karakter, item.asalKarakter],
      };
      return (searchable[activeTab] ?? []).some(v => v?.toLowerCase().includes(q));
    });
  }, [items, activeTab, search, filterStatus, loading]);

  const isFiltered = search !== '' || filterStatus !== 'all';
  const section    = SECTION[activeTab];
  const CardC      = CARD[activeTab];

  const changeTab  = tab => { setActiveTab(tab); setSearch(''); setFilter('all'); };

  return (
    <div className="app-container">
      <Hero data={data} loading={loading} />
      <PosterSlider />
      <EventTimeline />

      <main className="main-content">
        <Tabs activeTab={activeTab} setTab={changeTab} data={data} />

        <SearchFilter
          search={search} setSearch={setSearch}
          filterStatus={filterStatus} setFilterStatus={setFilter}
        />

        <div className="section-header">
          <div className="section-label">
            <span className={`section-accent-line ${section.line}`} />
            <div>
              <div className="section-title">{section.title}</div>
              <div className="section-subtitle">{section.sub}</div>
            </div>
          </div>
          <div className="results-count">
            {loading ? '…'
              : isFiltered ? `${filtered.length} / ${items.length} peserta`
              : `${items.length} peserta`}
          </div>
        </div>

        {error && (
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <div className="error-msg">{error}</div>
            <button className="error-retry" onClick={refetch}>Coba Lagi</button>
          </div>
        )}

        {loading ? (
          <div className="grid-skeleton">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="skeleton-card" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="skel-line w-16" />
                <div className="skel-line" />
                <div className="skel-line w-3/4" />
                <div className="skel-line w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="cards-grid">
            {filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <div>Tidak ada data yang cocok.</div>
              </div>
            ) : (
              filtered.map((item, i) => (
                <CardC
                  key={item.id}
                  item={item}
                  index={i}
                  onClick={(type, it) => setSelected({ type, item: it })}
                />
              ))
            )}
          </div>
        )}

        <div className="footer-info">
          {lastUpdate ? `Diperbarui: ${lastUpdate}` : 'Menghubungkan ke spreadsheet...'}
        </div>
      </main>

      {selected && (
        <Modal item={selected.item} type={selected.type} onClose={() => setSelected(null)} />
      )}
    </div>
  );
};

export default App;
