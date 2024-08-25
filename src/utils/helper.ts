import { User } from "../entities/User";

// Function to remove sensitive information (password) from a User object
export const removePasswordFromUser = (user: User) => {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username
    // Note: The password property is intentionally omitted to ensure sensitive information is not exposed
  };
};
