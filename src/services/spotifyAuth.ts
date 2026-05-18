import AsyncStorage from "@react-native-async-storage/async-storage";

const SPOTIFY_TOKEN_KEY = "SPOTIFY_APP_TOKEN";

interface TokenData {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
  refresh_token?: string;
}

/**
 * Renova o access_token usando o refresh_token permanente do .env.
 * Não exige nenhuma interação do usuário.
 */
async function refreshAccessToken(): Promise<TokenData | null> {
  const clientId = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID || "";
  const clientSecret = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_SECRET || "";
  const refreshToken = process.env.EXPO_PUBLIC_SPOTIFY_REFRESH_TOKEN || "";

  if (!clientId || !clientSecret || !refreshToken) {
    console.error(
      "[SpotifyAuth] Missing env vars. Need EXPO_PUBLIC_SPOTIFY_CLIENT_ID, EXPO_PUBLIC_SPOTIFY_CLIENT_SECRET, and EXPO_PUBLIC_SPOTIFY_REFRESH_TOKEN",
    );
    return null;
  }

  const credentials = btoa(`${clientId}:${clientSecret}`);

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "<no-body>");
      console.error(
        "[SpotifyAuth] Token refresh failed:",
        response.status,
        response.statusText,
        text,
      );
      return null;
    }

    const data: TokenData = await response.json();
    // Margem de 60s antes da expiração real
    data.expires_at = Date.now() + (data.expires_in - 60) * 1000;
    return data;
  } catch (error) {
    console.error("[SpotifyAuth] Network error refreshing token:", error);
    return null;
  }
}

/**
 * Retorna um access_token válido com user-level permissions.
 * Usa cache em AsyncStorage e renova automaticamente via refresh_token.
 * Zero interação do usuário.
 */
export async function getStoredSpotifyToken(): Promise<string | null> {
  const raw = await AsyncStorage.getItem(SPOTIFY_TOKEN_KEY);
  if (raw) {
    try {
      const parsed: TokenData = JSON.parse(raw);
      if (
        parsed.access_token &&
        parsed.expires_at &&
        Date.now() < parsed.expires_at
      ) {
        return parsed.access_token;
      }
    } catch {
      // Token corrompido, será renovado abaixo
    }
  }

  // Token ausente ou expirado — renova via refresh_token
  const tokenData = await refreshAccessToken();
  if (!tokenData) return null;

  await AsyncStorage.setItem(SPOTIFY_TOKEN_KEY, JSON.stringify(tokenData));
  return tokenData.access_token;
}

/**
 * Limpa o token armazenado (útil para debug).
 */
export async function clearStoredSpotifyToken(): Promise<void> {
  await AsyncStorage.removeItem(SPOTIFY_TOKEN_KEY);
}
