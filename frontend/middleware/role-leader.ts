export default defineNuxtRouteMiddleware(async () => {
  const role = await useUserRole();
  if (role !== 'tour_leader' && role !== 'admin') {
    return navigateTo('/dashboard');
  }
});
