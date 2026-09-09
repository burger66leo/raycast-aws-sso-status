# AWS SSO Status

[English](../README.md) · [繁體中文](README.zh-TW.md) · [简体中文](README.zh-CN.md) · 日本語 · [한국어](README.ko.md)

Raycast で AWS IAM Identity Center の状態を確認し、すばやくサインイン。

- **Menu Bar** — 雲アイコンと残り時間または ✓ / ✕ を表示。プロファイルも切り替え可能。
- **Status** — プロファイル、認証情報の有効期限、最終成功確認を表示。
- **Login** — 優先プロファイルまたは指定したプロファイルにサインイン。
- **Diagnostics** — ローカル設定と AWS CLI のインストールを確認。

## インストール

macOS、Raycast、Node.js/npm、最新の [AWS CLI v2](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) が必要です。`aws configure sso` で SSO プロファイルを設定してください。

```sh
git clone https://github.com/burger66leo/raycast-aws-sso-status.git
cd raycast-aws-sso-status
npm ci
npm run dev
```

Raycast で **AWS SSO Menu Bar** を実行し、Background Refresh を有効にします。言語、表示形式、任意のサインイン通知は拡張機能の設定で変更できます。

現在は GitHub からインストールできます。Raycast Store には未公開です。

## プライバシー

AWS データはローカルで処理されます。分析・テレメトリは使用せず、拡張機能は認証情報を保存しません。認証と AWS キャッシュは AWS CLI が管理し、拡張機能はプロファイルと状態のメタデータのみをキャッシュします。

> 残り時間は現在の AWS 認証情報の有効期間であり、SSO のブラウザ再認証期限ではありません。

[使い方と制限](GUIDE.md) · [開発への参加](../CONTRIBUTING.md) · [セキュリティ](../SECURITY.md) · [MIT ライセンス](../LICENSE)
