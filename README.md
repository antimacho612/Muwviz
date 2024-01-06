<img align="left" width="90" height="90" src="/resources/icon.png" alt="logo" style="margin-right: 1rem" />

# Muwviz

**Muwviz**は、音楽を耳と目で楽しむためのデスクトップアプリケーションです。

<img align="left" width="45%" src="/screenshots/screenshot-light.png" alt="screenshot light mode" />

<img width="45%" src="/screenshots/screenshot-dark.png" alt="screenshot dark mode" />

## 機能／特徴

- PC内の音楽ファイル（`.aac`, `.mp3`, `.ogg`, `.wav`, `.flac`, `.webm`, `.m4a`）を再生します
- 楽曲再生時、リアルタイムで楽曲の音声解析を行い、ビジュアライザーを表示します
  - ビジュアライザーの表示には[`audioMotion-analyzer`ライブラリ](https://github.com/hvianna/audioMotion-analyzer)を使用しています
- ビジュアライザーのカスタマイズが可能です
  - ビジュアライザーの各設定値については、[audioMotion-analyzerのサイト（英語）](https://audiomotion.dev/#/?id=properties)を参照してください
- ビジュアライザーの設定をプリセットとして保存することができます
- オフラインでも動作します
- 楽曲の詳細情報（タグに保存された情報）を見ることができます
- 外観のカスタマイズが可能です
  - テーマ（ライト／ダーク）
  - プライマリー（メイン）カラー
  - フォント
- クロスプラットフォーム（Windows, Mac, Linux）に対応しています

## ダウンロード

[GitHub Release](https://github.com/antimacho612/Muwviz/releases)より、お使いのPCに合った最新版のインストーラをダウンロードし、インストールしてください。

## 使い方

🚧準備中

## 使用している主なライブラリ

- Electron
- TypeScript
- Vue3
- Pinia
- electron-vite
- audioMotion-analyzer
- Sass

## 開発／ローカル起動

### 依存ライブラリのインストール

```bash
npm install
```

### 開発用アプリケーション起動

`electron-vite`ライブラリにより、レンダラープロセスはホットリロードされます。
メインプロセスもホットリロードさせたい場合は、`dev`の後ろに`:watch`をつけて実行してください。

```bash
npm run dev
# Or
npm run dev:watch
```

### ビルド

```bash
npm run build:electron
```

## フィードバック

バグ報告・ご意見・ご要望などは[GitHub Issues](https://github.com/antimacho612/Muwviz/issues/new/choose)までお願いします。
