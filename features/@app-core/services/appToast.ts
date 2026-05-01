export type AppToastPayload = {
  message: string;
  tone?: 'info' | 'error';
};

type Listener = (payload: AppToastPayload) => void;

const listeners = new Set<Listener>();
let lastShownAtByKey = new Map<string, number>();

export function subscribeToAppToast(listener: Listener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function showToast(payload: AppToastPayload) {
  for (const listener of listeners) {
    listener(payload);
  }
}

export function showToastOnce(message: string, tone: AppToastPayload['tone'] = 'error', ttlMs = 8000) {
  const key = `${tone}:${message}`;
  const now = Date.now();
  const lastShownAt = lastShownAtByKey.get(key) ?? 0;

  if (now - lastShownAt < ttlMs) {
    return;
  }

  lastShownAtByKey.set(key, now);
  showToast({ message, tone });

  if (lastShownAtByKey.size > 50) {
    lastShownAtByKey = new Map([...lastShownAtByKey.entries()].slice(-20));
  }
}
