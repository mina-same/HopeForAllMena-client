import { QueryClient } from '@tanstack/react-query';

// Shared cache for API data: switching admin sections reuses recent results
// instead of refetching everything on every visit.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // data is reused for 1 minute without refetching
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Loads an admin list through the cache. Returns cached data when it is fresh,
// otherwise runs `fetcher` (which must return the parsed data or throw).
export const cachedGet = (key, fetcher) =>
  queryClient.fetchQuery({ queryKey: ['admin', ...key], queryFn: fetcher, retry: false });

// Drop-in replacement for `fetch` on JSON list loads: returns a Response-like
// object so existing `response.ok` / `response.json()` code keeps working.
export const cachedFetch = async (key, url, options) => {
  try {
    const data = await cachedGet(key, async () => {
      const response = await fetch(url, options);
      if (!response.ok) {
        const error = new Error(`Request failed with status ${response.status}`);
        error.status = response.status;
        error.body = await response.text();
        throw error;
      }
      return response.json();
    });
    return { ok: true, status: 200, json: async () => data, text: async () => JSON.stringify(data) };
  } catch (error) {
    if (!error.status) throw error;
    return { ok: false, status: error.status, json: async () => JSON.parse(error.body || '{}'), text: async () => error.body || '' };
  }
};

// Any successful write (POST/PUT/PATCH/DELETE) can change what lists show,
// so mark all cached data stale; the next read fetches fresh data.
export const invalidateAfterWrite = (method) => {
  if (method && method.toUpperCase() !== 'GET') {
    queryClient.invalidateQueries();
  }
};

// Most admin screens call the API with window.fetch directly; hook it once so
// every successful write invalidates the cache without touching each handler.
export const installWriteInvalidation = () => {
  if (typeof window === 'undefined' || window.__queryCacheWriteHook) return;
  window.__queryCacheWriteHook = true;
  const originalFetch = window.fetch.bind(window);
  window.fetch = async (input, init = {}) => {
    const response = await originalFetch(input, init);
    const method = init.method || (typeof input === 'object' && input.method) || 'GET';
    if (response.ok) invalidateAfterWrite(method);
    return response;
  };
};
