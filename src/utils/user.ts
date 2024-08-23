import jwt from "jsonwebtoken";

import { JWT_SECRET } from "./constants";

export const generateToken = (userId: number, username: string) => {
  return jwt.sign({ id: userId, username }, JWT_SECRET, { expiresIn: "1h" });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error("Invalid token", error);
    throw new Error("Invalid token");
  }
};
