const mongoose = require("mongoose");

/*
 * =========================================================
 * Technical Question Schema
 * =========================================================
 */

const technicalQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
    },

    intention: {
      type: String,
      required: [true, "Intention is required"],
    },

    answer: {
      type: String,
      required: [true, "Answer is required"],
    },
  },
  { _id: false }
);


/*
 * =========================================================
 * Behavioral Question Schema
 * =========================================================
 */

const behavioralQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
    },

    intention: {
      type: String,
      required: [true, "Intention is required"],
    },

    answer: {
      type: String,
      required: [true, "Answer is required"],
    },
  },
  { _id: false }
);


/*
 * =========================================================
 * Skill Gap Schema
 * =========================================================
 */

const skillGapSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: [true, "Skill is required"],
    },

    severity: {
      type: String,
      required: [true, "Severity is required"],
      enum: ["low", "medium", "high", "critical"],
    },

    type: {
      type: String,
      required: [true, "Skill gap type is required"],
      enum: ["technical", "soft-skill", "experience", "knowledge"],
    },
  },
  { _id: false }
);


/*
 * =========================================================
 * Preparation Plan Schema
 * =========================================================
 */

const preparationPlanSchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: [true, "Day is required"],
      min: 1,
    },

    task: {
      type: String,
      required: [true, "Task is required"],
    },

    resources: {
      type: String,
      required: [true, "Resources are required"],
    },
  },
  { _id: false }
);


/*
 * =========================================================
 * Interview Report Schema
 * =========================================================
 */

const interviewReportSchema = new mongoose.Schema(
  {
    // User ID
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },

    // Job Description
    jobDescription: {
      type: String,
      required: [true, "Job description is required"],
    },

    // Resume Text
    resume: {
      type: String,
      required: [true, "Resume is required"],
    },

    // User's Self Description
    selfDescription: {
      type: String,
      required: [true, "Self description is required"],
    },

    // Resume + Job Description Match Score
    matchScore: {
      type: Number,
      required: [true, "Match score is required"],
      min: 0,
      max: 100,
    },

    // Technical Questions
    technicalQuestions: {
      type: [technicalQuestionSchema],
      default: [],
    },

    // Behavioral Questions
    behavioralQuestions: {
      type: [behavioralQuestionSchema],
      default: [],
    },

    // Skill Gaps
    skillGaps: {
      type: [skillGapSchema],
      default: [],
    },

    // Preparation Plan
    preparationPlan: {
      type: [preparationPlanSchema],
      default: [],
    },
  },

  {
    timestamps: true,
  }
);


/*
 * =========================================================
 * Export Model
 * =========================================================
 */

const InterviewReport = mongoose.model(
  "InterviewReport",
  interviewReportSchema
);

module.exports = InterviewReport;