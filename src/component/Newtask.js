import React, { useState, useEffect } from "react";
import "../styles/Newtask.scss";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//import { Toaster } from "react-hot-toast";
import { DiJavascript } from "react-icons/di";
import { useNavigate } from "react-router-dom";
//import { toast } from "react-toastify";

const NewTaskPage = () => {
  const navigate = useNavigate();
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [sample, setSample] = useState({
    input: "",
    output: "",
    explanation: "",
  });
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [extraTestCases, setExtraTestCases] = useState([]);
  const [testCases, setTestCases] = useState([]);
  const [showIO, setShowIO] = useState(false);
  const [runClicked, setRunClicked] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetch("http://localhost/Task/task/src/backend/randomproblem.php")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched problem data:", data); // Log the data
        setSelectedProblem(data);
        setExtraTestCases(data.hiddenTestCases || []);

        // Set sample data

        if (data.samples) {
          setSample({
            input: data.samples.input || "",
            output: data.samples.output || "",
            explanation: data.samples.explanation || "",
          });
        }
      });
  }, []);

  useEffect(() => {
    if (language) {
      const sampleCode = {
        javascript: `// Sample code in JavaScript\nfunction solution() {\n  // your code here\n}`,
        python: `# Sample code in Python\ndef solution():\n    # your code here\n`,
        java: `// Sample code in Java\npublic class Solution {\n    public static void main(String[] args) {\n        // your code here\n    }\n}`,
        "C++": `// Sample code in C++\n#include <iostream>\nusing namespace std;\nint main() {\n    // your code here\n    return 0;\n}`,
      };
      setCode(sampleCode[language]);
    }
  }, [language]);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const moveTestCase = (index, direction) => {
    const newTestCases = [...testCases];
    const [removedTestCase] = newTestCases.splice(index, 1);
    const newIndex = direction === "up" ? index - 1 : index + 1;
    newTestCases.splice(newIndex, 0, removedTestCase);
    setTestCases(newTestCases);
  };

  const handleRun = () => {
    const newTestCases = [];
    for (let i = 0; i < 2; i++) {
      const passed = Math.random() > 0.5; // Randomly pass or fail
      newTestCases.push({ passed });
    }
    setTestCases(newTestCases);
    setRunClicked(true);
    setShowIO(true);
    console.log("Code executed:", {
      code,
      language,
      inputValue: sample.input,
      expectedOutput: sample.output,
    });

    setTimeout(() => {
      setExtraTestCases((prev) =>
        prev.map((testCase, index) => ({
          ...testCase,
          passed: index % 2 === 0,
        }))
      );
    }, 1000);
  };
  const cancelDelete = () => {
    setShowPopup(false);
  };

  const handleSubmit = () => {
    if (!runClicked) {
      alert("Please run the code first.");
      return;
    }
    setShowPopup(true);
  };
  const handleDone = () => {
    toast.success("Problem Submitted");

    console.log("Code submitted:", {
      code,
      language,
      inputValue: sample.input,
      expectedOutput: sample.output,
    });

    setShowPopup(false);
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return (
    <div className="new-task-page">
      {/*<div>
        <Toaster />
      </div>*/}
      <ToastContainer />
      <div className="problem-list">
        <div className="problem-item selected">
          <h3>{selectedProblem?.title}</h3>
          <p>{selectedProblem?.description}</p>
        </div>

        <div className="io-section">
          {selectedProblem?.sample.map((example, index) => (
            <div key={index} className="example-section">
              <strong>Example {index + 1}</strong>
              <p>
                <strong>Input:</strong> {example.input}
              </p>
              <p>
                <strong>Output:</strong> {example.output}
              </p>
              <p>
                <strong>Explanation:</strong> {example.explanation}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="compiler-area">
        <div className="compiler-header">
          <select value={language} onChange={handleLanguageChange}>
            <option>Select language</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="C++">C++</option>
          </select>

          <div className="Run">
            <button className="btn run-btn" onClick={handleRun}>
              Run
            </button>
            <button
              className="btn submit-btn"
              onClick={handleSubmit}
              disabled={!runClicked}
            >
              Submit
            </button>
          </div>
        </div>
        <textarea
          className="code-editor"
          placeholder="Write your code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        {showIO && (
          <div className="io-display">
            <h3>Test Results:</h3>
            {testCases.map((testCase, index) => (
              <div
                key={index}
                className={`test-case ${testCase.passed ? "passed" : "failed"}`}
                style={{ transition: "all 0.5s ease-in-out" }}
              >
                <div className="status-icon">
                  {testCase.passed ? <i className="bi bi-check-lg"></i> : "❌"}
                </div>
                <div className="test-display">
                  <p
                    style={{
                      color: testCase.passed ? "green" : "red",
                    }}
                  >
                    Testcase {index + 1}:{" "}
                    {testCase.passed ? "Passed" : "Failed"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p>Are you sure you want to Submit this problem?</p>
            <div className="popup-buttons">
              <button className="cancel-btn" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="confirm-btn" onClick={handleDone}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewTaskPage;