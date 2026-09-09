# AWS SSO Status

[English](../README.md) · [繁體中文](README.zh-TW.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · 한국어

Raycast에서 AWS IAM Identity Center 상태를 확인하고 빠르게 로그인하세요.

- **Menu Bar** — 구름 아이콘과 남은 시간 또는 ✓ / ✕ 표시, 프로필 전환.
- **Status** — 프로필, 자격 증명 만료 시각, 마지막 성공 확인.
- **Login** — 기본 프로필 또는 지정한 프로필로 빠르게 로그인.
- **Diagnostics** — 로컬 구성 및 AWS CLI 설치 확인.

## 설치

macOS, Raycast, Node.js/npm 및 최신 [AWS CLI v2](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)가 필요합니다. `aws configure sso`로 SSO 프로필을 설정하세요.

```sh
git clone https://github.com/burger66leo/raycast-aws-sso-status.git
cd raycast-aws-sso-status
npm ci
npm run dev
```

Raycast에서 **AWS SSO Menu Bar**를 실행하고 Background Refresh를 켜세요. 확장 프로그램 설정에서 언어, 표시 방식, 선택적 로그인 알림을 변경할 수 있습니다.

현재 GitHub에서 설치할 수 있으며 Raycast Store에는 아직 출시되지 않았습니다.

## 개인정보 보호

AWS 데이터는 로컬에서 처리됩니다. 분석이나 원격 측정을 사용하지 않으며 확장 프로그램은 자격 증명을 저장하지 않습니다. 인증과 AWS 캐시는 AWS CLI가 관리하며, 확장 프로그램은 프로필과 상태 메타데이터만 캐시합니다.

> 남은 시간은 현재 AWS 자격 증명의 유효 기간이며, SSO 브라우저 재인증 기한이 아닙니다.

[사용 방법 및 제한](GUIDE.md) · [기여 안내](../CONTRIBUTING.md) · [보안](../SECURITY.md) · [MIT 라이선스](../LICENSE)
