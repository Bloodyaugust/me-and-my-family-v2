export const API_ROOT = process.env.REACT_APP_API_ROOT;

export function createHeadersWithAuth(token, jsonBody = false) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      ...(jsonBody && { 'Content-Type': 'application/json' }),
    },
  };
}
