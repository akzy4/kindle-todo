# Kindle TODO

シンプルなTODOアプリケーション

## プロジェクト構成

- **backend/**: Express.js + TypeScript バックエンドAPI
- **frontend/**: React + TypeScript フロントエンド

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動（バックエンド＆フロントエンド同時起動）
npm run dev

# ビルド
npm run build

# テスト実行
npm run test

# リント実行
npm run lint
```

## API エンドポイント

### TODO一覧取得
```
GET /api/todos
```

### TODO作成
```
POST /api/todos
Content-Type: application/json

{
  "title": "タイトル",
  "description": "説明（オプション）"
}
```

### TODO更新
```
PATCH /api/todos/:id
Content-Type: application/json

{
  "title": "新しいタイトル",
  "description": "新しい説明",
  "completed": true
}
```

### TODO削除
```
DELETE /api/todos/:id
```

## 開発

### 開発サーバー

バックエンド: http://localhost:3001
フロントエンド: http://localhost:3000

フロントエンドのプロキシ設定により、`/api` リクエストは自動的にバックエンドに転送されます。
