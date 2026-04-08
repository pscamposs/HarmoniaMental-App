import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AvatarConfig, createAvatarConfig } from "../services/avatarApi";

export type UserProfile = {
  name: string;
  avatar: AvatarConfig;
  onboardingDone: boolean;
};

const DEFAULT_AVATAR: AvatarConfig = {
  id: "lorelei:harmonia-default",
  style: "lorelei",
  url: "https://api.dicebear.com/9.x/lorelei/png?seed=harmonia-default&size=256",
};

const DEFAULT_PROFILE: UserProfile = {
  name: "",
  avatar: DEFAULT_AVATAR,
  onboardingDone: false,
};

const STORAGE_KEY = "@harmonia_user_profile";

type UserContextType = {
  profile: UserProfile;
  isLoading: boolean;
  saveProfile: (profile: UserProfile) => Promise<void>;
  updateAvatar: (avatar: AvatarConfig) => Promise<void>;
  logout: () => Promise<void>;
};

const UserContext = createContext<UserContextType>({
  profile: DEFAULT_PROFILE,
  isLoading: true,
  saveProfile: async () => {},
  updateAvatar: async () => {},
  logout: async () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!raw) return;

        const parsed = JSON.parse(raw) as Partial<UserProfile> & {
          avatar?: Partial<AvatarConfig>;
        };

        const hasNewAvatar = typeof parsed.avatar?.url === "string";
        const name = typeof parsed.name === "string" ? parsed.name : "";
        const onboardingDone = Boolean(parsed.onboardingDone);

        const migrated: UserProfile = {
          name,
          onboardingDone,
          avatar: hasNewAvatar
            ? {
                id: parsed.avatar?.id || DEFAULT_AVATAR.id,
                style: parsed.avatar?.style || DEFAULT_AVATAR.style,
                url: parsed.avatar?.url || DEFAULT_AVATAR.url,
              }
            : createAvatarConfig(name || "harmonia-user", "adventurer"),
        };

        setProfile(migrated);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const saveProfile = async (next: UserProfile) => {
    setProfile(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const updateAvatar = async (avatar: AvatarConfig) => {
    const next = { ...profile, avatar };
    setProfile(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const logout = async () => {
    setProfile(DEFAULT_PROFILE);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  return (
    <UserContext.Provider
      value={{ profile, isLoading, saveProfile, updateAvatar, logout }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
