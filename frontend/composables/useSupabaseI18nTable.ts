type TranslationRecord = Record<string, unknown> & { lang?: string };

type SupabaseI18nOptions<T> = {
  table: string;
  i18nTable: string;
  fields: Array<keyof T>;
  fallback: T[] | Ref<T[]>;
};

const pickFields = <T>(record: TranslationRecord | undefined, fields: Array<keyof T>) => {
  if (!record) return {} as Partial<T>;
  return fields.reduce((acc, key) => {
    const value = record[key as string];
    if (value !== undefined && value !== null) {
      (acc as Record<string, unknown>)[key as string] = value;
    }
    return acc;
  }, {} as Partial<T>);
};

export const useSupabaseI18nTable = <T extends Record<string, unknown>>(options: SupabaseI18nOptions<T>) => {
  const { $supabase, $supabaseReady } = useNuxtApp();
  const { lang } = useI18n();

  const getFallback = () => unref(options.fallback);
  const data = ref<T[]>(getFallback());
  const loading = ref(false);
  const error = ref<string | null>(null);
  const usingFallback = ref(true);

  const load = async () => {
    if (!$supabaseReady) return;
    loading.value = true;

    const selectFields = options.fields.join(',');
    const { data: rows, error: supabaseError } = await $supabase
      .from(options.table)
      .select(`*, ${options.i18nTable}(lang, ${selectFields})`);

    if (supabaseError) {
      error.value = supabaseError.message;
      loading.value = false;
      return;
    }

    if (rows) {
      const merged = rows.map((row: Record<string, unknown>) => {
        const translations = (row[options.i18nTable] as TranslationRecord[]) || [];
        const current = translations.find((item) => item.lang === lang.value);
        const fallback = translations.find((item) => item.lang === 'en');

        const mergedRow = {
          ...row,
          ...pickFields<T>(fallback, options.fields),
          ...pickFields<T>(current, options.fields)
        } as Record<string, unknown>;

        delete mergedRow[options.i18nTable];
        return mergedRow as T;
      });

      data.value = merged;
      usingFallback.value = false;
    }

    loading.value = false;
  };

  onMounted(load);

  watch(
    () => lang.value,
    () => {
      if (usingFallback.value) {
        data.value = getFallback();
        return;
      }
      load();
    }
  );

  return { data, loading, error, reload: load };
};
