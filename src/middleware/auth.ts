import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/auth";

interface JwtPayload {
  userId: number;
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = verifyToken(token) as JwtPayload;
    req.userId = decoded.userId;
    next();
  } catch (_err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
