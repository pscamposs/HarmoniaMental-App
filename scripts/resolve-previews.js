/**
 * Resolve preview URLs usando múltiplas fontes: iTunes + Deezer.
 * iTunes e preferido porque os previews do Deezer podem vir com assinatura temporaria.
 *
 * Uso: node scripts/resolve-previews.js
 */

const fs = require("fs");
const path = require("path");

const cachePath = path.join(__dirname, "..", "src", "constants", "playlistCache.json");
const cache = JSON.parse(fs.readFileSync(cachePath, "utf-8"));

function cleanQuery(text) {
  return text
    .replace(/\s*[-–]\s*(Ao Vivo|Live|Radio Edit|Remix|Seeb Remix|Microfonado|Single Mix|Instrumental).*$/i, "")
    .replace(/\s*\(feat\.?\s+[^)]+\)/gi, "")
    .replace(/\s*\[.*?\]/g, "")
    .replace(/[^\w\sÀ-ÿ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function getDeezerPreview(artist, title) {
  const artistClean = cleanQuery(artist.split(",")[0].trim());
  const titleClean = cleanQuery(title);
  const query = `${artistClean} ${titleClean}`;
  const url = `https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=3`;

  try {
    const resp = await fetch(url);
    if (!resp.ok) return null;
    const data = await resp.json();
    if (!data.data || data.data.length === 0) return null;

    const titleLower = titleClean.toLowerCase();
    const artistLower = artistClean.toLowerCase();

    const match = data.data.find((r) => {
      const a = (r.artist?.name || "").toLowerCase();
      const t = (r.title || "").toLowerCase();
      return (a.includes(artistLower) || artistLower.includes(a)) &&
             (t.includes(titleLower) || titleLower.includes(t));
    }) || data.data[0];

    return match.preview || null;
  } catch {
    return null;
  }
}

async function getItunesPreview(artist, title) {
  const artistClean = cleanQuery(artist.split(",")[0].trim());
  const titleClean = cleanQuery(title);
  const query = `${titleClean} ${artistClean}`;
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=3&entity=song`;

  try {
    const resp = await fetch(url);
    if (!resp.ok) return null;
    const data = await resp.json();
    if (!data.results || data.results.length === 0) return null;
    return data.results[0].previewUrl || null;
  } catch {
    return null;
  }
}

async function resolvePreview(artist, title) {
  let preview = await getItunesPreview(artist, title);
  if (preview) return { url: preview, source: "itunes" };

  await new Promise((r) => setTimeout(r, 100));

  preview = await getDeezerPreview(artist, title);
  if (preview) return { url: preview, source: "deezer" };

  return null;
}

function isExpiringPreviewUrl(url) {
  return Boolean(url?.includes("cdnt-preview.dzcdn.net") || url?.includes("hdnea="));
}

async function main() {
  let total = 0;
  let resolved = 0;
  let failed = 0;
  const failedTracks = [];

  for (const [section, tracks] of Object.entries(cache)) {
    console.log(`\n── ${section} (${tracks.length} tracks) ──`);

    for (const track of tracks) {
      total++;

      // Keep stable previews, but refresh expiring signed URLs.
      if (track.previewUrl && !isExpiringPreviewUrl(track.previewUrl)) {
        resolved++;
        process.stdout.write("•");
        continue;
      }

      const result = await resolvePreview(track.artist, track.name);
      if (result) {
        track.previewUrl = result.url;
        resolved++;
        process.stdout.write(result.source === "deezer" ? "D" : "I");
      } else {
        failed++;
        process.stdout.write("✗");
        failedTracks.push(`${track.artist} - ${track.name}`);
      }
      await new Promise((r) => setTimeout(r, 250));
    }

    const withPreview = tracks.filter((t) => t.previewUrl).length;
    console.log(`\n  Total com preview: ${withPreview}/${tracks.length}`);
  }

  fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2));
  console.log(`\n✅ Cache atualizado: ${resolved}/${total} com preview`);

  if (failedTracks.length > 0) {
    console.log(`\n❌ ${failedTracks.length} tracks sem preview:`);
    failedTracks.forEach((t) => console.log(`   - ${t}`));
  }
}

main().catch(console.error);
