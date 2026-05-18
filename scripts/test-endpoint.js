const fs = require("fs");
const path = require("path");

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
  return (await resp.json()).access_token;
}

async function main() {
  const token = await getToken();

  // Test 1: Search API
  console.log("── Test: Search API ──");
  const searchResp = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent("relaxing music")}&type=track&limit=3`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  console.log("Search status:", searchResp.status);
  if (searchResp.ok) {
    const data = await searchResp.json();
    console.log("✅ Search works! Found", data.tracks?.total, "results");
    for (const t of (data.tracks?.items || []).slice(0, 3)) {
      console.log(`  🎵 ${t.name} - ${t.artists.map(a => a.name).join(", ")}`);
    }
  } else {
    console.log("❌", await searchResp.text());
  }

  // Test 2: Get specific track by ID  
  console.log("\n── Test: Get Track by ID ──");
  const trackResp = await fetch(
    "https://api.spotify.com/v1/tracks/4cOdK2wGLETKBW3PvgPWqT",
    { headers: { Authorization: `Bearer ${token}` } }
  );
  console.log("Track status:", trackResp.status);
  if (trackResp.ok) {
    const t = await trackResp.json();
    console.log(`✅ Track: ${t.name} - ${t.artists.map(a => a.name).join(", ")}`);
  } else {
    console.log("❌", await trackResp.text());
  }

  // Test 3: Recommendations
  console.log("\n── Test: Recommendations API ──");
  const recResp = await fetch(
    "https://api.spotify.com/v1/recommendations?seed_genres=chill&limit=5",
    { headers: { Authorization: `Bearer ${token}` } }
  );
  console.log("Recommendations status:", recResp.status);
  if (recResp.ok) {
    const data = await recResp.json();
    console.log("✅ Got", data.tracks?.length, "recommendations");
    for (const t of (data.tracks || []).slice(0, 3)) {
      console.log(`  🎵 ${t.name} - ${t.artists.map(a => a.name).join(", ")}`);
    }
  } else {
    console.log("❌", await recResp.text());
  }
}

main().catch(console.error);
