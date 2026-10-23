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
