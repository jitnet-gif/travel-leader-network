type AuthUser = {
  id: string;
  email: string;
  role: 'tour_leader' | 'agency' | 'admin';
  avatar?: string;
};

const authUser = ref<AuthUser | null>(null);
const authLoading = ref(true);
let initialized = false;

export const useAuth = () => {
  const supabase = useNuxtApp().$supabase;

  const resolveRole = (user: any): 'tour_leader' | 'agency' | 'admin' => {
    return user?.user_metadata?.role || user?.app_metadata?.role || 'tour_leader';
  };

  const resolveAvatar = (user: any) => user?.user_metadata?.avatar_url || user?.user_metadata?.avatar || undefined;

  const init = () => {
    if (initialized || !process.client) return;
    initialized = true;

    supabase.auth.getSession().then(({ data }: any) => {
      const u = data?.session?.user ?? null;
      if (u) {
        authUser.value = { id: u.id, email: u.email, role: resolveRole(u), avatar: resolveAvatar(u) };
      } else {
        authUser.value = null;
      }
      authLoading.value = false;
    });

    supabase.auth.onAuthStateChange((_event: string, session: any) => {
      const u = session?.user ?? null;
      if (u) {
        authUser.value = { id: u.id, email: u.email, role: resolveRole(u), avatar: resolveAvatar(u) };
      } else {
        authUser.value = null;
      }
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
