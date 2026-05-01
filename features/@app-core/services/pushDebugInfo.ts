export type PushDebugInfoState = {
  token: string | null;
  registrationError: string | null;
  projectId: string | null;
  permissionStatus: string | null;
  updatedAt: string | null;
};

const state: PushDebugInfoState = {
  token: null,
  registrationError: null,
  projectId: null,
  permissionStatus: null,
  updatedAt: null,
};

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function getPushDebugInfoSnapshot(): PushDebugInfoState {
  return state;
}

export function subscribePushDebugInfo(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function setPushDebugInfo(nextState: Partial<PushDebugInfoState>) {
  Object.assign(state, nextState, {
    updatedAt: new Date().toISOString(),
  });
  notify();
}
