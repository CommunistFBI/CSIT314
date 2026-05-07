const express = require('express');
const upload = require('../config/upload');
const {
  createCandidate,
  updateCandidate,
  getAllCandidates,
  getCandidateById,
  getCandidateByUserId
} = require('../controllers/candidateController');

const router = express.Router();
const candidateUploads = upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'coverLetter', maxCount: 1 },
  { name: 'profileImage', maxCount: 1 }
]);

router.get('/', getAllCandidates);
router.get('/user/:userId', getCandidateByUserId);
router.get('/:id', getCandidateById);
router.post('/', candidateUploads, createCandidate);
router.put('/:id', candidateUploads, updateCandidate);

module.exports = router;
