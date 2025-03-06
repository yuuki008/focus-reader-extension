#!/usr/bin/env node

/**
 * Chrome Web Store APIのリフレッシュトークンを取得するためのスクリプト
 *
 * 使用方法:
 * 1. npm install axios open
 * 2. CLIENT_ID=your_client_id CLIENT_SECRET=your_client_secret node get_refresh_token.js
 */

const axios = require("axios");
const open = require("open");
const readline = require("readline");
const querystring = require("querystring");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// 環境変数からクライアントIDとシークレットを取得
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    "エラー: CLIENT_IDとCLIENT_SECRETを環境変数として設定してください。"
  );
  console.error(
    "例: CLIENT_ID=your_client_id CLIENT_SECRET=your_client_secret node get_refresh_token.js"
  );
  process.exit(1);
}

// OAuth認証URLを生成
const scopes = ["https://www.googleapis.com/auth/chromewebstore"];

const authUrl = `https://accounts.google.com/o/oauth2/auth?${querystring.stringify(
  {
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: "urn:ietf:wg:oauth:2.0:oob",
    scope: scopes.join(" "),
  }
)}`;

console.log("ブラウザで認証ページを開きます...");
open(authUrl);

rl.question("認証コードを入力してください: ", async (code) => {
  try {
    // 認証コードを使用してトークンを取得
    const response = await axios.post(
      "https://oauth2.googleapis.com/token",
      querystring.stringify({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: "urn:ietf:wg:oauth:2.0:oob",
        grant_type: "authorization_code",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("\n=== トークン情報 ===");
    console.log(`アクセストークン: ${response.data.access_token}`);
    console.log(`リフレッシュトークン: ${response.data.refresh_token}`);
    console.log(
      "\nGitHubリポジトリのシークレットとして以下を設定してください:"
    );
    console.log(`REFRESH_TOKEN=${response.data.refresh_token}`);
  } catch (error) {
    console.error(
      "エラー:",
      error.response ? error.response.data : error.message
    );
  } finally {
    rl.close();
  }
});
