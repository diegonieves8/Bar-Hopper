import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";

const SLO_CENTER = [35.2828, -120.6596];

const bars = [
  { id: 1, name: "The Mark",          lat: 35.2793, lng: -120.6592, crowd: "High",   cover: 5,  friends: ["Josh", "Maya", "Ty"] },
  { id: 2, name: "Frog & Peach",      lat: 35.2797, lng: -120.6612, crowd: "Medium", cover: 0,  friends: ["Ava"] },
  { id: 3, name: "SLO Brew Rock",     lat: 35.2718, lng: -120.6540, crowd: "Low",    cover: 10, friends: [] },
  { id: 4, name: "Creekside Brewing", lat: 35.2802, lng: -120.6637, crowd: "Medium", cover: 0,  friends: ["Sam", "Leo"] },
  { id: 5, name: "Bello Mundo Bar",   lat: 35.2800, lng: -120.6640, crowd: "High",   cover: 10, friends: ["Zoe"] },
  { id: 6, name: "The Libertine",     lat: 35.2812, lng: -120.6591, crowd: "Low",    cover: 0,  friends: [] },
];

const crowdColors = { Low: "#4ade80", Medium: "#facc15", High: "#f87171" };
const crowdGlow   = { Low: "#4ade8066", Medium: "#facc1566", High: "#f8717166" };

