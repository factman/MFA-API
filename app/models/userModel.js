"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String },
    phone: { type: String },
    gender: { type: String, enum: ["MALE", "FEMALE"] },
    password: { type: String, required: true },
    question1: { type: String, default: "Your mother's maiden name" },
    answer1: { type: String },
    question2: { type: String, default: "Your favorite pet name" },
    answer2: { type: String },
    question3: { type: String, default: "Your favorite color" },
    answer3: { type: String },
    otp: { type: String, default: "qwerty" },
    fingerprint: { type: String, unique: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
userSchema.methods.update = function (updates, callback) {
    Object.assign(this, updates, { updatedAt: new Date() });
    this.save(callback);
};
const User = mongoose_1.model("User", userSchema);
exports.User = User;
//# sourceMappingURL=userModel.js.map