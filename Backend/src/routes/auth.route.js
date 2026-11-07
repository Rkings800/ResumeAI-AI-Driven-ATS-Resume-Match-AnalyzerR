const express = require('express');
const authrouter = express.Router();
const authController = require('../controllers/auth.controller');

/**
 * @descriptin : register a new user
 * @route : /api/auth/register
 * @method : POST
 * @access : PUBLIC
 */

authrouter.post('/register', authController.registerUser);
authrouter.post('/login', authController.loginUser);
authrouter.post('/logout', authController.logoutUser);

module.exports = authrouter;

