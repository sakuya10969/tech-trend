# ディレクトリ構成と責務分離

## 全体構成

```
├── client/          # フロントエンド（Next.js）
├── server/          # バックエンド（Hono on Cloudflare Workers）
└── .kiro/steering/  # プロジェクト方針ドキュメント
```

フロントエンドとバックエンドは独立したパッケージとして管理する。それぞれに独自の `package.json`、`tsconfig.json` を持つ。

---

## フロントエンド構成（FSD アーキテクチャ）

Feature-Sliced Design（FSD）を採用し、責務ごとにレイヤーを分離する。

### レイヤー構成

```
client/src/
├── app/              # アプリケーション初期化・グローバル設定
│   ├── layout.tsx
│   ├── globals.css
│   ├── providers/    # MantineProvider 等のグローバルプロバイダ
│   └── (routes)/     # Next.js App Router のルート定義
│       ├── page.tsx
│       ├── trends/
│       │   └── page.tsx
│       └── ...
├── pages/            # ページ単位の構成（FSD の pages レイヤー）
│   └── trends/
│       ├── ui/       # ページ固有の UI 構成
│       └── index.ts
├── widgets/          # 複数 feature/entity を組み合わせた複合 UI ブロック
│   └── trend-list/
│       ├── ui/
│       └── index.ts
├── features/         # ユーザー操作に対応する機能単位
│   └── filter-trends/
│       ├── ui/
│       ├── model/    # 状態管理・ロジック
│       └── index.ts
├── entities/         # ドメインオブジェクトの表現
│   └── repository/
│       ├── ui/       # エンティティ表示用コンポーネント
│       ├── model/    # 型定義・ドメインロジック
│       └── index.ts
├── shared/           # 全レイヤーから参照可能な共通リソース
│   ├── api/          # Orval 生成物の配置先
│   │   └── generated/  # 自動生成コード（手動編集禁止）
│   ├── ui/           # 汎用 UI コンポーネント（Mantine ラッパー等）
│   ├── lib/          # ユーティリティ関数
│   └── config/       # 環境変数・定数
└── ...
```

### 各レイヤーの役割と配置ルール

#### app

- Next.js App Router のルート定義を配置する
- グローバルプロバイダ（MantineProvider、テーマ設定等）を管理する
- レイアウト、メタデータ、グローバル CSS を定義する
- ビジネスロジックは置かない

#### pages

- FSD における pages レイヤー。画面単位の構成を担う
- Next.js の `app/(routes)/` 内の `page.tsx` は薄く保ち、実際の画面構成は `pages/` レイヤーのコンポーネントに委譲する
- widgets や features を組み合わせてページを構成する
- ページ固有のレイアウト調整のみ行い、ドメインロジックは持たない

#### widgets

- 複数の features や entities を組み合わせた複合的な UI ブロック
- 例: トレンドリポジトリ一覧（フィルタ機能 + リポジトリカード一覧）
- 画面の独立したセクションとして機能する

#### features

- ユーザー操作に対応する機能単位
- 例: トレンドのフィルタリング、期間選択、言語切り替え
- UI コンポーネントと、その機能に必要な状態管理・ロジックを含む
- API 呼び出しが必要な場合は `shared/api` の生成クライアントを利用する

#### entities

- ドメインオブジェクト（リポジトリ、トレンド項目等）の表現を担う
- エンティティの表示用コンポーネント（カード、リスト項目等）を配置する
- エンティティ固有の型定義やドメインロジックを含む

#### shared

- 全レイヤーから参照可能な共通リソース
- Orval 生成物、汎用 UI コンポーネント、ユーティリティ、設定値を配置する
- 特定のドメインやページに依存するコードは置かない

### FSD のレイヤー間依存ルール

- 上位レイヤーは下位レイヤーを参照できる（app → pages → widgets → features → entities → shared）
- 同一レイヤー内のスライス間は直接参照しない
- 下位レイヤーから上位レイヤーへの参照は禁止

### Orval 生成物の配置方針

- 生成先: `client/src/shared/api/generated/`
- このディレクトリ内のファイルは全て自動生成物であり、手動編集は禁止する
- 生成物には API クライアント関数、リクエスト/レスポンスの TypeScript 型、Zod スキーマが含まれる
- 各レイヤーから `shared/api/generated` を通じて API を呼び出す
- 生成物をラップする薄いカスタムフックが必要な場合は `shared/api/` 直下に手書きで配置する

