import { User } from "../../entities/User";
import { AppDataSource } from "../../data-source";
import UserService from "../../services/userService";

async function seed() {
  const connection = await AppDataSource.initialize();

  const user = {
    firstName: "Demo",
    lastName: "User",
    username: "demo_user",
    password: "password123"
  } as User;
  await UserService.createUser(user);

  await connection.destroy();
}

seed().catch((error) => console.log(error));
