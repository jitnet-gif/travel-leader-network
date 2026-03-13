export default defineNuxtRouteMiddleware(async () => {
  const role = await useUserRole();
  if (role !== 'admin') {
    return navigateTo('/dashboard');
  }
});
