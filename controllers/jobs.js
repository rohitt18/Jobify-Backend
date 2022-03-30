const Job = require("../models/Job");
const {StatusCodes} = require("http-status-codes");
const { BadRequestError,NotFoundError } = require("../errors");

// AS FAR AS THE 'jobs' CONTROLLER THE MAIN TASK IS TO GET THAT 'userId'


const getAllJobs = async (req, res) => {
  // createdBy = req.user.userId; // why user? bec we want to get only the jobs that are associated with that user
  // we'll pass in createdBy property & we'll set it equal to that user by req.user.userId
  const job = await Job.find({createdBy:req.user.userId}).sort('createdAt')
  res.status(StatusCodes.OK).json({ job, count: job.length });  
};


const getJob = async (req, res) => { // here I'm gonna look for 2 things in the req
  // 1. as far as the jobs, we can access them in the params object thats going to be the job id
  // 2. And when it comes to user, ofc that is located in the user object that we're getting in from the middleware
  // so lets first destructure both of these things first
  // const {user:{userId},params:{id:jobId}} = req
  const {userId} = req.user;
  const {id:jobId} = req.params;
  // logic => to find that one job where the id is the jobId as well as createdBy is userId & if the job doesnt exist then we'll throw notFoundError
  const job = await Job.findById({ _id:jobId, createdBy:userId });
  if(!job){
    throw new NotFoundError(`No job with id:${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job }); 
};


const createJob = async (req, res) => {
  // const job = await Job.create(req.body) // but at the moment we're missing is that user & where is it located?=>req.user
  // now what we're really looking for is the id 
  req.body.createdBy = req.user.userId; // createdBy bec in our Job Model thats what i called my property
  const job = await Job.create(req.body)
  res.status(StatusCodes.CREATED).json({ job }); 
};


const updateJob = async (req, res) => { 
  const {userId} = req.user;
  const {id:jobId} = req.params;
  const {status,position,company} = req.body
  if(!position || !company){
    throw new BadRequestError("Company and position fields cannot be empty")
  }
  // logic => to find that one job where the id is the jobId as well as createdBy is userId & update (req.body as second parameter as we need to pass in that new data)
  // if the job doesnt exist then we'll throw notFoundError
  const job = await Job.findByIdAndUpdate({ _id:jobId, createdBy:userId },req.body,{
    new:true,
    runValidators:true,
  });
  if(!job){
    throw new NotFoundError(`No job with id:${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const {userId} = req.user;
  const {id:jobId} = req.params;
  const job = await Job.findByIdAndDelete({_id:jobId, createdBy:userId})
  if(!job){
    throw new NotFoundError(`No job with id:${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job }); // OR res.status(StatusCodes.OK).send(); 
}


module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};

// before deployment lets make our mongoose error responses more user-friendly
// just like our error classes, we'll do this once & then use it in multiple projects
// currently we have 3 mongoose errors - 
// - Validation Errors (if the user doesn't provide one of the values this error pops up in auth)   [solved] 
// - Duplicate (Email) (where email is unique and if not this error pops up in auth)    [solved]
// - Cast Error (thats when the id syntax doesn't match exactly to what the mongoose is looking for & pops up in jobs)  [solved]

// so we have to go to the error-handler middleware and make the changes accordingly
