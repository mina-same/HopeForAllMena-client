import React, { useState, useEffect } from 'react';
import './jquery-jvectormap.css';

// Countries where the ministry is active, keyed by world_mill region code.
// Bahrain has no shape in world_mill (too small), so it can't be highlighted.
const ACTIVE_COUNTRIES = {
  EG: { name: 'Egypt', color: '#ff6b6b' },
  SD: { name: 'Sudan', color: '#ff7675' },
  SS: { name: 'South Sudan', color: '#55a3ff' },
  ER: { name: 'Eritrea', color: '#ffd3b6' },
  SO: { name: 'Somalia', color: '#a8e6cf' },
  XS: { name: 'Somaliland', color: '#aa96da' },
  DJ: { name: 'Djibouti', color: '#fcbad3' },
  TD: { name: 'Chad', color: '#74b9ff' },
  LY: { name: 'Libya', color: '#00b894' },
  TN: { name: 'Tunisia', color: '#fdcb6e' },
  MA: { name: 'Morocco', color: '#fd79a8' },
  DZ: { name: 'Algeria', color: '#e17055' },
  MR: { name: 'Mauritania', color: '#f38181' },
  ML: { name: 'Mali', color: '#ffd3b6' },
  IQ: { name: 'Iraq', color: '#98d8c8' },
  SY: { name: 'Syria', color: '#dda0dd' },
  LB: { name: 'Lebanon', color: '#ffeaa7' },
  JO: { name: 'Jordan', color: '#96ceb4' },
  KW: { name: 'Kuwait', color: '#fd79a8' },
  SA: { name: 'Saudi Arabia', color: '#95e1d3' },
  AE: { name: 'United Arab Emirates', color: '#45b7d1' },
  BH: { name: 'Bahrain', color: '#fdcb6e' },
  QA: { name: 'Qatar', color: '#fab1a0' },
  OM: { name: 'Oman', color: '#6c5ce7' },
  YE: { name: 'Yemen', color: '#a29bfe' },
  IR: { name: 'Iran', color: '#4ecdc4' },
  TR: { name: 'Turkey', color: '#ffaaa5' },
  CY: { name: 'Cyprus', color: '#74b9ff' },
  PK: { name: 'Pakistan', color: '#f38181' },
  IN: { name: 'India', color: '#ff6b9d' },
  AF: { name: 'Afghanistan', color: '#aa96da' }
};

const WorldVectorMap = () => {
  const [isClient, setIsClient] = useState(false);
  const [VectorMap, setVectorMap] = useState(null);

  useEffect(() => {
    setIsClient(true);
    // Dynamically import the VectorMap component only on client side
    import('react-jvectormap').then((module) => {
      setVectorMap(() => module.VectorMap);
    }).catch((error) => {
      console.error('Failed to load VectorMap:', error);
    });
  }, []);

  if (!isClient || !VectorMap) {
    return (
      <div style={{ 
        width: '100%', 
        height: '500px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        border: '1px solid #ddd',
        borderRadius: '8px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', marginBottom: '10px' }}>🌍</div>
          <div>Loading MENA Region Map...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <VectorMap
        map="world_mill"
        backgroundColor="transparent"
        zoomOnScroll={false}
        containerStyle={{
          width: '100%',
          height: '500px'
        }}
        containerClassName="map"
        regionStyle={{
          initial: {
            fill: '#e4e4e4',
            'fill-opacity': 0.9,
            stroke: 'none',
            'stroke-width': 0,
            'stroke-opacity': 0
          },
          hover: {
            'fill-opacity': 0.8,
            cursor: 'pointer',
            fill: '#2938bc'
          },
          selected: {
            fill: '#2938bc'
          },
          selectedHover: {}
        }}
        regionsSelectable={true}
        series={{
          regions: [{
            values: Object.fromEntries(
              Object.entries(ACTIVE_COUNTRIES).map(([code, { color }]) => [code, color])
            ),
            attribute: 'fill'
          }]
        }}
        onRegionClick={(e, code) => {
          if (ACTIVE_COUNTRIES[code]) {
            alert(`Hope For All MENA serves in ${ACTIVE_COUNTRIES[code].name}`);
          }
        }}
      />
    </div>
  );
};

export default WorldVectorMap;
