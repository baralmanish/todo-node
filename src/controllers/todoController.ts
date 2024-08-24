import { Response } from "express";

import { IAuthInfoRequest } from "../authRequest";
import TodoService from "../services/todoService";

export const getTodo = async (req: IAuthInfoRequest, res: Response) => {
  const userId = req.userId!;

  try {
    const todo = await TodoService.getTodoByUser(userId);
    return res.status(200).json(todo);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "An unknown error occurred" });
  }
};

export const createTodo = async (req: IAuthInfoRequest, res: Response) => {
  const { title } = req.body;
  const userId = req.userId!;

  try {
    const todo = await TodoService.createTodo(userId, title);
    return res.status(201).json(todo);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "An unknown error occurred" });
  }
};

export const updateTodo = async (req: IAuthInfoRequest, res: Response) => {
  const { id } = req.params;
  const { title, isComplete } = req.body;
  const userId = req.userId!;

  try {
    const todo = await TodoService.updateTodo(Number(id), userId, title, isComplete);
    return res.status(200).json(todo);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "An unknown error occurred" });
  }
};

export const deleteTodo = async (req: IAuthInfoRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.userId!;

  try {
    await TodoService.deleteTodo(Number(id), userId);
    return res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "An unknown error occurred" });
  }
};
