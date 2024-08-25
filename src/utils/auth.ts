import jwt from "jsonwebtoken";

import { JWT_SECRET } from "./constants";

// Function to generate a JWT (JSON Web Token) for a user
// Parameters: userId - The user's ID, username - The user's username
// The token contains the user's ID and username, and is signed with a secret key (JWT_SECRET).
// The token is set to expire in 1 hour ("1h").
export const generateToken = (userId: number, username: string) => {
  return jwt.sign({ id: userId, username }, JWT_SECRET, { expiresIn: "1h" });
};

// Function to verify a JWT
// Parameter: token - The JWT to be verified
// The function attempts to verify the token using the secret key (JWT_SECRET).
// If the token is valid, it returns the decoded token payload.
// If the token is invalid, it logs an error and throws an exception.
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error("Invalid token", error);
    throw new Error("Invalid token");
  }
};
