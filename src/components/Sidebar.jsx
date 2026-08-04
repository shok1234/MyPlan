import { NavLink } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import "../styles/sidebar.css";
import { useTranslation } from "react-i18next";

export default function Sidebar({ open, setOpen }) {
  const { t } = useTranslation();

  return (
    <>
      
      <aside className={`sidebar ${open ? "open" : "closed"}`}>
      
        <div className={`logo ${open ? "open" : "closed"}`}>
          {open && <span className="logo-text">📊 {t("appName")}</span>}
        </div>

        <nav className="menu">
          <NavLink
            to="/"
            className="item"
            onClick={() => window.innerWidth <= 768 && setOpen(false)}
          >
            🏠 {open && t("home")}
          </NavLink>

          <NavLink
            to="/profile"
            className="item"
            onClick={() => window.innerWidth <= 768 && setOpen(false)}
          >
            👤 {open && t("profile")}
          </NavLink>

          <NavLink
            to="/settings"
            className="item"
            onClick={() => window.innerWidth <= 768 && setOpen(false)}
          >
            ⚙️ {open && t("settings")}
          </NavLink>
        </nav>

        <button
          className="logout"
          onClick={async () => {
            await supabase.auth.signOut();
          }}
        >
          🚪 {open && t("logout")}
        </button>
      </aside>
    </>
  );
}