# 臺灣復元優勢觀點社會工作學會文章資料庫

這是一個可直接放到 GitHub Pages 的靜態網站範本，已整理 Medium 帳號公開顯示的 **29 則文章**，涵蓋 2023–2024 年。

## 已完成內容

- 29 則文章的標題、發布日期、分類、格式、標籤、編輯摘要及 Medium 原文連結
- 8 個主題分類：學會介紹、理論與實務、文獻資源、研究成果、案例與影音、專業人物、活動與研討會、督導認證
- 關鍵字搜尋、分類篩選、日期／標題排序
- 手機、平板及桌面響應式版面
- 無外部套件、無建置流程，可直接部署
- 保留來源標題，另提供較適合新站使用的正規化標題與編輯備註

## 檔案結構

```text
.
├── index.html               # 網站頁面
├── styles.css               # 視覺樣式與響應式版面
├── app.js                   # 搜尋、篩選與排序
├── data/
│   ├── articles.json        # 網站主要資料來源
│   └── articles.csv         # 方便人工校對或匯入試算表
├── EDITORIAL-NOTES.md       # 編輯校對與上線前建議
└── .nojekyll                # GitHub Pages 直接發布靜態檔案
```

## 本機預覽

由於瀏覽器直接開啟 `index.html` 時，可能禁止讀取 JSON，請在專案資料夾內啟動簡易伺服器：

```bash
python -m http.server 8000
```

再開啟 `http://localhost:8000`。

## 部署至 GitHub Pages

1. 在 GitHub 建立一個 repository。
2. 將本資料夾內的全部檔案放到 repository 根目錄並推送至 `main` branch。
3. 進入 repository 的 **Settings → Pages**。
4. 在 **Build and deployment** 將 Source 選為 **Deploy from a branch**。
5. 選擇 `main` 與 `/(root)`，再按 **Save**。

GitHub Pages 官方說明：<https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site>

## 新增或修改文章

主要只需編輯 `data/articles.json`。每筆資料格式如下：

```json
{
  "id": "unique-id",
  "title": "新站顯示標題",
  "sourceTitle": "Medium 原始標題",
  "date": "2026-11-22",
  "category": "理論與實務",
  "format": "實務論述",
  "summary": "自行整理的短摘要。",
  "url": "https://medium.com/...",
  "status": "理論資料",
  "pinned": false,
  "tags": ["標籤一", "標籤二"]
}
```

如需置頂顯示，將 `pinned` 改為 `true`。新增分類時，可同步在 `app.js` 的 `categoryColors` 設定分類色彩。

## 內容與著作權

本範本僅收錄文章的基本資料、重新撰寫的短摘要及原文連結，不複製 Medium 全文或圖片。若要將全文與圖片搬移到新站，請先確認內容所有權、作者授權及圖片使用權，並設定 canonical URL 或重新規劃原始發布來源，避免搜尋引擎將兩站視為重複內容。
