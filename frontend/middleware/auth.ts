export default defineNuxtRouteMiddleware(async () => {
  const supabase = useSupabase();
  const { data } = await supabase.auth.getSession();
  if (!data.session) {
    return navigateTo('/login');
  }
});
