# AWS SSO Status

[English](../README.md) · [繁體中文](README.zh-TW.md) · 简体中文 · [日本語](README.ja.md) · [한국어](README.ko.md)

在 Raycast 查看 AWS IAM Identity Center 状态，快速完成登录。

- **Menu Bar** — 云朵搭配剩余时间或 ✓ / ✕，可直接切换配置文件。
- **Status** — 查看配置文件、凭证到期时间和上次成功检查。
- **Login** — 快速登录主要或指定的配置文件。
- **Diagnostics** — 检查本机配置与 AWS CLI 安装。

## 安装

需要 macOS、Raycast、Node.js/npm 和新版 [AWS CLI v2](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)。先运行 `aws configure sso` 配置 SSO。

```sh
git clone https://github.com/burger66leo/raycast-aws-sso-status.git
cd raycast-aws-sso-status
npm ci
npm run dev
```

在 Raycast 打开 **AWS SSO Menu Bar** 并启用 Background Refresh。语言、显示模式和可选的登录提醒均可在扩展偏好设置中调整。

目前可从 GitHub 安装；尚未上架 Raycast Store。

## 隐私

AWS 数据在本机处理。扩展不使用分析或遥测，也不存储凭证。认证与 AWS 缓存由 AWS CLI 管理；扩展仅缓存配置文件和状态信息。

> 剩余时间代表当前 AWS 凭证的有效期，不代表 SSO 何时需要重新通过浏览器验证。

[使用说明与限制](GUIDE.md) · [参与开发](../CONTRIBUTING.md) · [安全政策](../SECURITY.md) · [MIT 许可](../LICENSE)
