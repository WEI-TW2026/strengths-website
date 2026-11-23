# 臺灣復元優勢觀點社會工作學會｜全文網站版

本版本包含 29 篇獨立的站內文章，點選「閱讀全文」直接開啟本站文章。文章文字由學會授權的 Medium 原文搬移，未以摘要替代全文。

## 先在電腦預覽

解壓縮後，直接用 Chrome 開啟 **index.html** 即可。首頁資料已內嵌，不需要安裝軟體或啟動伺服器。文章、圖片與已下載的附件使用相對路徑，可在本機閱讀。

## 上傳到既有 GitHub 儲存庫

1. 進入 `strengths-website` 儲存庫首頁，也就是看得到原本 `index.html` 的那一層。
2. 按 **Add file → Upload files**。
3. 打開本壓縮檔解壓縮後的資料夾，第一次先選取 **assets 以外的所有項目**，一起拖進上傳區，按 **Commit changes**。這一批共 71 個檔案（含子資料夾內的檔案）。
4. 回到儲存庫首頁，再按一次 **Add file → Upload files**，這次拖入完整的 **assets 資料夾**，按 **Commit changes**。這一批共 96 個檔案。
5. **保留 articles、assets、content、scripts 等資料夾，不要拆開其中的檔案，也不要連外層壓縮檔同名資料夾一起上傳。** 同名檔案會由新版本更新。
6. 若目前想暫不公開，請維持 Settings → Pages → Branch 為 None；上傳檔案後不必重新開啟 Pages。

分兩次上傳是因為 [GitHub 網頁上傳每次最多 100 個檔案](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository)。本版本共 167 個檔案，每個檔案均小於 25 MiB。請上傳解壓縮後的內容，不能只上傳 ZIP 壓縮檔。

網站檔案放在 Public 儲存庫時，檔案本身仍可被其他人讀取。若連原始檔也要保密，需另外將儲存庫設定為 Private。

## 第一層檔案與資料夾

| 項目 | 用途 |
|---|---|
| index.html | 首頁；內嵌文章索引，本機也能直接開啟 |
| app.js、styles.css | 首頁搜尋、分類與版面 |
| article.js、article.css | 文章頁字級、列印與版面 |
| articles.json、articles.csv | 文章基本資料及校對索引 |
| articles/ | 29 篇獨立 HTML 全文頁面 |
| content/ | 29 篇可編輯的 Markdown 原文 |
| assets/images/ | 站內圖片 |
| assets/attachments/ | 已下載的 PDF、Word、簡報等附件 |
| scripts/ | 日後由 Markdown 重新產生文章的工具 |
| MIGRATION-NOTES.md | 搬移數量、無法取得的附件、待補項目 |
| migration-report.json | 詳細來源與下載結果，供維護核對 |

本版本**不使用 data 資料夾**，文章索引統一保存在第一層的 articles.json。

## 修改文章

一般文字內容請修改 `content/文章代號.md` 中 `<!-- ARTICLE CONTENT -->` 下方的段落。

在電腦安裝 Python 後，於本資料夾執行以下命令，將 Markdown 變更更新到文章頁與首頁索引：

```bash
python -m pip install -r scripts/requirements.txt
python scripts/rebuild.py
```

標題、分類、日期與摘要請修改第一層的 `articles.json` 後，再執行相同的重建命令。CSV 為校對輸出，不是網頁的編輯來源。

不使用重建工具時，也可以直接編輯 `articles/文章代號/index.html`，但需自行同步 Markdown 備份。

## 外部資源說明

文章全文不再導向 Medium。原文中的書店、研究文獻、報名表單、Podcast 等連結仍屬外部資源。可正常下載的學會附件已保存至 assets/attachments；無法取得的舊連結保留原網址，並列於 MIGRATION-NOTES.md，供日後補檔。

歷年活動保留原始日期，並標示為歷史資料。認證名單、入會費用與認證辦法仍需學會確認最新版本。
