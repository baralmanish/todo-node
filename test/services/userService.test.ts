import { userRepositoryMock } from "../__mocks__/userRepositoryMock";

import bcrypt from "bcryptjs";
import { User } from "../../src/entities/User";
import UserService from "../../src/services/userService";

jest.mock("../../src/data-source", () => ({
  AppDataSource: {
    getRepository: jest.fn().mockReturnValue(userRepositoryMock)
  }
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn()
}));

describe("UserService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new user with a hashed password", async () => {
    const hashedPassword = "hashedPassword";

    const userData = {
      firstName: "Demo",
      lastName: "User",
      username: "demo_user",
      password: "password123"
    } as User;

    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

    const user = await UserService.createUser(userData);

    expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);

    expect(userRepositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({
        username: userData.username,
        password: hashedPassword
      })
    );

    expect(user).toMatchObject({ username: userData.username, password: hashedPassword });
  });

  it("should retrieve a user by ID", async () => {
    const user = {
      id: 1,
      firstName: "Existing",
      lastName: "User",
      username: "existing_user",
      password: "hashedPassword"
    } as User;

    userRepositoryMock.findOne.mockResolvedValue(user);

    const retrievedUser = await UserService.getUserById(user.id);

    expect(userRepositoryMock.findOne).toHaveBeenCalledWith({ where: { id: user.id } });
    expect(retrievedUser).toEqual(user);
  });

  it("should retrieve a user by username", async () => {
    const user = {
      id: 1,
      firstName: "Existing",
      lastName: "User",
      username: "existing_user",
      password: "hashedPassword"
    } as User;

    userRepositoryMock.findOne.mockResolvedValue(user);

    const retrievedUser = await UserService.getUserByUsername(user.username);

    expect(userRepositoryMock.findOne).toHaveBeenCalledWith({ where: { username: user.username } });
    expect(retrievedUser).toEqual(user);
  });

  it("should handle errors when creating a user", async () => {
    const userData = {
      firstName: "Demo",
      lastName: "User",
      username: "new_user",
      password: "password123"
    } as User;

    // assuming the hashing of the password fails
    (bcrypt.hash as jest.Mock).mockRejectedValue(new Error("Hashing Failed"));

    await expect(UserService.createUser(userData)).rejects.toThrow("Failed to create user");
  });

  it("should handle errors when retrieving a user by ID", async () => {
    const userId = 1;

    // assuming there is not user with id: 1
    userRepositoryMock.findOne.mockRejectedValue(new Error("Failed to retrieve user by ID"));

    await expect(UserService.getUserById(userId)).rejects.toThrow("Failed to retrieve user by ID");
  });

  it("should handle errors when retrieving a user by username", async () => {
    const username = "non_existent_user";

    // assuming there is not user with username: "non_existent_user"
    userRepositoryMock.findOne.mockRejectedValue(new Error("Failed to retrieve user by username"));

    await expect(UserService.getUserByUsername(username)).rejects.toThrow("Failed to retrieve user by username");
  });
});
