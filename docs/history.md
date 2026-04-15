# 完了タスク履歴

## 環境構築・基盤

- [x] バックエンドに Zod OpenAPI Hono を導入し、OpenAPI 自動生成の基盤を構築する
- [x] バックエンドの共通エラーハンドリングミドルウェアを実装する
- [x] バックエンドの CORS ミドルウェアを設定する
- [x] バックエンドの GitHub モジュールディレクトリ構成を作成する（`server/src/github/`）
- [x] フロントエンドに Mantine を導入し、MantineProvider・テーマ設定を構築する
- [x] フロントエンドに Orval を導入し、OpenAPI からの自動生成パイプラインを構築する
- [x] フロントエンドの FSD ディレクトリ構成を作成する

## バックエンド: GitHub トレンドリポジトリ取得

- [x] GitHub GraphQL API クライアントを実装する（`github/clients/`）
- [x] GitHub API 認証トークンの環境変数管理を実装する
- [x] トレンドリポジトリ取得のユースケースを実装する（`github/usecases/`）
- [x] GitHub API レスポンスをプロダクト固有スキーマに整形するロジックを実装する
- [x] トレンドリポジトリの Zod スキーマを定義する（リクエスト/レスポンス）
- [x] `GET /api/v1/github/trending/repositories` エンドポイントを実装する
- [x] 言語フィルタ（クエリパラメータ `language`）を実装する
- [x] 期間フィルタ（クエリパラメータ `period`: daily / weekly）を実装する

## バックエンド: トレンド言語一覧

- [x] トレンドに含まれる言語一覧の取得ユースケースを実装する
- [x] 言語一覧の Zod スキーマを定義する
- [x] `GET /api/v1/github/trending/languages` エンドポイントを実装する

## バックエンド: エラーハンドリング

- [x] GitHub API レート制限超過時のエラーレスポンスを実装する
- [x] 外部 API 障害時の統一エラーレスポンス形式を実装する
- [x] 共通エラーコード定義を作成する（RATE_LIMIT_EXCEEDED, EXTERNAL_API_ERROR, VALIDATION_ERROR, INTERNAL_ERROR）

## バックエンド: OpenAPI ドキュメント

- [x] OpenAPI ドキュメント全体設定を作成する（`openapi/doc.ts`）
- [x] `GET /api/v1/doc` で OpenAPI JSON を返すエンドポイントを実装する

## フロントエンド: トレンドリポジトリ一覧

- [x] Orval で API クライアント・型・Zod スキーマを生成する
- [x] トレンドリポジトリ一覧ページを作成する（`app/(routes)/trends/`）
- [x] リポジトリカードコンポーネントを実装する（`entities/repository/ui/`）
- [x] リポジトリエンティティの型定義を作成する（`entities/repository/model/`）
- [x] トレンドリポジトリ一覧ウィジェットを実装する（`widgets/trend-list/`）
- [x] トレンド一覧ページの構成コンポーネントを実装する（`pages/trends/ui/`）

## フロントエンド: 言語別フィルタリング

- [x] 言語フィルタ機能を実装する（`features/filter-trends/`）
- [x] 言語選択 UI コンポーネントを実装する
- [x] フィルタ状態管理を実装する（`features/filter-trends/model/`）
- [x] 言語一覧 API からフィルタ選択肢を取得する

## フロントエンド: 期間別表示

- [x] 期間切り替え UI を実装する（daily / weekly）
- [x] 期間選択状態の管理を実装する
- [x] 期間変更時の API 再取得を実装する

## フロントエンド: トレンド比較

- [x] 複数リポジトリの比較表示 UI を実装する
- [x] 比較対象の選択・解除機能を実装する
- [x] 注目度の相対的な位置づけの視覚表現を実装する
