import { ref, computed } from 'vue';
import type { GpsStatus } from '~/types/gps';

export type Poi = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  messages: Record<string, string>; // lang -> text
  longMessages?: Record<string, string>; // optional extended script
};

type Options = {
  language?: string; // BCP-47, default 'en-US'
  radiusMeters?: number; // trigger radius
  repeat?: boolean; // allow repeat announcements
  voice?: string; // preferred voice name
  markAnnounced?: boolean; // whether to mark as delivered when forcing
  gapMs?: number; // pause between simulated clips
  useLongForm?: boolean; // choose long script when available
};

const haversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371000; // m
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export function useAudioGuide() {
  const isSupported = computed(
    () => process.client && typeof navigator !== 'undefined' && !!navigator.geolocation && 'speechSynthesis' in window
  );

  const active = ref(false);
  const mode = ref<'idle' | 'gps' | 'simulation'>('idle');
  const currentPosition = ref<{ lat: number; lng: number } | null>(null);
  const lastAnnouncement = ref<{ poiId: string; text: string } | null>(null);
  const error = ref<string | null>(null);
  const gpsStatus = ref<GpsStatus>('idle');

  let watchId: number | null = null;
  let simulationTimer: ReturnType<typeof setTimeout> | null = null;
  const announced = new Set<string>();

  const resolveText = (poi: Poi, lang: string, useLong?: boolean) => {
    if (useLong && poi.longMessages && (poi.longMessages[lang] || poi.longMessages['en-US'])) {
      return poi.longMessages[lang] || poi.longMessages['en-US']!;
    }
    return poi.messages[lang] || poi.messages['en-US'] || poi.name;
  };

  const speak = (text: string, lang: string, voiceName?: string, onEnd?: () => void) => {
    if (!process.client || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.97; // 약간 느리게 해 자연스러운 연결
    if (voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find((v) => v.name === voiceName);
      if (preferred) utterance.voice = preferred;
    }
    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    if (watchId !== null && process.client && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }
    if (simulationTimer) {
      clearTimeout(simulationTimer);
      simulationTimer = null;
    }
    active.value = false;
    mode.value = 'idle';
    if (gpsStatus.value === 'ok' || gpsStatus.value === 'checking' || gpsStatus.value === 'idle') {
      gpsStatus.value = 'idle';
    }
  };

  const checkGps = async () => {
    error.value = null;
    if (!isSupported.value) {
      gpsStatus.value = 'unsupported';
      error.value = '현재 브라우저에서는 GPS 또는 음성 합성이 지원되지 않습니다.';
      return;
    }
    gpsStatus.value = 'checking';
    return new Promise<void>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          gpsStatus.value = 'ok';
          currentPosition.value = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          resolve();
        },
        (err) => {
          gpsStatus.value = err.code === err.PERMISSION_DENIED ? 'denied' : 'error';
          error.value = err.message;
          resolve();
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 8000 }
      );
    });
  };

  const start = (pois: Poi[], opts: Options = {}) => {
    error.value = null;
    if (!isSupported.value) {
      error.value = 'GPS 또는 TTS를 사용할 수 없습니다. 브라우저 권한을 확인하세요.';
      return;
    }
    stop(); // 기존 시뮬레이션/워치 종료 후 시작
    gpsStatus.value = 'checking';
    const radius = opts.radiusMeters ?? 200;
    const lang = opts.language || 'en-US';
    const allowRepeat = opts.repeat ?? false;
    const voiceName = opts.voice;
    const useLong = opts.useLongForm ?? false;

    if (allowRepeat) announced.clear();

    watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        currentPosition.value = { lat: latitude, lng: longitude };
        gpsStatus.value = 'ok';

        for (const poi of pois) {
          const distance = haversine(latitude, longitude, poi.lat, poi.lng);
          if (distance <= radius && (allowRepeat || !announced.has(poi.id))) {
            const text = resolveText(poi, lang, useLong);
            speak(text, lang, voiceName);
            lastAnnouncement.value = { poiId: poi.id, text };
            announced.add(poi.id);
            break;
          }
        }
      },
      (err) => {
        gpsStatus.value = err.code === err.PERMISSION_DENIED ? 'denied' : 'error';
        error.value = err.message;
        stop();
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );

    active.value = true;
    mode.value = 'gps';
  };

  const forcePlay = (poi: Poi, opts: Options = {}) => {
    const lang = opts.language || 'en-US';
    const voiceName = opts.voice;
    const text = resolveText(poi, lang, opts.useLongForm);
    speak(text, lang, voiceName);
    lastAnnouncement.value = { poiId: poi.id, text };
    if (opts.markAnnounced !== false) {
      announced.add(poi.id);
    }
  };

  const startSimulation = (pois: Poi[], opts: Options = {}) => {
    stop();
    if (!pois.length) return;
    const lang = opts.language || 'en-US';
    const voiceName = opts.voice;
    const useLong = opts.useLongForm ?? false;
    const gap = opts.gapMs ?? 900;
    const allowRepeat = opts.repeat ?? true;
    if (allowRepeat) announced.clear();
    let idx = 0;

    const playNext = () => {
      const poi = pois[idx];
      const text = resolveText(poi, lang, useLong);
      lastAnnouncement.value = { poiId: poi.id, text };
      announced.add(poi.id);
      speak(text, lang, voiceName, () => {
        idx += 1;
        if (idx < pois.length) {
          simulationTimer = setTimeout(playNext, gap);
        } else {
          active.value = false;
          mode.value = 'idle';
        }
      });
    };

    active.value = true;
    mode.value = 'simulation';
    playNext();
  };

  return {
    isSupported,
    active,
    currentPosition,
    lastAnnouncement,
    error,
    gpsStatus,
    start,
    stop,
    checkGps,
    forcePlay,
    startSimulation,
    mode
  };
}
