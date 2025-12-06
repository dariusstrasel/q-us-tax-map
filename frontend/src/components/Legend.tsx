import React from 'react';

export const Legend: React.FC = () => (
  <div className="legend" style={{ textAlign: 'center', margin: '1em 0' }}>
    <span style={{ background: '#0000ff', color: '#fff', padding: '2px 8px', marginRight: 8 }}>Low</span>
    <span style={{ background: '#ff0000', color: '#fff', padding: '2px 8px' }}>High</span>
  </div>
);