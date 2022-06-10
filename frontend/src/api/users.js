import { API_ROOT, createHeadersWithAuth } from ".";

export function findUser(users, id) {
  return users.find((user) => {
    return user.id === id;
  });
}

export async function getUsers(token) {
  const response = await fetch(`${API_ROOT}users/`, createHeadersWithAuth(token));
  return await response.json();
}
