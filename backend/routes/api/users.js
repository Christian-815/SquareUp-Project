const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
    check('firstName')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a valid first name.'),
    check('lastName')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a valid last name.'),
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('email')
        .custom(value => {
            return User.findOne({
                where: {email: value}
            }).then(user => {
                if (user) {
                    return Promise.reject('User with that email already exists')
                }
            })
        })
        .withMessage(),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('username')
        .custom(value => {
            return User.findOne({
                where: { username: value }
            }).then(user => {
                if (user) {
                    return Promise.reject('User with that username already exists')
                }
            })
        }),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];


// Sign up
router.post(
    '/',
    validateSignup,
    async (req, res) => {
        const { firstName, lastName, email, password, username } = req.body;
        const user = await User.signup({ firstName, lastName, email, username, password });

        const jsonUser = user.toJSON();
        const token = await setTokenCookie(res, user);
        jsonUser.token = token
        // console.log('----------------------FIRST ROUTE HANDLER-------------------------')
        // console.log('//////////////////////////////////////////////////////////////////', req.body)


        return res.json({
            user: jsonUser
        });
    },
    async (err, req, res, next) => {
        // console.log('--------------------SECOND MIDDLEWARE FUNCTION----------------')
        if (err.errors.email === 'User with that email already exists') {
            // console.log('|||||||||||||||||||||||ERROR SAME EMAIL|||||||||||||||||||||||||||||||||', req.body)
            err.status = 403;
            err.message = "User already exists";
            delete err.title

            return res.status(403).json({
                message: err.message,
                statusCode: err.status,
                error: err.errors
            })
        };

        if (err.errors.email) {
            // console.log('///////////////////////////////ERROR EMAIL INVALID///////////////////////////////////', req.body)
            err.status = 400;
            err.message = "Validation error";
            err.errors.email = "Invalid email"
            return res.status(400).json({
                message: err.message,
                statusCode: err.status,
                error: err.errors
            })
        };

        if (err.errors.firstName) {
            err.status = 400;
            err.message = "Validation error";
            err.errors.firstName = "First Name is required"
            return res.status(400).json({
                message: err.message,
                statusCode: err.status,
                error: err.errors
            })
        };

        if (err.errors.lastName) {
            err.status = 400;
            err.message = "Validation error";
            err.errors.lastName = "Last Name is required"
            return res.status(400).json({
                message: err.message,
                statusCode: err.status,
                error: err.errors
            })
        };

        if (err.errors.username === 'User with that username already exists') {
            // console.log('|||||||||||||||||||||||ERROR SAME EMAIL|||||||||||||||||||||||||||||||||', req.body)
            err.status = 403;
            err.message = "Username already exists";
            delete err.title

            return res.status(403).json({
                message: err.message,
                statusCode: err.status,
                error: err.errors
            })
        };

        if (err.errors.username) {
            err.status = 400;
            err.message = "Validation error";
            err.errors.username = "Please provide a username with at least 4 characters."
            return res.status(400).json({
                message: err.message,
                statusCode: err.status,
                error: err.errors
            })
        };

        if (err.errors.password) {
            err.status = 400;
            err.message = "Validation error";
            err.errors.password = "Password must be 6 characters or more."
            return res.status(400).json({
                message: err.message,
                statusCode: err.status,
                error: err.errors
            })
        };

        return next(err)
    }
);




module.exports = router;
