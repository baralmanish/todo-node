import { Todo } from "../entities/Todo";
import { User } from "../entities/User";
import { AppDataSource } from "../data-source";
import { removePasswordFromUser } from "../utils/helper";

class TodoService {
  private userRepository = AppDataSource.getRepository(User);
  private todoRepository = AppDataSource.getRepository(Todo);

  async getTodoByUser(userId?: number) {
    let todoRes = await this.todoRepository.find();

    if (userId) {
      todoRes = await this.todoRepository.find({ where: { user: { id: userId } } });
    }

    return todoRes.map((todo) => {
      return {
        ...todo,
        user: removePasswordFromUser(todo.user)
      };
    });
  }

  async createTodo(userId: number, title: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error("User not found");
    }

    const todo = new Todo();
    todo.user = user;
    todo.title = title;
    const todoRes = await this.todoRepository.save(todo);
    return {
      ...todoRes,
      user: removePasswordFromUser(todoRes.user)
    };
  }

  async updateTodo(id: number, userId: number, title?: string, isComplete?: boolean) {
    const todo = await this.todoRepository.findOne({ where: { id, user: { id: userId } } });
    if (!todo) {
      throw new Error("Todo not found");
    }

    if (title !== undefined) todo.title = title;
    if (isComplete !== undefined) todo.isComplete = isComplete;

    const todoRes = await this.todoRepository.save(todo);
    return {
      ...todoRes,
      user: removePasswordFromUser(todoRes.user)
    };
  }

  async deleteTodo(id: number, userId: number) {
    const todoRes = await this.todoRepository.findOne({ where: { id, user: { id: userId } } });
    if (!todoRes) {
      throw new Error("Todo not found");
    }

    return this.todoRepository.remove(todoRes);
  }
}

export default new TodoService();
