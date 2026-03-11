import { useState } from "react";
import { useAuth } from "../context/AuthContext";

// Mock updates feed — only entries WITH media show in Updates grid
const mockUpdates = [
  {
    id: 1,
    user: "Josh",
    initials: "J",
    bar: "The Mark",
    caption: "it's PACKED in here rn no cap 🔥",
    crowd: "High",
    vibe: "Packed & Loud",
    cover: 5,
    line: "Long",
    time: "8 min ago",
    // placeholder gradient color stands in for real image
    color: "linear-gradient(135deg, #7c3aed, #db2777)",
  },
  {
    id: 2,
    user: "Maya",
    initials: "M",
    bar: "Frog & Peach",
    caption: "chill vibes, no line, highly recommend",
    crowd: "Medium",
    vibe: "Social",
    cover: 0,
    line: "None",
    time: "14 min ago",
    color: "linear-gradient(135deg, #0f766e, #0369a1)",
  },
  {
    id: 3,
    user: "Ty",
    initials: "T",
    bar: "The Mark",
    caption: "cover just went up to $5 heads up",
    crowd: "High",
    vibe: "Packed & Loud",
    cover: 5,
    line: "Long",
    time: "21 min ago",
    color: "linear-gradient(135deg, #b45309, #b91c1c)",
  },
  {
    id: 4,
    user: "Ava",
    initials: "A",
    bar: "Creekside Brewing",
    caption: "actually really good tonight, go",
    crowd: "Medium",
    vibe: "Social",
    cover: 0,
    line: "Short",
    time: "33 min ago",
    color: "linear-gradient(135deg, #166534, #065f46)",
  },
  {
    id: 5,
    user: "Zoe",
    initials: "Z",
    bar: "Bello Mundo Bar",
    caption: "line's out the door but inside is 🔥",
    crowd: "High",
    vibe: "Packed & Loud",
    cover: 10,
    line: "Long",
    time: "41 min ago",
    color: "linear-gradient(135deg, #7e22ce, #be185d)",
  },
  {
    id: 6,
    user: "Leo",
    initials: "L",
    bar: "SLO Brew Rock",
    caption: "dead rn but the beer is cold lol",
    crowd: "Low",
    vibe: "Chill",
    cover: 10,
    line: "None",
    time: "55 min ago",
    color: "linear-gradient(135deg, #1e3a5f, #1e40af)",
  },
];

const CROWD_OPTIONS = ["Low", "Medium", "High"];
const VIBE_OPTIONS  = ["Chill", "Social", "Packed & Loud", "Dead"];
const LINE_OPTIONS  = ["None", "Short", "Long"];
const COVER_OPTIONS = [0, 5, 10];

const crowdColors = { Low: "#4ade80", Medium: "#facc15", High: "#f87171" };
const lineColors  = { None: "#4ade80", Short: "#facc15", Long: "#f87171" };
const vibeEmoji   = { "Packed & Loud": "🔥", Social: "🎉", Chill: "😌", Dead: "💀" };

