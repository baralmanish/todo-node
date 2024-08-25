import { Response, NextFunction } from "express";

import { verifyToken } from "../utils/auth";
import { IAuthInfoRequest } from "../authRequest";

interface JwtPayload {
  id: number;
}

// Middleware function to authenticate a JWT (JSON Web Token)
export const authenticateJWT = (req: IAuthInfoRequest, res: Response, next: NextFunction) => {
  // Extract the token from the Authorization header, removing the "Bearer " prefix
  const token = req.header("Authorization")?.replace("Bearer ", "");

  // If no token is provided, return a 401 Unauthorized response
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify and decode the token to extract the user ID (JwtPayload)
    const decoded = verifyToken(token) as JwtPayload;

    // Attach the user ID to the request object for use in subsequent middleware/routes
    req.userId = decoded.id;

    // Proceed to the next middleware or route handler
    next();
  } catch (_err) {
    // If token verification fails, return a 401 Unauthorized response
    return res.status(401).json({ message: "Invalid token" });
  }
};
