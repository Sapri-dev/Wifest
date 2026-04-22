import React from 'react';

const SearchFilter = ({ search, setSearch, filterStatus, setFilterStatus }) => (
  <div className="toolbar">
    <div className="search-box">
      <span className="search-icon">⌕</span>
      <input
        type="text"
        className="search-input"
        placeholder="Cari nama, sekolah, atau tim..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      {search && (
        <button className="clear-search visible" onClick={() => setSearch('')} aria-label="Hapus">✕</button>
      )}
    </div>
    <div className="filter-box">
      <label htmlFor="filterStatus">Status</label>
      <div className="custom-select">
        <select id="filterStatus" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">Semua</option>
          <option value="valid">Valid</option>
          <option value="invalid">Tidak Valid</option>
        </select>
      </div>
    </div>
  </div>
);

export default SearchFilter;
