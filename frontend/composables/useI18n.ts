import en from '@/locales/en';
import ko from '@/locales/ko';

type Locale = 'en' | 'ko';

type MessageValue = string | Record<string, unknown> | Array<unknown>;

type MessageMap = Record<string, MessageValue>;

const messages: Record<Locale, MessageMap> = { en, ko };

const getMessage = (locale: Locale, key: string): MessageValue | undefined => {
  return key.split('.').reduce<MessageValue | undefined>((acc, part) => {
    if (!acc || typeof acc !== 'object') return undefined;
    return (acc as Record<string, MessageValue>)[part];
  }, messages[locale]);
};

const interpolate = (value: string, params?: Record<string, string | number>) => {
  if (!params) return value;
  return value.replace(/\{\{(\w+)\}\}/g, (_, key: string) => String(params[key] ?? ''));
};

export const useI18n = () => {
  const lang = useState<Locale>('tln-lang', () => 'en');

  const applyLang = () => {
    if (!process.client) return;
    document.documentElement.lang = lang.value;
  };

  const init = () => {
    if (!process.client) return;
    const saved = localStorage.getItem('tln-lang');
    if (saved === 'en' || saved === 'ko') {
      lang.value = saved;
    }
    applyLang();
  };

  const setLang = (value: Locale) => {
    lang.value = value;
    if (process.client) {
      localStorage.setItem('tln-lang', value);
      applyLang();
    }
  };

  const toggleLang = () => setLang(lang.value === 'en' ? 'ko' : 'en');

  const t = (key: string, params?: Record<string, string | number>) => {
    const current = getMessage(lang.value, key);
    const fallback = getMessage('en', key);
    const value = (current ?? fallback ?? key) as MessageValue;
    if (typeof value !== 'string') return key;
    return interpolate(value, params);
  };

  const ta = <T = string>(key: string): T[] => {
    const current = getMessage(lang.value, key);
    const fallback = getMessage('en', key);
    const value = (current ?? fallback ?? []) as MessageValue;
    return Array.isArray(value) ? (value as T[]) : [];
  };

  return {
    lang,
    init,
    setLang,
    toggleLang,
    t,
    ta
  };
};
