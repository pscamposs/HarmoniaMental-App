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
    canPrevious: boolean,
    canNext: boolean,
  ) => Promise<boolean>;
  hide: () => void;
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
  return emitter?.addListener("MusicNotificationAction", listener) ?? null;
}
