/**
 * Resolve track IDs das playlists curadas via Search API.
 * Gera src/constants/playlistCache.json com todos os IDs.
 *
 * Uso: node scripts/resolve-playlists.js
 */

const fs = require("fs");
const path = require("path");

// Load .env
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

async function searchTrack(token, artist, title) {
  const query = `track:${title} artist:${artist}`;
  const resp = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!resp.ok) return null;
  const data = await resp.json();
  const t = data.tracks?.items?.[0];
  if (!t) return null;
  return {
    id: t.id,
    name: t.name,
    artist: t.artists?.map((a) => a.name).join(", "),
    album: t.album?.name,
    albumArt: t.album?.images?.[0]?.url || "",
    previewUrl: t.preview_url,
    durationMs: t.duration_ms,
    spotifyUri: t.uri,
  };
}

// Playlists extraídas dos embeds do Spotify
const PLAYLISTS = {
  depressao: [
    { artist: "Armandinho", title: "Outra Vida" },
    { artist: "Gilberto Gil", title: "Esperando na janela" },
    { artist: "Falamansa", title: "Xote Dos Milagres" },
    { artist: "Toquinho", title: "Aquarela" },
    { artist: "Chimarruts", title: "Do Lado de Cá" },
    { artist: "Natiruts", title: "Quero Ser Feliz Também" },
    { artist: "Armandinho", title: "Analua" },
    { artist: "Sandy e Junior", title: "Inesquecível" },
    { artist: "Onze:20", title: "Meu Lugar" },
    { artist: "Lenine", title: "Paciência" },
    { artist: "Cássia Eller", title: "O Segundo Sol" },
    { artist: "Lagum", title: "Deixa" },
    { artist: "Lagum", title: "NINGUÉM ME ENSINOU" },
    { artist: "Charlie Brown Jr.", title: "Só Os Loucos Sabem" },
    { artist: "Rita Lee", title: "Reza" },
    { artist: "Djavan", title: "Sina" },
    { artist: "Vitor Kley", title: "A Tal Canção Pra Lua" },
    { artist: "Os Paralamas Do Sucesso", title: "Aonde Quer Que Eu Vá" },
    { artist: "Tim Maia", title: "O Descobridor Dos Sete Mares" },
    { artist: "ANAVITÓRIA", title: "Pupila" },
    { artist: "Tim Maia", title: "Não Quero Dinheiro" },
    { artist: "Raul Seixas", title: "Metamorfose Ambulante" },
    { artist: "Katy Perry", title: "Dark Horse" },
    { artist: "Ariana Grande", title: "we can't be friends" },
    { artist: "Jason Mraz", title: "93 Million Miles" },
    { artist: "Katy Perry", title: "Roar" },
    { artist: "One Direction", title: "Night Changes" },
    { artist: "Harry Styles", title: "Adore You" },
    { artist: "Dua Lipa", title: "Don't Start Now" },
    { artist: "Ariana Grande", title: "One Last Time" },
    { artist: "Ed Sheeran", title: "Shape of You" },
    { artist: "Coldplay", title: "A Sky Full of Stars" },
    { artist: "Ed Sheeran", title: "Castle on the Hill" },
    { artist: "Coldplay", title: "Viva La Vida" },
    { artist: "Bruno Mars", title: "Marry You" },
    { artist: "Taylor Swift", title: "Shake It Off" },
    { artist: "The Chainsmokers", title: "Something Just Like This" },
    { artist: "Sia", title: "Chandelier" },
    { artist: "Christina Perri", title: "A Thousand Years" },
    { artist: "Bruno Mars", title: "Just the Way You Are" },
    { artist: "One Direction", title: "What Makes You Beautiful" },
    { artist: "Harry Styles", title: "As It Was" },
    { artist: "Michael Jackson", title: "Man in the Mirror" },
    { artist: "Coldplay", title: "My Universe" },
    { artist: "Maroon 5", title: "She Will Be Loved" },
    { artist: "AURORA", title: "Runaway" },
    { artist: "Coldplay", title: "Yellow" },
    { artist: "Michael Jackson", title: "Black or White" },
    { artist: "Djo", title: "End of Beginning" },
    { artist: "Rihanna", title: "We Found Love" },
    { artist: "Dua Lipa", title: "Levitating" },
    { artist: "Lady Gaga", title: "Born This Way" },
    { artist: "Alcione", title: "Não Deixe O Samba Morrer" },
    { artist: "Skank", title: "Vamos Fugir" },
    { artist: "Los Hermanos", title: "Último Romance" },
    { artist: "Jorge & Mateus", title: "Logo Eu" },
    { artist: "Coldplay", title: "Hymn for the Weekend" },
    { artist: "Bob Sinclair", title: "World Hold On" },
    { artist: "Benson Boone", title: "Beautiful Things" },
    { artist: "Swedish House Mafia", title: "Don't You Worry Child" },
    { artist: "Michael Jackson", title: "Don't Stop Til You Get Enough" },
    { artist: "Natiruts", title: "Tudo Vai Dar Certo" },
  ],
  mania: [
    { artist: "Kendrick Lamar", title: "HUMBLE." },
    { artist: "Sean Paul", title: "Be Like Me" },
    { artist: "A$AP Rocky", title: "Praise The Lord" },
    { artist: "Toquinho", title: "Onde Anda Você" },
    { artist: "Tim Maia", title: "Você" },
    { artist: "Caetano Veloso", title: "Samba De Verão" },
    { artist: "Armandinho", title: "Pescador" },
    { artist: "Djavan", title: "Samurai" },
    { artist: "Alex Warren", title: "Ordinary" },
    { artist: "Teddy Swims", title: "Lose Control" },
    { artist: "Ed Sheeran", title: "Photograph" },
    { artist: "Pearl Jam", title: "Black" },
    { artist: "Claude Debussy", title: "Clair de Lune" },
    { artist: "Frédéric Chopin", title: "Waltz No. 9" },
    { artist: "Tim Bernardes", title: "Recomeçar" },
    { artist: "Tim Bernardes", title: "Só Nós Dois" },
    { artist: "Djavan", title: "Lilás" },
    { artist: "Djavan", title: "Fato Consumado" },
    { artist: "Cigarettes After Sex", title: "Apocalypse" },
    { artist: "Cigarettes After Sex", title: "Cry" },
    { artist: "Cigarettes After Sex", title: "Nothing's Gonna Hurt You Baby" },
    { artist: "Billie Eilish", title: "BIRDS OF A FEATHER" },
    { artist: "Billie Eilish", title: "WILDFLOWER" },
    { artist: "Billie Eilish", title: "Happier Than Ever" },
    { artist: "Billie Eilish", title: "What Was I Made For" },
    { artist: "Billie Eilish", title: "ocean eyes" },
    { artist: "LAKEY INSPIRED", title: "Better Days" },
    { artist: "LAKEY INSPIRED", title: "Chill Day" },
    { artist: "Toquinho", title: "Carolina Carol Bela" },
    { artist: "Jorge Ben Jor", title: "Chove Chuva" },
    { artist: "Alceu Valença", title: "Flor de Tangerina" },
    { artist: "Rubel", title: "Quando Bate Aquela Saudade" },
    { artist: "Tim Maia", title: "Eu Amo Você" },
    { artist: "Adoniran Barbosa", title: "Trem Das Onze" },
    { artist: "Arlindo Cruz", title: "Meu Lugar" },
    { artist: "Antônio Carlos Jobim", title: "Garota de Ipanema" },
    { artist: "Patrick Watson", title: "Je te laisserai des mots" },
    { artist: "Tom Rosenthal", title: "Lights Are On" },
    { artist: "Nando Reis", title: "Pra Você Guardei O Amor" },
    { artist: "Martinho Da Vila", title: "Mulheres" },
    { artist: "Legião Urbana", title: "Pais E Filhos" },
  ],
  ansiedade: [
    { artist: "The Script", title: "Hall of Fame" },
    { artist: "Egzod", title: "Royalty" },
    { artist: "Coldplay", title: "Hymn for the Weekend" },
    { artist: "Sia", title: "Unstoppable" },
    { artist: "Clean Bandit", title: "Symphony" },
    { artist: "Rema", title: "Calm Down" },
    { artist: "Daft Punk", title: "Get Lucky" },
    { artist: "Sia", title: "Move Your Body" },
    { artist: "Lady Gaga", title: "Die With A Smile" },
    { artist: "Swedish House Mafia", title: "Don't You Worry Child" },
    { artist: "Ellie Goulding", title: "Burn" },
    { artist: "Martin Garrix", title: "In the Name of Love" },
    { artist: "Birdy", title: "People Help the People" },
    { artist: "U2", title: "Beautiful Day" },
    { artist: "Ariana Grande", title: "One Last Time" },
    { artist: "Avicii", title: "Wake Me Up" },
    { artist: "Panic! At The Disco", title: "High Hopes" },
    { artist: "Adele", title: "Set Fire to the Rain" },
    { artist: "Kelly Clarkson", title: "Stronger" },
    { artist: "James Arthur", title: "Train Wreck" },
    { artist: "P!nk", title: "Try" },
    { artist: "Sia", title: "Bird Set Free" },
    { artist: "Katy Perry", title: "Roar" },
    { artist: "The Script", title: "Superheroes" },
    { artist: "Birdy", title: "Wings" },
    { artist: "Vance Joy", title: "Fire and the Flood" },
    { artist: "The Wanted", title: "Glad You Came" },
    { artist: "Florence + The Machine", title: "You've Got The Love" },
    { artist: "Lady Gaga", title: "The Edge Of Glory" },
    { artist: "Katy Perry", title: "Rise" },
    { artist: "Coldplay", title: "Paradise" },
    { artist: "Cher", title: "Believe" },
    { artist: "KT Tunstall", title: "Suddenly I See" },
    { artist: "Sia", title: "Alive" },
    { artist: "Imagine Dragons", title: "Whatever It Takes" },
    { artist: "Alesso", title: "Heroes" },
    { artist: "Calvin Harris", title: "This Is What You Came For" },
    { artist: "Natasha Bedingfield", title: "Pocketful of Sunshine" },
    { artist: "Harry Styles", title: "As It Was" },
    { artist: "Lizzo", title: "Good as Hell" },
    { artist: "Jack Johnson", title: "Better Together" },
    { artist: "Natasha Bedingfield", title: "Unwritten" },
    { artist: "American Authors", title: "Best Day Of My Life" },
  ],
  equilibrio: [
    { artist: "Miracle Tones", title: "852 Hz Awake Intuition" },
    { artist: "Miracle Tones", title: "639 Hz Heal Heart Chakra" },
    { artist: "Miracle Tones", title: "963 Hz Activate Pineal Gland" },
    { artist: "Miracle Tones", title: "528 Hz Anxiety Relief" },
    { artist: "Miracle Tones", title: "528 Hz Love Frequency" },
    { artist: "Miracle Tones", title: "741 Hz Cleanse Aura" },
    { artist: "Miracle Tones", title: "396 Hz Cleanse Fear" },
    { artist: "Source Vibrations", title: "528 Hz Miracle" },
    { artist: "Source Vibrations", title: "396 Hz Liberation from Fear" },
    { artist: "Source Vibrations", title: "639 Hz Relationship Harmonization" },
    { artist: "Source Vibrations", title: "852 Hz Awakening Intuition" },
    { artist: "Kev Thompson", title: "417 Hz Undoing Emotional Patterns" },
    { artist: "Kev Thompson", title: "528 Hz Love Miracles" },
    { artist: "Kev Thompson", title: "396 Hz Guilt Fear Liberation" },
    { artist: "Kev Thompson", title: "174 Hz Pain Reduction" },
    { artist: "Kev Thompson", title: "852 Hz Unconditional Love" },
    { artist: "J.S. Epperson", title: "528 Hz D.N.A. Repair" },
    { artist: "J.S. Epperson", title: "741 Hz Developing Intuition" },
    { artist: "Tammy Sorenson", title: "Restored Body 417 Hz" },
    { artist: "Tammy Sorenson", title: "Fathering Love 639 Hz" },
    { artist: "Hans Zimmer", title: "Cornfield Chase" },
  ],
};

async function main() {
  const token = await getToken();
  console.log("✅ Token obtido\n");

  const result = {};
  let resolved = 0;
  let failed = 0;

  for (const [section, tracks] of Object.entries(PLAYLISTS)) {
    console.log(`\n── ${section} (${tracks.length} tracks) ──`);
    result[section] = [];

    for (const { artist, title } of tracks) {
      const track = await searchTrack(token, artist, title);
      if (track) {
        result[section].push(track);
        resolved++;
        process.stdout.write(".");
      } else {
        failed++;
        process.stdout.write("✗");
        console.log(` Not found: ${artist} - ${title}`);
      }
      // Rate limit: small delay between requests
      await new Promise((r) => setTimeout(r, 50));
    }
    console.log(`\n  Resolved: ${result[section].length}/${tracks.length}`);
  }

  const outputPath = path.join(__dirname, "..", "src", "constants", "playlistCache.json");
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
  console.log(`\n✅ Cache salvo em ${outputPath}`);
  console.log(`   Total: ${resolved} encontradas, ${failed} não encontradas`);
}

main().catch(console.error);