export default function MapPage() {
  const { user }            = useAuth();
  const isLoggedIn          = !!user;
  const mapRef              = useRef(null);
  const mapInstanceRef      = useRef(null);
  const markersRef          = useRef([]);
  const [ready, setReady]   = useState(false);
  const [selectedBar, setSelectedBar] = useState(null);
  const [expandedBar, setExpandedBar] = useState(null); // which bar's friends are expanded

  // Dynamically load Leaflet CSS + JS
  useEffect(() => {
    // If already loaded, just mark ready
    if (window.L) { setReady(true); return; }

    if (!document.getElementById("leaflet-css")) {
      const link  = document.createElement("link");
      link.id     = "leaflet-css";
      link.rel    = "stylesheet";
      link.href   = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
      document.head.appendChild(link);
    }

    if (!document.getElementById("leaflet-js")) {
      const script  = document.createElement("script");
      script.id     = "leaflet-js";
      script.src    = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
      script.onload = () => {
        // Poll until window.L is actually available
        const check = setInterval(() => {
          if (window.L) { clearInterval(check); setReady(true); }
        }, 50);
      };
      document.head.appendChild(script);
    }
  }, []);

  // Init map once Leaflet is ready
  useEffect(() => {
    if (!ready || !mapRef.current || mapInstanceRef.current) return;

    const L   = window.L;
    const map = L.map(mapRef.current, {
      center: SLO_CENTER,
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
    });

    // Dark tile layer from CartoDB
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      { maxZoom: 19 }
    ).addTo(map);

    // Add custom markers for each bar
    bars.forEach((bar) => {
      const color = crowdColors[bar.crowd];
      const hasFriends = isLoggedIn && bar.friends.length > 0;

      const icon = L.divIcon({
        className: "",
        html: buildMarkerHTML(bar, isLoggedIn),
        iconSize: [48, 48],
        iconAnchor: [24, 48],
      });

      const marker = L.marker([bar.lat, bar.lng], { icon })
        .addTo(map)
        .on("click", () => setSelectedBar(bar));

      markersRef.current.push({ bar, marker });
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersRef.current = [];
    };
  }, [ready]);

  // Rebuild markers when login state changes
  useEffect(() => {
    if (!mapInstanceRef.current || !ready) return;
    const L = window.L;
    markersRef.current.forEach(({ bar, marker }) => {
      marker.setIcon(L.divIcon({
        className: "",
        html: buildMarkerHTML(bar, isLoggedIn),
        iconSize: [48, 48],
        iconAnchor: [24, 48],
      }));
    });
  }, [isLoggedIn, ready]);

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.title}>MAP</div>
        <div style={s.subtitle}>San Luis Obispo · Tonight</div>
      </div>

      {/* Legend */}
      <div style={s.legend}>
        {Object.entries(crowdColors).map(([label, color]) => (
          <div key={label} style={s.legendItem}>
            <div style={{ ...s.legendDot, background: color }} />
            <span style={s.legendLabel}>{label}</span>
          </div>
        ))}
        {isLoggedIn && (
          <div style={s.legendItem}>
            <div style={s.legendFriend}>👤</div>
            <span style={s.legendLabel}>Friends</span>
          </div>
        )}
      </div>

      {/* Map */}
      <div style={s.mapWrap}>
        {!ready && (
          <div style={s.loading}>
            <div style={s.loadingText}>Loading map…</div>
          </div>
        )}
        <div ref={mapRef} style={s.map} />

        {/* Bar list overlay — bottom of map */}
        <div style={s.barStrip}>
          {bars.map((bar) => (
            <div
              key={bar.id}
              style={{
                ...s.stripCard,
                borderColor: selectedBar?.id === bar.id
                  ? crowdColors[bar.crowd]
                  : "rgba(255,255,255,0.08)",
              }}
              onClick={() => {
                setSelectedBar(bar);
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.flyTo([bar.lat, bar.lng], 16, { duration: 0.8 });
                }
              }}
            >
              <div style={{ ...s.stripDot, background: crowdColors[bar.crowd] }} />
              <div>
                <div style={s.stripName}>{bar.name}</div>
                {isLoggedIn && bar.friends.length > 0 && (
                  <div style={s.stripFriends}>
                    👤 {bar.friends.slice(0, 2).join(", ")}
                    {bar.friends.length > 2 ? ` +${bar.friends.length - 2}` : ""}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bar detail bottom sheet */}
      {selectedBar && (
        <BarSheet
          bar={selectedBar}
          isLoggedIn={isLoggedIn}
          expandedBar={expandedBar}
          setExpandedBar={setExpandedBar}
          onClose={() => setSelectedBar(null)}
        />
      )}
    </div>
  );
}

/* ── Bar detail sheet ── */
function BarSheet({ bar, isLoggedIn, expandedBar, setExpandedBar, onClose }) {
  const isExpanded = expandedBar === bar.id;

  return (
    <div style={s.sheetOverlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={s.sheet}>
        <div style={s.handle} />

        <div style={s.sheetBody}>
          {/* Bar name + crowd */}
          <div style={s.sheetTop}>
            <div>
              <div style={s.sheetName}>{bar.name}</div>
              <div style={s.sheetCrowd}>
                <div style={{ ...s.sheetCrowdDot, background: crowdColors[bar.crowd] }} />
                {bar.crowd} · {bar.cover === 0 ? "No cover" : `$${bar.cover} cover`}
              </div>
            </div>
            <button style={s.closeBtn} onClick={onClose}>✕</button>
          </div>

          {/* Friends section */}
          {isLoggedIn ? (
            <div style={s.friendsSection}>
              <div style={s.friendsHeader}>
                <span className="section-label" style={{ marginBottom: 0 }}>
                  Friends Here · {bar.friends.length}
                </span>
                {bar.friends.length > 0 && (
                  <button
                    style={s.expandBtn}
                    onClick={() => setExpandedBar(isExpanded ? null : bar.id)}
                  >
                    {isExpanded ? "Collapse" : "Show all"}
                  </button>
                )}
              </div>

              {bar.friends.length === 0 ? (
                <div style={s.noFriends}>No friends here yet</div>
              ) : (
                <div style={s.avatarRow}>
                  {/* Stacked circles — always shown */}
                  {!isExpanded && (
                    <div style={s.stackedAvatars}>
                      {bar.friends.slice(0, 4).map((f, i) => (
                        <div
                          key={i}
                          style={{ ...s.stackAvatar, marginLeft: i === 0 ? 0 : -10, zIndex: bar.friends.length - i }}
                          title={f}
                        >
                          {f[0]}
                        </div>
                      ))}
                      {bar.friends.length > 4 && (
                        <div style={{ ...s.stackAvatar, marginLeft: -10, background: "rgba(255,255,255,0.15)" }}>
                          +{bar.friends.length - 4}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Expanded — individual pills with names on hover */}
                  {isExpanded && (
                    <div style={s.expandedRow}>
                      {bar.friends.map((f, i) => (
                        <FriendPill key={i} name={f} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div style={s.lockedFriends}>
              🔒 Log in to see if your friends are here
            </div>
          )}

          <button className="btn-primary" style={{ marginTop: 16 }}>
            + DROP A VIBE UPDATE
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Friend pill with hover name reveal ── */
function FriendPill({ name }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        ...s.friendPill,
        background: hovered
          ? "linear-gradient(135deg, #a855f7, #ec4899)"
          : "rgba(168,85,247,0.15)",
        border: `1px solid ${hovered ? "transparent" : "rgba(168,85,247,0.3)"}`,
        width: hovered ? "auto" : 36,
        paddingLeft: hovered ? 10 : 0,
        paddingRight: hovered ? 12 : 0,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setTimeout(() => setHovered(false), 1200)}
    >
      <div style={s.pillInitial}>{name[0]}</div>
      {hovered && <span style={s.pillName}>{name}</span>}
    </div>
  );
}

/* ── Build marker HTML string for Leaflet divIcon ── */
function buildMarkerHTML(bar, isLoggedIn) {
  const color     = crowdColors[bar.crowd];
  const glow      = crowdGlow[bar.crowd];
  const hasFriends = isLoggedIn && bar.friends.length > 0;
  const count      = bar.friends.length;

  return `
    <div style="
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
    ">
      ${hasFriends ? `
        <div style="
          background: rgba(168,85,247,0.9);
          border: 2px solid rgba(255,255,255,0.6);
          border-radius: 20px;
          padding: 2px 7px;
          font-size: 9px;
          font-weight: 700;
          color: white;
          margin-bottom: 3px;
          white-space: nowrap;
          font-family: sans-serif;
          backdrop-filter: blur(4px);
        ">👤 ${count}</div>
      ` : ""}
      <div style="
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: ${color};
        box-shadow: 0 0 12px ${glow}, 0 0 4px ${color};
        border: 2px solid rgba(255,255,255,0.8);
      "></div>
      <div style="
        width: 2px;
        height: 8px;
        background: ${color};
        opacity: 0.6;
      "></div>
    </div>
  `;
}

/* ─────────────────── STYLES ─────────────────── */
const s = {
  page: {
    position: "relative", zIndex: 1,
    display: "flex", flexDirection: "column",
    height: "100dvh", overflow: "hidden",
  },
  header: { padding: "52px 20px 8px", flexShrink: 0 },
  title: {
    fontFamily: "var(--font-display)", fontSize: 32, letterSpacing: 3,
    background: "linear-gradient(135deg, #fff 0%, #a855f7 60%, #ec4899 100%)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
  },
  subtitle: { fontSize: 13, color: "rgba(255,255,255,0.35)", fontWeight: 300, marginTop: 2 },
  legend: {
    display: "flex", gap: 14, padding: "8px 20px 10px", flexShrink: 0, alignItems: "center",
  },
  legendItem: { display: "flex", alignItems: "center", gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0 },
  legendFriend: { fontSize: 11 },
  legendLabel: { fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 500 },

  mapWrap: { flex: 1, position: "relative", minHeight: 0 },
  map: { width: "100%", height: "100%", position: "absolute", inset: 0 },
  loading: {
    position: "absolute", inset: 0, background: "#0e0e1c",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10,
  },
  loadingText: {
    fontFamily: "var(--font-display)", fontSize: 18, letterSpacing: 2,
    color: "rgba(255,255,255,0.3)",
  },

  // Horizontal bar strip at bottom of map
  barStrip: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    display: "flex", gap: 10, overflowX: "auto",
    padding: "10px 14px 14px", scrollbarWidth: "none",
    background: "linear-gradient(to top, rgba(8,8,16,0.95) 60%, transparent)",
    zIndex: 400,
  },
  stripCard: {
    display: "flex", alignItems: "center", gap: 8, flexShrink: 0,
    background: "rgba(255,255,255,0.06)", border: "1px solid",
    borderRadius: 12, padding: "8px 12px", cursor: "pointer",
    transition: "border-color 0.2s", WebkitTapHighlightColor: "transparent",
  },
  stripDot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0 },
  stripName: { fontSize: 12, fontWeight: 600, color: "#fff", whiteSpace: "nowrap" },
  stripFriends: { fontSize: 10, color: "#a855f7", marginTop: 2, whiteSpace: "nowrap" },

  // Sheet
  sheetOverlay: {
    position: "fixed", inset: 0, zIndex: 500,
    background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)",
    display: "flex", alignItems: "flex-end",
    animation: "fadeIn 0.2s ease",
  },
  sheet: {
    width: "100%", maxWidth: 430, margin: "0 auto",
    background: "#0e0e1c", borderRadius: "24px 24px 0 0",
    borderTop: "1px solid rgba(255,255,255,0.1)",
    animation: "slideUp 0.3s cubic-bezier(0.32,0.72,0,1)",
  },
  handle: {
    width: 36, height: 4, background: "rgba(255,255,255,0.18)",
    borderRadius: 2, margin: "14px auto 0",
  },
  sheetBody: { padding: "16px 20px 36px" },
  sheetTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  sheetName: {
    fontFamily: "var(--font-display)", fontSize: 28, letterSpacing: 2,
    background: "linear-gradient(135deg, #fff, #c084fc)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
    lineHeight: 1,
  },
  sheetCrowd: { display: "flex", alignItems: "center", gap: 6, marginTop: 5, fontSize: 13, color: "rgba(255,255,255,0.45)" },
  sheetCrowdDot: { width: 8, height: 8, borderRadius: "50%" },
  closeBtn: {
    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "50%", width: 30, height: 30, fontSize: 13,
    color: "rgba(255,255,255,0.5)", cursor: "pointer", fontFamily: "var(--font-body)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },

  // Friends
  friendsSection: {
    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 14, padding: "12px 14px", marginBottom: 4,
  },
  friendsHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  expandBtn: {
    background: "none", border: "none", fontSize: 12,
    color: "#a855f7", cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 600,
  },
  noFriends: { fontSize: 13, color: "rgba(255,255,255,0.2)", fontStyle: "italic" },
  avatarRow: { minHeight: 36 },
  stackedAvatars: { display: "flex", alignItems: "center" },
  stackAvatar: {
    width: 32, height: 32, borderRadius: "50%",
    background: "linear-gradient(135deg, #a855f7, #ec4899)",
    border: "2px solid #0e0e1c",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 11, fontWeight: 700, color: "white", position: "relative",
  },
  expandedRow: { display: "flex", gap: 8, flexWrap: "wrap" },
  friendPill: {
    height: 36, borderRadius: 18,
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", transition: "all 0.25s ease", overflow: "hidden",
    minWidth: 36,
  },
  pillInitial: { fontSize: 13, fontWeight: 700, color: "white", flexShrink: 0 },
  pillName: { fontSize: 13, fontWeight: 600, color: "white", marginLeft: 6, whiteSpace: "nowrap" },
  lockedFriends: {
    background: "rgba(168,85,247,0.07)", border: "1px dashed rgba(168,85,247,0.2)",
    borderRadius: 12, padding: "12px 14px", fontSize: 13,
    color: "rgba(255,255,255,0.35)", marginBottom: 4,
  },
};