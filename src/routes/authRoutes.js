const express = require('express');
const { listUsers, getUserById, register, login } = require('../controllers/authController');

const router = express.Router();

router.get('/users', listUsers);
router.get('/users/:id', getUserById);
router.post('/register', register);
router.post('/login', login);

module.exports = router;
