import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  crowdColors, crowdEmoji, vibeEmoji,
  lineEmoji, lineColors, worthColor, worthLabel
} from "../data/Bars";

export default function BarDetail({ bar, timeOffset, onClose }) {
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const [checkedIn, setCheckedIn] = useState(false);

  if (!bar) return null;

  const isForecast = timeOffset !== "now";
  const data = isForecast ? bar.forecast[timeOffset] : {
    crowd: bar.crowd, vibe: bar.vibe, line: bar.line, worth: bar.worthScore,
  };

  const handleCheckIn = () => {
    // Will wire to Firestore later — updates user.currentBar
    setCheckedIn((v) => !v);
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* FIX #1: sheet is a flex column with fixed height so inner content scrolls */}
      <div style={styles.sheet}>
        <div className="modal-handle" />

        {/* Scrollable content area */}
        <div style={styles.scrollArea}>
          {/* Header */}
          <div style={{ padding: "16px 20px 0" }}>
            {isForecast && (
              <div style={styles.forecastTag}>🔮 FORECAST · IN {timeOffset} MIN</div>
            )}
            <div style={styles.barName}>{bar.name}</div>
            <div style={styles.address}>{bar.address}</div>
          </div>

          <div style={{ padding: "20px" }}>

            {/* I'M HERE button */}
            {isLoggedIn && (
              <button
                style={{
                  ...styles.imHereBtn,
                  background: checkedIn
                    ? "linear-gradient(135deg, #a855f7, #ec4899)"
                    : "rgba(255,255,255,0.06)",
                  border: checkedIn
                    ? "1px solid transparent"
                    : "1px solid rgba(255,255,255,0.12)",
                  color: checkedIn ? "#fff" : "rgba(255,255,255,0.6)",
                }}
                onClick={handleCheckIn}
              >
                {checkedIn ? "✓ YOU'RE HERE" : "📍 I'M HERE"}
              </button>
            )}

            {/* Friends */}
            <div style={{ marginBottom: 24 }}>
              <div className="section-label">Friends Here</div>
              {isLoggedIn ? (
                bar.friends.length > 0 ? (
                  <div style={styles.friendsRow}>
                    {bar.friends.map((f, i) => (
                      <div key={i} style={styles.friendPill}>
                        <div style={styles.friendAvatar}>{f[0]}</div>
                        <span style={styles.friendName}>{f}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={styles.dimText}>No friends checked in yet</div>
                )
              ) : (
                <div style={styles.loginNudge}>
                  <span style={{ fontSize: 16 }}>🔒</span>
                  <span>Log in to see if your friends are here</span>
                </div>
              )}
            </div>

            {/* Stats Grid */}
            <div className="section-label">
              {isForecast ? `Predicted Vibe in ${timeOffset} Min` : "Current Vibe"}
            </div>
            <div style={styles.statsGrid}>
              <StatCard label="Crowd"  value={`${crowdEmoji[data.crowd]} ${data.crowd}`}  valueColor={crowdColors[data.crowd]} sub={`${bar.submissions} reports`} />
              <StatCard label="Vibe"   value={vibeEmoji[data.vibe]}                        valueColor="#c084fc"                 sub={data.vibe} />
              <StatCard label="Cover"  value={`💵 ${bar.cover === 0 ? "FREE" : `$${bar.cover}`}`} valueColor="#34d399"          sub="at the door" />
              <StatCard label="Line"   value={`${lineEmoji[data.line]} ${data.line}`}      valueColor={lineColors[data.line]}   sub="wait estimate" />
            </div>

            {/* Worth Score */}
            <div style={{ marginBottom: 20 }}>
              <div className="section-label">Worth It Score</div>
              {isLoggedIn ? (
                <div style={styles.worthSection}>
                  <div style={{
                    ...styles.worthGlow,
                    background: `radial-gradient(circle at 50% 50%, ${worthColor(data.worth)}18 0%, transparent 70%)`,
                  }} />
                  <div style={{ ...styles.worthPercent, color: worthColor(data.worth) }}>
                    {data.worth}%
                  </div>
                  <div style={{ ...styles.worthText, color: worthColor(data.worth) }}>
                    {worthLabel(data.worth)}
                  </div>
                  <div style={styles.worthMeta}>
                    {isForecast
                      ? `Predicted based on historical patterns · ${bar.submissions} past reports`
                      : `Based on crowd, vibe, cover & line · ${bar.submissions} reports in last 90 min`}
                  </div>
                </div>
              ) : (
                <div style={styles.loginWorthBox}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>🔒</div>
                  <div style={styles.loginWorthTitle}>Log in to see your rating</div>
                  <div style={styles.loginWorthSub}>
                    Your worth score is personalized based on your preferences
                  </div>
                </div>
              )}
            </div>

            {/* Drop Update CTA */}
            <button className="btn-primary" style={{ marginBottom: 8 }}>
              + DROP A VIBE UPDATE
            </button>

            {/* Extra padding so button clears the bottom safely */}
            <div style={{ height: 24 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, valueColor, sub }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statCardLabel}>{label}</div>
      <div style={{ ...styles.statCardValue, color: valueColor }}>{value}</div>
      <div style={styles.statCardSub}>{sub}</div>
    </div>
  );
}

const styles = {
  /* FIX: use flex column + max-height so the inner div can overflow-y scroll */
  sheet: {
    width: "100%",
    maxWidth: 430,
    margin: "0 auto",
    background: "#0e0e1c",
    borderRadius: "24px 24px 0 0",
    borderTop: "1px solid rgba(255,255,255,0.1)",
    maxHeight: "88dvh",
    display: "flex",
    flexDirection: "column",
    animation: "slideUp 0.32s cubic-bezier(0.32,0.72,0,1)",
  },
  scrollArea: {
    overflowY: "auto",
    scrollbarWidth: "none",
    flex: 1,
  },
  forecastTag: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "rgba(168,85,247,0.15)",
    border: "1px solid rgba(168,85,247,0.3)",
    borderRadius: 20,
    padding: "4px 12px",
    fontSize: 11,
    fontWeight: 600,
    color: "#c084fc",
    letterSpacing: "1px",
    marginBottom: 10,
  },
  barName: {
    fontFamily: "var(--font-display)",
    fontSize: 38,
    letterSpacing: 2,
    background: "linear-gradient(135deg, #fff 0%, #c084fc 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    lineHeight: 1,
  },
  address: {
    fontSize: 12,
    color: "rgba(255,255,255,0.3)",
    marginTop: 4,
    fontWeight: 300,
  },
  imHereBtn: {
    width: "100%",
    borderRadius: 14,
    padding: "13px",
    fontFamily: "var(--font-display)",
    fontSize: 17,
    letterSpacing: "2px",
    cursor: "pointer",
    marginBottom: 20,
    transition: "all 0.2s",
    WebkitTapHighlightColor: "transparent",
  },
  friendsRow: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
  friendPill: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(168,85,247,0.12)",
    border: "1px solid rgba(168,85,247,0.25)",
    borderRadius: 50,
    padding: "6px 12px 6px 6px",
  },
  friendAvatar: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #a855f7, #ec4899)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 700,
    color: "white",
  },
  friendName: {
    fontSize: 13,
    fontWeight: 500,
    color: "rgba(255,255,255,0.85)",
  },
  dimText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.25)",
    fontStyle: "italic",
  },
  loginNudge: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "rgba(168,85,247,0.08)",
    border: "1px dashed rgba(168,85,247,0.25)",
    borderRadius: 12,
    padding: "12px 14px",
    fontSize: 13,
    color: "rgba(255,255,255,0.5)",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 14,
    padding: 14,
  },
  statCardLabel: {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: "1.5px",
    color: "rgba(255,255,255,0.3)",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  statCardValue: {
    fontFamily: "var(--font-display)",
    fontSize: 20,
    letterSpacing: 1,
  },
  statCardSub: {
    fontSize: 11,
    color: "rgba(255,255,255,0.25)",
    marginTop: 4,
    fontWeight: 300,
  },
  worthSection: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 18,
    padding: 20,
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
  },
  worthGlow: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    borderRadius: 18,
  },
  worthPercent: {
    fontFamily: "var(--font-display)",
    fontSize: 72,
    lineHeight: 1,
    letterSpacing: 2,
  },
  worthText: {
    fontFamily: "var(--font-display)",
    fontSize: 22,
    letterSpacing: 3,
    marginTop: 4,
    opacity: 0.85,
  },
  worthMeta: {
    fontSize: 11,
    color: "rgba(255,255,255,0.25)",
    marginTop: 8,
  },
  loginWorthBox: {
    background: "rgba(255,255,255,0.03)",
    border: "1px dashed rgba(255,255,255,0.1)",
    borderRadius: 18,
    padding: 28,
    textAlign: "center",
  },
  loginWorthTitle: {
    fontFamily: "var(--font-display)",
    fontSize: 22,
    letterSpacing: 2,
    color: "rgba(255,255,255,0.5)",
    marginBottom: 6,
  },
  loginWorthSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.25)",
    lineHeight: 1.5,
  },
};