import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

export interface ApiRequestOptions {
  method: string;
  path: string;
  params?: Record<string, unknown>;
}

export async function apiRequest<T>(options: ApiRequestOptions): Promise<T> {
  const { method, path, params } = options;

  let url = path;
  let body: string | undefined;

  if (method === 'GET' && params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          searchParams.append(key, String(value));
        }
      }
    });
    url = `${path}?${searchParams.toString()}`;
  } else if (params) {
    body = JSON.stringify(params);
  }

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}
