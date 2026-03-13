export default defineNuxtRouteMiddleware(async () => {
  const role = await useUserRole();
  if (role !== 'agency' && role !== 'admin') {
    return navigateTo('/dashboard');
  }
});
