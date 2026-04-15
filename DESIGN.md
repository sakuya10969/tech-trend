# Design System

## Overview

技術トレンドを集約・可視化する開発者向けツールのための、清潔感のあるライトインターフェース。
白背景に青〜紺のアクセントで、情報密度を高く保ちつつ視認性を確保する。
Mantine UI をコンポーネント基盤とし、テーマ設定で全体の統一感を担保する。

## Design Principles

- 情報密度を優先する。装飾よりもデータの視認性を重視する
- 色数を絞り、青と紺で意味のある差異だけを表現する
- 余白とボーダーで階層を作り、影やグラデーションに頼らない
- 開発者が日常的に使うツールとして、目の疲れにくい配色を維持する
- 一貫性を最優先とし、同じ意味には同じ見た目を適用する

## Colors

### Primary Palette

- **Primary** (blue, shade 7): CTA、アクティブ状態、主要なインタラクティブ要素。紺に近い青で落ち着いた印象を与える
- **Primary Light** (blue, shade 0–1): ホバー状態、選択状態、アクティブ行のハイライト背景
- **Primary Medium** (blue, shade 4–5): セカンダリボタンのアウトライン、進捗バー、バッジの背景

### Neutral Palette

- **Text Primary** (dark.9 / black): 見出し、本文テキスト、最も重要な情報
- **Text Secondary** (dark.5): 補助テキスト、ラベル、タイムスタンプ、メタ情報
- **Text Disabled** (dark.3): 無効状態のテキスト、プレースホルダー
- **Surface** (white): ページ全体の背景
- **Surface Variant** (gray.0–1): カード背景、テーブルの偶数行、セクション区切り
- **Border** (gray.3): カード、入力欄、区切り線、テーブルの罫線
- **Border Subtle** (gray.2): 軽い区切り、ネストされた要素間の境界

### Semantic Colors

- **Error** (red.7): バリデーションエラー、破壊的操作の警告
- **Success** (green.7): 将来的な成功状態表示用。現時点では未使用
- **Warning** (yellow.7): 将来的な警告状態表示用。現時点では未使用

### Color Restrictions

- 使用可: blue、dark、gray、white、black
- エラー系のみ: red
- 原則不使用: orange、cyan、teal、violet、pink、indigo 等
- 追加が必要な場合はこのドキュメントを更新してから使用する

## Typography

- **Headlines**: 太め（semi-bold）、dark.9 または black。ページタイトルやセクション見出しに使用
- **Subheadings**: ミディアムウェイト、dark.7。カードタイトルやグループ見出しに使用
- **Body**: レギュラー、14–16px、dark.7。本文、説明文、リスト項目
- **Labels**: やや小さめ（12–13px）、dark.5 または dimmed。フォームラベル、テーブルヘッダー、メタ情報
- **Links**: blue.7、下線なし。ホバー時に下線を表示
- **Monospace**: コード表示、リポジトリ名、技術名など固有名詞的な要素に使用

## Spacing and Layout

- 基本グリッドは 4px 単位
- セクション間の余白は 24–32px
- カード内のパディングは 16–20px
- 要素間の最小余白は 8px
- 情報密度を高く保つため、過剰な余白は避ける
- レスポンシブ対応はデスクトップファーストで設計する

## Components

### Buttons

- **Primary**: 青の filled。最も重要な1アクションに限定して使用する
- **Secondary**: 青の outline。補助的なアクション、フィルタの適用など
- **Tertiary**: 青の subtle。テキストリンク的なアクション、キャンセル、詳細表示
- **Danger**: red の filled または outline。削除、リセットなど破壊的操作のみ
- **Disabled**: gray 背景、dark.3 テキスト。操作不可状態を明示する
- 角丸は sm（小さめ）で統一する

### Cards

- 白背景、gray.3 の 1px ボーダー
- 影（box-shadow）は使用しない。ボーダーと背景色で領域を区切る
- ホバー時に blue.0 背景を適用し、クリッカブルであることを示す
- カード内の情報は左揃えで統一する
- リポジトリカード、トレンド項目カードなど、繰り返し要素の基本単位として使用する

### Tables

- ヘッダー行: gray.0 背景、dark.5 テキスト、ミディアムウェイト
- データ行: 白背景、ホバー時に blue.0 背景
- ストライプ表示を使う場合は偶数行に gray.0 を適用
- 罫線は gray.3 の水平線のみ。縦罫線は使用しない
- ソート可能なカラムはヘッダーに blue.7 のインジケーターを表示

