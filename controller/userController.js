const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const config = require('../config/config')
const Category = require('../models/category');
const moment = require('moment');
const Task = require('../models/taskModel');

const securePassword = async (password) => {
    try {
        const hashPassword = await bcrypt.hash(password, 10);
        return hashPassword;
    } catch (error) {
        console.log(error.message);
    }
}

const Create_Token = async (data) => {
    try {
        console.log(data);
        const userData = {
            userId: data.userData._id,
            email: data.userData.email
        }
        console.log("UserId", userData)
        const token = jwt.sign({ userData }, config.secret_jwt, { expiresIn: "2h" });
        return token;
    } catch (error) {
        log(error.message);
    }
}


const userSignup = async (req, res) => {
    try {
        const reqBody = req.body;
        const { name, email, password, mobile } = reqBody;
        if (!name || !email || !password || !mobile)
            return res.status(400).send({ success: false, message: "All field are required for signup" });
        const usserEmailData = await User.findOne({ email: email });
        if (usserEmailData)
            return res.status(400).send({ success: false, message: "User already exists with this Email Id." });

        await User.create({
            name: name,
            email: email,
            password: await securePassword(password),
            mobile: mobile,
            is_admin: 0
        });

        res.status(200).send({ success: true, message: "Sign Up" });
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
}

const userLogin = async (req, res) => {
    try {
        const reqBody = req.body;
        const { email, password } = reqBody
        if (!email || !password)
            return res.status(400).send({ success: false, msg: 'All field are required for login!' });
        const userData = await User.findOne({ email: email });
        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password);
            if (passwordMatch) {
                console.log(userData);
                const token = await Create_Token({ userData });
                const response = {
                    success: true,
                    message: "User Details",
                    data: userData, token
                }
                res.status(200).send(response);
            } else {
                res.status(400).send({ success: false, msg: "Email Or Password Wrong!" });
            }
        } else {
            res.status(400).send({ success: false, msg: "Email Or Password Wrong!" });
        }
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
}

const createCategory = async (req, res) => {
    try {
        const authUser = req.user.userData;
        const reqBody = req.body;
        const { categoryName } = reqBody;
        if (!categoryName)
            return res.status(400).send({ success: false, msg: "All field are required!" })
        const userData = await User.findOne({ _id: authUser.userId });
        if (userData) {
            if (userData.is_admin == 1) {
                await Category.create({
                    category_name: categoryName
                });
                res.status(200).send({ success: true, msg: "Category Created Successfully" });
            } else {
                res.status(400).send({ success: false, msg: "You can't Create  a Category! You Are Not Admin." })
            }
        } else {
            res.status(400).send({ success: false, msg: "User not valid!." });
        }
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
}

const assignTaskToUser = async (req, res) => {
    try {
        const authUser = req.user.userData;
        console.log(authUser.userId, authUser.email);
        const reqBody = req.body;
        const { category_id, user_id, task } = reqBody
        if (!category_id || !user_id || !task)
            return res.status(400).send({ success: false, msg: "All fields are required" });
        const userData = await User.findOne({ _id: authUser.userId });
        if (userData) {
            if (userData.is_admin == 1) {
                const date = moment().add(5, 'days').format('DD-MMM-YYYY')
                console.log("Date", date);
                console.log(userData.is_admin);
                await Task.create({
                    category_id: category_id,
                    user_id: user_id,
                    task: task,
                    due_date: date
                });
                res.status(200).send({ success: true, msg: "Task Assigned Successfully" });
            } else {
                res.status(400).send({ success: false, msg: "You can't assign task to user beacuse you are not a user" });
            }
        } else {
            res.status(400).send({ success: false, msg: "Invalid User!" });
        }
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
}

module.exports = {
    userSignup,
    userLogin,
    createCategory,
    assignTaskToUser
}