"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const userModel_1 = require("../models/userModel");
const api_1 = require("../utilities/api");
const error_1 = require("../utilities/error");
const validations_1 = require("../utilities/validations");
// initializing environment configuration
dotenv_1.default.config();
// initializing the api version.
const version = process.env.API_VERSION;
/**
 * @description Return welcome message
 */
const welcome = (req, res) => {
    res.json({
        success: true,
        message: `Welcome to MFA-API v${version}`,
        data: null,
    });
};
exports.welcome = welcome;
/**
 * @description Return Specified Joke Via id parameter
 */
const getUserByIdParam = (req, res, next, id) => {
    userModel_1.User.findById(id, (err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return next(error_1.getError({ message: "Not Found", status: 404 }));
        }
        Object.assign(req, { user });
        return next();
    });
};
exports.getUserByIdParam = getUserByIdParam;
/**
 * @description Return a specific user from database
 */
const getUserById = (req, res) => {
    const { user } = req;
    res.json({
        success: true,
        data: api_1.formatUser(user),
        message: "User returned successfully.",
    });
};
exports.getUserById = getUserById;
/**
 * @description Reset Database
 */
const resetDatabase = (req, res, next) => {
    userModel_1.User.db.dropDatabase((err) => {
        if (err) {
            return next(err);
        }
        res.json({
            success: true,
            data: null,
            message: "Database Reset successfully.",
        });
    });
};
exports.resetDatabase = resetDatabase;
/**
 * @description Create a user
 */
const createUser = (req, res, next) => {
    const user = req.body;
    validations_1.Validation.validateUserSignup(user, (valid) => {
        if (valid) {
            validations_1.Validation.hashPassword(user.password, (hash) => {
                user.password = hash;
                userModel_1.User.insertMany([user], (err, users) => {
                    if (err) {
                        return next(err);
                    }
                    const newUser = users[0];
                    res.status(201)
                        .json({
                        success: true,
                        data: api_1.formatUser(newUser),
                        message: "Signed up successfully.",
                    });
                });
            });
        }
        else {
            return next(error_1.getError({ message: "Error Creating User: Invalid information supplied.", status: 500 }));
        }
    });
};
exports.createUser = createUser;
/**
 * @description Edit a specific user
 */
const editUserData = (req, res, next) => {
    const userEditData = req.body;
    if (validations_1.Validation.validateUserEdit(userEditData)) {
        req.user.update(userEditData, (err, editedUserData) => {
            if (err) {
                return next(err);
            }
            res.json({
                success: true,
                data: api_1.formatUser(editedUserData),
                message: "User data was updated successfully.",
            });
        });
    }
    else {
        return next(error_1.getError({ message: "Invalid User data supplied.", status: 500 }));
    }
};
exports.editUserData = editUserData;
/**
 * @description Edit a specific user password
 */
const editUserPassword = (req, res, next) => {
    const userEditPassword = req.body;
    validations_1.Validation.validateUserPassword(userEditPassword, req.user, (valid, hash) => {
        if (valid) {
            req.user.update({ password: hash }, (err, editedUserData) => {
                if (err) {
                    return next(err);
                }
                res.json({
                    success: true,
                    data: api_1.formatUser(editedUserData),
                    message: "Password updated successfully.",
                });
            });
        }
        else {
            return next(error_1.getError({ message: "Invalid password supplied.", status: 500 }));
        }
    });
};
exports.editUserPassword = editUserPassword;
/**
 * @description Login a specific user
 */
const userLogin = (req, res, next) => {
    const login = req.body;
    validations_1.Validation.validateUserLogin(login, (valid, user) => {
        if (valid) {
            res.json({
                success: true,
                data: api_1.formatUser(user),
                message: "Login successfully.",
            });
        }
        else {
            return next(error_1.getError({ message: "Invalid username or password.", status: 500 }));
        }
    });
};
exports.userLogin = userLogin;
/**
 * @description Get user Security question or questions
 */
const getSecurityQuestions = (req, res) => {
    const user = req.user;
    const qid = Math.floor(Math.random() * 3) + 1;
    const questions = [];
    if (req.params.quantity === "all") {
        for (let x = 1; x <= 3; x++) {
            questions.push({
                qid: x,
                // @ts-ignore
                question: user["question" + x],
            });
        }
    }
    else {
        questions.push({
            qid,
            // @ts-ignore
            question: user["question" + qid],
        });
    }
    res.json({
        success: true,
        data: questions,
        message: "Questions Returned successfully.",
    });
};
exports.getSecurityQuestions = getSecurityQuestions;
/**
 * @description Authenticate user with Security question
 */
