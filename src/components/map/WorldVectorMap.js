import React from 'react';
import { VectorMap } from 'react-jvectormap';
import './jquery-jvectormap.css';

const WorldVectorMap = () => {
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
              SA: '#4ecdc4', // Saudi Arabia
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
              SS: '#55a3ff'  // South Sudan
            },
            attribute: 'fill'
          }]
        }}
        onRegionClick={(e, code) => {
          const countryNames = {
            EG: 'Egypt',
            SA: 'Saudi Arabia',
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
            SS: 'South Sudan'
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
