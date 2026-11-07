import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateReport } from "../../interview/services/interview.api.js";
import { useInterviewReport } from "../../interview/services/interview.context.jsx";

/**
 * useInterview
 * Manages the Home page form state and report generation.
 */
const useInterview = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);

  const { saveReport } = useInterviewReport();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setResume(file);
    } else {
      alert("Please upload a PDF file");
    }
  };

  const handleGenerateReport = async () => {
    if (!jobDescription.trim() || !selfDescription.trim() || !resume) {
      alert("Please fill in all fields and upload your resume");
      return;
    }

    setLoading(true);
    try {
      // API returns an envelope: { success, message, data: <report> }
      const response = await generateReport({
        jobDescription: jobDescription.trim(),
        selfDescription: selfDescription.trim(),
        resume,
      });

      saveReport(response.data);
      navigate("/interview");
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to generate report";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    jobDescription,
    setJobDescription,
    selfDescription,
    setSelfDescription,
    resume,
    loading,
    handleFileChange,
    handleGenerateReport,
  };
};

export default useInterview;
