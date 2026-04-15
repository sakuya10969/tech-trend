# API デザイン

## 設計方針

- バックエンドは REST API を OpenAPI 準拠で公開する
- Zod OpenAPI Hono によるコードファーストアプローチで OpenAPI ドキュメントを自動生成する
- フロントエンドは Orval で生成した型安全なクライアントのみを使用する
- 外部 API（GitHub GraphQL 等）の構造をフロントエンドに漏らさない

## API ベースパス

```
/api/v1
```

## 初期フェーズ エンドポイント一覧

### GitHub トレンド

#### `GET /api/v1/github/trending/repositories`

トレンドリポジトリ一覧を取得する。

クエリパラメータ:
- `language` (string, 任意): プログラミング言語でフィルタ（例: `typescript`, `rust`）
- `period` (string, 任意): 集計期間。`daily` | `weekly`。デフォルト: `daily`

レスポンス例:
```json
{
  "repositories": [
    {
      "name": "example-repo",
      "owner": "example-user",
      "description": "リポジトリの説明",
      "language": "TypeScript",
      "stars": 12345,
      "forks": 678,
      "url": "https://github.com/example-user/example-repo",
      "trendScore": 95.2
    }
  ],
  "period": "daily",
  "fetchedAt": "2026-04-15T00:00:00Z"
}
```

#### `GET /api/v1/github/trending/languages`

トレンドに含まれる言語の一覧を取得する。フィルタ UI の選択肢として使用する。

レスポンス例:
```json
{
  "languages": [
    { "name": "TypeScript", "color": "#3178c6" },
    { "name": "Rust", "color": "#dea584" },
    { "name": "Python", "color": "#3572A5" }
  ]
}
```

## 将来フェーズ エンドポイント（予定）

| メソッド | パス | 概要 |
|----------|------|------|
| GET | `/api/v1/reddit/trending/posts` | Reddit トレンド投稿一覧 |
| GET | `/api/v1/hackernews/trending/items` | Hacker News トレンド記事一覧 |
| GET | `/api/v1/trends/aggregated` | 複数ソース横断の集約トレンド |

将来エンドポイントはデータソース追加時に具体化する。

## エラーレスポンス形式

全エンドポイント共通のエラーレスポンス形式:

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "GitHub API のレート制限を超過しました"
  }
}
```

主要エラーコード:
- `RATE_LIMIT_EXCEEDED`: 外部 API のレート制限超過
- `EXTERNAL_API_ERROR`: 外部 API の通信エラー
- `VALIDATION_ERROR`: リクエストパラメータのバリデーションエラー
- `INTERNAL_ERROR`: 内部エラー

## OpenAPI ドキュメント

- `GET /api/v1/doc` で OpenAPI JSON を取得可能にする
- フロントエンドの Orval はこのエンドポイント（またはビルド時に出力した JSON ファイル）を参照する
