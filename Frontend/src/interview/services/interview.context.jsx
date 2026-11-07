import { createContext, useContext, useState } from "react";
import { getReportById } from "./interview.api";

export const InterviewContext = createContext(null);

const STORAGE_KEY = "interviewReport";

function readStoredReport() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const InterviewProvider = ({ children }) => {
  // Restored from sessionStorage so the report survives a page refresh
  const [report, setReport] = useState(readStoredReport);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const saveReport = (newReport) => {
    setReport(newReport);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newReport));
    } catch {
      // storage full/unavailable — in-memory report still works
    }
  };

  const clearReport = () => {
    setReport(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  // Load a saved report by ID (from Mongo) into context
  const loadReportById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getReportById(id);
      saveReport(result.data);
      return result.data;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to load report";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <InterviewContext.Provider
      value={{ report, saveReport, clearReport, loadReportById, loading, error }}
    >
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterviewReport = () => useContext(InterviewContext);
