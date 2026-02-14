# ✈️ 海外旅行 安全情報 AIエージェント

外務省が公開している「海外安全情報」のオープンデータ（XML）をリアルタイムに取得・表示するWebアプリケーションです。  
GitHub Actions による**自動データ更新**と、**GitHub Pages による静的ホスティング**に対応したサーバーレス構成を採用しています。

---

## 🌟 主な機能

| 機能 | 説明 |
|------|------|
| 🔄 自動データ更新 | GitHub Actions が30分ごとに外務省XMLを取得・コミット |
| 📋 カード型UI | 各安全情報を見やすいカード形式で一覧表示 |
| 🔗 詳細リンク | 外務省の公式ページへワンクリックで遷移 |
| 📱 レスポンシブ対応 | PC・タブレット・スマートフォンに最適化 |
| 🎨 モダンデザイン | ダークテーマ + Glassmorphism + アニメーション |

---

## 🏗️ システム構成

```
┌─────────────────────────────────────────────────┐
│  外務省オープンデータ                              │
│  ezairyu.mofa.go.jp/opendata/area/newarrivalL.xml│
└──────────────┬──────────────────────────────────┘
               │ 30分ごとに取得
               ▼
┌──────────────────────────┐
│  GitHub Actions          │
│  (update_data.yml)       │
│  cURL → data/latest.xml  │
│  → git commit & push     │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐     ┌───────────────────┐
│  GitHub Pages / 静的配信  │────▶│  ブラウザ (Client)  │
│  index.html              │     │  app.js が XMLを    │
│  data/latest.xml         │     │  パース & カード表示  │
└──────────────────────────┘     └───────────────────┘
```

### 本番環境（GitHub Pages）
- フロントエンドが `data/latest.xml` を直接 `fetch` で読み込み
- サーバーサイドの処理は不要（完全静的配信）

### ローカル開発環境
- `server.js`（Express）が CORS プロキシとして外務省APIからリアルタイム取得
- ポート `3000` で起動

---

## 📁 ファイル構成

```
travelsafe/
├── .github/
│   └── workflows/
│       └── update_data.yml   # GitHub Actions: 30分ごとにXMLデータを自動取得
├── data/
│   └── latest.xml            # 外務省から取得した最新の安全情報XML
├── index.html                # メインHTML（SPA）
├── app.js                    # XMLパース・カードレンダリング・UI制御
├── style.css                 # ダークテーマ + Glassmorphism スタイル
├── server.js                 # ローカル開発用Expressサーバー（CORSプロキシ）
├── package.json              # Node.js 依存関係定義
├── package-lock.json         # ロックファイル
├── .gitignore                # Git除外設定
└── README.md                 # このファイル
```

---

## 🚀 セットアップ

### 前提条件

- **Node.js** v18 以上
- **npm**

### ローカルでの起動方法

```bash
# 1. リポジトリのクローン
git clone https://github.com/MURAIMUNEAKI/travelsafe.git
cd travelsafe

# 2. 依存関係のインストール
npm install

# 3. 開発サーバーの起動
npm start
```

ブラウザで `http://localhost:3000` を開くと、アプリケーションが表示されます。

### GitHub Pages へのデプロイ

1. GitHubリポジトリの **Settings → Pages** で、`main` ブランチをソースに設定
2. GitHub Actions が自動で30分ごとにデータを更新
3. 手動更新したい場合は、**Actions → Update Safety Data → Run workflow** を実行

---

## 🛠️ 技術スタック

| カテゴリ | 技術 |
|----------|------|
| フロントエンド | HTML5 / Vanilla JavaScript / CSS3 |
| フォント | Google Fonts（Noto Sans JP, Inter） |
| バックエンド（開発用） | Node.js / Express / Axios |
| CI/CD | GitHub Actions（cron: 30分間隔） |
| ホスティング | GitHub Pages（静的配信） |
| データソース | [外務省 海外安全ホームページ オープンデータ](https://www.ezairyu.mofa.go.jp/) |

---

## 📊 データソース

本アプリケーションは、外務省が提供する以下のオープンデータAPIを利用しています：

- **エンドポイント**: `https://www.ezairyu.mofa.go.jp/opendata/area/newarrivalL.xml`
- **更新頻度**: 外務省側で随時更新
- **データ形式**: XML
- **主要フィールド**:
  - `title` — 安全情報のタイトル（国名・地域・事象）
  - `lead` — 概要テキスト
  - `leaveDate` — 発出日時
  - `infoUrl` — 詳細ページURL

---

## 🎨 UI / UX デザイン

### デザインコンセプト
- **ダークテーマ** (`#0f172a`) をベースに、高コントラストで視認性を確保
- **Glassmorphism** — 半透明カード + `backdrop-filter: blur` で奥行き感を演出
- **グラデーションアクセント** — Sky Blue (`#38bdf8`) × Indigo (`#4f46e5`) の配色
- **マイクロアニメーション** — カードの `fadeInUp`、ヘッダーの `fadeInDown`、ホバーエフェクト

### レスポンシブ対応
- **PC**: 最大3カラムのグリッドレイアウト（`auto-fill, minmax(320px, 1fr)`）
- **モバイル** (`≤768px`): 1カラム、タイトル・ボタンのサイズ最適化

---

## ⚙️ GitHub Actions ワークフロー

`update_data.yml` は以下の処理を自動実行します：

1. **スケジュール実行**: 30分ごと（`*/30 * * * *`）+ 手動トリガー対応
2. **データ取得**: `curl` で外務省XMLをダウンロード → `data/latest.xml` に保存
3. **差分コミット**: データに変更がある場合のみ `git commit` & `git push`
4. **スキップ制御**: コミットメッセージに `[skip ci]` を含め、無限ループを防止

---

## 📜 ライセンス

Copyright 2025 MuraiMuneaki All rights reserved.
