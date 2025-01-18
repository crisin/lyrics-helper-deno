import { Context } from "@oak/oak/context";
import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";
import "jsr:@std/dotenv/load";
import { generateRandomString } from "./util/generateRandomString.ts";
import routeStaticFilesFrom from "./util/routeStaticFilesFrom.ts";
import { encodeBase64 } from "jsr:@std/encoding/base64";

const spotify_client_id = Deno.env.get("SPOTIFY_CLIENT_ID");
const spotify_client_secret = Deno.env.get("SPOTIFY_CLIENT_SECRET");

export const app = new Application();
const router = new Router();

const port = 5000;

const spotify_redirect_uri = `http://localhost:${port}/auth/callback`;

let access_token = "";

router.get("/auth/login", ($ctx: Context) => {
  const scope =
    "streaming user-read-email user-read-private user-read-email user-read-playback-state user-modify-playback-state playlist-modify-public";
  const state = generateRandomString(16);

  // https://accounts.spotify.com/authorize?response_type=code&client_id=40546a7c7d9a49e38f8880bb38dc6743&scope=user-read-private user-read-email user-read-playback-state user-modify-playback-state playlist-modify-public&redirect_uri=https://lyrics-helper.glitch.me/callback&state=p5VyFGL3c2l2gih1
  const auth_query_parameters = `response_type=code&client_id=${spotify_client_id}&scope=${scope}&redirect_uri=${spotify_redirect_uri}&state=${state}`;
  $ctx.response.redirect(
    `https://accounts.spotify.com/authorize?${auth_query_parameters}`
  );
  $ctx.response.body = "Redirecting to Spotify"; // sinnvoll? oder weglassen?
});

router.get("/auth/callback", async (context) => {
  const code = context.request.url.searchParams.get("code");

  if (!code) {
    context.response.status = 400;
    context.response.body = { error: "Code query parameter is missing." };
    return;
  }

  const authHeaders = new Headers();
  authHeaders.set(
    "Authorization",
    "Basic " + encodeBase64(`${spotify_client_id}:${spotify_client_secret}`)
  );
  authHeaders.set("Content-Type", "application/x-www-form-urlencoded");

  const body = new URLSearchParams({
    code: code,
    redirect_uri: spotify_redirect_uri,
    grant_type: "authorization_code",
  });

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: authHeaders,
      body: body.toString(),
    });

    if (response.ok) {
      const responseBody = await response.json();
      access_token = responseBody.access_token;
      context.response.redirect("/");
    } else {
      context.response.status = response.status;
      context.response.body = { error: "Failed to retrieve access token." };
    }
  } catch (error) {
    console.error(error);
    context.response.status = 500;
    context.response.body = { error: "Internal Server Error." };
  }
});

router.get("/auth/token", ($ctx) => {
  $ctx.response.body = {
    access_token: access_token,
  };
});

app.use(router.routes());
app.use(
  routeStaticFilesFrom([
    `${Deno.cwd()}/client/dist`,
    `${Deno.cwd()}/client/public`,
  ])
);
console.log("this is a text xxx");
if (import.meta.main) {
  console.log(`Server listening on port http://localhost:${port}`);
  await app.listen({ port });
}
