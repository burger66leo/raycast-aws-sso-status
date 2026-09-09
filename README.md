# AWS SSO Status

A macOS Raycast extension for developers using AWS IAM Identity Center (AWS SSO). Discover SSO profiles, resolve temporary credentials, see their remaining lifetime, and sign in from Raycast or the menu bar. Uses TypeScript, React, and the official Raycast API. This is not a Script Command or a separate native app.

## Install from GitHub

```sh
git clone https://github.com/burger66leo/raycast-aws-sso-status.git
cd raycast-aws-sso-status
npm ci
npm run dev
```

Raycast imports the development extension. Search for **AWS SSO Status**, **AWS SSO Menu Bar**, **AWS SSO Login**, or **AWS SSO Diagnostics**. This project is publicly available on GitHub; it has not yet been accepted into the Raycast Store.

## Requirements

- macOS with Raycast installed.
- A current **AWS CLI v2** that supports `aws configure export-credentials --format process` (CLI v1 is rejected).
- IAM Identity Center access and at least one direct SSO profile.
- Network access when AWS CLI needs to refresh credentials or sign in.

Install AWS CLI using the [official installation guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html). The extension never downloads it for you.

## IAM Identity Center setup

Run `aws configure sso` in Terminal and follow AWS's prompts. See the [official SSO setup guide](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html).

The extension reads `~/.aws/config`, or `AWS_CONFIG_FILE` from Raycast's environment when set. It never changes that file. Modern session configuration is recommended:

```ini
[profile dev]
sso_session = example
sso_account_id = 123456789012
sso_role_name = DeveloperAccess
region = ap-northeast-1

[sso-session example]
sso_start_url = https://example.awsapps.com/start
sso_region = us-east-1
sso_registration_scopes = sso:account:access
```

Legacy configuration is also supported:

```ini
[profile production]
sso_start_url = https://example.awsapps.com/start
sso_region = us-east-1
sso_account_id = 123456789012
sso_role_name = DeveloperAccess
region = ap-northeast-1
```

These are fictional examples. `[default]` is supported, as are names with dashes and underscores. Ordinary static-key profiles are excluded. Incomplete SSO profiles are shown as Invalid Configuration. SSO profiles mixed with role chaining, static keys, web identity, or an external credential process are deliberately unsupported. Bearer-token-only sessions without an account and role cannot resolve AWS role credentials and are shown as invalid.

## Commands and menu bar usage

**AWS SSO Status** lists all matching profiles. Select one to inspect its account ID from config, role, region, SSO session, credential expiration, remaining time, and last check. Actions include Sign In / Sign In Again, Refresh Status, Open AWS Console, copy profile/account identifiers, and preferences. Refresh Status checks the selected profile; use Refresh All Profiles to rediscover the configuration.

**AWS SSO Login** is a quick no-view command. Run it directly (or assign a Raycast hotkey) to sign in with the Primary Profile. With no primary configured, it chooses `default`, otherwise the first matching profile alphabetically. An optional profile argument selects another discovered profile. The Profile Filter still applies; nonexistent, excluded, and invalid profiles are rejected before login. It skips bulk credential checks, runs browser login, verifies the selected profile's credentials, and refreshes the menu bar. Login success is only reported as ready when credential resolution succeeds.

**AWS SSO Menu Bar** is a native `MenuBarExtra`. Run it once in Raycast and enable Background Refresh in Raycast preferences. Its declared interval is **1 minute**; Raycast controls actual scheduling and may delay updates while asleep or idle. There are no per-second timers. The title is a snapshot as of the last refresh.

Remaining Time mode shows only `3h 42m`, `42m`, or `< 1m`. Simple mode shows only **✓** when credentials are currently usable (including Expiring Soon), or **✕** when usable credentials cannot be confirmed. Errors and Unknown also show ✕; this does not necessarily mean you signed out. Remaining Time mode falls back to ✕ when no valid time is available. Only initial loading without a prior result shows `…`. Reopening the menu preserves the cached title during background work. A native cloud icon precedes the time or check/cross symbol. There is no AWS label or profile prefix. The previous Show Profile preference has been removed; existing Status Only preferences now use the check/cross display.

