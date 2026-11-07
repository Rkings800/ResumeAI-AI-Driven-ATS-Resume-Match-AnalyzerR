const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const InterviewReport = require("../model/Interview.report.model.js"); // Adjust path to your model file
require("dotenv").config();

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

/*
 * =========================================================
 * Zod Schema Aligned with Mongoose Model
 * =========================================================
 */

const technicalQuestionZodSchema = z.object({
  question: z.string().describe("Technical question evaluating candidate claims and edge cases"),
  intention: z.string().describe("Why the interviewer is asking this question"),
  answer: z.string().describe("Key points of an ideal answer"),
});

const behavioralQuestionZodSchema = z.object({
  question: z.string().describe("Behavioral question tailored to candidate background"),
  intention: z.string().describe("What quality/soft skill is being evaluated"),
  answer: z.string().describe("How the candidate should structure their response using STAR method"),
});

const skillGapZodSchema = z.object({
  skill: z.string().describe("Specific skill or domain gap identified"),
  severity: z.enum(["low", "medium", "high", "critical"]).describe("Severity of the gap"),
  type: z.enum(["technical", "soft-skill", "experience", "knowledge"]).describe("Category of skill gap"),
});

const preparationPlanZodSchema = z.object({
  day: z.number().int().min(1).describe("Day number of the study plan (e.g., 1, 2, 3...)"),
  task: z.string().describe("Actionable learning or coding task to bridge gaps"),
  resources: z.string().describe("Recommended documentation, tutorials, or practice topics"),
});

const interviewAnalysisZodSchema = z.object({
  matchScore: z.number().int().min(0).max(100).describe("Overall percentage match score (0-100)"),
  technicalQuestions: z.array(technicalQuestionZodSchema).min(3),
  behavioralQuestions: z.array(behavioralQuestionZodSchema).min(2),
  skillGaps: z.array(skillGapZodSchema),
  preparationPlan: z.array(preparationPlanZodSchema).min(5).describe("Day-by-day structured preparation roadmap"),
});

/*
 * =========================================================
 * Service Function
 * =========================================================
 */

async function generateAndSaveInterviewReport({ userId, jobDescription, resume, selfDescription }) {
  if (!userId || !jobDescription || !resume || !selfDescription) {
    throw new Error("userId, jobDescription, resume, and selfDescription are all required.");
  }

  const responseJsonSchema = z.toJSONSchema(interviewAnalysisZodSchema);

  const prompt = `
You are a senior engineering hiring manager and technical interviewer.
Analyze the candidate's resume and self-description against the job description.

Generate:
1. An accurate matchScore (0-100).
2. Targeted technicalQuestions (with question, intention, answer).
3. Behavioral questions (with question, intention, answer).
4. Skill gaps (with skill, severity: low|medium|high|critical, type: technical|soft-skill|experience|knowledge).
5. A day-by-day preparationPlan to help the candidate prepare and bridge gaps.

---
### JOB DESCRIPTION:
${jobDescription}

---
### RESUME:
${resume}

---
### SELF-DESCRIPTION:
${selfDescription}
`;

  // 1. Call Gemini API with structured JSON output
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: responseJsonSchema,
      temperature: 0.2,
    },
  });

  const aiParsedResult = interviewAnalysisZodSchema.parse(JSON.parse(response.text));

  // 2. Persist directly into MongoDB using Mongoose model
  const savedReport = await InterviewReport.create({
    userId,
    jobDescription,
    resume,
    selfDescription,
    matchScore: aiParsedResult.matchScore,
    technicalQuestions: aiParsedResult.technicalQuestions,
    behavioralQuestions: aiParsedResult.behavioralQuestions,
    skillGaps: aiParsedResult.skillGaps,
    preparationPlan: aiParsedResult.preparationPlan,
  });

  return savedReport;
}

module.exports = {
  generateAndSaveInterviewReport,
  interviewAnalysisZodSchema,
};