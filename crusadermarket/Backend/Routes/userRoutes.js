//all routes used for creating a user account and updating user information

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const verifyToken = require('../Middleware/veryfyToken')



// POST /api/signup
router.post('/signup', userController.signup);

// POST /api/auth/login
router.post('/login', userController.login);



// Routes to get user information
router.get('/user/name', verifyToken, userController.getUserName);
router.get('/user/email', verifyToken, userController.getUserEmail);
router.get('/user/phone', verifyToken, userController.getUserPhone);

// Routes to update user information
router.put('/user/name', verifyToken, userController.updateUserName);
router.put('/user/email', verifyToken, userController.updateUserEmail);
router.put('/user/phone', verifyToken, userController.updateUserPhone);
//router.put('/user/password', verifyToken, userController.updateUserPassword);

module.exports = router;