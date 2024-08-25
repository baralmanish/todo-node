import { Todo } from "../entities/Todo";
import { User } from "../entities/User";
import { AppDataSource } from "../data-source";
import { removePasswordFromUser } from "../utils/helper";

class TodoService {
  // Repositories for accessing User and Todo entities
  private userRepository = AppDataSource.getRepository(User);
  private todoRepository = AppDataSource.getRepository(Todo);

  // Method to retrieve todo items by user ID
  async getTodoByUser(userId?: number) {
    let todoRes = await this.todoRepository.find();

    // If userId is provided, filter todos by user ID and order them by descending ID
    if (userId) {
      todoRes = await this.todoRepository.find({
        where: { user: { id: userId } },
        order: { id: "DESC" }
      });
    }

    // Return todos with the user password removed
    return todoRes.map((todo) => {
      return {
        ...todo,
        user: removePasswordFromUser(todo.user) // Remove sensitive user data
      };
    });
  }

  // Method to create a new todo item
  async createTodo(userId: number, title: string) {
    // Fetch user by user ID
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      // Throw an error if user is not found
      throw new Error("User not found");
    }

    // Create a new Todo instance and set its properties
    const todo = new Todo();
    todo.user = user;
    todo.title = title;

    // Save the new todo item to the database
    const todoRes = await this.todoRepository.save(todo);

    // Return the newly created todo item with the user password removed
    return {
      ...todoRes,
      user: removePasswordFromUser(todoRes.user) // Remove sensitive user data
    };
  }

  // Method to update an existing todo item
  async updateTodo(id: number, userId: number, title?: string, isComplete?: boolean) {
    // Find the todo item by ID and user ID
    const todo = await this.todoRepository.findOne({ where: { id, user: { id: userId } } });
    if (!todo) {
      // Throw an error if todo item is not found
      throw new Error("Todo not found");
    }

    // Update the todo item properties if provided
    if (title !== undefined) todo.title = title;
    if (isComplete !== undefined) todo.isComplete = isComplete;

    // Save the updated todo item to the database
    const todoRes = await this.todoRepository.save(todo);

    // Return the updated todo item with the user password removed
    return {
      ...todoRes,
      user: removePasswordFromUser(todoRes.user) // Remove sensitive user data
    };
  }

  // Method to delete a todo item
  async deleteTodo(id: number, userId: number) {
    // Find the todo item by ID and user ID
    const todoRes = await this.todoRepository.findOne({ where: { id, user: { id: userId } } });
    if (!todoRes) {
      // Throw an error if todo item is not found
      throw new Error("Todo not found");
    }

    // Remove the todo item from the database
    return this.todoRepository.remove(todoRes);
  }
}

export default new TodoService();
