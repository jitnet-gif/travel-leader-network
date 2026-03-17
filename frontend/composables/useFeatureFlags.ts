export const useFeatureFlags = () => {
  const flags = useState<Record<string, boolean>>('feature-flags', () => ({}));
  const loaded = useState<boolean>('feature-flags-loaded', () => false);

  const load = async () => {
    if (loaded.value) return;
    try {
      const data = await $fetch<Record<string, boolean>>('/api/admin/feature-flags');
      flags.value = data;
    } catch {
      // keep defaults (all enabled)
    }
    loaded.value = true;
  };

  const isEnabled = (key: string): boolean => flags.value[key] ?? true;

  const toggle = async (key: string, enabled: boolean) => {
    flags.value = { ...flags.value, [key]: enabled };
    await $fetch('/api/admin/feature-flags', {
      method: 'POST',
      body: { key, enabled },
    });
  };

  return { flags, load, isEnabled, toggle };
};
