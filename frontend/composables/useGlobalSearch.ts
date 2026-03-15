/**
 * Shared search query across Navbar and all pages.
 * useState ensures SSR-safe global state within a single request,
 * and reactive sharing across components on the client.
 */
export const useGlobalSearch = () => {
  const query = useState<string>('globalSearch', () => '');

  // Auto-clear when navigating to a new page
  const route = useRoute();
  watch(() => route.path, () => {
    query.value = '';
  });

  return query;
};
