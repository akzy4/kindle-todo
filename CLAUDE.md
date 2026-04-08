# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

Kindle TODO は、フルスタック TypeScript で構築されたシンプルな TODO アプリケーションです。React フロントエンドと Express.js バックエンドで構成されるモノリポジトリ（npm workspaces）です。

現在のフェーズは **MVP** で、基本的な TODO 管理機能を提供することが目標です。

## プロジェクト構造

```
kindle-todo/
├── backend/              # Express.js バックエンド（Node.js）
│   ├── src/
│   │   └── index.ts      # メインサーバーファイル（REST API）
│   ├── tsconfig.json
│   └── package.json
├── frontend/             # React フロントエンド
│   ├── src/
│   │   ├── App.tsx       # メインコンポーネント
│   │   ├── App.css       # スタイル
│   │   └── main.tsx      # エントリーポイント
│   ├── index.html        # HTML テンプレート
│   ├── vite.config.ts    # Vite 設定
│   ├── tsconfig.json
│   └── package.json
├── package.json          # ルートワークスペース設定
├── .eslintrc.json        # ESLint 設定
└── README.md
```

## 開発コマンド

### 開発サーバー起動

```bash
npm run dev
```

バックエンド（http://localhost:3001）とフロントエンド（http://localhost:3000）を同時に起動します。フロントエンドの Vite 設定で `/api` プリフィックスのリクエストは自動的にバックエンドにプロキシされます。

### 個別起動

```bash
npm run dev -w backend   # バックエンドのみ
npm run dev -w frontend  # フロントエンドのみ
```

### ビルド

```bash
npm run build            # 両方ビルド
npm run build -w backend # バックエンドのみ
npm run build -w frontend # フロントエンドのみ
```

### テスト

```bash
npm run test             # 両方実行
npm run test -w backend
npm test:watch -w backend  # ウォッチモード
```

### リント・型チェック

```bash
npm run lint             # ESLint 実行
npm run type-check       # TypeScript チェック
```

## アーキテクチャ

### バックエンド

- **フレームワーク**: Express.js
- **言語**: TypeScript
- **ポート**: 3001
- **データ**: メモリ内（Redis や永続DBは未実装）

**主要なエンドポイント**:
- `GET /api/todos` - 全 TODO 取得
- `POST /api/todos` - TODO 作成（`title` 必須、`description` オプション）
- `PATCH /api/todos/:id` - TODO 更新（完了状態・タイトル・説明）
- `DELETE /api/todos/:id` - TODO 削除

エラーハンドリング:
- 400: 不正なリクエスト（タイトル未指定など）
- 404: リソース未検出
- レスポンスは常に JSON

### フロントエンド

- **フレームワーク**: React 18 + TypeScript
- **ビルドツール**: Vite
- **HTTP クライアント**: Axios
- **ポート**: 3000

**主要な UI 構成**:
- `App.tsx` が単一のメインコンポーネント（現在のフェーズでは複雑な分割は不要）
- TODO リスト表示・追加・削除・チェック機能
- エラーメッセージ表示
- ローディング状態管理

フロントエンドのプロキシ設定（`vite.config.ts`）により、`/api` で始まるリクエストは自動的にバックエンド（http://localhost:3001）に転送されます。

## 主要な技術判定

### npm workspaces の採用

バックエンドとフロントエンドを単一リポジトリで管理し、共通の依存関係管理と簡単なスクリプト実行を可能にしています。本番環境ではそれぞれを独立してビルド・デプロイしてください。

### メモリ内データストア

MVP フェーズでは永続化なしでシンプルさを優先。サーバー再起動でデータ消失する設計です。本番化時に PostgreSQL や MongoDB などの実装に変更してください。

### 単一コンポーネント設計（フロントエンド）

現在のスコープでは複数コンポーネントへの分割は不要です。機能が増加したら段階的にコンポーネント化してください。

### Axios による HTTP 通信

シンプルな RESTful API との連携が目的。GraphQL やリアルタイム機能が必要になった場合は適切に検討してください。

## 開発のポイント

### API 契約の一貫性

バックエンドの API 仕様を変更した場合は、フロントエンドの `axios` コールと型定義（`Todo` インターフェース）を同期させてください。型定義の共有化は将来の検討事項です。

### エラーハンドリング

- **バックエンド**: 400・404 などのステータスコードで明確に
- **フロントエンド**: `axios` のエラーをキャッチし、ユーザーに分かりやすいメッセージを表示

### ローディング状態の管理

フロントエンドの `loading` 状態で UI の操作を制御し、二重送信を防止してください。

### TypeScript の使用

型定義を明示的に行い、ランタイムエラーを早期に検出してください。`// @ts-ignore` は避けてください。

## よくある開発タスク

### 新しい TODO フィールドを追加したい

1. **バックエンド**: `Todo` インターフェース、API エンドポイント、バリデーション を更新
2. **フロントエンド**: `Todo` 型定義、入力フォーム、表示ロジック を更新
3. 両方でテストを追加

### スタイルを調整したい

`frontend/src/App.css` を編集してください。現在はシンプルな CSS で管理中です。

### テストを書きたい

- **バックエンド**: `src/__tests__/*.test.ts` にて Vitest で記述
- **フロントエンド**: `src/__tests__/*.test.tsx` にて React Testing Library で記述

### バックエンドを永続化したい（本番化）

`backend/src/index.ts` のメモリ内配列を以下のように置き換えてください：
- PostgreSQL + Prisma
- MongoDB + Mongoose
- その他のデータベース

その際、トランザクション・エラーハンドリング・マイグレーション を適切に実装してください。

## 今後の拡張に向けた検討事項

- **認証**: ユーザー管理・セッション（JWT など）
- **永続化**: データベース選定・スキーマ設計
- **本番化**: Docker・CI/CD パイプライン・環境変数管理
- **Kindle 連携**: Kindle API との統合（プロジェクト名の由来）
- **UI 改善**: コンポーネント分割・状態管理ライブラリ（必要に応じて）
