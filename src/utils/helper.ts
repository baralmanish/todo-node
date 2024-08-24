import { User } from "../entities/User";

export const removePasswordFromUser = (user: User) => {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username
  };
};