Results older than two minutes are labeled **Stale**, with an orange cloud. A failed check preserves the historical expiration and Last Successful Check for reference but does not claim credentials are currently usable. Simple mode shows ✕ for stale data. The menu shows Last Checked, Last Successful Check, and Next Automatic Check.

Use **Switch Primary Profile** directly in the menu; the change applies immediately and is shared with quick login. This selection is local extension state, not an edit to AWS config or Raycast preferences. **Use Preference Default** clears it. Changing the Primary Profile preference to a different value also overrides the menu selection.

**AWS SSO Diagnostics** shows the selected config path, AWS CLI path/version, and discovered profile/session counts. It does not export diagnostics or display credentials.

The tooltip identifies the selected profile and status. The dropdown shows current details and a submenu per matching profile with status, time, sign-in, and refresh actions. Its footer provides Refresh, Open AWS SSO Status, and Preferences.

The selected profile is an extension display preference; **it does not change your Terminal's AWS_PROFILE or global AWS configuration**. If no Primary Profile is set, choose `default`, otherwise the first SSO profile alphabetically. An explicitly configured profile excluded by the filter produces a setup message instead of silently switching accounts.

Sign In invokes AWS CLI with separate arguments and lets it open the default browser. A Toast remains active while you authenticate. Each browser login has a 3-minute timeout. Concurrent login requests for the same session join the existing operation (waiting up to 190 seconds for its lock) instead of launching another browser flow. All matching profiles sharing that session are refreshed afterward; account/role credentials remain independently resolved. Failed login Toasts provide Retry and Open AWS SSO Status actions. If browser opening is unavailable, run `aws sso login --profile dev` in Terminal, then Refresh.

Open AWS Console opens the configured AWS access portal; choose the account and role there. It does not generate credential-bearing federation URLs. Only HTTPS `*.awsapps.com/start` (including China domains) URLs without user info, query strings, or fragments are eligible. Issuer URLs and custom portal domains do not expose this action.

## Preferences

| Preference              | Default        | Meaning                                                                 |
| ----------------------- | -------------- | ----------------------------------------------------------------------- |
| Language                | English        | English, 繁體中文, 简体中文, 日本語, 한국어                             |
| Primary Profile         | Empty          | Prefer default, otherwise first alphabetically                          |
| Profile Filter          | Empty          | Exact comma-separated profile names; empty includes all                 |
| Expiring Soon Threshold | 30 minutes     | 15 minutes, 30 minutes, 1 hour, or 2 hours                              |
| Menu Bar Style          | Remaining Time | Remaining Time or Simple (✓ / ✕)                                        |
| Sign-In Reminder        | Off            | One Raycast Toast/HUD when a previously usable session requires sign-in |
| AWS CLI Path            | Empty          | Optional absolute executable path for custom installations              |

The **Language** preference supports English (default), 繁體中文, 简体中文, 日本語, and 한국어. It translates extension views, menu contents, status labels, errors, and login Toasts. Dates follow the chosen locale; compact durations keep `h` / `m` consistently across languages. User profile names and AWS identifiers are never translated. Reopen a command or refresh the menu after changing preferences.

Raycast's [current Store guidance](https://developers.raycast.com/basics/prepare-an-extension-for-store) does not provide native manifest localization. Command names, preference labels, and Store metadata therefore remain US English; the extension implements its own optional runtime translation catalog with English fallback. Store acceptance of optional translations remains subject to review.

The optional reminder uses Raycast Toast/HUD, not macOS Notification Center. It is emitted once per sign-out episode, is quiet on first discovery of an already signed-out session, and rearms after successful resolution. Network failures do not trigger a sign-in reminder. When the Raycast window is closed, Toast actions may not be available in the HUD; use AWS SSO Login or the menu to recover.

