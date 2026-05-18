/**
 * Diagnóstico: testa o token e acesso às playlists.
 * Uso: node scripts/test-playlists.js
 */

const fs = require("fs");
const path = require("path");

// Carrega .env
const envPath = path.join(__dirname, "..", ".env");
const envContent = fs.readFileSync(envPath, "utf-8");
const envVars = {};
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) continue;
  envVars[trimmed.slice(0, eqIdx)] = trimmed.slice(eqIdx + 1);
}

const CLIENT_ID = envVars["EXPO_PUBLIC_SPOTIFY_CLIENT_ID"];
const CLIENT_SECRET = envVars["EXPO_PUBLIC_SPOTIFY_CLIENT_SECRET"];
const REFRESH_TOKEN = envVars["EXPO_PUBLIC_SPOTIFY_REFRESH_TOKEN"];

const PLAYLIST_IDS = {
  depressao: "4D6rArwz9g3Gyuq4ijBNBB",
  mania: "0nRBPiAlnU5bPacdmDZGNP",
  ansiedade: "1Nqe0O8Xk5RBvWV0kPEWGb",
  equilibrio: "3zf9l9Vejibhc4t8tTv1QP",
};

async function getToken() {
  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
  const resp = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=refresh_token&refresh_token=${encodeURIComponent(REFRESH_TOKEN)}`,
  });
  const data = await resp.json();
  if (!resp.ok) {
    console.error("❌ Falha ao obter token:", data);
    process.exit(1);
  }
  return data.access_token;
}

async function main() {
  console.log("\n🔑 Obtendo access token...");
  const token = await getToken();
  console.log("✅ Token obtido:", token.slice(0, 20) + "...\n");

  // Teste 1: /v1/me (verifica se o token tem permissões de usuário)
  console.log("── Teste 1: GET /v1/me ──");
  const meResp = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (meResp.ok) {
    const me = await meResp.json();
    console.log(`✅ Logado como: ${me.display_name} (${me.id})`);
    console.log(`   Produto: ${me.product}, País: ${me.country}\n`);
  } else {
    const err = await meResp.text();
    console.log(`❌ /v1/me falhou: ${meResp.status} - ${err}\n`);
  }

  // Teste 2: Cada playlist
  for (const [name, id] of Object.entries(PLAYLIST_IDS)) {
    console.log(`── Teste playlist "${name}" (${id}) ──`);

    // Tenta GET /v1/playlists/{id} (metadata)
    const metaResp = await fetch(`https://api.spotify.com/v1/playlists/${id}?fields=id,name,public,owner(id,display_name),tracks.total`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (metaResp.ok) {
      const meta = await metaResp.json();
      console.log(`  ✅ Nome: "${meta.name}" | Public: ${meta.public} | Owner: ${meta.owner?.display_name} (${meta.owner?.id}) | Tracks: ${meta.tracks?.total}`);
    } else {
      const err = await metaResp.text();
      console.log(`  ❌ Metadata falhou: ${metaResp.status} - ${err}`);
    }

    // Tenta GET /v1/playlists/{id}/tracks
    const tracksResp = await fetch(`https://api.spotify.com/v1/playlists/${id}/tracks?limit=1`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (tracksResp.ok) {
      const tracks = await tracksResp.json();
      console.log(`  ✅ Tracks OK - ${tracks.total} faixas disponíveis`);
    } else {
      const err = await tracksResp.text();
      console.log(`  ❌ Tracks falhou: ${tracksResp.status} - ${err}`);
    }
    console.log("");
  }
}

main().catch(console.error);
