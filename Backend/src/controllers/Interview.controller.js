const pdfparse = require("pdf-parse");

const {
  generateAndSaveInterviewReport,
} = require("../services/ai.services");

const InterviewReport = require("../model/InterviewReport");

async function generateInterviewReportController(req, res) {
  try {
    // 1. Get uploaded resume
    const resumeFile = req.file;

    if (!resumeFile) {
      return res.status(400).json({
        message: "Resume file is required",
      });
    }

    // 2. Extract text from PDF
    const resumeContent = await pdfparse(resumeFile.buffer);

    // 3. Get data from request body
    const { selfDescription, jobDescription } = req.body;

    // 4. Generate report using AI
    const interviewReportByAi =
      await generateAndSaveInterviewReport({
        resume: resumeContent.text,
        jobDescription,
        selfDescription,
      });

    // 5. Save report in MongoDB
    const interviewReport = await InterviewReport.create({
      user: req.user.id,
      resume: resumeContent.text,
      jobDescription,
      selfDescription,
      ...interviewReportByAi,
    });

    // 6. Send response
    res.status(201).json({
      message: "Interview report generated successfully",
      interviewReport,
    });

  } catch (error) {
    console.error("Interview report error:", error);

    res.status(500).json({
      message: "Failed to generate interview report",
      error: error.message,
    });
  }
}
// yaar yeh get interview report by id wala function bhi yaha add kar do
async function getInterviewReportById(req, res) {
    const { interviewID } = req.params
    const interviewReport = await InterviewReport.findById(interviewID)
    if( !interviewReport){
        return res.status(404).json({
            message : "Interview report not found"
        })
    }
    res.status(200).json({
        message : "Interview report found",
        interviewReport
    })
}

// i want to get all my interview report at all ones a time 
async function getAllInterviewReport(req, res) {
  try {
    const interviews = await InterviewReport.find({
      user: req.user.id,
    })
      .sort({
        createdAt: -1,
      })
      .select("-resume -selfDescription -jobDescription");

    return res.status(200).json({
      message: "Interview reports fetched successfully",
      interviews,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
}




module.exports = {
    generateInterviewReportController,
    getInterviewReportById,
    getAllInterviewReport
};