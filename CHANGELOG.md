# AWS SSO Status Changelog

## [Initial Version] - {PR_MERGE_DATE}

- Simplify documentation into five concise language versions and avoid inferring unverified role status from a shared-session failure.
- Preserve cached menu status during refresh, flag stale results, and show last successful checks.
- Add primary-profile switching, session coordination, retry backoff, optional sign-in reminders, and diagnostics.
- Publish the source on GitHub and enable the voluntary Star link.
- Add a quick SSO sign-in command with optional profile selection and post-login credential verification.
- Restore the native cloud icon and prepare an optional GitHub Star link.
- Support English, Traditional Chinese, Simplified Chinese, Japanese, and Korean in extension views and messages.
- Simplify menu bar output to time only or a check/cross symbol, with profile details in the dropdown.
- Discover modern and legacy IAM Identity Center profiles automatically.
- Inspect temporary credential lifetime in a native list and menu bar.
- Sign in through AWS CLI with safe process arguments and refresh status.
- Configure primary profile, filtering, time warnings, menu style, and CLI path.
- Bound background checks and sanitize authentication failures.
