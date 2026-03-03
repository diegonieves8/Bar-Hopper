import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function SettingsPage({ onOpenLogin }) {
  const { user, logOut } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>SETTINGS</div>
      </div>

      {/* Tabs */}
      <div style={styles.tabRow}>
        {["profile", "friends"].map((t) => (
          <button
            key={t}
            style={{ ...styles.tab, ...(activeTab === t ? styles.tabActive : {}) }}
            onClick={() => setActiveTab(t)}
          >
            {t === "profile" ? "👤 Profile" : "👥 Friends"}
          </button>
        ))}
      </div>

      <div style={styles.body}>
        {activeTab === "profile" && (
          <ProfileTab user={user} onOpenLogin={onOpenLogin} onLogOut={logOut} />
        )}
        {activeTab === "friends" && (
          <FriendsTab user={user} onOpenLogin={onOpenLogin} />
        )}
      </div>
    </div>
  );
}

/* ── Profile Tab ── */
function ProfileTab({ user, onOpenLogin, onLogOut }) {
  if (!user) {
    return (
      <div style={styles.loggedOutBox}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🔒</div>
        <div style={styles.loggedOutTitle}>You're not logged in</div>
        <div style={styles.loggedOutSub}>
          Log in to see your profile, track friends, and get personalized worth scores.
        </div>
        <button className="btn-primary" style={{ marginTop: 20 }} onClick={onOpenLogin}>
          LOG IN / SIGN UP
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Avatar */}
      <div style={styles.avatarSection}>
        <div style={styles.avatarLarge}>
          {(user.displayName || user.email || "?")[0].toUpperCase()}
        </div>
        <div style={styles.profileName}>{user.displayName || "No name set"}</div>
        <div style={styles.profileEmail}>{user.email}</div>
      </div>

      {/* Current bar */}
      <div style={styles.card}>
        <div className="section-label">Currently At</div>
        <div style={styles.currentBar}>
          {user.currentBar ? (
            <>📍 {user.currentBar}</>
          ) : (
            <span style={{ color: "rgba(255,255,255,0.25)", fontStyle: "italic" }}>
              Not checked in anywhere
            </span>
          )}
        </div>
      </div>

      {/* Options */}
      <div style={styles.optionsList}>
        <OptionRow icon="🔔" label="Notifications" sub="Coming soon" disabled />
        <OptionRow icon="🎯" label="My Preferences" sub="Personalize your worth score — coming soon" disabled />
        <OptionRow
          icon="🚪"
          label="Log Out"
          sub={`Signed in as ${user.email}`}
          danger
          onClick={onLogOut}
        />
      </div>
    </div>
  );
}

/* ── Friends Tab ── */
function FriendsTab({ user, onOpenLogin }) {
  const [searchVal, setSearchVal] = useState("");

  if (!user) {
    return (
      <div style={styles.loggedOutBox}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>👥</div>
        <div style={styles.loggedOutTitle}>Log in to see friends</div>
        <div style={styles.loggedOutSub}>
          Add friends to see where they're at tonight.
        </div>
        <button className="btn-primary" style={{ marginTop: 20 }} onClick={onOpenLogin}>
          LOG IN / SIGN UP
        </button>
      </div>
    );
  }

  const mockFriends = [
    { name: "Josh", currentBar: "The Mark", initials: "J" },
    { name: "Maya", currentBar: "The Mark", initials: "M" },
    { name: "Ava",  currentBar: "Frog & Peach", initials: "A" },
    { name: "Sam",  currentBar: "Creekside Brewing", initials: "S" },
  ];

  const filtered = mockFriends.filter((f) =>
    f.name.toLowerCase().includes(searchVal.toLowerCase())
  );

  return (
    <div>
      {/* Search / Add */}
      <div style={styles.searchRow}>
        <input
          style={styles.searchInput}
          placeholder="Search or add friends by email..."
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
        />
      </div>

      <div className="section-label" style={{ marginBottom: 10 }}>
        OUT TONIGHT · {filtered.length}
      </div>

      {filtered.map((f, i) => (
        <div key={i} style={styles.friendRow}>
          <div style={styles.friendAvatar}>{f.initials}</div>
          <div style={{ flex: 1 }}>
            <div style={styles.friendName}>{f.name}</div>
            <div style={styles.friendLocation}>📍 {f.currentBar}</div>
          </div>
          <button style={styles.joinBtn}>Join</button>
        </div>
      ))}

      {filtered.length === 0 && (
        <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 13, textAlign: "center", marginTop: 24 }}>
          No friends found
        </div>
      )}
    </div>
  );
}

