#!/usr/bin/env node

/**
 * Chrome Web Store APIを使用して拡張機能をデプロイするスクリプト
 *
 * 使用方法:
 * 1. npm install axios
 * 2. REFRESH_TOKEN=your_refresh_token CLIENT_ID=your_client_id CLIENT_SECRET=your_client_secret EXTENSION_ID=your_extension_id node deploy_to_chrome_store.js
 */

const axios = require("axios");
const fs = require("fs");
const path = require("path");
const querystring = require("querystring");

// 環境変数から必要な情報を取得
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const EXTENSION_ID = process.env.EXTENSION_ID;

// 必要な環境変数が設定されているか確認
if (!REFRESH_TOKEN || !CLIENT_ID || !CLIENT_SECRET || !EXTENSION_ID) {
  console.error("エラー: 必要な環境変数が設定されていません。");
  console.error(
    "REFRESH_TOKEN, CLIENT_ID, CLIENT_SECRET, EXTENSION_IDを設定してください。"
  );
  process.exit(1);
}

// ZIPファイルのパス
const zipFilePath = path.resolve(__dirname, "../extension.zip");

// リフレッシュトークンを使用してアクセストークンを取得する関数
async function getAccessToken() {
  try {
    const response = await axios.post(
      "https://oauth2.googleapis.com/token",
      querystring.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: REFRESH_TOKEN,
        grant_type: "refresh_token",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error(
      "アクセストークンの取得に失敗しました:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

// 拡張機能をアップロードする関数
async function uploadExtension(accessToken) {
  try {
    const fileContent = fs.readFileSync(zipFilePath);

    const response = await axios.put(
      `https://www.googleapis.com/upload/chromewebstore/v1.1/items/${EXTENSION_ID}`,
      fileContent,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-goog-api-version": "2",
          "Content-Type": "application/zip",
        },
      }
    );

    console.log("アップロード結果:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "拡張機能のアップロードに失敗しました:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

// 拡張機能を公開する関数
async function publishExtension(accessToken) {
  try {
    const response = await axios.post(
      `https://www.googleapis.com/chromewebstore/v1.1/items/${EXTENSION_ID}/publish`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-goog-api-version": "2",
          "Content-Type": "application/json",
        },
        params: {
          publishTarget: "default", // 'default'または'trustedTesters'
        },
      }
    );

    console.log("公開結果:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "拡張機能の公開に失敗しました:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

// メイン処理
async function main() {
  try {
    // ZIPファイルが存在するか確認
    if (!fs.existsSync(zipFilePath)) {
      console.error(`エラー: ${zipFilePath} が見つかりません。`);
      console.error(
        '先に "npm run build" と "npm run package" を実行してください。'
      );
      process.exit(1);
    }

    console.log("Chrome Web Storeへのデプロイを開始します...");

    // アクセストークンを取得
    const accessToken = await getAccessToken();
    console.log("アクセストークンを取得しました");

    // 拡張機能をアップロード
    const uploadResult = await uploadExtension(accessToken);
    if (uploadResult.uploadState !== "SUCCESS") {
      console.error("アップロードに失敗しました:", uploadResult);
      process.exit(1);
    }

    // 拡張機能を公開
    const publishResult = await publishExtension(accessToken);
    if (publishResult.status.includes("OK")) {
      console.log("拡張機能が正常に公開されました！");
    } else {
      console.error("公開に失敗しました:", publishResult);
      process.exit(1);
    }
  } catch (error) {
    console.error("デプロイ中にエラーが発生しました:", error);
    process.exit(1);
  }
}

main();
