import bcrypt from "bcryptjs";

import { User } from "../entities/User";
import { AppDataSource } from "../data-source";

class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async createUser(requestedUser: User) {
    try {
      const hashedPassword = await bcrypt.hash(requestedUser.password, 10);
      const user = new User();
      user.firstName = requestedUser.firstName;
      user.lastName = requestedUser.lastName;
      user.username = requestedUser.username;
      user.password = hashedPassword;

      await this.userRepository.save(user);

      return user;
    } catch (_error) {
      throw new Error("Failed to create user");
    }
  }

  async getUserById(id: number) {
    try {
      return await this.userRepository.findOne({ where: { id } });
    } catch (_error) {
      throw new Error("Failed to retrieve user by ID");
    }
  }

  async getUserByUsername(username: string) {
    try {
      return await this.userRepository.findOne({ where: { username } });
    } catch (_error) {
      throw new Error("Failed to retrieve user by username");
    }
  }
}

export default new UserService();
