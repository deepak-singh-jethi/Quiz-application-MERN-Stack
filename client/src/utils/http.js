import { QueryClient } from "@tanstack/react-query";
export const queryClient = new QueryClient();

export async function authorizedFetcher({ signal, URL, token }) {
  const response = await fetch(
    URL,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    { signal }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  const { data } = await response.json();
  return data;
}
