import { useState } from "react";
import { bars, crowdColors, vibeEmoji, lineEmoji, worthColor } from "../data/bars";
import BarDetail from "../components/BarDetail";

const TIME_OPTIONS = ["now", 15, 30, 45, 60, 90];

export default function BarsPage({ isLoggedIn }) {
  const [selectedBar, setSelectedBar] = useState(null);
  const [timeOffset, setTimeOffset] = useState("now");
  const [showTimePicker, setShowTimePicker] = useState(false);

  const getBarData = (bar) => {
    if (timeOffset === "now") return {
      crowd: bar.crowd, vibe: bar.vibe, line: bar.line, worth: bar.worthScore,
    };
    return bar.forecast[timeOffset];
  };

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <div style={styles.appTitle}>NIGHTOUT</div>

          {/* Time Toggle Button */}
          <button
            style={{
              ...styles.timeBtn,
              background: showTimePicker
                ? "rgba(168,85,247,0.2)"
                : timeOffset !== "now"
                ? "rgba(168,85,247,0.15)"
                : "rgba(255,255,255,0.07)",
              border: `1px solid ${timeOffset !== "now" ? "rgba(168,85,247,0.4)" : "rgba(255,255,255,0.1)"}`,
              color: timeOffset !== "now" ? "#c084fc" : "rgba(255,255,255,0.6)",
            }}
            onClick={() => setShowTimePicker((v) => !v)}
          >
            {timeOffset === "now" ? (
              <>
                <span style={styles.liveDot} />
                LIVE
              </>
            ) : (
              <>🔮 +{timeOffset}m</>
            )}
          </button>
        </div>

        <div style={styles.subtitle}>
          San Luis Obispo ·{" "}
          {timeOffset === "now" ? "Right now" : `Forecast in ${timeOffset} min`}
        </div>

        {/* Time Picker Dropdown */}
        {showTimePicker && (
          <div style={styles.timePicker}>
            <div style={styles.timePickerLabel}>SHOW ME THE VIBE IN…</div>
            <div style={styles.timeOptionsRow}>
              {TIME_OPTIONS.map((t) => (
                <button
                  key={t}
                  style={{
                    ...styles.timeOption,
                    background: timeOffset === t
                      ? "linear-gradient(135deg, #a855f7, #ec4899)"
                      : "rgba(255,255,255,0.06)",
                    color: timeOffset === t ? "#fff" : "rgba(255,255,255,0.5)",
                    border: `1px solid ${timeOffset === t ? "transparent" : "rgba(255,255,255,0.08)"}`,
                  }}
                  onClick={() => {
                    setTimeOffset(t);
                    setShowTimePicker(false);
                  }}
                >
                  {t === "now" ? "NOW" : `+${t}m`}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bar List */}
      <div style={styles.barList}>
        {bars.map((bar, i) => {
          const data = getBarData(bar);
          return (
            <div
              key={bar.id}
              style={{
                ...styles.barCard,
                borderLeft: `2px solid ${crowdColors[data.crowd]}40`,
                animationDelay: `${i * 55}ms`,
              }}
              onClick={() => setSelectedBar(bar)}
            >
              <div style={styles.cardTop}>
                <div style={styles.barName}>{bar.name}</div>
                {isLoggedIn && bar.friends.length > 0 && (
                  <div style={styles.friendsPreview}>
                    {bar.friends.slice(0, 3).map((f, idx) => (
                      <div key={idx} style={styles.friendAvatarSm}>{f[0]}</div>
                    ))}
                    <span style={styles.friendsCount}>
                      {bar.friends.length === 1 ? bar.friends[0] : `+${bar.friends.length}`}
                    </span>
                  </div>
                )}
              </div>

              <div style={styles.cardStats}>
                <div className="stat-chip">
                  <div className="stat-dot" style={{ background: crowdColors[data.crowd] }} />
                  {data.crowd}
                </div>
                <div className="stat-chip">{vibeEmoji[data.vibe]} {data.vibe}</div>
                <div className="stat-chip">{lineEmoji[data.line]} Line: {data.line}</div>
                <div className="stat-chip">
                  💵 {bar.cover === 0 ? "Free" : `$${bar.cover}`}
                </div>
              </div>

              <div style={styles.cardBottom}>
                <span style={styles.updatedTime}>
                  {timeOffset === "now" ? `Updated ${bar.lastUpdated}` : `📊 Historical avg`}
                </span>
                {isLoggedIn ? (
                  <div
                    style={{
                      ...styles.worthBadge,
                      color: worthColor(data.worth),
                      background: `${worthColor(data.worth)}18`,
                      border: `1px solid ${worthColor(data.worth)}30`,
                    }}
                  >
                    {data.worth}% WORTH
                  </div>
                ) : (
                  <div style={styles.lockedBadge}>🔒 Log in</div>
                )}
              </div>
            </div>
          );
        })}
        <div style={{ height: 20 }} />
      </div>

      {/* Bar Detail Modal */}
      {selectedBar && (
        <BarDetail
          bar={selectedBar}
          timeOffset={timeOffset}
          isLoggedIn={isLoggedIn}
          onClose={() => setSelectedBar(null)}
        />
      )}
    </div>
  );
}

const styles = {
  header: {
    padding: "52px 20px 16px",
    position: "relative",
    zIndex: 2,
  },
  headerTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  appTitle: {
    fontFamily: "var(--font-display)",
    fontSize: 32,
    letterSpacing: 3,
    background: "linear-gradient(135deg, #fff 0%, #a855f7 60%, #ec4899 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  timeBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    borderRadius: 20,
    padding: "6px 14px",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "1px",
    cursor: "pointer",
    transition: "all 0.2s",
    WebkitTapHighlightColor: "transparent",
    fontFamily: "var(--font-display)",
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#ef4444",
    display: "inline-block",
    animation: "pulse 1.5s infinite",
  },
  subtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.35)",
    fontWeight: 300,
    letterSpacing: "0.5px",
  },
  timePicker: {
    marginTop: 14,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: "14px 14px",
    animation: "fadeIn 0.18s ease",
  },
  timePickerLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "2px",
    color: "rgba(255,255,255,0.28)",
    marginBottom: 10,
  },
  timeOptionsRow: {
    display: "flex",
    gap: 8,
  },
  timeOption: {
    flex: 1,
    padding: "8px 4px",
    borderRadius: 10,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.5px",
    cursor: "pointer",
    fontFamily: "var(--font-display)",
    transition: "all 0.15s",
    WebkitTapHighlightColor: "transparent",
  },
  barList: {
    overflowY: "auto",
    padding: "4px 16px 100px",
    scrollbarWidth: "none",
  },
  barCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    cursor: "pointer",
    transition: "all 0.2s",
    position: "relative",
    overflow: "hidden",
    WebkitTapHighlightColor: "transparent",
  },
  cardTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  barName: {
    fontFamily: "var(--font-display)",
    fontSize: 22,
    letterSpacing: "1.5px",
    color: "#fff",
    lineHeight: 1,
  },
  friendsPreview: {
    display: "flex",
    alignItems: "center",
  },
  friendAvatarSm: {
    width: 24,
    height: 24,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #a855f7, #ec4899)",
    border: "2px solid #080810",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 9,
    fontWeight: 600,
    marginLeft: -6,
    color: "white",
  },
  friendsCount: {
    fontSize: 11,
    color: "#a855f7",
    fontWeight: 600,
    marginLeft: 8,
  },
  cardStats: {
    display: "flex",
    gap: 6,
    flexWrap: "wrap",
  },
  cardBottom: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 12,
    borderTop: "1px solid rgba(255,255,255,0.06)",
  },
  updatedTime: {
    fontSize: 11,
    color: "rgba(255,255,255,0.22)",
  },
  worthBadge: {
    fontFamily: "var(--font-display)",
    fontSize: 14,
    letterSpacing: 1,
    padding: "3px 10px",
    borderRadius: 20,
  },
  lockedBadge: {
    fontSize: 12,
    color: "rgba(255,255,255,0.25)",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: "3px 10px",
  },
};