### Forms and Inputs

- テキスト入力: 白背景、gray.3 の 1px ボーダー、角丸 sm
- フォーカス時: blue.7 のボーダーに切り替え
- エラー時: red.7 のボーダーに切り替え、エラーメッセージを red.7 で表示
- ラベル: 入力欄の上に配置、dark.5、やや小さめ
- プレースホルダー: dark.3

### Select and Dropdown

- トリガー: テキスト入力と同じスタイル
- ドロップダウンメニュー: 白背景、gray.3 ボーダー、軽い影は許容
- 選択中の項目: blue.0 背景、blue.7 テキスト
- ホバー: gray.0 背景

### Badges and Chips

- 言語表示、カテゴリ分類、ステータス表示に使用
- デフォルト: blue の light variant（薄い青背景、blue.7 テキスト）
- 選択可能な Chip: 未選択時は gray の outline、選択時は blue の filled
- サイズは sm を基本とする

### Navigation

- サイドバーまたはトップナビゲーション: dark 系の背景も許容（dark.8–9）
- アクティブなナビ項目: blue.7 テキストまたは blue.0 背景
- 非アクティブなナビ項目: dark.5 テキスト
- ホバー: blue.0 背景

### Tabs

- アクティブタブ: blue.7 の下線インジケーター、blue.7 テキスト
- 非アクティブタブ: dark.5 テキスト、インジケーターなし
- ホバー: dark.7 テキスト

### Pagination

- 現在のページ: blue の filled
- その他のページ: subtle または outline
- 無効状態（前へ/次へ）: gray、dark.3 テキスト

### Icons

- アクティブ状態: blue.7
- 非アクティブ状態: dark.4
- 装飾アイコン: dark.3
- サイズは 16–20px を基本とする

### Tooltips

- dark.8 背景、white テキスト
- 角丸 sm
- 補足情報の表示に限定し、重要な情報は Tooltip に隠さない

### Modals and Dialogs

- 白背景、gray.3 ボーダー
- オーバーレイ: 半透明の dark（dark.9, opacity 0.5 程度）
- タイトル: dark.9、太め
- アクションボタンはフッターに右揃えで配置

### Notifications and Alerts

- 情報通知: blue の light variant
- エラー通知: red の light variant
- 左側にカラーバーを配置して種別を視覚的に区別する

### Loading States

- Loader: blue.7
- Skeleton: gray.1–2 のパルスアニメーション
- Progress bar: blue.7

### Empty States

- gray.0 背景の中央配置
- dark.4 のアイコン（大きめ）
- dark.5 のメッセージテキスト
- 必要に応じて blue の CTA ボタンを配置

## Data Visualization

- トレンドスコアやスター数などの数値表示は blue.7 で強調
- グラフを使用する場合、メインの系列は blue.7、比較用の系列は blue.4 や dark.4 で差別化
- 数値の増減表示: 増加は blue.7、減少は dark.5（red は使わない。エラーと混同するため）

## Responsive Behavior

- デスクトップファーストで設計する
- ブレークポイント: sm (768px)、md (1024px)、lg (1280px)
- カードグリッドは lg で 3 列、md で 2 列、sm で 1 列
- テーブルは sm 以下でカード表示に切り替えることを検討する
- ナビゲーションは sm 以下でハンバーガーメニューに折りたたむ

## Do's and Don'ts

- Do: 青は最も重要なアクションやアクティブ状態に集中させる
- Do: 白背景と薄いグレーで情報の階層を表現する
- Do: テキストは dark 系で統一し、コントラスト比 4.5:1 以上を維持する
- Do: 同じ種類の要素には同じコンポーネント・同じスタイルを適用する
- Do: データの視認性を最優先にし、装飾は最小限にする
- Don't: 青以外のカラフルな色を装飾目的で使わない
- Don't: ダークモードは現時点で対応しない
- Don't: カードに影（elevation）を多用しない
- Don't: 1 画面に複数の filled ボタンを並べない。最重要アクション 1 つに限定する
- Don't: アイコンだけで意味を伝えない。ラベルまたは Tooltip を併用する
- Don't: 色だけで状態を区別しない。形状やテキストでも補助する
