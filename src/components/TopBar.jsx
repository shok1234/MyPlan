import "../styles/topbar.css";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function TopBar({ open, setOpen }) {
  const { t } = useTranslation();

  return (
    <header className="topbar">

      <button
        className="menu-btn"
        onClick={() => setOpen(!open)}
      >
        {open ? "✕" : "☰"}
      </button>

      <h2 className="topbar-title">
        {t("appName")}
      </h2>

      <Link to="/profile" className="profile-link">
        <span className="profile-btn">
          👤
        </span>
      </Link>

    </header>
  );
}