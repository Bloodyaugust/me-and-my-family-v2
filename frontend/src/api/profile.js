import { API_ROOT, createHeadersWithAuth } from ".";

export async function getProfile(token, id) {
  const response = await fetch(`${API_ROOT}profile/${id}`, createHeadersWithAuth(token));
  return await response.json();
}
