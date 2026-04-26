import React from 'react';

const TICKER_ITEMS = [
  { text: 'Hardwood Installation',        accent: false },
  { text: 'Licensed & Insured',           accent: true  },
  { text: 'Vinyl & LVP',                  accent: false },
  { text: 'Serving MA · RI · CT',         accent: true  },
  { text: 'Laminate Flooring',            accent: false },
  { text: 'Free In-Home Consultation',    accent: true  },
  { text: 'Hardwood Restoration',         accent: false },
  { text: 'Certified Installation Crew',  accent: true  },
  { text: 'Wide Plank & Parquet',         accent: false },
  { text: 'West Bridgewater, MA',         accent: true  },
  { text: 'Residential & Commercial',     accent: false },
  { text: 'Guaranteed Workmanship',       accent: true  },
];

const ITEMS = [...TICKER_ITEMS, ...TICKER_ITEMS];

const DiamondSeparator = () => (
  <svg 
    viewBox="0 0 8 8" 
    width="8" 
    height="8" 
    style={{ margin: '0 8px', flexShrink: 0 }}
  >
    <rect 
      x="1" 
      y="1" 
      width="6" 
      height="6" 
      transform="rotate(45 4 4)" 
      fill="rgba(255,255,255,0.15)" 
    />
  </svg>
);

const TickerRow = ({ items, reverse = false }: { items: typeof ITEMS, reverse?: boolean }) => (
  <div 
    className={`ticker-track ${reverse ? 'rtl' : 'ltr'}`}
    style={{
      display: 'flex',
      alignItems: 'center',
      width: 'max-content',
    }}
  >
    {items.map((item, index) => (
      <div 
        key={index}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 40px',
          whiteSpace: 'nowrap',
          flexShrink: 0
        }}
      >
        <span 
          style={{
            fontSize: '22px',
            fontWeight: 500,
            letterSpacing: '-0.01em',
            color: item.accent ? 'var(--color-accent-mid)' : 'rgba(255,255,255,0.55)'
          }}
        >
          {item.text}
        </span>
        <DiamondSeparator />
      </div>
    ))}
  </div>
);

const PartnersTicker = () => {
  return (
    <div 
      className="ticker-container"
      style={{
        background: '#1a1a1a',
        height: '260px',
        overflow: 'hidden',
        width: '100%',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        zIndex: 20
      }}
    >
      <style>{`
        @keyframes tickerLTR {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes tickerRTL {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
        .ticker-track.ltr {
          animation: tickerLTR 40s linear infinite;
        }
        .ticker-track.rtl {
          animation: tickerRTL 40s linear infinite;
        }
        .ticker-container:hover .ticker-track {
          animation-play-state: paused;
        }
      `}</style>

      {/* Fade esquerdo */}
      <div 
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '200px',
          zIndex: 1,
          background: 'linear-gradient(to right, #1a1a1a, transparent)',
          pointerEvents: 'none'
        }}
      />

      {/* Fade direito */}
      <div 
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '200px',
          zIndex: 1,
          background: 'linear-gradient(to left, #1a1a1a, transparent)',
          pointerEvents: 'none'
        }}
      />

      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '32px', 
          width: '100%' 
        }}
      >
        <TickerRow items={ITEMS} />
        <TickerRow items={ITEMS} reverse />
      </div>
    </div>
  );
};

export default PartnersTicker;
