import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginModal({ onClose }) {
  const { logIn, signUp } = useAuth();
  const [mode, setMode] = useState("login");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    if (mode === "signup" && !displayName) { setError("Please enter your name."); return; }

    setLoading(true);
    try {
      if (mode === "login") {
        await logIn(email, password);
      } else {
        await signUp(email, password, displayName);
      }
      onClose();
    } catch (err) {
      const map = {
        "auth/user-not-found": "No account with that email.",
        "auth/wrong-password": "Wrong password.",
        "auth/email-already-in-use": "Email already in use.",
        "auth/weak-password": "Password must be at least 6 characters.",
        "auth/invalid-email": "Invalid email address.",
        "auth/invalid-credential": "Invalid email or password.",
      };
      setError(map[err.code] || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-sheet">
        <div className="modal-handle" />
        <div style={styles.container}>
          <div style={styles.logo}>NIGHTOUT</div>
          <div style={styles.tagline}>
            {mode === "login" ? "Welcome back 🍺" : "Join the night 🎉"}
          </div>

          <div style={styles.tabs}>
            {["login", "signup"].map((m) => (
              <button
                key={m}
                style={{ ...styles.tab, ...(mode === m ? styles.tabActive : {}) }}
                onClick={() => { setMode(m); setError(""); }}
              >
                {m === "login" ? "LOG IN" : "SIGN UP"}
              </button>
            ))}
          </div>

          <div style={styles.form}>
            {mode === "signup" && (
              <input
                style={styles.input}
                type="text"
                placeholder="Your name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            )}
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
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={loading}
            style={{ opacity: loading ? 0.6 : 1, marginBottom: 12 }}
          >
            {loading ? "..." : mode === "login" ? "LET'S GO →" : "CREATE ACCOUNT →"}
          </button>

          <button onClick={onClose} style={styles.skipBtn}>
            Continue without logging in
          </button>
          <div style={{ height: 36 }} />
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
    gap: 14,
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
    marginTop: -6,
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
  error: {
    background: "rgba(239,68,68,0.12)",
    border: "1px solid rgba(239,68,68,0.25)",
    borderRadius: 10,
    padding: "10px 14px",
    fontSize: 13,
    color: "#f87171",
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