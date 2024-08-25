import "reflect-metadata";
import * as dotenv from "dotenv";
import { DataSource } from "typeorm";

import { User } from "./entities/User";
import { Todo } from "./entities/Todo";

// Load environment variables from a .env file into process.env
dotenv.config();

// Create and export a TypeORM DataSource instance for connecting to the PostgreSQL database
export const AppDataSource = new DataSource({
  type: "postgres", // Type of database being used (PostgreSQL)
  host: process.env.POSTGRES_HOST as string, // Hostname of the PostgreSQL server
  port: parseInt(process.env.POSTGRES_PORT as string, 10), // Port number of the PostgreSQL server
  username: process.env.POSTGRES_USER as string, // Username for database authentication
  password: process.env.POSTGRES_PASSWORD as string, // Password for database authentication
  database: process.env.POSTGRES_DB as string, // Name of the database to connect to
  synchronize: true, // Automatically create database schema based on entities (useful for development)
  logging: true, // Enable SQL query logging for debugging
  entities: [User, Todo] // List of entity classes to be managed by TypeORM
});
