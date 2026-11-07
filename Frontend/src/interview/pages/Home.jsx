import React from "react";
import useInterview from "../../auth/hooks/useInterview";
import "./Home.scss";

const Home = () => {
  const {
    jobDescription,
    setJobDescription,
    selfDescription,
    setSelfDescription,
    resume,
    loading,
    handleFileChange,
    handleGenerateReport,
  } = useInterview();

  return (
    <main className="home">
      <div className="left">
        <textarea
          className="jobDescription"
          id="jobDescription"
          placeholder="Enter your job description here"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        ></textarea>
      </div>

      <div className="right">
        <textarea
          className="selfDescription"
          id="selfDescription"
          placeholder="Enter your self description here"
          value={selfDescription}
          onChange={(e) => setSelfDescription(e.target.value)}
        ></textarea>

        <div className="input-group">
          <label htmlFor="resume">Upload Resume:</label>

          <input
            type="file"
            id="resume"
            name="resume"
            accept=".pdf"
            onChange={handleFileChange}
          />
          {resume && <span className="file-name">{resume.name}</span>}
        </div>
      </div>

      <div className="bottom">
        <button
          className="generateReport"
          onClick={handleGenerateReport}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Report"}
        </button>
      </div>
    </main>
  );
};

export default Home;
