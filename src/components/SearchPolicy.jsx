import React, { useEffect, useState } from "react";

function SearchPage() {
  const [files, setFiles] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [topK, setTopK] = useState(5);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch file list
  useEffect(() => {
    fetch("http://127.0.0.1:4000/files")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        return res.json();
      })
      .then((data) => {
        const fileList = data.files || [];
        setFiles(fileList);
        // Auto-select first file if available
        if (fileList.length > 0 && !selectedFile) {
          setSelectedFile(fileList[0]);
        }
      })
      .catch((err) => {
        console.error("Error fetching files:", err);
        setError("Failed to load files: " + err.message);
      });
  }, [selectedFile]);

  // Handle search
  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Please enter a search query");
      return;
    }
    if (!selectedFile) {
      setError("Please select a file to search");
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const response = await fetch("http://127.0.0.1:4000/search", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          query: query.trim(), // Try both 'query' and 'instruction'
          instruction: query.trim(),
          index_name: selectedFile.replace(/\.[^/.]+$/, ""), // Remove file extension
          top_k: topK,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Search response:", data); // Debug logging
      
      // Handle different possible response formats
      let searchResults = [];
      if (Array.isArray(data.results)) {
        searchResults = data.results;
      } else if (Array.isArray(data.data)) {
        searchResults = data.data;
      } else if (Array.isArray(data)) {
        searchResults = data;
      } else {
        console.warn("Unexpected response format:", data);
        searchResults = [];
      }
      
      setResults(searchResults);
      
      if (searchResults.length === 0) {
        setError("No results found for your query");
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Search failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key in textarea
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333', textAlign: 'center', marginBottom: '30px' }}>Policy Document Search</h1>
      
      <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>
            Search Query:
          </label>
          <textarea
            placeholder="Enter your search instruction here... (Press Enter to search, Shift+Enter for new line)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{
              width: '100%',
              minHeight: '80px',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '15px', alignItems: 'end', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>
              Select Policy File:
            </label>
            <select
              value={selectedFile}
              onChange={(e) => setSelectedFile(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <option value="">-- Select a file --</option>
              {files.map((file, i) => (
                <option key={i} value={file}>
                  {file}
                </option>
              ))}
            </select>
          </div>

          <div style={{ minWidth: '100px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>
              Max Results:
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={topK}
              onChange={(e) => setTopK(Math.max(1, parseInt(e.target.value) || 1))}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={loading || !query.trim() || !selectedFile}
            style={{
              padding: '8px 20px',
              backgroundColor: loading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: loading ? 'not-allowed' : 'pointer',
              minWidth: '80px'
            }}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          color: '#721c24',
          padding: '12px',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      <div>
        {results.length > 0 && (
          <>
            <h3 style={{ color: '#333', marginBottom: '15px' }}>
              Search Results ({results.length} found):
            </h3>
            <div style={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '4px' }}>
              {results.map((item, index) => (
                <div
                  key={index}
                  style={{
                    padding: '15px',
                    borderBottom: index < results.length - 1 ? '1px solid #eee' : 'none',
                    lineHeight: '1.5'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={{
                      backgroundColor: '#007bff',
                      color: 'white',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      {index + 1}
                    </span>
                    <div style={{ flex: 1, fontSize: '14px', color: '#333' }}>
                      {typeof item === 'string' ? item : JSON.stringify(item, null, 2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        
        {!loading && results.length === 0 && !error && query && (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#666',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px'
          }}>
            No results found. Try adjusting your search query or selecting a different file.
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;