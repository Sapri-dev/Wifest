import React from 'react';

const TABS = [
  { id: 'badminton', icon: '🏸', label: 'Badminton' },
  { id: 'mlbb',      icon: '🎮', label: 'Mobile Legends' },
  { id: 'dance',     icon: '💃', label: 'Modern Dance' },
  { id: 'cosplay',   icon: '🎭', label: 'Cosplay' },
];

const Tabs = ({ activeTab, setTab, data }) => (
  <div className="tabs-container">
    {TABS.map(({ id, icon, label }) => (
      <button
        key={id}
        data-tab={id}
        className={`tab${activeTab === id ? ' active' : ''}`}
        onClick={() => setTab(id)}
        aria-selected={activeTab === id}
      >
        <span className="tab-icon">{icon}</span>
        <span className="tab-label">{label}</span>
        <span className="tab-count">{data[id]?.length ?? 0}</span>
      </button>
    ))}
  </div>
);

export default Tabs;
