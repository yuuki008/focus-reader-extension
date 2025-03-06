// background.js (manifest v3の場合は service_worker として動作)
// 拡張機能のインストール・更新時にコンテキストメニューを登録
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "focus-element",
    title: "Focus This Element",
    contexts: ["all"],
  });
});

// コンテキストメニューがクリックされたら、content_script にメッセージを送る
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "focus-element") {
    // 右クリックされた要素情報などは content_script 側の 'contextmenu' イベントで保持する
    // ここでは単に「要素をモーダル表示せよ」という命令だけ送る
    chrome.tabs.sendMessage(tab.id, { action: "focusElement" });
  }
});
