import * as dotenv from "dotenv";

// Load environment variables from a .env file into process.env
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET as string;
