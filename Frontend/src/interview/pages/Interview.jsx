import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useInterviewReport } from "../services/interview.context.jsx";
import "./Interview.scss";

const Interview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { report: contextReport } = useInterviewReport();

  // Context (sessionStorage-backed) first; router state as fallback
  const report = contextReport || location.state?.report;

  const [activeTab, setActiveTab] = useState("technical");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  // Fallback if no report data (or a malformed/stale saved report)
  if (!report || typeof report.matchScore !== "number") {
    return (
      <main className="interview">
        <div className="no-report">
          <h2>No Interview Data</h2>
          <p>Please generate a report from the Home page first.</p>
          <button className="back-btn" onClick={() => navigate("/")}>
            Go to Home
          </button>
        </div>
      </main>
    );
  }

  const {
    matchScore,
    technicalQuestions = [],
    behavioralQuestions = [],
    skillGaps = [],
    preparationPlan = [],
  } = report;

  // Get current questions based on active tab
  const questions =
    activeTab === "technical" ? technicalQuestions : behavioralQuestions;
  const totalQuestions = questions.length;

  const handlePrev = () => {
    setCurrentQuestion((prev) => Math.max(0, prev - 1));
    setShowAnswer(false);
  };

  const handleNext = () => {
    setCurrentQuestion((prev) =>
      Math.min(totalQuestions - 1, prev + 1)
    );
    setShowAnswer(false);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "critical":
        return "#ef4444";
      case "high":
        return "#f97316";
      case "medium":
        return "#eab308";
      case "low":
        return "#22c55e";
      default:
        return "#6b7280";
    }
  };

  return (
    <main className="interview">
      {/* Left: Question + Progress */}
      <div className="left">
        <div className="match-score">
          <h3>Match Score</h3>
          <div className="score-circle">
            <span className="score-value">{matchScore}%</span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === "technical" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("technical");
              setCurrentQuestion(0);
              setShowAnswer(false);
            }}
          >
            Technical ({technicalQuestions.length})
          </button>
          <button
            className={`tab ${activeTab === "behavioral" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("behavioral");
              setCurrentQuestion(0);
              setShowAnswer(false);
            }}
          >
            Behavioral ({behavioralQuestions.length})
          </button>
          <button
            className={`tab ${activeTab === "gaps" ? "active" : ""}`}
            onClick={() => setActiveTab("gaps")}
          >
            Skill Gaps ({skillGaps.length})
          </button>
          <button
            className={`tab ${activeTab === "plan" ? "active" : ""}`}
            onClick={() => setActiveTab("plan")}
          >
            Prep Plan ({preparationPlan.length})
          </button>
        </div>

        {/* Question Card */}
        {activeTab !== "gaps" && activeTab !== "plan" && totalQuestions > 0 && (
          <div className="question-card">
            <span className="question-number">
              Question {currentQuestion + 1} / {totalQuestions}
            </span>
            <h3>
              {activeTab === "technical" ? "Technical" : "Behavioral"} Question
            </h3>
            <p className="question-text">
              {questions[currentQuestion].question}
            </p>
            <p className="intention">
              <strong>Intention:</strong> {questions[currentQuestion].intention}
            </p>
          </div>
        )}

        {/* Skill Gaps View */}
        {activeTab === "gaps" && (
          <div className="gaps-list">
            {skillGaps.map((gap, index) => (
              <div key={index} className="gap-card">
                <div className="gap-header">
                  <span className="gap-skill">{gap.skill}</span>
                  <span
                    className="gap-severity"
                    style={{ background: getSeverityColor(gap.severity) }}
                  >
                    {gap.severity}
                  </span>
                </div>
                <span className="gap-type">{gap.type}</span>
              </div>
            ))}
          </div>
        )}

        {/* Preparation Plan View */}
        {activeTab === "plan" && (
          <div className="plan-list">
            {preparationPlan.map((day) => (
              <div key={day.day} className="plan-card">
                <div className="plan-header">
                  <span className="plan-day">Day {day.day}</span>
                </div>
                <p className="plan-task">{day.task}</p>
                <p className="plan-resources">
                  <strong>Resources:</strong> {day.resources}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Progress bar for questions */}
        {activeTab !== "gaps" && activeTab !== "plan" && totalQuestions > 0 && (
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${((currentQuestion + 1) / totalQuestions) * 100}%`,
              }}
            ></div>
          </div>
        )}
      </div>

      {/* Right: Answer */}
      <div className="right">
        <h3 className="answer-title">
          {activeTab === "gaps"
            ? "Skill Gap Analysis"
            : activeTab === "plan"
            ? "Preparation Plan"
            : "Ideal Answer"}
        </h3>

        {activeTab !== "gaps" && activeTab !== "plan" && totalQuestions > 0 && (
          <>
            <div className="answer-toggle">
              <button
                className={`toggle-btn ${showAnswer ? "active" : ""}`}
                onClick={() => setShowAnswer(!showAnswer)}
              >
                {showAnswer ? "Hide Answer" : "Show Answer"}
              </button>
            </div>

            {showAnswer && (
              <div className="answer-card">
                <p>{questions[currentQuestion].answer}</p>
              </div>
            )}
          </>
        )}

        {activeTab === "gaps" && (
          <div className="gaps-summary">
            <p>
              You have <strong>{skillGaps.length}</strong> skill gaps to
              address. Focus on the critical and high severity items first.
            </p>
            <ul>
              {skillGaps
                .filter((g) => g.severity === "critical" || g.severity === "high")
                .map((gap, i) => (
                  <li key={i}>
                    <strong>{gap.skill}</strong> — {gap.severity} ({gap.type})
                  </li>
                ))}
            </ul>
          </div>
        )}

        {activeTab === "plan" && (
          <div className="plan-summary">
            <p>
              Your personalized <strong>{preparationPlan.length}-day</strong>{" "}
              preparation plan:
            </p>
          </div>
        )}
      </div>

      {/* Bottom: Navigation */}
      <div className="bottom">
        <button className="prev-btn" onClick={handlePrev}>
          Previous
        </button>
        <button className="next-btn" onClick={handleNext}>
          Next
        </button>
        <button className="back-btn" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    </main>
  );
};

export default Interview;
