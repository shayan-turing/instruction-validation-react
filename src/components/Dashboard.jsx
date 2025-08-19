import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import FileUpload from "./FileUpload";
import PolicyDocuments from "./PolicyDocuments";
import SearchPage from "./SearchPolicy";
import ValidateInstruction from "./ValidateInstruction";
import "./Dashboard.css";

export default function Dashboard() {
  const [page, setPage] = useState("upload"); // default page

  return (
    <div className="dashboard">
      <Sidebar onMenuClick={setPage} />

      <div className="main">
        <Navbar />

        <div className="content-area">
          {page === "upload" && <FileUpload />}
          {page === "policy-docs" && <PolicyDocuments />}
          {page === "policy-view" && <SearchPage />}
          {page === "instruction-validation" && <ValidateInstruction />}
        </div>
      </div>
    </div>
  );
}
