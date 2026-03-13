export const useApiClient = () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBase;

  return {
    get: <T>(path: string) => $fetch<T>(path, { baseURL }),
    post: <T>(path: string, body: unknown) =>
      $fetch<T>(path, { baseURL, method: 'POST', body })
  };
};
