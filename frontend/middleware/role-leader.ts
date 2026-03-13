export default defineNuxtRouteMiddleware(async () => {
  const role = await useUserRole();
  if (role !== 'leader' && role !== 'admin') {
    return navigateTo('/dashboard');
  }
});