export default function CameraPage() {
  const { user } = useAuth();
  const [tab, setTab]           = useState("updates"); // "updates" | "log"
  const [selected, setSelected] = useState(null);      // zoomed update

  return (
    <div style={s.page}>
      {/* Header + tabs */}
      <div style={s.header}>
        <div style={s.title}>SHOTS</div>
        <div style={s.tabRow}>
          {["updates", "log"].map((t) => (
            <button
              key={t}
              style={{ ...s.tab, ...(tab === t ? s.tabActive : {}) }}
              onClick={() => setTab(t)}
            >
              {t === "updates" ? "📸 Updates" : "✏️ Log"}
            </button>
          ))}
        </div>
      </div>

      {/* Pages */}
      {tab === "updates" && (
        <UpdatesTab updates={mockUpdates} onSelect={setSelected} />
      )}
      {tab === "log" && (
        <LogTab user={user} />
      )}

      {/* Zoom modal */}
      {selected && (
        <UpdateModal update={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   UPDATES TAB — masonry-ish 2-col grid
───────────────────────────────────────── */
function UpdatesTab({ updates, onSelect }) {
  // Split into two columns for the staggered look
  const left  = updates.filter((_, i) => i % 2 === 0);
  const right = updates.filter((_, i) => i % 2 !== 0);

  return (
    <div style={s.updatesScroll}>
      <div style={s.grid}>
        <div style={s.col}>
          {left.map((u) => <UpdateCard key={u.id} update={u} onSelect={onSelect} tall />)}
        </div>
        <div style={s.col}>
          <div style={{ height: 40 }} />{/* offset for stagger */}
          {right.map((u) => <UpdateCard key={u.id} update={u} onSelect={onSelect} />)}
        </div>
      </div>
      <div style={{ height: 20 }} />
    </div>
  );
}

function UpdateCard({ update: u, onSelect, tall }) {
  return (
    <div style={{ ...s.card, height: tall ? 220 : 180 }} onClick={() => onSelect(u)}>
      {/* Image placeholder */}
      <div style={{ ...s.cardImg, background: u.color }}>
        <div style={s.cardUser}>
          <div style={s.cardAvatar}>{u.initials}</div>
          <div>
            <div style={s.cardUserName}>{u.user}</div>
            <div style={s.cardBar}>{u.bar}</div>
          </div>
        </div>
      </div>
      {/* Caption preview */}
      <div style={s.cardCaption} numberOfLines={2}>
        {u.caption}
      </div>
      <div style={s.cardMeta}>
        <span style={{ color: crowdColors[u.crowd], fontSize: 10, fontWeight: 700 }}>{u.crowd}</span>
        <span style={s.dot}>·</span>
        <span style={s.cardTime}>{u.time}</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   LOG TAB — submit a vibe update
───────────────────────────────────────── */
function LogTab({ user }) {
  const [bar,    setBar]    = useState("");
  const [crowd,  setCrowd]  = useState(null);
  const [vibe,   setVibe]   = useState(null);
  const [line,   setLine]   = useState(null);
  const [cover,  setCover]  = useState(null);
  const [caption, setCaption] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!user) {
    return (
      <div style={s.lockedBox}>
        <div style={{ fontSize: 52 }}>🔒</div>
        <div style={s.lockedTitle}>Log in to drop a vibe</div>
        <div style={s.lockedSub}>
          Share what's happening at the bar — crowd, line, cover and more.
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={s.lockedBox}>
        <div style={{ fontSize: 52 }}>✅</div>
        <div style={s.lockedTitle}>Vibe dropped!</div>
        <div style={s.lockedSub}>Thanks for keeping SLO in the loop.</div>
        <button
          className="btn-primary"
          style={{ marginTop: 20, maxWidth: 240 }}
          onClick={() => {
            setBar(""); setCrowd(null); setVibe(null);
            setLine(null); setCover(null); setCaption("");
            setSubmitted(false);
          }}
        >
          DROP ANOTHER
        </button>
      </div>
    );
  }

  const canSubmit = bar && crowd && vibe && line && cover !== null;

  return (
    <div style={s.logScroll}>
      {/* Bar selector */}
      <div style={s.section}>
        <div className="section-label">Which bar?</div>
        <div style={s.chipRow}>
          {["The Mark","Frog & Peach","SLO Brew Rock","Creekside Brewing","Bello Mundo Bar","The Libertine"].map((b) => (
            <button
              key={b}
              style={{ ...s.chip, ...(bar === b ? s.chipActive : {}) }}
              onClick={() => setBar(b)}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Crowd */}
      <div style={s.section}>
        <div className="section-label">Crowd</div>
        <div style={s.chipRow}>
          {CROWD_OPTIONS.map((o) => (
            <button
              key={o}
              style={{
                ...s.chip,
                ...(crowd === o ? { ...s.chipActive, color: crowdColors[o], borderColor: crowdColors[o] } : {}),
              }}
              onClick={() => setCrowd(o)}
            >
              {o}
            </button>
          ))}
        </div>
      </div>

      {/* Vibe */}
      <div style={s.section}>
        <div className="section-label">Vibe</div>
        <div style={s.chipRow}>
          {VIBE_OPTIONS.map((o) => (
            <button
              key={o}
              style={{ ...s.chip, ...(vibe === o ? s.chipActive : {}) }}
              onClick={() => setVibe(o)}
            >
              {vibeEmoji[o]} {o}
            </button>
          ))}
        </div>
      </div>

      {/* Line */}
      <div style={s.section}>
        <div className="section-label">Line</div>
        <div style={s.chipRow}>
          {LINE_OPTIONS.map((o) => (
            <button
              key={o}
              style={{
                ...s.chip,
                ...(line === o ? { ...s.chipActive, color: lineColors[o], borderColor: lineColors[o] } : {}),
              }}
              onClick={() => setLine(o)}
            >
              {o}
            </button>
          ))}
        </div>
      </div>

      {/* Cover */}
      <div style={s.section}>
        <div className="section-label">Cover</div>
        <div style={s.chipRow}>
          {COVER_OPTIONS.map((o) => (
            <button
              key={o}
              style={{ ...s.chip, ...(cover === o ? s.chipActive : {}) }}
              onClick={() => setCover(o)}
            >
              {o === 0 ? "Free" : `$${o}`}
            </button>
          ))}
        </div>
      </div>

      {/* Caption */}
      <div style={s.section}>
        <div className="section-label">Caption (optional)</div>
        <textarea
          style={s.textarea}
          placeholder="What's the vibe like? Give the people the real scoop…"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          maxLength={120}
        />
        <div style={s.charCount}>{caption.length}/120</div>
      </div>

      {/* Media note */}
      <div style={s.mediaNote}>
        📷 Photo/video upload coming soon
      </div>

      {/* Submit */}
      <button
        className="btn-primary"
        disabled={!canSubmit}
        style={{ opacity: canSubmit ? 1 : 0.4, marginBottom: 32 }}
        onClick={() => setSubmitted(true)}
      >
        DROP THE VIBE →
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────
   ZOOM MODAL
───────────────────────────────────────── */
function UpdateModal({ update: u, onClose }) {
  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-sheet">
        <div className="modal-handle" />

        {/* Big image placeholder */}
        <div style={{ ...s.modalImg, background: u.color }}>
          <div style={s.modalImgOverlay} />
          <div style={s.modalImgUser}>
            <div style={s.modalAvatar}>{u.initials}</div>
            <div>
              <div style={s.modalUserName}>{u.user}</div>
              <div style={s.modalUserBar}>📍 {u.bar} · {u.time}</div>
            </div>
          </div>
        </div>

        <div style={{ padding: "20px 20px 0" }}>
          {/* Caption */}
          <div style={s.modalCaption}>"{u.caption}"</div>

          {/* Stats */}
          <div className="section-label" style={{ marginTop: 20 }}>Reported Vibe</div>
          <div style={s.modalStats}>
            <StatPill label="Crowd"  value={u.crowd}  color={crowdColors[u.crowd]} />
            <StatPill label="Vibe"   value={`${vibeEmoji[u.vibe]} ${u.vibe}`} color="#c084fc" />
            <StatPill label="Line"   value={u.line}   color={lineColors[u.line]} />
            <StatPill label="Cover"  value={u.cover === 0 ? "Free" : `$${u.cover}`} color="#34d399" />
          </div>
        </div>

        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}

function StatPill({ label, value, color }) {
  return (
    <div style={s.statPill}>
      <div style={s.statPillLabel}>{label}</div>
      <div style={{ ...s.statPillVal, color }}>{value}</div>
    </div>
  );
}

const s = {
  page: { position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100dvh" },
  header: { padding: "52px 20px 0", flexShrink: 0 },
  title: {
    fontFamily: "var(--font-display)", fontSize: 32, letterSpacing: 3,
    background: "linear-gradient(135deg, #fff 0%, #a855f7 60%, #ec4899 100%)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
    marginBottom: 14,
  },
  tabRow: { display: "flex", gap: 8, marginBottom: 16 },
  tab: {
    flex: 1, padding: "11px", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12, background: "rgba(255,255,255,0.04)",
    fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600,
    color: "rgba(255,255,255,0.35)", cursor: "pointer", transition: "all 0.2s",
  },
  tabActive: {
    background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)", color: "#c084fc",
  },

  // Updates grid
  updatesScroll: { overflowY: "auto", padding: "0 12px 100px", flex: 1, scrollbarWidth: "none" },
  grid: { display: "flex", gap: 10 },
  col: { flex: 1, display: "flex", flexDirection: "column", gap: 10 },
  card: {
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 16, overflow: "hidden", cursor: "pointer",
    transition: "transform 0.15s", WebkitTapHighlightColor: "transparent",
    display: "flex", flexDirection: "column",
  },
  cardImg: { flex: 1, position: "relative", minHeight: 0 },
  cardUser: { position: "absolute", bottom: 8, left: 8, display: "flex", alignItems: "center", gap: 6 },
  cardAvatar: {
    width: 24, height: 24, borderRadius: "50%",
    background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)",
    border: "1px solid rgba(255,255,255,0.3)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 9, fontWeight: 700, color: "white", flexShrink: 0,
  },
  cardUserName: { fontSize: 10, fontWeight: 700, color: "#fff", lineHeight: 1 },
  cardBar: { fontSize: 9, color: "rgba(255,255,255,0.6)", marginTop: 1 },
  cardCaption: {
    padding: "8px 10px 2px", fontSize: 11, color: "rgba(255,255,255,0.75)",
    lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical", overflow: "hidden",
  },
  cardMeta: {
    display: "flex", alignItems: "center", gap: 4,
    padding: "4px 10px 8px",
  },
  dot: { color: "rgba(255,255,255,0.2)", fontSize: 10 },
  cardTime: { fontSize: 10, color: "rgba(255,255,255,0.25)" },

  // Log tab
  logScroll: { overflowY: "auto", padding: "4px 16px 100px", flex: 1, scrollbarWidth: "none" },
  section: { marginBottom: 22 },
  chipRow: { display: "flex", gap: 8, flexWrap: "wrap" },
  chip: {
    padding: "8px 14px", borderRadius: 20,
    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
    fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.6)",
    cursor: "pointer", transition: "all 0.15s", fontFamily: "var(--font-body)",
    WebkitTapHighlightColor: "transparent",
  },
  chipActive: {
    background: "rgba(168,85,247,0.18)", border: "1px solid rgba(168,85,247,0.5)", color: "#c084fc",
  },
  textarea: {
    width: "100%", background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12,
    padding: "13px 14px", fontSize: 14, color: "#fff",
    fontFamily: "var(--font-body)", outline: "none", resize: "none",
    lineHeight: 1.5, minHeight: 90,
  },
  charCount: { fontSize: 11, color: "rgba(255,255,255,0.2)", textAlign: "right", marginTop: 4 },
  mediaNote: {
    background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.1)",
    borderRadius: 12, padding: "14px", fontSize: 13,
    color: "rgba(255,255,255,0.25)", textAlign: "center", marginBottom: 20,
  },

  // Locked
  lockedBox: {
    display: "flex", flexDirection: "column", alignItems: "center",
    textAlign: "center", padding: "60px 32px", flex: 1, gap: 10,
  },
  lockedTitle: {
    fontFamily: "var(--font-display)", fontSize: 26, letterSpacing: 2, color: "rgba(255,255,255,0.5)",
  },
  lockedSub: { fontSize: 13, color: "rgba(255,255,255,0.25)", lineHeight: 1.6 },

  // Modal
  modalImg: { height: 260, position: "relative" },
  modalImgOverlay: {
    position: "absolute", inset: 0,
    background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)",
  },
  modalImgUser: {
    position: "absolute", bottom: 16, left: 16,
    display: "flex", alignItems: "center", gap: 10,
  },
  modalAvatar: {
    width: 38, height: 38, borderRadius: "50%",
    background: "linear-gradient(135deg, #a855f7, #ec4899)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 15, fontWeight: 700, color: "white",
  },
  modalUserName: { fontSize: 16, fontWeight: 700, color: "#fff" },
  modalUserBar: { fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 2 },
  modalCaption: {
    fontSize: 17, fontWeight: 400, color: "rgba(255,255,255,0.85)",
    lineHeight: 1.5, fontStyle: "italic",
  },
  modalStats: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 },
  statPill: {
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12, padding: "12px 14px",
  },
  statPillLabel: {
    fontSize: 10, fontWeight: 600, letterSpacing: "1.5px",
    color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 6,
  },
  statPillVal: { fontFamily: "var(--font-display)", fontSize: 18, letterSpacing: 1 },
};