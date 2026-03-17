export const useApiClient = () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBase;

  const getHeaders = () => {
    const token = localStorage.getItem('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  return {
    get: <T>(path: string) => $fetch<T>(path, { baseURL, headers: getHeaders() }),
    post: <T>(path: string, body: any) =>
      $fetch<T>(path, { baseURL, method: 'POST', body, headers: getHeaders() }),
    auth: {
      signup: (email: string, password: string, role?: string) =>
        $fetch('/api/auth/signup', { baseURL, method: 'POST', body: { email, password, role } }),
      login: (email: string, password: string) =>
        $fetch('/api/auth/login', { baseURL, method: 'POST', body: { email, password } }),
      logout: () =>
        $fetch('/api/auth/logout', { baseURL, method: 'POST', headers: getHeaders() }),
      me: () =>
        $fetch('/api/auth/me', { baseURL, headers: getHeaders() })
    }
  };
};
