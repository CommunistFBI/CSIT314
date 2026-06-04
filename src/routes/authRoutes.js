const express = require('express');
const { listUsers, getUserById, register, login, updateMembership } = require('../controllers/authController');

const router = express.Router();

router.get('/users', listUsers);
router.get('/users/:id', getUserById);
router.post('/register', register);
router.post('/login', login);
router.patch('/:id/membership', updateMembership);

module.exports = router;
