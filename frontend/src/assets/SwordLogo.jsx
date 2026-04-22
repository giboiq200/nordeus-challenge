function SwordLogo() {
  return (
    <svg width="200" height="280" viewBox="0 0 200 280">
      <defs>
        <radialGradient id="swordGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7b3ff7" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#7b3ff7" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="260" rx="80" ry="22" fill="#1a1428"/>
      <ellipse cx="100" cy="258" rx="70" ry="18" fill="#221a38"/>
      <line x1="90" y1="248" x2="78" y2="268" stroke="#120e20" strokeWidth="1.5"/>
      <line x1="112" y1="244" x2="125" y2="266" stroke="#120e20" strokeWidth="1"/>
      <ellipse cx="100" cy="160" rx="55" ry="110" fill="url(#swordGlow)" opacity="0.5"/>
      <polygon points="94,10 106,10 102,210 98,210" fill="#c8c8e8"/>
      <polygon points="96,10 104,10 101,180 99,180" fill="#e8e8ff"/>
      <line x1="100" y1="12" x2="100" y2="205" stroke="#ffffff" strokeWidth="0.8" opacity="0.6"/>
      <rect x="65" y="105" width="70" height="12" rx="4" fill="#8a7040"/>
      <rect x="67" y="106" width="66" height="6" rx="3" fill="#c4a855"/>
      <circle cx="76" cy="111" r="4" fill="#7b3ff7"/>
      <circle cx="76" cy="111" r="2" fill="#b884ff"/>
      <circle cx="124" cy="111" r="4" fill="#7b3ff7"/>
      <circle cx="124" cy="111" r="2" fill="#b884ff"/>
      <rect x="95" y="117" width="10" height="50" rx="3" fill="#6b4a1a"/>
      <rect x="96" y="118" width="5" height="48" rx="2" fill="#8b6a2a"/>
      <line x1="95" y1="125" x2="105" y2="125" stroke="#4a2a08" strokeWidth="1.5"/>
      <line x1="95" y1="132" x2="105" y2="132" stroke="#4a2a08" strokeWidth="1.5"/>
      <line x1="95" y1="139" x2="105" y2="139" stroke="#4a2a08" strokeWidth="1.5"/>
      <line x1="95" y1="146" x2="105" y2="146" stroke="#4a2a08" strokeWidth="1.5"/>
      <ellipse cx="100" cy="170" rx="10" ry="8" fill="#8a7040"/>
      <ellipse cx="100" cy="169" rx="7" ry="5" fill="#c4a855"/>
      <circle cx="70" cy="60" r="2" fill="#b884ff" opacity="0.8"/>
      <circle cx="135" cy="80" r="1.5" fill="#b884ff" opacity="0.6"/>
      <circle cx="55" cy="120" r="1.8" fill="#7b3ff7" opacity="0.7"/>
      <circle cx="148" cy="35" r="2.2" fill="#b884ff" opacity="0.5"/>
      <circle cx="62" cy="180" r="1.5" fill="#7b3ff7" opacity="0.6"/>
      <circle cx="142" cy="150" r="1.8" fill="#b884ff" opacity="0.7"/>
    </svg>
  );
}

export default SwordLogo;