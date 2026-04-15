# Tech Trend

技術トレンドを集約・可視化する開発者向け Web アプリケーション。
GitHub のトレンドリポジトリを期間・言語で絞り込み、注目度を比較できます。

## アーキテクチャ

```
client/   … Next.js 16 (App Router) + Mantine + Orval
server/   … Hono on Cloudflare Workers + Zod OpenAPI
```

- フロントエンドは Feature-Sliced Design (FSD) で構成
- バックエンドはモジュラーモノリス構成（データソース単位でモジュール分離）
- OpenAPI をフロントエンド・バックエンド間の契約として運用
- 外部 API (GitHub GraphQL) の差分はバックエンドが吸収

## 技術スタック

| レイヤー | 技術 |
|----------|------|
| フロントエンド | Next.js 16, React 19, TypeScript, Mantine, TanStack Query |
| バックエンド | Hono 4, TypeScript, Cloudflare Workers, Zod OpenAPI Hono |
| API クライアント生成 | Orval (OpenAPI → React Query hooks + 型 + Zod スキーマ) |
| パッケージマネージャ | Bun |
| リンター / フォーマッター | Biome |

## セットアップ

### 前提条件

- [Bun](https://bun.sh/) がインストール済みであること
- GitHub Personal Access Token を取得済みであること

### バックエンド

```bash
cd server
bun install
cp .env.example .env  # GITHUB_TOKEN を設定
bun run dev            # http://localhost:3001 で起動
```

### フロントエンド

```bash
cd client
bun install
cp .env.example .env   # API_URL を設定
bun run dev            # http://localhost:3000 で起動
```

### API クライアント再生成

OpenAPI 定義を更新した場合:

```bash
cd server
bun run openapi:generate   # openapi.json を再生成

cd ../client
bun run api:generate       # Orval で型・クライアントを再生成
```

## 主な機能

- GitHub トレンドリポジトリの一覧表示
- 言語別フィルタリング（複数選択可）
- 期間切り替え（Daily / Weekly）
- 最大 4 件のリポジトリ比較（Trend Score による相対比較）

## API エンドポイント

| メソッド | パス | 概要 |
|----------|------|------|
| GET | `/api/v1/github/trending/repositories` | トレンドリポジトリ取得 |
| GET | `/api/v1/github/trending/languages` | トレンド言語一覧取得 |
| GET | `/api/v1/doc` | OpenAPI ドキュメント (JSON) |
| GET | `/api/v1/ui` | Swagger UI |

## ディレクトリ構成

```
├── client/                  # フロントエンド (Next.js)
│   └── src/
│       ├── app/             # App Router ルート・プロバイダ
│       ├── views/           # ページ構成 (FSD pages レイヤー)
│       ├── widgets/         # 複合 UI ブロック
│       ├── features/        # 機能単位
│       ├── entities/        # ドメインオブジェクト表現
│       └── shared/          # 共通リソース・API 生成物
├── server/                  # バックエンド (Hono)
│   └── src/
│       ├── github/          # GitHub モジュール
│       ├── lib/             # 共通ユーティリティ
│       └── openapi/         # OpenAPI 設定
└── docs/                    # プロジェクトドキュメント
```

## ドキュメント

詳細は [docs/INDEX.md](docs/INDEX.md) を参照してください。

## ライセンス

Private
