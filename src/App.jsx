import { useState } from "react";

const bars = [
  {
    id: 1,
    name: "The Mark",
    address: "1108 Garden St",
    crowd: "High",
    vibe: "Packed & Loud",
    cover: 5,
    line: "Long",
    lastUpdated: "4 min ago",
    friends: ["Josh", "Maya", "Ty"],
    submissions: 14,
    worthScore: 82,
  },
  {
    id: 2,
    name: "Frog & Peach",
    address: "728 Higuera St",
    crowd: "Medium",
    vibe: "Social",
    cover: 0,
    line: "Short",
    lastUpdated: "11 min ago",
    friends: ["Ava"],
    submissions: 9,
    worthScore: 91,
  },
  {
    id: 3,
    name: "SLO Brew Rock",
    address: "855 Aerovista Pl",
    crowd: "Low",
    vibe: "Chill",
    cover: 10,
    line: "None",
    lastUpdated: "22 min ago",
    friends: [],
    submissions: 5,
    worthScore: 67,
  },
  {
    id: 4,
    name: "Creekside Brewing",
    address: "1040 Broad St",
    crowd: "Medium",
    vibe: "Social",
    cover: 0,
    line: "Short",
    lastUpdated: "7 min ago",
    friends: ["Sam", "Leo"],
    submissions: 11,
    worthScore: 88,
  },
  {
    id: 5,
    name: "Bello Mundo Bar",
    address: "1127 Broad St",
    crowd: "High",
    vibe: "Packed & Loud",
    cover: 10,
    line: "Long",
    lastUpdated: "2 min ago",
    friends: ["Zoe"],
    submissions: 18,
    worthScore: 55,
  },
  {
    id: 6,
    name: "The Libertine",
    address: "1234 Monterey St",
    crowd: "Low",
    vibe: "Dead",
    cover: 0,
    line: "None",
    lastUpdated: "38 min ago",
    friends: [],
    submissions: 3,
    worthScore: 40,
  },
];

const crowdColors = {
  Low: "#4ade80",
  Medium: "#facc15",
  High: "#f87171",
};

const crowdEmoji = {
  Low: "🟢",
  Medium: "🟡",
  High: "🔴",
};

const vibeEmoji = {
  "Packed & Loud": "🔥",
  Social: "🎉",
  Chill: "😌",
  Dead: "💀",
};

const lineEmoji = {
  None: "✅",
  Short: "⏱️",
  Long: "😤",
};

const lineColors = {
  None: "#4ade80",
  Short: "#facc15",
  Long: "#f87171",
};

const worthColor = (score) => {
  if (score >= 80) return "#4ade80";
  if (score >= 60) return "#facc15";
  return "#f87171";
};

