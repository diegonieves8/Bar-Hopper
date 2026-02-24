import { useState } from "react";
import "./styles/global.css";
import BarsPage from "./pages/BarsPage";
/* import CameraPage from "./pages/CameraPage";
import MapPage from "./pages/MapPage"; */
import LoginModal from "./components/LoginModal";

export default function App() {
  const [activePage, setActivePage] = useState("bars");
  const [user, setUser] = useState(null); // null = logged out
  const [showLogin, setShowLogin] = useState(false);

  const isLoggedIn = !!user;

  const renderPage = () => {
    switch (activePage) {
      case "bars":   return <BarsPage isLoggedIn={isLoggedIn} />;
      case "camera": return <CameraPage />;
      case "map":    return <MapPage />;
      default:       return <BarsPage isLoggedIn={isLoggedIn} />;
    }
  };

  return (
    <div className="app">
      {/* Page Content */}
      {renderPage()}

      {/* Bottom Nav */}
      <div className="bottom-nav">
        {[
          { id: "bars",   icon: "🍺", label: "Bars"  },
          { id: "camera", icon: "📸", label: "Shots" },
          { id: "map",    icon: "📍", label: "Map"   },
        ].map((nav) => (
          <button
            key={nav.id}
            className={`nav-item ${activePage === nav.id ? "active" : ""}`}
            onClick={() => setActivePage(nav.id)}
          >
            <span className="nav-icon">{nav.icon}</span>
            <span className="nav-label">{nav.label}</span>
          </button>
        ))}

        {/* Auth button */}
        <button
          className="nav-item"
          onClick={() => isLoggedIn ? setUser(null) : setShowLogin(true)}
        >
          <span className="nav-icon">{isLoggedIn ? "👤" : "🔑"}</span>
          <span className="nav-label" style={{ color: isLoggedIn ? "#a855f7" : undefined }}>
            {isLoggedIn ? user.name.slice(0, 6) : "Log In"}
          </span>
        </button>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLogin={(userData) => setUser(userData)}
        />
      )}
    </div>
  );
}