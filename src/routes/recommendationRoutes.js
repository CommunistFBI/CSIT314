const express = require('express');
const {
  recommendJobsForCandidate,
  recommendCandidatesForJob
} = require('../controllers/recommendationController');

const router = express.Router();

router.get('/jobs/:candidateId', recommendJobsForCandidate);
router.get('/candidates/:jobId', recommendCandidatesForJob);

module.exports = router;