const worthLabel = (score) => {
  if (score >= 85) return "GO NOW 🚀";
  if (score >= 70) return "Worth It ✓";
  if (score >= 55) return "Maybe 🤷";
  return "Skip It ✗";
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #080810;
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    overscroll-behavior: none;
  }

  .app {
    max-width: 430px;
    margin: 0 auto;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    background: #080810;
    position: relative;
    overflow: hidden;
  }

  /* Ambient glow background */
  .app::before {
    content: '';
    position: fixed;
    top: -30%;
    left: 50%;
    transform: translateX(-50%);
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .header {
    padding: 52px 20px 16px;
    position: relative;
    z-index: 1;
  }

  .header-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 4px;
  }

  .app-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 32px;
    letter-spacing: 3px;
    background: linear-gradient(135deg, #fff 0%, #a855f7 60%, #ec4899 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .live-badge {
    display: flex;
    align-items: center;
    gap: 5px;
    background: rgba(239, 68, 68, 0.15);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 20px;
    padding: 4px 10px;
    font-size: 11px;
    font-weight: 600;
    color: #ef4444;
    letter-spacing: 1px;
  }

  .live-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #ef4444;
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.8); }
  }

  .subtitle {
    font-size: 13px;
    color: rgba(255,255,255,0.35);
    font-weight: 300;
    letter-spacing: 0.5px;
  }

  .bar-list {
    flex: 1;
    overflow-y: auto;
    padding: 8px 16px 100px;
    position: relative;
    z-index: 1;
    scrollbar-width: none;
  }

  .bar-list::-webkit-scrollbar { display: none; }

  .bar-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
    -webkit-tap-highlight-color: transparent;
  }

  .bar-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(168, 85, 247, 0.05) 0%, transparent 60%);
    pointer-events: none;
  }

  .bar-card:active {
    transform: scale(0.98);
    background: rgba(255,255,255,0.07);
  }

  .card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  .bar-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px;
    letter-spacing: 1.5px;
    color: #fff;
    line-height: 1;
  }

  .friends-preview {
    display: flex;
    align-items: center;
    gap: -4px;
  }

  .friend-avatar-sm {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: linear-gradient(135deg, #a855f7, #ec4899);
    border: 2px solid #080810;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 9px;
    font-weight: 600;
    margin-left: -6px;
    color: white;
  }

  .friends-preview .friend-avatar-sm:first-child {
    margin-left: 0;
  }

  .friends-count {
    font-size: 11px;
    color: #a855f7;
    font-weight: 600;
    margin-left: 6px;
  }

  .card-stats {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
  }

  .stat-chip {
    display: flex;
    align-items: center;
    gap: 5px;
    background: rgba(255,255,255,0.07);
    border-radius: 20px;
    padding: 5px 10px;
    font-size: 12px;
    font-weight: 500;
    color: rgba(255,255,255,0.8);
  }

  .stat-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
  }

  .card-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid rgba(255,255,255,0.06);
  }

  .updated-time {
    font-size: 11px;
    color: rgba(255,255,255,0.25);
  }

  .worth-badge {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 14px;
    letter-spacing: 1px;
    padding: 3px 10px;
    border-radius: 20px;
  }

  /* Bottom Nav */
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 430px;
    background: rgba(8, 8, 16, 0.9);
    backdrop-filter: blur(20px);
    border-top: 1px solid rgba(255,255,255,0.08);
    padding: 12px 0 28px;
    display: flex;
    justify-content: space-around;
    z-index: 100;
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    padding: 6px 20px;
    border-radius: 12px;
    transition: all 0.2s;
    -webkit-tap-highlight-color: transparent;
  }

  .nav-item.active .nav-icon { opacity: 1; }
  .nav-item .nav-icon { font-size: 22px; opacity: 0.4; transition: all 0.2s; }
  .nav-item .nav-label { font-size: 10px; color: rgba(255,255,255,0.3); font-weight: 500; }
  .nav-item.active .nav-label { color: #a855f7; }

  /* Modal Overlay */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(8px);
    z-index: 200;
    display: flex;
    align-items: flex-end;
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }

  .modal-sheet {
    width: 100%;
    max-width: 430px;
    margin: 0 auto;
    background: #10101e;
    border-radius: 24px 24px 0 0;
    border-top: 1px solid rgba(255,255,255,0.1);
    max-height: 88dvh;
    overflow-y: auto;
    scrollbar-width: none;
    animation: slideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1);
  }

  .modal-sheet::-webkit-scrollbar { display: none; }

  .modal-handle {
    width: 36px;
    height: 4px;
    background: rgba(255,255,255,0.2);
    border-radius: 2px;
    margin: 12px auto 0;
  }

  .modal-header {
    padding: 20px 20px 0;
    position: relative;
  }

  .modal-bar-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 38px;
    letter-spacing: 2px;
    background: linear-gradient(135deg, #fff 0%, #c084fc 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1;
  }

  .modal-address {
    font-size: 12px;
    color: rgba(255,255,255,0.3);
    margin-top: 4px;
    font-weight: 300;
  }

  .modal-body {
    padding: 20px;
  }

  .section-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 2px;
    color: rgba(255,255,255,0.3);
    text-transform: uppercase;
    margin-bottom: 10px;
  }

  .friends-section {
    margin-bottom: 24px;
  }

  .friends-row {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .friend-pill {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(168, 85, 247, 0.12);
    border: 1px solid rgba(168, 85, 247, 0.25);
    border-radius: 50px;
    padding: 6px 12px 6px 6px;
  }

  .friend-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: linear-gradient(135deg, #a855f7, #ec4899);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
  }

  .friend-name {
    font-size: 13px;
    font-weight: 500;
    color: rgba(255,255,255,0.85);
  }

  .no-friends {
    font-size: 13px;
    color: rgba(255,255,255,0.25);
    font-style: italic;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 24px;
  }

  .stat-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px;
    padding: 14px;
  }

  .stat-card-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1.5px;
    color: rgba(255,255,255,0.3);
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .stat-card-value {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 20px;
    letter-spacing: 1px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .stat-card-sub {
    font-size: 11px;
    color: rgba(255,255,255,0.25);
    margin-top: 4px;
    font-weight: 300;
  }

  .worth-section {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 18px;
    padding: 20px;
    text-align: center;
    margin-bottom: 20px;
    position: relative;
    overflow: hidden;
  }

  .worth-glow {
    position: absolute;
    inset: 0;
    pointer-events: none;
    border-radius: 18px;
  }

  .worth-percent {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 72px;
    line-height: 1;
    letter-spacing: 2px;
  }

  .worth-text {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px;
    letter-spacing: 3px;
    margin-top: 4px;
    opacity: 0.85;
  }

  .worth-meta {
    font-size: 11px;
    color: rgba(255,255,255,0.25);
    margin-top: 8px;
  }

  .submit-btn {
    width: 100%;
    background: linear-gradient(135deg, #a855f7, #ec4899);
    border: none;
    border-radius: 14px;
    padding: 16px;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 18px;
    letter-spacing: 2px;
    color: white;
    cursor: pointer;
    margin-bottom: 32px;
    transition: opacity 0.2s;
    -webkit-tap-highlight-color: transparent;
  }

  .submit-btn:active { opacity: 0.8; }
`;

export default function App() {
  const [selectedBar, setSelectedBar] = useState(null);
  const [activeNav, setActiveNav] = useState("bars");

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="header">
          <div className="header-top">
            <div className="app-title">NIGHTOUT</div>
            <div className="live-badge">
              <div className="live-dot" />
              LIVE
            </div>
          </div>
          <div className="subtitle">San Luis Obispo · Tonight</div>
        </div>

        <div className="bar-list">
          {bars.map((bar, i) => (
            <div
              key={bar.id}
              className="bar-card"
              onClick={() => setSelectedBar(bar)}
              style={{
                animationDelay: `${i * 60}ms`,
                borderLeft: `2px solid ${crowdColors[bar.crowd]}30`,
              }}
            >
              <div className="card-top">
                <div className="bar-name">{bar.name}</div>
                {bar.friends.length > 0 && (
                  <div className="friends-preview">
                    {bar.friends.slice(0, 3).map((f, idx) => (
                      <div key={idx} className="friend-avatar-sm">
                        {f[0]}
                      </div>
                    ))}
                    <span className="friends-count">
                      {bar.friends.length > 1
                        ? `+${bar.friends.length}`
                        : bar.friends[0]}
                    </span>
                  </div>
                )}
              </div>

              <div className="card-stats">
                <div className="stat-chip">
                  <div
                    className="stat-dot"
                    style={{ background: crowdColors[bar.crowd] }}
                  />
                  {bar.crowd}
                </div>
                <div className="stat-chip">
                  {vibeEmoji[bar.vibe]} {bar.vibe}
                </div>
                <div className="stat-chip">
                  {lineEmoji[bar.line]} Line: {bar.line}
                </div>
                <div className="stat-chip">
                  💵 {bar.cover === 0 ? "Free" : `$${bar.cover}`}
                </div>
              </div>

              <div className="card-bottom">
                <span className="updated-time">Updated {bar.lastUpdated}</span>
                <div
                  className="worth-badge"
                  style={{
                    color: worthColor(bar.worthScore),
                    background: `${worthColor(bar.worthScore)}18`,
                    border: `1px solid ${worthColor(bar.worthScore)}30`,
                  }}
                >
                  {bar.worthScore}% WORTH
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Nav */}
        <div className="bottom-nav">
          {[
            { id: "bars", icon: "🍺", label: "Bars" },
            { id: "camera", icon: "📸", label: "Shots" },
            { id: "map", icon: "📍", label: "Map" },
          ].map((nav) => (
            <div
              key={nav.id}
              className={`nav-item ${activeNav === nav.id ? "active" : ""}`}
              onClick={() => setActiveNav(nav.id)}
            >
              <span className="nav-icon">{nav.icon}</span>
              <span className="nav-label">{nav.label}</span>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedBar && (
          <div
            className="modal-overlay"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedBar(null);
            }}
          >
            <div className="modal-sheet">
              <div className="modal-handle" />
              <div className="modal-header">
                <div className="modal-bar-name">{selectedBar.name}</div>
                <div className="modal-address">{selectedBar.address}</div>
              </div>

              <div className="modal-body">
                {/* Friends */}
                <div className="friends-section">
                  <div className="section-label">Friends Here</div>
                  {selectedBar.friends.length > 0 ? (
                    <div className="friends-row">
                      {selectedBar.friends.map((f, i) => (
                        <div key={i} className="friend-pill">
                          <div className="friend-avatar">{f[0]}</div>
                          <span className="friend-name">{f}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-friends">No friends checked in</div>
                  )}
                </div>

                {/* Stats Grid */}
                <div className="section-label">Current Vibe</div>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-card-label">Crowd</div>
                    <div
                      className="stat-card-value"
                      style={{ color: crowdColors[selectedBar.crowd] }}
                    >
                      {crowdEmoji[selectedBar.crowd]} {selectedBar.crowd}
                    </div>
                    <div className="stat-card-sub">
                      {selectedBar.submissions} reports
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-card-label">Vibe</div>
                    <div className="stat-card-value" style={{ color: "#c084fc" }}>
                      {vibeEmoji[selectedBar.vibe]}
                    </div>
                    <div className="stat-card-sub">{selectedBar.vibe}</div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-card-label">Cover</div>
                    <div className="stat-card-value" style={{ color: "#34d399" }}>
                      💵{" "}
                      {selectedBar.cover === 0 ? "FREE" : `$${selectedBar.cover}`}
                    </div>
                    <div className="stat-card-sub">at the door</div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-card-label">Line</div>
                    <div
                      className="stat-card-value"
                      style={{ color: lineColors[selectedBar.line] }}
                    >
                      {lineEmoji[selectedBar.line]} {selectedBar.line}
                    </div>
                    <div className="stat-card-sub">wait estimate</div>
                  </div>
                </div>

                {/* Worth Score */}
                <div className="worth-section">
                  <div
                    className="worth-glow"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${worthColor(
                        selectedBar.worthScore
                      )}18 0%, transparent 70%)`,
                    }}
                  />
                  <div className="section-label">Worth It Score</div>
                  <div
                    className="worth-percent"
                    style={{ color: worthColor(selectedBar.worthScore) }}
                  >
                    {selectedBar.worthScore}%
                  </div>
                  <div
                    className="worth-text"
                    style={{ color: worthColor(selectedBar.worthScore) }}
                  >
                    {worthLabel(selectedBar.worthScore)}
                  </div>
                  <div className="worth-meta">
                    Based on crowd, vibe, cover & line · {selectedBar.submissions}{" "}
                    reports in last 90 min
                  </div>
                </div>

                {/* Submit Update */}
                <button className="submit-btn">+ DROP A VIBE UPDATE</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}