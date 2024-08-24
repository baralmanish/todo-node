import { todoRepositoryMock } from "../__mocks__/todoRepositoryMock";
import { userRepositoryMock } from "../__mocks__/userRepositoryMock";

import { Todo } from "../../src/entities/Todo";
import { User } from "../../src/entities/User";
import TodoService from "../../src/services/todoService";

jest.mock("../../src/data-source", () => ({
  AppDataSource: {
    getRepository: jest.fn((entity) => {
      if (entity === Todo) return todoRepositoryMock;
      if (entity === User) return userRepositoryMock;
    })
  }
}));

describe("TodoService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new todo for an existing user", async () => {
    const userId = 1;
    const title = "New Todo";
    const user = { id: userId } as User;

    userRepositoryMock.findOne.mockResolvedValue(user);

    const newTodo = { id: 1, user, title } as Todo;
    todoRepositoryMock.save.mockResolvedValue(newTodo);

    const todo = await TodoService.createTodo(userId, title);

    expect(userRepositoryMock.findOne).toHaveBeenCalledWith({ where: { id: userId } });
    expect(todoRepositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({
        user,
        title
      })
    );
    expect(todo).toEqual(newTodo);
  });

  it("should handle errors when user is not found", async () => {
    const userId = 1;
    const title = "New Todo";

    userRepositoryMock.findOne.mockResolvedValue(null);

    await expect(TodoService.createTodo(userId, title)).rejects.toThrow("User not found");
  });

  it("should update an existing todo", async () => {
    const userId = 1;
    const todoId = 1;
    const title = "Updated Todo";
    const isComplete = true;

    const existingTodo = { id: todoId, user: { id: userId } } as Todo;
    todoRepositoryMock.findOne.mockResolvedValue(existingTodo);

    const updatedTodo = { ...existingTodo, title, isComplete };
    todoRepositoryMock.save.mockResolvedValue(updatedTodo);

    const todo = await TodoService.updateTodo(todoId, userId, title, isComplete);

    expect(todoRepositoryMock.findOne).toHaveBeenCalledWith({ where: { id: todoId, user: { id: userId } } });
    expect(todoRepositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({
        title,
        isComplete
      })
    );
    expect(todo).toEqual(updatedTodo);
  });

  it("should handle errors when todo to update is not found", async () => {
    const userId = 1;
    const todoId = 1;

    todoRepositoryMock.findOne.mockResolvedValue(null);

    await expect(TodoService.updateTodo(todoId, userId)).rejects.toThrow("Todo not found");
  });

  it("should delete an existing todo", async () => {
    const userId = 1;
    const todoId = 1;

    const existingTodo = { id: todoId, user: { id: userId } } as Todo;
    todoRepositoryMock.findOne.mockResolvedValue(existingTodo);

    todoRepositoryMock.remove.mockResolvedValue(existingTodo);

    await TodoService.deleteTodo(todoId, userId);

    expect(todoRepositoryMock.findOne).toHaveBeenCalledWith({ where: { id: todoId, user: { id: userId } } });
    expect(todoRepositoryMock.remove).toHaveBeenCalledWith(existingTodo);
  });

  it("should handle errors when todo to delete is not found", async () => {
    const userId = 1;
    const todoId = 1;

    todoRepositoryMock.findOne.mockResolvedValue(null);

    await expect(TodoService.deleteTodo(todoId, userId)).rejects.toThrow("Todo not found");
  });

  it("should retrieve todo by user ID", async () => {
    const userId = 1;
    const todo = [{ id: 1, user: { id: userId }, title: "Todo 1" }] as Todo[];

    todoRepositoryMock.find.mockResolvedValue(todo);

    const result = await TodoService.getTodoByUser(userId);

    expect(todoRepositoryMock.find).toHaveBeenCalledWith({ where: { user: { id: userId } } });
    expect(result).toEqual(todo);
  });
});
