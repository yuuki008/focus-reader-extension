// 右クリックされた要素を一時的に格納しておくグローバル変数（またはスコープ）
let lastRightClickedElement = null;

// ページ上で右クリック（contextmenu）が発生したら、対象要素を記録する
document.addEventListener(
  "contextmenu",
  (event) => {
    lastRightClickedElement = event.target;
  },
  true
);

// 拡張機能( background.js ) からのメッセージを受け取り、モーダル表示を実行
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "focusElement") {
    if (lastRightClickedElement) {
      showModal(lastRightClickedElement);
    }
  }
});

// -------------------------------
// モーダル表示用の関数
// -------------------------------
function showModal(targetElement) {
  // 既にオーバーレイが存在する場合は一旦削除
  const existingOverlay = document.getElementById("focus-element-overlay");
  if (existingOverlay) {
    existingOverlay.remove();
  }

  // 背景を覆うオーバーレイ
  const overlay = document.createElement("div");
  overlay.id = "focus-element-overlay";
  overlay.className = "focus-overlay";

  // モーダル本体
  const modal = document.createElement("div");
  modal.id = "focus-element-modal";
  modal.className = "focus-modal";

  // 選択された要素をクローンして格納
  const cloned = targetElement.cloneNode(true);
  modal.appendChild(cloned);

  // オーバーレイにクリックイベントを設定し、
  // その部分をクリックしたら閉じる場合は以下のようにする
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      closeModal(overlay);
    }
  });

  // オーバーレイにモーダルを配置
  overlay.appendChild(modal);

  // body に挿入
  document.body.appendChild(overlay);
}

// モーダルを閉じる関数（アニメーション付き）
function closeModal(overlay) {
  const modal = document.getElementById("focus-element-modal");

  // アニメーションのためのクラスを追加
  overlay.classList.add("closing");
  modal.classList.add("closing");

  // アニメーションの完了を待ってから要素を削除
  setTimeout(() => {
    overlay.remove();
  }, 300); // アニメーションの時間（0.3秒）と同じ
}
