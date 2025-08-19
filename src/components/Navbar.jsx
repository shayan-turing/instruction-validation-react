import "./Dashboard.css";

export default function Navbar() {
  return (
    <div className="navbar">
      <h1>Dashboard</h1>
      <div className="navbar-right">
        <span className="icon">🔔</span>
        <span className="icon">👤 User</span>
      </div>
    </div>
  );
}
