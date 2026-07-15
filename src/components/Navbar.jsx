export default function Navbar({ toggleSidebar }) {
  return (
    <div className="navbar">
      <button className="menu-btn" onClick={toggleSidebar}>
        ☰
      </button>

      <div className="title">MyPlan</div>
    </div>
  );
}