import React from 'react';

const PARTNERS = [
  { type: 'stat',  value: '500+',         label: 'Projects Installed'      },
  { type: 'brand', value: 'Bruce Hardwood'                                  },
  { type: 'stat',  value: '20+ Years',    label: 'Serving New England'     },
  { type: 'brand', value: 'Shaw Floors'                                     },
  { type: 'stat',  value: 'MA · RI · CT', label: 'Licensed & Insured'      },
  { type: 'brand', value: 'Armstrong'                                       },
  { type: 'stat',  value: '4.8 ★',        label: 'Google Rating'           },
  { type: 'brand', value: 'Mohawk'                                          },
  { type: 'stat',  value: 'Free',         label: 'In-Home Consultation'    },
  { type: 'brand', value: 'Anderson Tuftex'                                 },
  { type: 'stat',  value: '500+',         label: 'Projects Installed'      },
  { type: 'brand', value: 'Pergo'                                           },
];

const ITEMS = [...PARTNERS, ...PARTNERS];

const PartnersTicker = () => {
  return (
    <div 
      style={{
        background: '#1a1a1a',
        padding: 0,
        overflow: 'hidden',
        width: '100%',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        height: '52px',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        zIndex: 20
      }}
    >
      <style>{`
        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .partners-ticker-track {
          display: flex;
          align-items: center;
          width: max-content;
          gap: 0;
          animation: ticker 35s linear infinite;
        }
        .partners-ticker-track:hover {
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
          width: '120px',
          zIndex: 1,
          background: 'linear-gradient(to right, #1a1a1a 0%, transparent 100%)',
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
          width: '120px',
          zIndex: 1,
          background: 'linear-gradient(to left, #1a1a1a 0%, transparent 100%)',
          pointerEvents: 'none'
        }}
      />

      <div className="partners-ticker-track">
        {ITEMS.map((item, index) => (
          <React.Fragment key={index}>
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                height: '52px',
                padding: '0 32px',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              {item.type === 'stat' ? (
                <>
                  <span 
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--color-accent-mid)',
                      letterSpacing: '-0.01em',
                      marginRight: '6px'
                    }}
                  >
                    {item.value}
                  </span>
                  <span 
                    style={{
                      fontSize: '11px',
                      fontWeight: 400,
                      color: 'rgba(255,255,255,0.40)',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase'
                    }}
                  >
                    {item.label}
                  </span>
                </>
              ) : (
                <span 
                  style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: 'rgba(255,255,255,0.55)',
                    letterSpacing: '0.04em',
                    fontStyle: 'italic'
                  }}
                >
                  {item.value}
                </span>
              )}
            </div>
            {index < ITEMS.length - 1 && (
              <div 
                style={{
                  width: '1px',
                  height: '16px',
                  flexShrink: 0,
                  background: 'rgba(255,255,255,0.10)',
                  alignSelf: 'center'
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default PartnersTicker;
