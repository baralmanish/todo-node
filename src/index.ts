import cors from "cors";
import * as dotenv from "dotenv";
import bodyParser from "body-parser";
import session from "express-session";
import express, { Request, Response } from "express";

import authRoutes from "./routes/authRoutes";
import todoRoutes from "./routes/todoRoutes";
import { AppDataSource } from "./data-source";
import { JWT_SECRET } from "./utils/constants";

// Load environment variables from a .env file into process.env
dotenv.config();

// Specify the port number for the server to listen on
const port: number = 3001;

// CORS (Cross-Origin Resource Sharing) options
const corsOptions = {
  origin: process.env.CLIENT_URL as string, // Allow requests from the specified client URL
  optionsSuccessStatus: 200 // Handle legacy browsers that might not support 204 status
};

// Function to start the server
const startServer = async () => {
  try {
    // Initialize the TypeORM data source (database connection)
    await AppDataSource.initialize();

    const app = express(); // Create an Express application
    app.use(bodyParser.json()); // Middleware to parse JSON bodies in incoming requests
    app.use(cors(corsOptions)); // Middleware to enable CORS with the specified options

    // Middleware to manage user sessions using express-session
    app.use(
      session({
        secret: JWT_SECRET, // Secret key used to sign the session ID cookie
        resave: false, // Do not save session if unmodified
        saveUninitialized: true, // Save new sessions even if they haven't been modified
        cookie: { secure: false } // Set to true to require HTTPS in production
      })
    );

    // Define a route for the root path ('/')
    app.get("/", (req: Request, res: Response) => {
      // Send a simple response to the client
      res.send("Hello, TypeScript + Node.js + Express!");
    });

    app.use("/api/auth", authRoutes); // Mount the authentication routes at /api/auth
    app.use("/api/todo", todoRoutes); // Mount the to-do routes at /api/todo

    // Start the server and listen on the specified port
    app.listen(port, () => {
      // Log a message when the server is successfully running
      console.log(`API Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    // Log an error message if the server fails to start
    console.error("API Server failed to start", error);
  }
};

// Start the server by invoking the startServer function
startServer();
