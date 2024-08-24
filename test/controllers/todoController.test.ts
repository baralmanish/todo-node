import { Response } from "express";

import { Todo } from "../../src/entities/Todo";
import { User } from "../../src/entities/User";
import { mockRequest, mockResponse } from "../mocks";
import TodoService from "../../src/services/todoService";
import { IAuthInfoRequest } from "../../src/authRequest";
import * as todoController from "../../src/controllers/todoController";

jest.mock("../../src/services/todoService");

const user = {
  id: 1,
  firstName: "Demo",
  lastName: "User",
  username: "demo_user"
} as User;

describe("TodoController", () => {
  it("should create a new todo and return status 201", async () => {
    const todoData = {
      title: "Test Todo"
    };

    const req = mockRequest() as IAuthInfoRequest;
    req.body = todoData;
    req.userId = user.id;
    const res = mockResponse();

    const createTodoMock = jest.mocked(TodoService.createTodo);
    createTodoMock.mockResolvedValue({
      id: 1,
      title: todoData.title,
      isComplete: false,
      user
    } as Todo);

    await todoController.createTodo(req as IAuthInfoRequest, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      title: todoData.title,
      isComplete: false,
      user
    });
  });

  it("should update a todo and return status 200", async () => {
    const req = mockRequest() as IAuthInfoRequest;
    req.params = { id: "1" };
    req.body = { title: "Updated Todo", isComplete: true };
    req.userId = user.id;
    const res = mockResponse();

    const updateTodoMock = jest.mocked(TodoService.updateTodo);
    updateTodoMock.mockResolvedValue({
      id: 1,
      title: "Updated Todo",
      isComplete: true,
      user
    } as Todo);

    await todoController.updateTodo(req as IAuthInfoRequest, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      title: "Updated Todo",
      isComplete: true,
      user
    });
  });

  it("should delete a todo and return status 204", async () => {
    const req = mockRequest() as IAuthInfoRequest;
    req.params = { id: "1" };
    req.userId = user.id;
    const res = mockResponse();

    const deleteTodoMock = jest.mocked(TodoService.deleteTodo);
    deleteTodoMock.mockResolvedValue(undefined as unknown as Todo);

    await todoController.deleteTodo(req as IAuthInfoRequest, res as Response);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it("should return todo for a user with status 200", async () => {
    const req = mockRequest() as IAuthInfoRequest;
    req.userId = user.id;
    const res = mockResponse();

    const mockTodo: Todo[] = [
      { id: 1, title: "Todo 1", isComplete: false, user },
      { id: 2, title: "Todo 2", isComplete: true, user }
    ];

    const getTodoByUserMock = jest.mocked(TodoService.getTodoByUser);
    getTodoByUserMock.mockResolvedValue(mockTodo);

    await todoController.getTodo(req as IAuthInfoRequest, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockTodo);
  });
});
