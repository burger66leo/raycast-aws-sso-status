# AWS SSO Status

[English](../README.md) · 繁體中文 · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md)

在 Raycast 查看 AWS IAM Identity Center 狀態，快速完成登入。

- **Menu Bar** — 雲朵搭配剩餘時間或 ✓ / ✕，可直接切換設定檔。
- **Status** — 查看設定檔、憑證到期時間與上次成功檢查。
- **Login** — 快速登入主要或指定的設定檔。
- **Diagnostics** — 檢查本機設定與 AWS CLI 安裝。

## 安裝

需要 macOS、Raycast、Node.js/npm 與新版 [AWS CLI v2](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)。先執行 `aws configure sso` 設定 SSO。

```sh
git clone https://github.com/burger66leo/raycast-aws-sso-status.git
cd raycast-aws-sso-status
npm ci
npm run dev
```

在 Raycast 開啟 **AWS SSO Menu Bar** 並啟用 Background Refresh。語言、顯示模式與可選的登入提醒都能在擴充功能偏好設定調整。

目前可從 GitHub 安裝；尚未上架 Raycast Store。

## 隱私

AWS 資料在本機處理。擴充功能不使用分析或遙測，也不儲存憑證。驗證與 AWS 快取由 AWS CLI 管理；擴充功能只快取設定檔與狀態資訊。

> 剩餘時間代表目前 AWS 憑證的有效期，不代表 SSO 何時需要重新透過瀏覽器驗證。

[使用說明與限制](GUIDE.md) · [參與開發](../CONTRIBUTING.md) · [安全政策](../SECURITY.md) · [MIT 授權](../LICENSE)
