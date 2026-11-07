import { useContext } from "react";
import { InterviewContext } from "../../interview/services/interview.context.jsx";

/**
 * useInterviewReport
 * Access the active interview report (survives page refresh via sessionStorage)
 */
export const useInterviewReport = () => {
  const context = useContext(InterviewContext);
  return context;
};

export default useInterviewReport;
