import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [codeInput, setCodeInput] = useState("");
  const [task, setTask] = useState("explain");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!codeInput.trim()) return;
    setLoading(true);
    setOutput("");
    try {
      const res = await axios.post("/api/gemini", { code: codeInput, task });
      setOutput(res.data.response || "No output");
    } catch (err) {
      console.error(err);
      setOutput("⚠️ Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1 className="title">🚀 CodeCraft – Gemini AI</h1>

      <div className="task-buttons">
        <button
          onClick={() => setTask("explain")}
          className={task === "explain" ? "active" : ""}
        >
          Code Explainer
        </button>
        <button
          onClick={() => setTask("convert")}
          className={task === "convert" ? "active" : ""}
        >
          Code Converter
        </button>
        <button
          onClick={() => setTask("generate")}
          className={task === "generate" ? "active" : ""}
        >
          Code Generator
        </button>
      </div>

      <textarea
        className="code-input"
        placeholder={
          task === "generate"
            ? "Describe what you want to generate..."
            : "Paste your code here..."
        }
        value={codeInput}
        onChange={(e) => setCodeInput(e.target.value)}
      />

      <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
        {loading ? "Processing..." : "Run"}
      </button>

      {output && (
        <div className="output-container">
          <h2>Output</h2>
          <pre className="output">{output}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
