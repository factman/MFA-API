"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const userModel_1 = require("../models/userModel");
class Validation {
    // validate if the data supplied is valid
    static validateUserSignup(user, callback) {
        let status = true;
        if (!user.name || !user.username || !user.password) {
            status = false;
        }
        userModel_1.User.findOne({ username: user.username }, (err, res) => {
            status = (res === null);
            callback(status);
        });
    }
    // Return the hash version of password string
    static hashPassword(password, callback) {
        const hash = crypto_1.createHash("sha256");
        hash.on("readable", () => {
            const data = hash.read();
            if (data) {
                callback(data.toString("hex"));
            }
        });
        hash.write(password);
        hash.end();
    }
    // Validate if the user data to edit are valid
    static validateUserEdit(user) {
        return !!(user.email && user.gender && user.name && user.phone);
    }
    // Validate if the supplied is a valid password
    static validateUserPassword(user, userData, callback) {
        if (user.newPassword && user.oldPassword && user.newPassword.length > 5) {
            this.hashPassword(user.oldPassword, (oldHash) => {
                if (userData.password !== oldHash) {
                    callback(false, null);
                }
                else {
                    this.hashPassword(user.newPassword, (newHash) => {
                        callback(true, newHash);
                    });
                }
            });
        }
        else {
            callback(false, null);
        }
    }
    // Validate user login credentials
    static validateUserLogin(userLogin, callback) {
        if (userLogin.username && userLogin.password && userLogin.password.length > 5 && userLogin.username.length > 1) {
            userModel_1.User.findOne({ username: userLogin.username }, (err, res) => {
                if (res !== null) {
                    this.hashPassword(userLogin.password, (hash) => {
                        if (res.password === hash) {
                            callback(true, res);
                        }
                        else {
                            callback(false, null);
                        }
                    });
                }
                else {
                    callback(false, null);
                }
            });
        }
        else {
            callback(false, null);
        }
    }
}
exports.Validation = Validation;
//# sourceMappingURL=validations.js.map