Raycast owns all declared preferences; there is no custom settings command. GUI applications may not inherit your shell's PATH or AWS_CONFIG_FILE. CLI discovery checks the PATH visible to Raycast, Apple Silicon and Intel Homebrew paths, and standard AWS installer locations. Use AWS CLI Path if needed. Shell aliases and functions are not executables.

## Meaning of Remaining Time

**Remaining Time is the TTL of currently resolved AWS temporary credentials, not the IAM Identity Center browser reauthentication deadline.**

The extension runs `aws configure export-credentials --profile <name> --format process`. It parses only the ISO expiration and immediately releases references to all other fields. When the modern SSO token provider can refresh, the next check may return a later expiration without any browser interaction. The extension does not read SSO cache `expiresAt` or implement OAuth refresh.

| Status                | Meaning                                                                                             |
| --------------------- | --------------------------------------------------------------------------------------------------- |
| Signed In             | CLI resolved temporary credentials with expiration beyond the warning threshold                     |
| Expiring Soon         | CLI resolved credentials within the threshold                                                       |
| Expired               | CLI returned a credential expiration at or before the check time                                    |
| Not Signed In         | CLI reports missing/invalid/expired SSO authentication requiring sign-in                            |
| Invalid Configuration | Config syntax, required SSO settings, or credential provider conflicts prevent use                  |
| AWS CLI Not Found     | No executable can be found                                                                          |
| Checking              | Initial/loading state while resolution is pending                                                   |
| Unknown               | Timeout, network/permission error, unsupported CLI, missing expiration, or refresh budget exhausted |

An expired SSO login commonly yields **Not Signed In**, because AWS CLI cannot resolve credentials at all. A network error is Unknown, not a claim that you signed out. Signed In means credential resolution succeeded; it is not an STS identity check and does not promise authorization for every AWS service. Account ID comes from config, not a verified identity request.

## Security & Privacy

- All AWS data stays on the user's Mac.
- No credentials are transmitted to the extension author.
- No analytics or telemetry.
- The extension never stores AWS access keys or session tokens.
- No Keychain, LocalStorage, credential clipboard actions, or credential files created by the extension.
- AWS CLI performs its normal AWS authentication/refresh network exchanges and manages its own existing credential/token caches. The local-data guarantee concerns extension processing, not the necessary AWS authentication protocol.
- Child stdout/stderr is never logged or shown. Only allowlisted, fixed error messages reach UI. No raw child-process errors escape the CLI boundary.
- Temporary credential JSON exists briefly in process memory; JavaScript garbage collection cannot guarantee secure memory zeroization. It is never persisted by extension code.
- The extension reads the selected AWS config for metadata and checks executable paths. It does not directly read or modify SSO cache, shared credentials, or unrelated user files.
- Inherited static credentials and web identity variables are removed for the child process; the shared credential file is set to `/dev/null` so it cannot shadow a direct SSO profile. Custom credential processes in SSO profiles are rejected.
- CLI uses `spawn` with `shell: false` and argument arrays. Commands have deadlines, bounded output, and process-group termination on timeout. There is no automatic browser login in background refresh.
- Profile names/account metadata may appear in Raycast's normal local UI persistence. UI snapshots (profile metadata and status only) and the selected profile use Raycast Cache. Per-profile status timestamps, expiration, retry counters, session login timestamps, and reminder state are stored in the extension support directory in allowlisted JSON files with mode 0600. Config parsing is cached in memory. No access keys, session tokens, SSO tokens, or raw CLI output are stored.

Trust the AWS configuration, executable, and endpoint settings on your Mac. Do not submit real credentials, company identifiers, or SSO URLs in issues or screenshots.

## Architecture and performance

`src/aws/config.ts` parses selected INI metadata and caches it by file path/inode/mtime/ctime/size within each runtime. Raycast unloads menu commands between runs, so a new runtime reads the file again. `profiles.ts` builds and validates SSO models; `cli.ts` isolates executable discovery, safe process execution, and error classification; `status.ts` resolves credentials and calculates state. Formatting is pure. A shared React hook coordinates loading/login; separate components render the list and native menu.

