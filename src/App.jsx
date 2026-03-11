import { useState } from "react";
import "./styles/global.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import BarsPage from "./pages/BarsPage";
import CameraPage from "./pages/CamerasPage";
import MapPage from "./pages/MapPage"; 
import SettingsPage from "./pages/SettingsPage";
import LoginModal from "./components/LoginModal";

function AppInner() {
  const { user } = useAuth();
  const [activePage, setActivePage] = useState("bars");
  const [showLogin, setShowLogin] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case "bars":     return <BarsPage />;
      case "camera":   return <CameraPage />;
      case "map":      return <MapPage />;
      case "settings": return <SettingsPage onOpenLogin={() => setShowLogin(true)} />;
      default:         return <BarsPage />;
    }
  };

  return (
    <div className="app">
      {renderPage()}

      {/* Bottom Nav */}
      <div className="bottom-nav">
        {[
          { id: "bars",     icon: "🍺", label: "Bars"     },
          { id: "camera",   icon: "📸", label: "Shots"    },
          { id: "map",      icon: "📍", label: "Map"      },
          { id: "settings", icon: "⚙️", label: user ? (user.displayName || "Me").slice(0, 6) : "Settings" },
        ].map((nav) => (
          <button
            key={nav.id}
            className={`nav-item ${activePage === nav.id ? "active" : ""}`}
            onClick={() => setActivePage(nav.id)}
          >
            <span className="nav-icon">
              {/* Show user initial when logged in on settings */}
              {nav.id === "settings" && user ? (
                <span style={styles.userDot}>
                  {(user.displayName || user.email || "?")[0].toUpperCase()}
                </span>
              ) : (
                nav.icon
              )}
            </span>
            <span className="nav-label">{nav.label}</span>
          </button>
        ))}
      </div>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}

const styles = {
  userDot: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #a855f7, #ec4899)",
    fontSize: 12,
    fontWeight: 700,
    color: "white",
  },
};