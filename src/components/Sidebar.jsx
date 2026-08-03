import { NavLink } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import "../styles/sidebar.css";
import { useTranslation } from "react-i18next";

export default function Sidebar({ open, setOpen }) {
  const { t } = useTranslation();
  return (
    <>
       {!open && (
  <button 
    className="toggle" 
    onClick={() => setOpen(true)}
  >
    ☰
  </button>
)}
    <div className={`sidebar ${open ? "open" : "closed"}`}>
      {open && (
  <button 
    className="close-toggle"
    onClick={() => setOpen(false)}
  >
    ✕
  </button>
)}
      

      {/* LOGO */}
      <div className={`logo ${open ? "open" : "closed"}`}>
        {open && <span className="logo-text">📊 {t("appName")}</span>}

      </div>

      {/* MENU */}
      <nav className="menu">
        <NavLink to="/" className="item">
          🏠 {open && t("home") }
        </NavLink>

        <NavLink to="/profile" className="item">
          👤 {open && t("profile")}
        </NavLink>

        <NavLink to="/settings" className="item">
          ⚙️ {open && t("settings")}
        </NavLink>
      </nav>

      {/* LOGOUT */}
      <button
        className="logout"
        onClick={async () => {
          await supabase.auth.signOut();
        }}
      >
        🚪 {open && t("logout")}
      </button>

    </div>
    </>
  );
}