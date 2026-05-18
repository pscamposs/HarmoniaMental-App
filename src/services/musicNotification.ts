import {
  NativeEventEmitter,
  NativeModules,
  PermissionsAndroid,
  Platform,
} from "react-native";

type MusicNotificationAction = "previous" | "playPause" | "next";

type MusicNotificationModule = {
  update: (
    title: string,
    artist: string,
    isPlaying: boolean,
    durationSeconds: number,
    elapsedSeconds: number,
    canPrevious: boolean,
    canNext: boolean,
  ) => Promise<boolean>;
  hide: () => void;
  consumePendingActions: () => Promise<MusicNotificationAction[]>;
};

const nativeModule = NativeModules.MusicNotification as
  | MusicNotificationModule
  | undefined;

const emitter = nativeModule ? new NativeEventEmitter(nativeModule as any) : null;

function getAndroidVersion() {
  return typeof Platform.Version === "number"
    ? Platform.Version
    : Number.parseInt(String(Platform.Version), 10);
}

export async function ensureMusicNotificationPermission() {
  if (Platform.OS !== "android" || getAndroidVersion() < 33) {
    return true;
  }

  const permission = (PermissionsAndroid.PERMISSIONS as any).POST_NOTIFICATIONS;
  if (!permission) {
    return false;
  }

  const current = await PermissionsAndroid.check(permission);
  if (current) {
    return true;
  }

  const result = await PermissionsAndroid.request(permission);
  return result === PermissionsAndroid.RESULTS.GRANTED;
}

export async function showMusicNotification(params: {
  title: string;
  artist: string;
  isPlaying: boolean;
  durationSeconds: number;
  elapsedSeconds: number;
  canPrevious: boolean;
  canNext: boolean;
}) {
  if (Platform.OS !== "android" || !nativeModule) {
    return false;
  }

  const allowed = await ensureMusicNotificationPermission();
  if (!allowed) {
    return false;
  }

  return nativeModule.update(
    params.title,
    params.artist,
    params.isPlaying,
    params.durationSeconds,
    params.elapsedSeconds,
    params.canPrevious,
    params.canNext,
  );
}

export function hideMusicNotification() {
  if (Platform.OS === "android") {
    nativeModule?.hide();
  }
}

export function addMusicNotificationActionListener(
  listener: (action: MusicNotificationAction) => void,
) {
  if (!emitter || !nativeModule) {
    return null;
  }

  let isDraining = false;
  let shouldDrainAgain = false;

  const drain = async () => {
    if (isDraining) {
      shouldDrainAgain = true;
      return;
    }

    isDraining = true;
    try {
      do {
        shouldDrainAgain = false;
        const actions = await nativeModule.consumePendingActions();
        actions.forEach(listener);
      } while (shouldDrainAgain);
    } catch {
      // Notification actions are best-effort; playback state will stay in sync on the next event.
    } finally {
      isDraining = false;
    }
  };

  const subscription = emitter.addListener("MusicNotificationAction", drain);
  drain();

  return {
    remove: () => subscription.remove(),
  };
}

export async function consumePendingMusicNotificationActions(
  listener: (action: MusicNotificationAction) => void,
) {
  if (Platform.OS !== "android" || !nativeModule) {
    return;
  }

  const actions = await nativeModule.consumePendingActions();
  actions.forEach(listener);
}
