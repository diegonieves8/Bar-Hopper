import { useState } from "react";

export default function LoginModal({ onClose, onLogin }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    // Placeholder — will wire to Firebase Auth later
    if (email && password) {
      onLogin({ email, name: email.split("@")[0] });
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-sheet">
        <div className="modal-handle" />

        <div style={styles.container}>
          {/* Logo */}
          <div style={styles.logo}>NIGHTOUT</div>
          <div style={styles.tagline}>
            {mode === "login" ? "Welcome back 🍺" : "Join the night 🎉"}
          </div>

          {/* Mode tabs */}
          <div style={styles.tabs}>
            <button
              style={{ ...styles.tab, ...(mode === "login" ? styles.tabActive : {}) }}
              onClick={() => setMode("login")}
            >
              LOG IN
            </button>
            <button
              style={{ ...styles.tab, ...(mode === "signup" ? styles.tabActive : {}) }}
              onClick={() => setMode("signup")}
            >
              SIGN UP
            </button>
          </div>

          {/* Inputs */}
          <div style={styles.form}>
            <input
              style={styles.input}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              style={styles.input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="btn-primary" onClick={handleSubmit} style={{ marginBottom: 12 }}>
            {mode === "login" ? "LET'S GO →" : "CREATE ACCOUNT →"}
          </button>

          <button
            onClick={onClose}
            style={styles.skipBtn}
          >
            Continue without logging in
          </button>

          <div style={{ height: 32 }} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "24px 24px 0",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  logo: {
    fontFamily: "var(--font-display)",
    fontSize: 42,
    letterSpacing: 4,
    background: "linear-gradient(135deg, #fff 0%, #a855f7 60%, #ec4899 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    textAlign: "center",
  },
  tagline: {
    textAlign: "center",
    fontSize: 14,
    color: "rgba(255,255,255,0.4)",
    fontWeight: 300,
    marginTop: -8,
  },
  tabs: {
    display: "flex",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    padding: "10px",
    border: "none",
    borderRadius: 9,
    background: "transparent",
    fontFamily: "var(--font-display)",
    fontSize: 15,
    letterSpacing: "1.5px",
    color: "rgba(255,255,255,0.35)",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  tabActive: {
    background: "rgba(168,85,247,0.2)",
    color: "#c084fc",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  input: {
    width: "100%",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: "14px 16px",
    fontSize: 14,
    color: "#fff",
    fontFamily: "var(--font-body)",
    outline: "none",
  },
  skipBtn: {
    background: "none",
    border: "none",
    fontSize: 13,
    color: "rgba(255,255,255,0.25)",
    cursor: "pointer",
    textAlign: "center",
    textDecoration: "underline",
    fontFamily: "var(--font-body)",
    padding: 0,
  },
};