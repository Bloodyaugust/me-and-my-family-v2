import { API_ROOT, createHeadersWithAuth } from ".";

export async function getPosts(token) {
  const response = await fetch(`${API_ROOT}posts/`, createHeadersWithAuth(token));
  return await response.json();
}

export async function createPost(token, formData) {
  const response = await fetch(`${API_ROOT}posts/`, {
    ...createHeadersWithAuth(token, false),
    body: formData,
    method: 'POST',
  });
  return await response.json();
}
