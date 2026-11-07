import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

/**
 * Generate an interview report by sending job description,
 * self description, and resume PDF to the backend.
 *
 * @param {{ jobDescription: string, selfDescription: string, resume: File }} params
 * @returns The full interview report from Gemini AI
 */
export async function generateReport({ jobDescription, selfDescription, resume }) {
  const formData = new FormData();
  formData.append("jobDescription", jobDescription);
  formData.append("selfDescription", selfDescription);
  formData.append("resume", resume);

  const response = await api.post("/api/interview/generate-report", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
}

/**
 * Get all interview reports for the logged-in user.
 */
export async function getAllReports() {
  const response = await api.get("/api/interview/reports");
  return response.data;
}

/**
 * Get a single interview report by ID.
 */
export async function getReportById(id) {
  const response = await api.get(`/api/interview/reports/${id}`);
  return response.data;
}

/**
 * Delete an interview report by ID.
 */
export async function deleteReport(id) {
  const response = await api.delete(`/api/interview/reports/${id}`);
  return response.data;
}
