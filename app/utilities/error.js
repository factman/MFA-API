"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @description Return an error object.
 * @returns {Error} Error object
 */
const getError = (err) => {
    return Object.assign(new Error(err.message), { status: err.status });
};
exports.getError = getError;
/**
 * @description Handle all errors and respond with error message and status code
 */
const errorHandler = (err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message,
        },
    });
    next();
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.js.map