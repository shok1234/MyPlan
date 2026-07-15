import { NavLink } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import "../styles/sidebar.css";

export default function Sidebar({ open, setOpen }) {
  return (
    <div className={`sidebar ${open ? "open" : "closed"}`}>

      {/* LOGO */}
      <div className={`logo ${open ? "open" : "closed"}`}>
        {open && <span className="logo-text">📊 MyPlan</span>}

        <button className="toggle" onClick={() => setOpen(!open)}>
          ☰
        </button>
      </div>

      {/* MENU */}
      <nav className="menu">
        <NavLink to="/" className="item">
          🏠 {open && "Home"}
        </NavLink>

        <NavLink to="/profile" className="item">
          👤 {open && "Profile"}
        </NavLink>

        <NavLink to="/settings" className="item">
          ⚙️ {open && "Settings"}
        </NavLink>
      </nav>

      {/* LOGOUT */}
      <button
        className="logout"
        onClick={async () => {
          await supabase.auth.signOut();
        }}
      >
        🚪 {open && "Logout"}
      </button>

    </div>
  );
}