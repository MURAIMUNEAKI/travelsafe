# ✈️ 海外旅行 安全情報 AIエージェント

外務省が公開している「海外安全情報」のオープンデータ（XML）を取得・表示するWebアプリケーションです。  
GitHub Actions による**30分ごとの自動データ更新**と、**GitHub Pages による静的ホスティング**に対応したサーバーレス構成を採用しています。

🔗 **公開URL**: [https://muraimuneaki.github.io/travelsafe/](https://muraimuneaki.github.io/travelsafe/)

---

## 🌟 主な機能

| 機能 | 説明 |
|------|------|
| 🔄 自動データ更新 | GitHub Actions が30分ごとに外務省APIから最新データを取得・コミット |
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
               │ GitHub Actions (30分ごと cron)
               ▼
┌──────────────────────────┐     ┌───────────────────┐
│  data/latest.xml         │────▶│  ブラウザ (Client)  │
│  リポジトリに自動コミット   │     │  app.js が XMLを    │
│  GitHub Pages で静的配信   │     │  パース & カード表示  │
└──────────────────────────┘     └───────────────────┘
```

### 本番環境（GitHub Pages）
- GitHub Actions が30分ごとに外務省APIからXMLを取得し `data/latest.xml` にコミット
- `app.js` は `data/latest.xml` を読み込んでカード表示
- PHPやNode.js不要の完全静的ホスティング

### ローカル開発環境
- `server.js`（Express）が CORS プロキシとして外務省APIからリアルタイム取得
- ポート `3000` で起動

---

## 📁 ファイル構成

```
travelsafe/
├── .github/
│   └── workflows/
│       └── update_data.yml   # GitHub Actions: 30分ごとの定期データ取得
├── data/
│   └── latest.xml            # 外務省APIから取得した最新安全情報XML
├── index.html                # メインHTML（SPA）
├── app.js                    # XMLパース・カードレンダリング・UI制御
├── style.css                 # ダークテーマ + Glassmorphism スタイル
├── proxy.php                 # PHPサーバー用CORSプロキシ（オプション）
├── server.js                 # ローカル開発用Expressサーバー（CORSプロキシ）
├── package.json              # Node.js 依存関係定義
├── package-lock.json         # ロックファイル
├── .gitignore                # Git除外設定
└── README.md                 # このファイル
```

---

## 🚀 セットアップ

### GitHub Pages へのデプロイ（推奨）

1. GitHubリポジトリの **Settings → Pages** で、`main` ブランチをソースに設定
2. GitHub Actions が自動で30分ごとに `data/latest.xml` を最新データで更新・コミット
3. 手動更新したい場合は **Actions → Update Safety Data → Run workflow** を実行

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

---

## 🛠️ 技術スタック

| カテゴリ | 技術 |
|----------|------|
| フロントエンド | HTML5 / Vanilla JavaScript / CSS3 |
| フォント | Google Fonts（Noto Sans JP, Inter） |
| ローカル開発用 | Node.js / Express / Axios |
| CI/CD | GitHub Actions（cron: 30分間隔で自動データ更新） |
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

## ⚙️ データ取得の仕組み

### GitHub Actions 自動更新（メイン）
- `update_data.yml` が **30分ごと** に外務省APIから最新XMLを取得
- `data/latest.xml` を更新してリポジトリに自動コミット・プッシュ
- GitHub Pages が自動的に最新データを配信

### ローカル開発（開発時のみ）
- `server.js` が Express プロキシとして外務省APIからリアルタイム取得
- CORS制約を回避してブラウザに直接XML返却

### 環境自動判定
`app.js` はホスト名を判定し、環境に応じてデータ取得先を自動切替：
- **localhost / 127.0.0.1** → Express プロキシ (`/api/safety-info`)
- **それ以外（本番）** → 静的ファイル (`./data/latest.xml`)

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

## 📜 ライセンス

Copyright 2025 MuraiMuneaki All rights reserved.
