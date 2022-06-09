import { API_ROOT } from ".";

export async function login(email) {
  const response = await fetch(`${API_ROOT}login?email=${email}`);
  const data = await response.json();

  return {
    response,
    data,
  };
}

export async function getCurrentUser(token) {
  const response = await fetch(`${API_ROOT}users/current`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
}
