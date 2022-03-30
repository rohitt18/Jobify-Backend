const express = require("express");
const jobsRouter = express.Router();

const { createJob,getAllJobs,getJob,updateJob,deleteJob } = require("../controllers/jobs");

jobsRouter.route("/").post(createJob).get(getAllJobs);
jobsRouter.route("/:id").get(getJob).patch(updateJob).delete(deleteJob);

module.exports = jobsRouter;