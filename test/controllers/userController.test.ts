import bcrypt from "bcryptjs";
import { Request, Response } from "express";

import { mockRequest, mockResponse } from "../mocks";
import { generateToken } from "../../src/utils/auth";
import UserService from "../../src/services/userService";
import * as userController from "../../src/controllers/userController";

jest.mock("../../src/services/userService");

jest.mock("../../src/utils/auth", () => ({
  generateToken: jest.fn()
}));

describe("UserController", () => {
  it("should register a new user and return status 201", async () => {
    const userData = {
      firstName: "Demo",
      lastName: "User",
      username: "demo_user",
      password: "password123"
    };

    const req = mockRequest();
    req.body = userData;
    const res = mockResponse();

    const getUserByUsernameMock = jest.mocked(UserService.getUserByUsername);
    getUserByUsernameMock.mockResolvedValue(null);

    const createUserMock = jest.mocked(UserService.createUser);

    createUserMock.mockResolvedValue({ ...userData, id: 1 });

    await userController.register(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      firstName: userData.firstName,
      lastName: userData.lastName,
      username: userData.username
    });
  });

  it("should return status 400 if username already exists", async () => {
    const userData = {
      firstName: "Existing",
      lastName: "User",
      username: "existing_user",
      password: "password123"
    };
    const req = mockRequest();
    req.body = userData;
    const res = mockResponse();

    const getUserByUsernameMock = jest.mocked(UserService.getUserByUsername);
    getUserByUsernameMock.mockResolvedValue({ ...userData, id: 1 });

    await userController.register(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Username already exists" });
  });

  it("should login with valid credentials and return status 200 with a token", async () => {
    const userData = {
      firstName: "Valid",
      lastName: "User",
      username: "valid_user",
      password: "password123"
    };

    const req = mockRequest();
    req.body = userData;
    const res = mockResponse();

    const getUserByUsernameMock = jest.mocked(UserService.getUserByUsername);
    getUserByUsernameMock.mockResolvedValue({ ...userData, id: 1 });

    // Mock bcrypt compare method
    (jest.spyOn(bcrypt, "compare") as jest.Mock).mockResolvedValue(true);

    jest.mocked(generateToken).mockReturnValue("mocked-token");

    await userController.login(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ token: "mocked-token" });
  });

  it("should return status 401 if credentials are invalid", async () => {
    const userData = {
      firstName: "Valid",
      lastName: "User",
      username: "valid_user",
      password: "wrongPassword"
    };

    const req = mockRequest();
    req.body = userData;
    const res = mockResponse();

    const getUserByUsernameMock = jest.mocked(UserService.getUserByUsername);
    getUserByUsernameMock.mockResolvedValue({ ...userData, id: 1, password: "hashedPassword" });

    (jest.spyOn(bcrypt, "compare") as jest.Mock).mockResolvedValue(false);

    await userController.login(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
  });

  it("should return status 500 if an error occurs", async () => {
    const req = mockRequest();
    const res = mockResponse();

    const getUserByUsernameMock = jest.mocked(UserService.getUserByUsername);
    getUserByUsernameMock.mockRejectedValue(new Error("Something went wrong"));

    await userController.register(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Something went wrong" });
  });
});
