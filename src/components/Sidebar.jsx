import { NavLink } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import "../styles/sidebar.css";
import { useTranslation } from "react-i18next";

export default function Sidebar({ open, setOpen }) {
  const { t } = useTranslation();
  return (
    <div className={`sidebar ${open ? "open" : "closed"}`}>

      {/* LOGO */}
      <div className={`logo ${open ? "open" : "closed"}`}>
        {open && <span className="logo-text">📊 {t("appName")}</span>}

        <button className="toggle" onClick={() => setOpen(!open)}>
          ☰
        </button>
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
  );
}