export default defineNuxtRouteMiddleware(async () => {
  const { $supabase } = useNuxtApp();
  const { data } = await $supabase.auth.getUser();
  const role = data?.user?.user_metadata?.role || data?.user?.app_metadata?.role;
  if (role !== 'admin') {
    return navigateTo('/login');
  }
});
