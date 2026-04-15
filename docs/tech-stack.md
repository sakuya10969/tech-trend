# 技術スタック

## フロントエンド

| 技術 | バージョン目安 | 用途 |
|------|---------------|------|
| Next.js | 16.x | App Router ベースのアプリケーションフレームワーク |
| React | 19.x | UI ライブラリ（React Compiler 有効） |
| TypeScript | 5.x | 型安全な開発 |
| Mantine | 最新安定版 | UI コンポーネントライブラリ |
| Orval | 最新安定版 | OpenAPI → API クライアント・型・Zod スキーマ自動生成 |
| Zod | 最新安定版 | ランタイムバリデーション |
| Biome | 2.x | リンター・フォーマッター |

## バックエンド

| 技術 | バージョン目安 | 用途 |
|------|---------------|------|
| Hono | 4.x | Web フレームワーク |
| TypeScript | ESNext | 型安全な開発 |
| Cloudflare Workers | - | エッジ実行環境 |
| Zod OpenAPI Hono | - | OpenAPI スキーマ定義・ドキュメント生成 |
| GraphQL クライアント | - | GitHub API との通信 |

## ツールチェイン

| ツール | 用途 |
|--------|------|
| Bun | パッケージマネージャ |
| Wrangler | Cloudflare Workers デプロイ |
| Biome | リント・フォーマット |
| Orval | API クライアント自動生成 |
