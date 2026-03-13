export const useUserRole = async () => {
  const supabase = useSupabase();
  const { data } = await supabase.auth.getUser();
  const role = data?.user?.user_metadata?.role || data?.user?.app_metadata?.role || 'tour_leader';
  return role as 'tour_leader' | 'agency' | 'admin';
};