const authQuestion = (req, res) => {
    const user = req.user;
    const authData = req.body;
    validations_1.Validation.hashPassword(authData.answer, (hash) => {
        // @ts-ignore
        if (user["answer" + authData.qid] === hash) {
            res.json({
                success: true,
                data: null,
                message: "Correct Answer.",
            });
        }
        else {
            const qid = Math.floor(Math.random() * 3) + 1;
            res.json({
                success: false,
                data: [{
                        qid,
                        // @ts-ignore
                        question: user["question" + qid],
                    }],
                message: "Incorrect answer try again.",
            });
        }
    });
};
exports.authQuestion = authQuestion;
/**
 * @description Authenticate user with OTP
 */
const authOtp = (req, res, next) => {
    const user = req.user;
    const authData = req.body;
    if (user.otp === authData.otp) {
        res.json({
            success: true,
            data: null,
            message: "Correct OTP.",
        });
    }
    else {
        return next(error_1.getError({ message: "Incorrect OTP or OTP not found.", status: 500 }));
    }
};
exports.authOtp = authOtp;
/**
 * @description Authenticate user with fingerprint
 */
const authFingerprint = (req, res, next) => {
    const user = req.user;
    const authData = req.body;
    validations_1.Validation.hashPassword(authData.signature, (hash) => {
        if (user.fingerprint === hash) {
            res.json({
                success: true,
                data: null,
                message: "Correct Fingerprint Signature.",
            });
        }
        else {
            return next(error_1.getError({ message: "Incorrect fingerprint signature not found.", status: 404 }));
        }
    });
};
exports.authFingerprint = authFingerprint;
/**
 * @description Update user fingerprint
 */
const updateFingerprint = (req, res, next) => {
    const user = req.user;
    const fingerprintData = req.body;
    validations_1.Validation.hashPassword(fingerprintData.password, (passwordHash) => {
        if (user.password === passwordHash) {
            validations_1.Validation.hashPassword(fingerprintData.signature, (fingerprintHash) => {
                user.update({ fingerprint: fingerprintHash }, (err, userData) => {
                    if (err) {
                        return next(err);
                    }
                    res.json({
                        success: true,
                        data: api_1.formatUser(userData),
                        message: "Fingerprint signature was updated successfully.",
                    });
                });
            });
        }
        else {
            return next(error_1.getError({ message: "Incorrect password, operation failed.", status: 404 }));
        }
    });
};
exports.updateFingerprint = updateFingerprint;
/**
 * @description Update user security questions
 */
const updateSecurityQuestions = (req, res, next) => {
    const user = req.user;
    const questionData = req.body;
    validations_1.Validation.hashPassword(questionData.password, (passwordHash) => {
        if (user.password === passwordHash) {
            const questionIds = questionData.answers.map((answer) => answer.qid);
            questionIds.forEach((id) => {
                if (!(id >= 1 && id <= 3)) {
                    return next(error_1.getError({ message: `Invalid question "${id}" supplied, operation failed.`, status: 404 }));
                }
            });
            const answers = { answer1: "", answer2: "", answer3: "" };
            validations_1.Validation.hashPassword(questionData.answers[0].answer, (hash1) => {
                answers["answer" + questionData.answers[0].qid] = hash1;
                validations_1.Validation.hashPassword(questionData.answers[1].answer, (hash2) => {
                    answers["answer" + questionData.answers[1].qid] = hash2;
                    validations_1.Validation.hashPassword(questionData.answers[2].answer, (hash3) => {
                        answers["answer" + questionData.answers[2].qid] = hash3;
                        user.update(answers, (err, userData) => {
                            if (err) {
                                return next(err);
                            }
                            res.json({
                                success: true,
                                data: api_1.formatUser(userData),
                                message: "Questions was updated successfully.",
                            });
                        });
                    });
                });
            });
        }
        else {
            return next(error_1.getError({ message: "Incorrect password, operation failed.", status: 404 }));
        }
    });
};
exports.updateSecurityQuestions = updateSecurityQuestions;
//# sourceMappingURL=apiController.js.map