### Mantine コンポーネントの配置方針

- Mantine コンポーネントは各レイヤーの `ui/` 内で直接利用してよい
- プロジェクト固有のスタイル調整やプリセットが必要な場合は `shared/ui/` にラッパーコンポーネントを作成する
- MantineProvider とテーマ設定は `app/providers/` に配置する

---

## バックエンド構成（モジュラーモノリス）

### ディレクトリ構成

```
server/src/
├── index.ts              # エントリポイント（Hono アプリ初期化・モジュール登録）
├── modules/              # 機能モジュール群
│   └── github/           # GitHub モジュール（初期フェーズの主軸）
│       ├── routes.ts     # ルーティング定義（OpenAPI スキーマ付き）
│       ├── usecases/     # ユースケース層（ビジネスロジック）
│       │   └── get-trending-repositories.ts
│       ├── clients/      # 外部 API クライアント層
│       │   └── github-graphql-client.ts
│       ├── schemas/      # Zod スキーマ（リクエスト/レスポンス定義）
│       │   └── trending.ts
│       └── types/        # モジュール内部の型定義
│           └── github-api.ts
├── shared/               # モジュール横断の共通コード
│   ├── middleware/        # 共通ミドルウェア（CORS、エラーハンドリング等）
│   ├── errors/           # 共通エラー定義
│   └── utils/            # 共通ユーティリティ
└── openapi/              # OpenAPI ドキュメント生成設定
    └── doc.ts
```

### 各層の責務

#### routes.ts（ルーティング層）

- Hono のルート定義と OpenAPI スキーマ定義を一体化する（Zod OpenAPI Hono を使用）
- リクエストのバリデーションとレスポンスの型定義をここで行う
- ビジネスロジックは持たず、ユースケース層に委譲する

#### usecases/（ユースケース層）

- ビジネスロジックを実装する
- 外部 API クライアントからデータを取得し、整形・集約・フィルタリングを行う
- フロントエンドに返すデータ構造への変換はここで行う
- 外部 API の生レスポンスをそのまま返さない

#### clients/（外部 API クライアント層）

- 外部 API との通信を担当する
- GitHub GraphQL API のクエリ定義と実行をここに閉じ込める
- 認証トークンの付与、ページネーション処理、レート制限対応をここで吸収する
- 外部 API の型定義（レスポンス型等）はこの層の `types/` に配置する

#### schemas/（スキーマ層）

- Zod スキーマによるリクエスト/レスポンスの定義
- OpenAPI ドキュメント生成の元となるスキーマ
- ルーティング層とユースケース層の両方から参照される

### モジュール設計の原則

- 各モジュールは独立したディレクトリに閉じ込め、モジュール間の直接参照は避ける
- モジュールの公開インターフェースは `routes.ts` のみとし、`index.ts` でアプリに登録する
- 共通処理が必要な場合は `shared/` に配置する
- 外部 API の GraphQL クエリ、認証情報、レスポンス型はモジュール内の `clients/` と `types/` に閉じ込める

### 将来のモジュール追加イメージ

```
server/src/modules/
├── github/       # GitHub トレンド取得（初期フェーズ）
├── reddit/       # Reddit 技術系サブレディット取得（将来）
├── hackernews/   # Hacker News トレンド取得（将来）
└── aggregator/   # 複数ソースの横断集約（将来）
```

新しいデータソースを追加する際は、対応するモジュールディレクトリを作成し、同じ層構成（routes / usecases / clients / schemas / types）で実装する。既存モジュールやフロントエンドへの影響を最小限に抑える。

### OpenAPI ドキュメント管理

- OpenAPI 定義はバックエンドのルート定義から自動生成する（Zod OpenAPI Hono）
- `openapi/doc.ts` で OpenAPI ドキュメント全体の設定（タイトル、バージョン、サーバー情報等）を管理する
- 生成された OpenAPI JSON/YAML をフロントエンドの Orval が参照する
- OpenAPI 定義を手書きで管理するファイルは作成しない（コードファーストアプローチ）
