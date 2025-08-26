// Navbar.jsx
import { useAuth } from "../App";

export default function Navbar() {
  const { logout } = useAuth();

  return (
    <div className="navbar">
      <h1>Dashboard</h1>
      <div className="navbar-right">
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}
