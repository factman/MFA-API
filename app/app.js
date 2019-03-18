"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = require("body-parser");
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const mongoose_1 = __importDefault(require("mongoose"));
const morgan_1 = __importDefault(require("morgan"));
const apiRouter_1 = require("./routes/apiRouter");
const error_1 = require("./utilities/error");
// initializing environment configuration
dotenv_1.default.config();
// defining Port number
const port = process.env.PORT || process.env.API_PORT;
// defining DB connection string
const connectionString = process.env.NODE_ENV ? process.env.LIVE_DB_URL : process.env.DB_URL;
// defining the express app
const app = express_1.default();
// creating connection to database
mongoose_1.default.connect(connectionString, { useNewUrlParser: true, useCreateIndex: true });
// save connection object
const db = mongoose_1.default.connection;
// database error event listener
db.on("error", (err) => {
    console.error("error connecting to database", err);
});
// database open event listener
db.once("open", () => {
    console.log("db connected successfully");
});
// helmet middleware implementation
app.use(helmet_1.default());
// logger middleware implementation
app.use(morgan_1.default("dev"));
// json parser middleware implementation
app.use(body_parser_1.json({ limit: "10mb" }));
// cors middleware implementation
app.use(cors_1.default());
// compression middleware implementation
app.use(compression_1.default());
/**
 * GET /api
 * @description API route middleware.
 */
app.use("/api", apiRouter_1.router);
/**
 * @description catch 404 error and forward to error handler.
 */
app.use((req, res, next) => {
    next(error_1.getError({ message: "Not Found", status: 404 }));
});
/**
 * @description Error Handler.
 */
app.use(error_1.errorHandler);
// Raising the app to listen to port
app.listen(port, () => {
    console.log("API is listening on Port:", port);
});
//# sourceMappingURL=app.js.map