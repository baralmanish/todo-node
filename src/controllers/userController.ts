import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { validationResult } from "express-validator";

import { User } from "../entities/User";
import { generateToken } from "../utils/auth";
import UserService from "../services/userService";

export const register = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const requestedUser = req.body as User;

  try {
    const existingUser = await UserService.getUserByUsername(requestedUser.username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const user = await UserService.createUser(requestedUser);
    return res.status(201).json({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(500).json({ message: "An unknown error occurred" });
  }
};

export const login = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    const user = await UserService.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = generateToken(user.id, user.username);

    return res.status(200).json({ token });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(500).json({ message: "An unknown error occurred" });
  }
};
