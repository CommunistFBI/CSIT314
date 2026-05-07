const express = require('express');
const {
  createJob,
  updateJob,
  getAllJobs,
  getJobById
} = require('../controllers/jobController');

const router = express.Router();

router.get('/', getAllJobs);
router.get('/:id', getJobById);
router.post('/', createJob);
router.put('/:id', updateJob);

module.exports = router;
