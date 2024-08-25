import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { validationResult } from "express-validator";

import { User } from "../entities/User";
import { generateToken } from "../utils/auth";
import UserService from "../services/userService";

// Handler for POST /api/auth/register
// Registers a new user
export const register = async (req: Request, res: Response) => {
  // Validate the request body using express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // If validation errors are found, respond with HTTP status 422 (Unprocessable Entity) and error details
    return res.status(422).json({ errors: errors.array() });
  }

  // Extract user data from request body
  const requestedUser = req.body as User;

  try {
    // Check if a user with the same username already exists
    const existingUser = await UserService.getUserByUsername(requestedUser.username);
    if (existingUser) {
      // If user exists, respond with HTTP status 400 (Bad Request) and an error message
      return res.status(400).json({ message: "Username already exists" });
    }

    // Create a new user using UserService
    const user = await UserService.createUser(requestedUser);

    // Respond with HTTP status 201 (Created) and user details (excluding password)
    return res.status(201).json({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username
    });
  } catch (error) {
    // Handle errors: respond with HTTP status 500 (Internal Server Error) and error message
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(500).json({ message: "An unknown error occurred" });
  }
};

// Handler for POST /api/auth/login
// Authenticates a user and returns a JWT token
export const login = async (req: Request, res: Response) => {
  // Validate the request body using express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // If validation errors are found, respond with HTTP status 422 (Unprocessable Entity) and error details
    return res.status(422).json({ errors: errors.array() });
  }

  // Extract username and password from request body
  const { username, password } = req.body;

  try {
    // Fetch user by username from UserService
    const user = await UserService.getUserByUsername(username);
    if (!user) {
      // If user is not found, respond with HTTP status 401 (Unauthorized) and an error message
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare the provided password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // If passwords do not match, respond with HTTP status 401 (Unauthorized) and an error message
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token for the authenticated user
    const token = generateToken(user.id, user.username);

    // Respond with HTTP status 200 (OK) and the JWT token
    return res.status(200).json({ token });
  } catch (error) {
    if (error instanceof Error) {
      // Handle errors: respond with HTTP status 500 (Internal Server Error) and error message
      return res.status(500).json({ message: error.message });
    }

    return res.status(500).json({ message: "An unknown error occurred" });
  }
};
