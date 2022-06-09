import { API_ROOT, createHeadersWithAuth } from ".";

export async function getPosts(token) {
  const response = await fetch(`${API_ROOT}posts/`, createHeadersWithAuth(token));
  return await response.json();
}

export async function createPost(token, content) {
  const response = await fetch(`${API_ROOT}posts/`, {
    ...createHeadersWithAuth(token, true),
    body: JSON.stringify({ content }),
    method: 'POST',
  });
  return await response.json();
}
