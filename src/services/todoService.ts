import { Todo } from "../entities/Todo";
import { User } from "../entities/User";
import { AppDataSource } from "../data-source";

class TodoService {
  private userRepository = AppDataSource.getRepository(User);
  private todoRepository = AppDataSource.getRepository(Todo);

  async getTodoByUser(userId?: number) {
    if (userId) {
      return this.todoRepository.find({ where: { user: { id: userId } } });
    }

    return this.todoRepository.find();
  }

  async createTodo(userId: number, title: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error("User not found");
    }

    const todo = new Todo();
    todo.user = user;
    todo.title = title;
    return this.todoRepository.save(todo);
  }

  async updateTodo(id: number, userId: number, title?: string, isComplete?: boolean) {
    const todo = await this.todoRepository.findOne({ where: { id, user: { id: userId } } });
    if (!todo) {
      throw new Error("Todo not found");
    }

    if (title !== undefined) todo.title = title;
    if (isComplete !== undefined) todo.isComplete = isComplete;

    return this.todoRepository.save(todo);
  }

  async deleteTodo(id: number, userId: number) {
    const todo = await this.todoRepository.findOne({ where: { id, user: { id: userId } } });
    if (!todo) {
      throw new Error("Todo not found");
    }

    return this.todoRepository.remove(todo);
  }
}

export default new TodoService();
