import React, { useEffect, useState } from "react";

export default function PolicyDocuments() {
  const [files, setFiles] = useState([]);

  // Fetch list of files
  useEffect(() => {
    fetch("http://127.0.0.1:4000/files")
      .then((res) => res.json())
      .then((data) => setFiles(data.files || []))
      .catch((err) => console.error("Error fetching files:", err));
  }, []);

  // Delete file
  const handleDelete = (filename) => {
    fetch(`http://127.0.0.1:4000/delete/${filename}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => {
        setFiles(files.filter((file) => file !== filename));
      })
      .catch((err) => console.error("Error deleting file:", err));
  };

  return (
    <div className="policy-container">
      <h1>Policy Documents Uploaded</h1>
      <table className="policy-table">
        <thead>
          <tr>
            <th>Document Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => (
            <tr key={index}>
              <td>{file}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(file)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {files.length === 0 && (
            <tr>
              <td colSpan="2">No documents uploaded yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
