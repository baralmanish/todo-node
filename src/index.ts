import express, { Request, Response } from "express";
import session from "express-session";
import bodyParser from "body-parser";

import { JWT_SECRET } from "./utils/constants";
import { AppDataSource } from "./data-source";

// Specify the port number for the server
const port: number = 3001;

const startServer = async () => {
  try {
    // Initialize TypeORM data source
    await AppDataSource.initialize();

    // Create an Express application
    const app = express();
    app.use(bodyParser.json());
    app.use(
      session({
        secret: JWT_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false } // Set secure to true in production
      })
    );

    // Define a route for the root path ('/')
    app.get("/", (req: Request, res: Response) => {
      // Send a response to the client
      res.send("Hello, TypeScript + Node.js + Express!");
    });

    // Start the server and listen on the specified port
    app.listen(port, () => {
      // Log a message when the server is successfully running
      console.log(`API Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("API Server failed to start", error);
  }
};

startServer();
