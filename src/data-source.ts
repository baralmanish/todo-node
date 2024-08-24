import "reflect-metadata";
import * as dotenv from "dotenv";
import { DataSource } from "typeorm";

import { User } from "./entities/User";
import { Todo } from "./entities/Todo";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST as string,
  port: parseInt(process.env.POSTGRES_PORT as string, 10),
  username: process.env.POSTGRES_USER as string,
  password: process.env.POSTGRES_PASSWORD as string,
  database: process.env.POSTGRES_DB as string,
  synchronize: true,
  logging: true,
  entities: [User, Todo]
});
