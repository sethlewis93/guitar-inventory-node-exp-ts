"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
// Initialize config
dotenv_1.default.config();
const app = (0, express_1.default)();
// Port is part of the runtime
const port = process.env.SERVER_PORT;
// Configure EJS use
app.set("views", path_1.default.join(__dirname, "views"));
app.set("view engine", "ejs");
// Define route handler for home page
app.get("/", (req, res) => {
    res.render("index");
});
// Start server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`Server listening at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map