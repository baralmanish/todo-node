import { Response } from "express";

import { IAuthInfoRequest } from "../authRequest";
import TodoService from "../services/todoService";

// Handler for GET /api/todo
// Retrieves all todo items for the authenticated user
export const getTodo = async (req: IAuthInfoRequest, res: Response) => {
  // Extract user ID from request (assumed to be added by authentication middleware)
  const userId = req.userId!;

  try {
    // Fetch todo items for the user from the TodoService
    const todo = await TodoService.getTodoByUser(userId);

    // Respond with the todo items and HTTP status 200 (OK)
    return res.status(200).json(todo);
  } catch (error) {
    // Handle errors: respond with HTTP status 500 (Internal Server Error) and error message
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "An unknown error occurred" });
  }
};

// Handler for POST /api/todo
// Creates a new todo item for the authenticated user
export const createTodo = async (req: IAuthInfoRequest, res: Response) => {
  // Extract title from request body and user ID from request (assumed to be added by authentication middleware)
  const { title } = req.body;
  const userId = req.userId!;

  try {
    // Create a new todo item using TodoService
    const todo = await TodoService.createTodo(userId, title);

    // Respond with the created todo item and HTTP status 201 (Created)
    return res.status(201).json(todo);
  } catch (error) {
    // Handle errors: respond with HTTP status 500 (Internal Server Error) and error message
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "An unknown error occurred" });
  }
};

// Handler for PUT /api/todo/:id
// Updates an existing todo item for the authenticated user
export const updateTodo = async (req: IAuthInfoRequest, res: Response) => {
  // Extract ID from request parameters, title and isComplete from request body, and user ID from request
  const { id } = req.params;
  const { title, isComplete } = req.body;
  const userId = req.userId!;

  try {
    // Update the todo item using TodoService
    const todo = await TodoService.updateTodo(Number(id), userId, title, isComplete);

    // Respond with the updated todo item and HTTP status 200 (OK)
    return res.status(200).json(todo);
  } catch (error) {
    // Handle errors: respond with HTTP status 500 (Internal Server Error) and error message
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "An unknown error occurred" });
  }
};

// Handler for DELETE /api/todo/:id
// Deletes a todo item for the authenticated user
export const deleteTodo = async (req: IAuthInfoRequest, res: Response) => {
  // Extract ID from request parameters and user ID from request
  const { id } = req.params;
  const userId = req.userId!;

  try {
    // Delete the todo item using TodoService
    await TodoService.deleteTodo(Number(id), userId);

    // Respond with HTTP status 204 (No Content) indicating successful deletion
    return res.status(204).send();
  } catch (error) {
    // Handle errors: respond with HTTP status 500 (Internal Server Error) and error message
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "An unknown error occurred" });
  }
};
