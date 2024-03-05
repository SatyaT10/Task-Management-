const express = require('express');
const userRoute = express();
userRoute.use(express.json());
userRoute.use(express.urlencoded({ extended: true }));
const userController = require('../controller/userController');
const auth = require('../middleware/auth');

userRoute.post('/register', userController.userSignup);

userRoute.post('/login', userController.userLogin);

userRoute.post('/create-category',auth,userController.createCategory);

userRoute.post('/assign-task',auth,userController.assignTaskToUser);

module.exports = userRoute; 