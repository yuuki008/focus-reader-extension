# Focus Element Reader

クリックした要素のみをモーダルに表示し、背景を白くする Chrome 拡張機能です。

## 機能

- ウェブページ上で右クリックして「この要素だけを集中表示」を選択すると、その要素だけがモーダルとして表示されます
- 背景は白色になり、集中して読むことができます
- モーダル外をクリックするか、「閉じる」ボタンをクリックすることでモーダルを閉じることができます

## インストール方法

1. このリポジトリをクローンまたはダウンロードします
2. Chrome で `chrome://extensions/` にアクセスします
3. 右上の「デベロッパーモード」をオンにします
4. 「パッケージ化されていない拡張機能を読み込む」をクリックします
5. ダウンロードしたフォルダを選択します

## 使い方

1. 任意のウェブページを開きます
2. 集中して読みたい要素（段落、記事など）を右クリックします
3. コンテキストメニューから「この要素だけを集中表示」を選択します
4. 選択した要素がモーダルとして表示され、背景が白くなります
5. 読み終わったら「閉じる」ボタンをクリックするか、モーダル外をクリックして閉じます

## カスタマイズ

- `content_style.css` を編集することで、モーダルや背景のスタイルをカスタマイズできます
- `content_script.js` を編集することで、動作をカスタマイズできます

## 自動デプロイの設定

このリポジトリは GitHub Actions を使用して、main ブランチへのプッシュ時に自動的に Chrome Web Store にデプロイされるように設定されています。

### 設定手順

1. Chrome Developer Dashboard で拡張機能を公開し、Extension ID を取得します
2. Google Cloud Platform でプロジェクトを作成し、Chrome Web Store API を有効にします
3. OAuth 同意画面を設定し、OAuth クライアント ID とシークレットを取得します
4. リフレッシュトークンを取得します
5. GitHub リポジトリの「Settings」→「Secrets and variables」→「Actions」で以下のシークレットを設定します：
   - `EXTENSION_ID`: Chrome Web Store の Extension ID
   - `CLIENT_ID`: Google Cloud Platform のクライアント ID
   - `CLIENT_SECRET`: Google Cloud Platform のクライアントシークレット
   - `REFRESH_TOKEN`: 取得したリフレッシュトークン

詳細な手順については、[Chrome Web Store API ドキュメント](https://developer.chrome.com/docs/webstore/using_webstore_api)を参照してください。

## 注意事項

- アイコンファイル（icon128.png）は別途用意する必要があります
- この拡張機能は Chrome 用に作成されていますが、Firefox 等の他のブラウザでも動作する可能性があります（未検証）
