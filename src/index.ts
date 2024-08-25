import cors from "cors";
import * as dotenv from "dotenv";
import bodyParser from "body-parser";
import session from "express-session";
import express, { Request, Response } from "express";

import authRoutes from "./routes/authRoutes";
import todoRoutes from "./routes/todoRoutes";
import { AppDataSource } from "./data-source";
import { JWT_SECRET } from "./utils/constants";

dotenv.config();

// Specify the port number for the server
const port: number = 3001;
const corsOptions = {
  origin: process.env.CLIENT_URL as string,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const startServer = async () => {
  try {
    // Initialize TypeORM data source
    await AppDataSource.initialize();

    // Create an Express application
    const app = express();
    app.use(bodyParser.json());
    app.use(cors(corsOptions));
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

    app.use("/api/auth", authRoutes);
    app.use("/api/todo", todoRoutes);

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
