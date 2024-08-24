import { Response, NextFunction } from "express";

import { verifyToken } from "../utils/auth";
import { IAuthInfoRequest } from "../authRequest";

interface JwtPayload {
  id: number;
}

export const authenticateJWT = (req: IAuthInfoRequest, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = verifyToken(token) as JwtPayload;
    req.userId = decoded.id;
    next();
  } catch (_err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
