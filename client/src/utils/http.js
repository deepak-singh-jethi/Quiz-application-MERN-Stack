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
export async function authorizedUpdater({ URL, body, token }) {
  const response = await fetch(URL, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    console.log("error");
    const error = await response.json();
    throw new Error(error.message);
  }

  const { data } = await response.json();

  return data;
}
export async function authorizedRemover({ URL, token }) {
  const response = await fetch(URL, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  const { data } = await response.json();

  return data;
}
export async function authorizedCreator({ URL, body, token }) {
  const response = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  const { data } = await response.json();

  return data;
}
