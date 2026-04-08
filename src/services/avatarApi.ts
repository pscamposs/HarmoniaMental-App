const DICEBEAR_BASE_URL = "https://api.dicebear.com/9.x";

export const AVATAR_STYLES = [
  "adventurer",
  "avataaars",
  "big-smile",
  "fun-emoji",
  "icons",
  "lorelei",
  "micah",
  "personas",
] as const;

export type AvatarStyle = (typeof AVATAR_STYLES)[number];

export type AvatarConfig = {
  id: string;
  url: string;
  style: AvatarStyle;
};

export function buildAvatarUrl(seed: string, style: AvatarStyle): string {
  const normalizedSeed = encodeURIComponent(seed.trim() || "harmonia");
  return `${DICEBEAR_BASE_URL}/${style}/png?seed=${normalizedSeed}&size=256`;
}

export function createAvatarConfig(
  seed: string,
  style: AvatarStyle,
): AvatarConfig {
  return {
    id: `${style}:${seed}`,
    style,
    url: buildAvatarUrl(seed, style),
  };
}

export function createAvatarOptions(
  baseSeed: string,
  count = 8,
): AvatarConfig[] {
  const safeSeed = baseSeed.trim() || "harmonia";
  return Array.from({ length: count }, (_, idx) => {
    const style = AVATAR_STYLES[idx % AVATAR_STYLES.length];
    const seed = `${safeSeed}-${idx + 1}`;
    return createAvatarConfig(seed, style);
  });
}
