import "./Dashboard.css";

export default function Sidebar({ onMenuClick }) {
  return (
    <div className="sidebar">
      <h2 className="logo">My Dashboard</h2>
      <nav>
        <a href="#" onClick={() => onMenuClick("upload")}>📂 File Upload</a>
        <a href="#" onClick={() => onMenuClick("policy-docs")}>📑 Policy Documents</a>
        <a href="#" onClick={() => onMenuClick("policy-view")}>📑 Policy Checker</a>
        <a href="#" onClick={() => onMenuClick("instruction-validation")}>⚙️ Validate Instruction</a>
      </nav>
    </div>
  );
}
