const express = require('express');
const interviewRouter = express.Router();

/**
 * @route   POST /api/interview/generate-report
 * @description generate new interview report based on the provided job description, resume, and self-description
 * @access  Public
 */
//const authMiddleware = require("../middleware/auth.middleware");
//interviewRouter.post("/",authMiddleware,authuse);
const authMiddleware = require("../middleware/auth.middleware");
const interviewController = require("../controllers/Interview.controller.generateInterviewReport");

interviewRouter.post("/", interviewController.generateInterviewReport);

/**
 * @ GET API by interviewID
 */
interviewRouter.get("/report/:interviewID", authMiddleware,interviewController.getInterviewReportById);

/**
 * @route GET/api/interview/
 * @description get all the interview report of logged user
 * @access Private 
 */
interviewRouter.get("/", authMiddleware, interviewController.getAllInterviewReport);

// abhi tak routes aur controller change hua kiya hai 






 

module.exports = interviewRouter;