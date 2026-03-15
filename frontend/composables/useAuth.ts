type AuthUser = {
  id: string;
  email: string;
  role: 'tour_leader' | 'agency' | 'admin';
};

const authUser = ref<AuthUser | null>(null);
const authLoading = ref(true);
let initialized = false;

export const useAuth = () => {
  const supabase = useSupabase();

  const resolveRole = (user: any): 'tour_leader' | 'agency' | 'admin' => {
    return user?.user_metadata?.role || user?.app_metadata?.role || 'tour_leader';
  };

  const init = () => {
    if (initialized || !process.client) return;
    initialized = true;

    supabase.auth.getSession().then(({ data }: any) => {
      const u = data?.session?.user ?? null;
      authUser.value = u ? { id: u.id, email: u.email, role: resolveRole(u) } : null;
      authLoading.value = false;
    });

    supabase.auth.onAuthStateChange((_event: string, session: any) => {
      const u = session?.user ?? null;
      authUser.value = u ? { id: u.id, email: u.email, role: resolveRole(u) } : null;
      authLoading.value = false;
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    authUser.value = null;
    initialized = false;
    await navigateTo('/login');
  };

  return { user: authUser, loading: authLoading, init, signOut };
};
