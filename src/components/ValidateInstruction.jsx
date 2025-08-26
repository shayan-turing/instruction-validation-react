import React, { useEffect, useState } from "react";

function ValidationPage() {
  const [files, setFiles] = useState([]);
  const [instruction, setInstruction] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [topK, setTopK] = useState(7);
  const [validationResult, setValidationResult] = useState(null);
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

  // Handle validation
  const handleValidation = async () => {
    if (!instruction.trim()) {
      setError("Please enter an instruction to validate");
      return;
    }
    if (!selectedFile) {
      setError("Please select a file");
      return;
    }

    setLoading(true);
    setError("");
    setValidationResult(null);

    try {
      const response = await fetch("http://127.0.0.1:4000/validate_instruction", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          instruction: instruction.trim(),
          index_name: selectedFile.replace(/\.[^/.]+$/, ""), // Remove file extension
          top_k: topK,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Validation response:", data); // Debug logging
      
      // Check if we have validation data
      if (data && (data.Validation || data.validation)) {
        setValidationResult(data);
      } else {
        console.warn("Unexpected response format:", data);
        setError("Unexpected response format from validation API");
      }
      
    } catch (err) {
      console.error("Validation error:", err);
      setError("Validation failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key in textarea
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleValidation();
    }
  };

  // Helper function to get status color
  const getStatusColor = (result) => {
    return result === "PASS" ? "#28a745" : "#dc3545";
  };

  // Helper function to get status background
  const getStatusBackground = (result) => {
    return result === "PASS" ? "#d4edda" : "#f8d7da";
  };

  // Render validation criteria
  const renderValidationCriteria = (validation) => {
    if (!validation) return null;

    const criteriaOrder = ['user_facing', 'output_oriented', 'single_outcome', 'policy_compliant', 'overall'];
    const criteriaLabels = {
      user_facing: 'User Facing',
      output_oriented: 'Output Oriented', 
      single_outcome: 'Single Outcome',
      policy_compliant: 'Policy Compliant',
      overall: 'Overall Assessment'
    };

    return (
      <div style={{ marginTop: '20px' }}>
        <h3 style={{ color: '#333', marginBottom: '20px', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>
          Validation Results
        </h3>
        
        {criteriaOrder.map(key => {
          const criteria = validation[key];
          if (!criteria) return null;
          
          return (
            <div key={key} style={{ 
              marginBottom: '20px', 
              border: '1px solid #ddd', 
              borderRadius: '8px',
              backgroundColor: 'white'
            }}>
              <div style={{
                padding: '15px',
                backgroundColor: getStatusBackground(criteria.result),
                borderRadius: '8px 8px 0 0',
                borderBottom: '1px solid #ddd'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h4 style={{ margin: 0, color: '#333' }}>
                    {criteriaLabels[key] || key}
                  </h4>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    backgroundColor: getStatusColor(criteria.result),
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {criteria.result}
                  </span>
                </div>
              </div>
              
              <div style={{ padding: '15px' }}>
                {criteria.explanation && (
                  <div style={{ marginBottom: '12px' }}>
                    <strong style={{ color: '#555' }}>Explanation:</strong>
                    <p style={{ margin: '8px 0 0 0', lineHeight: '1.5', color: '#666' }}>
                      {criteria.explanation}
                    </p>
                  </div>
                )}
                
                {criteria.summary && (
                  <div style={{ marginBottom: '12px' }}>
                    <strong style={{ color: '#555' }}>Summary:</strong>
                    <p style={{ margin: '8px 0 0 0', lineHeight: '1.5', color: '#666' }}>
                      {criteria.summary}
                    </p>
                  </div>
                )}
                
                {criteria.improved_instruction && (
                  <div>
                    <strong style={{ color: '#555' }}>Improved Instruction:</strong>
                    <ul style={{ margin: '8px 0 0 20px', lineHeight: '1.5' }}>
                      {criteria.improved_instruction.map((item, index) => (
                        <li key={index} style={{ color: '#666', marginBottom: '4px' }}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333', textAlign: 'center', marginBottom: '30px' }}>
        Instruction Validation
      </h1>
      
      <div style={{ backgroundColor: '#f8f9fa', padding: '25px', borderRadius: '8px', marginBottom: '25px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
            Instruction to Validate:
          </label>
          <textarea
            placeholder="Enter the instruction you want to validate... (Press Enter to validate, Shift+Enter for new line)"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              resize: 'vertical',
              boxSizing: 'border-box',
              lineHeight: '1.4'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'end', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '250px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
              Select Policy Index:
            </label>
            <select
              value={selectedFile}
              onChange={(e) => setSelectedFile(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                
              }}
            >
              <option value="">-- Select a policy index --</option>
              {files.map((file, i) => (
                <option key={i} value={file}>
                  {file}
                </option>
              ))}
            </select>
          </div>

          <div style={{ minWidth: '120px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
              Top K Results:
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={topK}
              onChange={(e) => setTopK(Math.max(1, parseInt(e.target.value) || 1))}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>

          <button
            onClick={handleValidation}
            disabled={loading || !instruction.trim() || !selectedFile}
            style={{
              padding: '10px 25px',
              backgroundColor: loading ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: loading ? 'not-allowed' : 'pointer',
              minWidth: '120px',
              fontWeight: 'bold'
            }}
          >
            {loading ? 'Validating...' : 'Validate'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          color: '#721c24',
          padding: '15px',
          borderRadius: '6px',
          marginBottom: '20px',
          fontSize: '14px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {validationResult && (validationResult.Validation || validationResult.validation) && (
        <div>
          {renderValidationCriteria(validationResult.Validation || validationResult.validation)}
        </div>
      )}

      {!loading && !validationResult && !error && instruction && (
        <div style={{
          textAlign: 'center',
          padding: '50px',
          color: '#666',
          backgroundColor: '#f8f9fa',
          borderRadius: '6px',
          border: '2px dashed #dee2e6'
        }}>
          <p style={{ margin: 0, fontSize: '16px' }}>
            Ready to validate your instruction. Click "Validate" to proceed.
          </p>
        </div>
      )}
    </div>
  );
}

export default ValidationPage;