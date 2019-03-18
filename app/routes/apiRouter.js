"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const apiController_1 = require("../controllers/apiController");
const router = express_1.Router();
exports.router = router;
/**
 * @description Get a user object when :id is present in the route
 */
router.param("id", apiController_1.getUserByIdParam);
/**
 * GET: /api
 * @description Return API name and version.
 */
router.get("/", apiController_1.welcome);
/**
 * GET: /api/user/:id
 * @description Return a user with the specified id.
 */
router.get("/user/:id", apiController_1.getUserById);
/**
 * POST /api/reset
 * @description Clear database.
 */
router.post("/reset", apiController_1.resetDatabase);
/**
 * POST /api/user
 * @description Create a user.
 */
router.post("/user", apiController_1.createUser);
/**
 * PUT /api/user/:id
 * @description Edit a specific user.
 */
router.put("/user/:id", apiController_1.editUserData);
/**
 * PUT /api/user/:id/password
 * @description Edit a specific user password.
 */
router.put("/user/:id/password", apiController_1.editUserPassword);
/**
 * POST /api/auth/login
 * @description Authenticate user with username and password.
 */
router.post("/auth/login", apiController_1.userLogin);
/**
 * POST: /api/auth/question/:id
 * @description Authenticate user with security question.
 */
router.post("/auth/question/:id", apiController_1.authQuestion);
/**
 * GET: /api/user/:id/questions/:quantity
 * @description Get user security questions.
 */
router.get("/user/:id/questions/:quantity", apiController_1.getSecurityQuestions);
/**
 * POST: /api/auth/otp/:id
 * @description Authenticate user with one time password (OTP).
 */
router.post("/auth/otp/:id", apiController_1.authOtp);
/**
 * POST: /api/auth/fingerprint/:id
 * @description Authenticate user with fingerprint.
 */
router.post("/auth/fingerprint/:id", apiController_1.authFingerprint);
/**
 * PUT: /api/user/:id/questions
 * @todo Update user security questions.
 */
router.put("/user/:id/questions", apiController_1.updateSecurityQuestions);
/**
 * PUT: /api/user/:id/fingerprint
 * @description Update user fingerprint.
 */
router.put("/user/:id/fingerprint", apiController_1.updateFingerprint);
//# sourceMappingURL=apiRouter.js.map