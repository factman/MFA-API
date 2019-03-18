"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Return formatted user object
const formatUser = (user) => {
    return {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        loginStatus: !!(user.username && user.password),
        securityQuestionStatus: !!(user.answer1 && user.answer2 && user.answer3),
        otpStatus: (user.otp !== undefined),
        fingerprintStatus: (user.fingerprint !== undefined),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
};
exports.formatUser = formatUser;
//# sourceMappingURL=api.js.map