/* ── Option Row ── */
function OptionRow({ icon, label, sub, danger, disabled, onClick }) {
  return (
    <button
      style={{
        ...styles.optionRow,
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? "default" : "pointer",
      }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      <div style={styles.optionIcon}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ ...styles.optionLabel, color: danger ? "#f87171" : "#fff" }}>{label}</div>
        <div style={styles.optionSub}>{sub}</div>
      </div>
      {!disabled && <div style={styles.optionArrow}>›</div>}
    </button>
  );
}

const styles = {
  page: {
    position: "relative",
    zIndex: 1,
    paddingBottom: 100,
  },
  header: {
    padding: "52px 20px 16px",
  },
  title: {
    fontFamily: "var(--font-display)",
    fontSize: 32,
    letterSpacing: 3,
    background: "linear-gradient(135deg, #fff 0%, #a855f7 60%, #ec4899 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  tabRow: {
    display: "flex",
    gap: 8,
    padding: "0 16px 16px",
  },
  tab: {
    flex: 1,
    padding: "10px",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    background: "rgba(255,255,255,0.04)",
    fontFamily: "var(--font-body)",
    fontSize: 13,
    fontWeight: 600,
    color: "rgba(255,255,255,0.35)",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  tabActive: {
    background: "rgba(168,85,247,0.15)",
    border: "1px solid rgba(168,85,247,0.3)",
    color: "#c084fc",
  },
  body: {
    padding: "0 16px",
  },
  loggedOutBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: "40px 20px",
  },
  loggedOutTitle: {
    fontFamily: "var(--font-display)",
    fontSize: 26,
    letterSpacing: 2,
    color: "rgba(255,255,255,0.5)",
  },
  loggedOutSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.25)",
    lineHeight: 1.6,
    marginTop: 8,
  },
  avatarSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "8px 0 24px",
  },
  avatarLarge: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #a855f7, #ec4899)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 28,
    fontWeight: 700,
    color: "white",
    marginBottom: 12,
  },
  profileName: {
    fontFamily: "var(--font-display)",
    fontSize: 24,
    letterSpacing: 2,
    color: "#fff",
  },
  profileEmail: {
    fontSize: 12,
    color: "rgba(255,255,255,0.3)",
    marginTop: 2,
  },
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  currentBar: {
    fontSize: 15,
    fontWeight: 500,
    color: "rgba(255,255,255,0.7)",
  },
  optionsList: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  optionRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 14,
    padding: "14px 16px",
    width: "100%",
    textAlign: "left",
    transition: "background 0.2s",
    WebkitTapHighlightColor: "transparent",
    fontFamily: "var(--font-body)",
  },
  optionIcon: { fontSize: 20 },
  optionLabel: { fontSize: 15, fontWeight: 500, marginBottom: 2 },
  optionSub: { fontSize: 12, color: "rgba(255,255,255,0.3)" },
  optionArrow: { fontSize: 22, color: "rgba(255,255,255,0.2)" },
  searchRow: { marginBottom: 16 },
  searchInput: {
    width: "100%",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: "13px 16px",
    fontSize: 14,
    color: "#fff",
    fontFamily: "var(--font-body)",
    outline: "none",
  },
  friendRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 14,
    padding: "12px 14px",
    marginBottom: 8,
  },
  friendAvatar: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #a855f7, #ec4899)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 15,
    fontWeight: 700,
    color: "white",
    flexShrink: 0,
  },
  friendName: {
    fontSize: 15,
    fontWeight: 500,
    color: "#fff",
  },
  friendLocation: {
    fontSize: 12,
    color: "rgba(255,255,255,0.35)",
    marginTop: 2,
  },
  joinBtn: {
    background: "rgba(168,85,247,0.15)",
    border: "1px solid rgba(168,85,247,0.3)",
    borderRadius: 20,
    padding: "6px 14px",
    fontSize: 12,
    fontWeight: 600,
    color: "#c084fc",
    cursor: "pointer",
    fontFamily: "var(--font-body)",
  },
};