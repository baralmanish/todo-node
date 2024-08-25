import bcrypt from "bcryptjs";

import { User } from "../entities/User";
import { AppDataSource } from "../data-source";

class UserService {
  // Repository for accessing User entities
  private userRepository = AppDataSource.getRepository(User);

  // Method to create a new user
  async createUser(requestedUser: User) {
    try {
      // Hash the user's password before storing it in the database
      const hashedPassword = await bcrypt.hash(requestedUser.password, 10);

      // Create a new User instance and set its properties
      const user = new User();
      user.firstName = requestedUser.firstName;
      user.lastName = requestedUser.lastName;
      user.username = requestedUser.username;
      user.password = hashedPassword;

      // Save the new user to the database
      await this.userRepository.save(user);

      // Return the newly created user
      return user;
    } catch (_error) {
      // Handle errors by throwing a new Error with a message
      throw new Error("Failed to create user");
    }
  }

  // Method to retrieve a user by their ID
  async getUserById(id: number) {
    try {
      // Find the user by ID
      return await this.userRepository.findOne({ where: { id } });
    } catch (_error) {
      // Handle errors by throwing a new Error with a message
      throw new Error("Failed to retrieve user by ID");
    }
  }

  async getUserByUsername(username: string) {
    try {
      // Find the user by username
      return await this.userRepository.findOne({ where: { username } });
    } catch (_error) {
      // Handle errors by throwing a new Error with a message
      throw new Error("Failed to retrieve user by username");
    }
  }
}

export default new UserService();