`coordinator.ts` groups profiles by SSO session and serializes operations within each session using `proper-lockfile` across Raycast command runtimes. Status results are cached by session/account/role/configuration and reused for 60 seconds. Profile aliases resolving the same target share metadata, while different accounts or roles are never conflated. Reopening a recently checked menu launches no AWS subprocess. Config path/revision and CLI settings scope the cache; changing them invalidates reuse. The same session's successful browser login invalidates older role checks.

Each refresh processes at most two different sessions concurrently. Individual credential processes have an 8-second timeout, with a 24-second overall scheduling budget and a 3-second version probe. Contended background checks wait at most one second for a session lock and preserve prior metadata if the lock is busy. The session lock renews every 10 seconds and recovers abandoned locks after four minutes. Background launches are not a global cross-session concurrency limiter across separate Raycast commands.

Connection failures use shared session backoff: 1, 2, 4, 8, then 15 minutes. A known login-required session is checked every five minutes. Other failures back off per profile. Manual Refresh bypasses backoff while still coordinating concurrent requests. Profiles beyond the budget show Unknown and can be refreshed individually. No STS probes, filesystem watchers, per-second AWS calls, or AWS SDK dependencies are used.

The CLI approach preserves the installed AWS CLI's SSO lifecycle, minimizes dependencies, and uses the same executable for login and resolution. An AWS SDK provider would also materialize credentials in memory while adding provider dependencies and potential version drift from the CLI; it offers no decisive security advantage here. Sources checked September 9, 2026: [CLI credential export](https://docs.aws.amazon.com/cli/latest/reference/configure/export-credentials.html), [SSO token provider](https://docs.aws.amazon.com/sdkref/latest/guide/feature-sso-credentials.html), [Raycast menu lifecycle](https://developers.raycast.com/api-reference/menu-bar-commands), [background refresh](https://developers.raycast.com/information/lifecycle/background-refresh). Implemented against `@raycast/api` 2.2.1.

## Troubleshooting

- **No profiles:** configure SSO and check the filter and AWS_CONFIG_FILE visible to Raycast. A missing file gives an empty state. Config files over 1 MiB or duplicate sections/keys are rejected.
- **No CLI / unsupported:** install a current CLI v2; set the absolute AWS CLI Path if PATH differs from Terminal.
- **Not Signed In:** choose Sign In and finish browser authentication. Legacy sessions may require more frequent manual sign-in.
- **Unknown:** verify network and assigned account/role permissions. Retry a single profile. CLI diagnostic wording may vary; unrecognized failures stay Unknown.
- **Menu bar not updating:** enable background refresh and run the command once. Check available macOS menu bar space. The displayed time does not tick between Raycast refreshes.
- **Config edited while view is open:** use Refresh All Profiles or menu Refresh to rediscover profiles.

## Development

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run dev
```

`npm run dev` installs the development extension into Raycast and watches source files. Search for the four AWS SSO commands in Raycast. No real AWS configuration or credentials are required by the automated tests; temporary fixtures and a fake executable exercise error paths and argument safety.

See [release and manual test checklist](docs/RELEASE.md) for native UI verification, GitHub preparation, and Raycast Store submission. Build success alone does not verify browser authentication or native background scheduling.

## License

MIT. See [LICENSE](LICENSE). This independent project is not affiliated with AWS or Raycast.

## Project support

A voluntary **Star on GitHub** link is wired into the menu footer and Status Actions. It only opens the project's repository after a user clicks; it never stars automatically, sends reminders, gates functionality, or requests GitHub access. The link points to [burger66leo/raycast-aws-sso-status](https://github.com/burger66leo/raycast-aws-sso-status).

The [Raycast extension guidelines](https://manual.raycast.com/extensions-guidelines) do not explicitly prohibit such a link. This is an interpretation of current guidance, not preapproval by Raycast; reviewers may request changes. GitHub publication is separate from Raycast Store approval.
