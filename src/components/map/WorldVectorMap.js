import React, { useState, useEffect } from 'react';
import './jquery-jvectormap.css';

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
            values: {
              EG: '#ff6b6b', // Egypt
              AE: '#45b7d1', // UAE
              JO: '#96ceb4', // Jordan
              LB: '#ffeaa7', // Lebanon
              SY: '#dda0dd', // Syria
              IQ: '#98d8c8', // Iraq
              QA: '#fab1a0', // Qatar
              KW: '#fd79a8', // Kuwait
              BH: '#fdcb6e', // Bahrain
              OM: '#6c5ce7', // Oman
              YE: '#a29bfe', // Yemen
              MA: '#fd79a8', // Morocco
              TN: '#fdcb6e', // Tunisia
              DZ: '#e17055', // Algeria
              LY: '#00b894', // Libya
              SD: '#ff7675', // Sudan
              TD: '#74b9ff', // Chad
              SS: '#55a3ff', // South Sudan
              IN: '#ff6b9d', // India
              PA: '#4ecdc4', // Panama
              US: '#95e1d3', // USA
              CA: '#f38181', // Canada
              KR: '#aa96da', // South Korea
              FJ: '#fcbad3', // Fiji
              ZA: '#a8e6cf', // South Africa
              ML: '#ffd3b6', // Mali
              NG: '#ffaaa5'  // Nigeria
            },
            attribute: 'fill'
          }]
        }}
        onRegionClick={(e, code) => {
          const countryNames = {
            EG: 'Egypt',
            AE: 'United Arab Emirates',
            JO: 'Jordan',
            LB: 'Lebanon',
            SY: 'Syria',
            IQ: 'Iraq',
            QA: 'Qatar',
            KW: 'Kuwait',
            BH: 'Bahrain',
            OM: 'Oman',
            YE: 'Yemen',
            MA: 'Morocco',
            TN: 'Tunisia',
            DZ: 'Algeria',
            LY: 'Libya',
            SD: 'Sudan',
            TD: 'Chad',
            SS: 'South Sudan',
            IN: 'India',
            PA: 'Panama',
            US: 'United States',
            CA: 'Canada',
            KR: 'South Korea',
            FJ: 'Fiji',
            ZA: 'South Africa',
            ML: 'Mali',
            NG: 'Nigeria'
          };
          
          if (countryNames[code]) {
            alert(`Hope For All MENA serves in ${countryNames[code]}`);
          }
        }}
      />
    </div>
  );
};

export default WorldVectorMap;
