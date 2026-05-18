/**
 * Script ONE-TIME para obter um refresh_token do Spotify.
 *
 * Uso:
 *   node scripts/get-refresh-token.js
 *
 * 1. Abre o browser para login no Spotify
 * 2. Redireciona para localhost com o code
 * 3. Troca o code por access_token + refresh_token
 * 4. Imprime o refresh_token para você colocar no .env
 *
 * Depois de copiar o EXPO_PUBLIC_SPOTIFY_REFRESH_TOKEN no .env,
 * você não precisa rodar mais esse script.
 */

const http = require("http");
const crypto = require("crypto");
const { execSync } = require("child_process");
const url = require("url");
const fs = require("fs");
const path = require("path");

// Carrega .env manualmente
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

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("❌ Defina EXPO_PUBLIC_SPOTIFY_CLIENT_ID e EXPO_PUBLIC_SPOTIFY_CLIENT_SECRET no .env");
  process.exit(1);
}

const REDIRECT_URI = "http://127.0.0.1:8888/callback";
const SCOPES = [
  "playlist-read-private",
  "playlist-read-collaborative",
].join(" ");

// Gera PKCE (não necessário com client_secret, mas boa prática)
const state = crypto.randomBytes(16).toString("hex");

const authUrl = new URL("https://accounts.spotify.com/authorize");
authUrl.searchParams.set("client_id", CLIENT_ID);
authUrl.searchParams.set("response_type", "code");
authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
authUrl.searchParams.set("scope", SCOPES);
authUrl.searchParams.set("state", state);

console.log("\n🎵 Abrindo o browser para login no Spotify...\n");
console.log("Se não abrir automaticamente, acesse:");
console.log(authUrl.toString());
console.log("");

// Abre o browser
const platform = process.platform;
if (platform === "win32") {
  execSync(`start "" "${authUrl.toString()}"`);
} else if (platform === "darwin") {
  execSync(`open "${authUrl.toString()}"`);
} else {
  execSync(`xdg-open "${authUrl.toString()}"`);
}

// Servidor temporário para capturar o callback
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (parsedUrl.pathname !== "/callback") {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  const code = parsedUrl.query.code;
  const returnedState = parsedUrl.query.state;

  if (returnedState !== state) {
    res.writeHead(400);
    res.end("State mismatch. Tente novamente.");
    server.close();
    return;
  }

  if (!code) {
    res.writeHead(400);
    res.end("Código não recebido. Autorização cancelada?");
    server.close();
    return;
  }

  // Trocar code por tokens
  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
  });

  try {
    const tokenResp = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    const data = await tokenResp.json();

    if (!tokenResp.ok) {
      console.error("❌ Erro ao trocar code por token:", data);
      res.writeHead(500);
      res.end("Erro ao obter token. Veja o console.");
      server.close();
      return;
    }

    console.log("\n✅ Tokens obtidos com sucesso!\n");
    console.log("─".repeat(60));
    console.log("REFRESH TOKEN (copie para o .env):\n");
    console.log(`EXPO_PUBLIC_SPOTIFY_REFRESH_TOKEN=${data.refresh_token}`);
    console.log("─".repeat(60));
    console.log("\nAccess Token (temporário, apenas para debug):");
    console.log(data.access_token?.slice(0, 30) + "...");
    console.log(`\nExpira em: ${data.expires_in}s`);

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
      <html>
        <body style="background:#1a1a2e;color:#e0e0e0;font-family:monospace;display:flex;align-items:center;justify-content:center;height:100vh;margin:0">
          <div style="text-align:center">
            <h1 style="color:#1DB954">✅ Refresh Token obtido!</h1>
            <p>Volte ao terminal para copiar o token.</p>
            <p>Pode fechar esta aba.</p>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    console.error("❌ Erro de rede:", err);
    res.writeHead(500);
    res.end("Erro de rede.");
  }

  setTimeout(() => {
    server.close();
    process.exit(0);
  }, 1000);
});

server.listen(8888, "127.0.0.1", () => {
  console.log("⏳ Aguardando callback em http://127.0.0.1:8888/callback ...\n");
});
