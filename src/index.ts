import exp from "constants";
import dotenv from "dotenv";
import express from "express";
import path from "path"
import * as sessionAuth from "./middleware/sessionAuth";
import * as routes from "./routes"

// Initialize config
dotenv.config();

const app = express();

// Directs Express to parse incoming JSON
app.use(express.json());

// Port is part of the runtime
const port = process.env.SERVER_PORT;

// Configure EJS use
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Configure Express to serve static files in the public directory
app.use(express.static(path.join(__dirname, "public")));

// Configure session auth
sessionAuth.register(app);

// Configure routes
routes.register(app);

// Define route handler for home page
app.get("/", (req, res) => {
  res.render("index");
});

// Start server
app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`Server listening at http://localhost:${port}`);
});
