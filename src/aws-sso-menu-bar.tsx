import { githubRepositoryUrl } from "./project";
import { Color, Icon, launchCommand, LaunchType, MenuBarExtra, open, openExtensionPreferences } from "@raycast/api";
import { consoleUrl, selectPrimary } from "./aws/profiles";
import { statusIcon, loginLabel } from "./components/ProfileListItem";
import { displayDate, formatRemainingTime, menuBarTitle } from "./formatting";
import { useProfiles } from "./hooks/useProfiles";
export default function Command() {
  const state = useProfiles();
  const { t } = state;
  const projectUrl = githubRepositoryUrl();
  const primary = selectPrimary(state.profiles, state.settings.primaryProfile);
  return (
    <MenuBarExtra
      icon={{ source: Icon.Cloud, tintColor: primary?.stale ? Color.Orange : undefined }}
      title={menuBarTitle(primary, state.settings, state.loading || state.signingIn)}
      isLoading={state.loading || state.signingIn}
      tooltip={`${primary ? `${primary.profile.name}: ${t(primary.status)}. ` : ""}${t("AWS temporary credential lifetime; not the SSO reauthentication deadline")}`}
    >
      <MenuBarExtra.Section title={t("Current Profile")}>
        {primary ? (
          <>
            <MenuBarExtra.Item
              title={primary.profile.name}
              subtitle={t(primary.status)}
              icon={statusIcon(primary.status)}
            />
            <MenuBarExtra.Item title={`${t("Remaining Time")}: ${t(formatRemainingTime(primary.expiration))}`} />
            <MenuBarExtra.Item
              title={`${t("Credential Expiration")}: ${t(displayDate(primary.expiration, state.settings.language))}`}
            />
            <MenuBarExtra.Item title={`${t("Account")}: ${primary.profile.accountId || t("Not configured")}`} />
            <MenuBarExtra.Item title={`${t("Role")}: ${primary.profile.roleName || t("Not configured")}`} />
            <MenuBarExtra.Item title={`${t("Region")}: ${primary.profile.region || t("Not configured")}`} />
            <MenuBarExtra.Item title={`${t("SSO Session")}: ${primary.profile.sessionName || t("Legacy")}`} />
            <MenuBarExtra.Item
              title={`${t("Last Checked")}: ${t(displayDate(primary.checkedAt, state.settings.language))}`}
            />
            <MenuBarExtra.Item
              title={`${t("Last Successful Check")}: ${t(displayDate(primary.lastSuccessAt, state.settings.language))}`}
            />
            {primary.stale && (
              <MenuBarExtra.Item title={t("Stale — showing the last known result")} icon={Icon.ExclamationMark} />
            )}
            {!!primary.nextRetryAt && primary.nextRetryAt > Date.now() && (
              <MenuBarExtra.Item
                title={`${t("Next Automatic Check")}: ${displayDate(new Date(primary.nextRetryAt).toISOString(), state.settings.language)}`}
              />
            )}
            <MenuBarExtra.Item title={t("Signing in refreshes all profiles using this SSO session.")} />
            {primary.message && <MenuBarExtra.Item title={t(primary.message)} />}
          </>
        ) : (
          <MenuBarExtra.Item title={t(state.notice || "Primary Profile was not found. Check preferences.")} />
        )}
      </MenuBarExtra.Section>
      <MenuBarExtra.Submenu title={t("Switch Primary Profile")}>
        {state.profiles.map((item) => (
          <MenuBarExtra.Item
            key={item.profile.name}
            title={item.profile.name}
            icon={item.profile.name === primary?.profile.name ? Icon.Check : undefined}
            onAction={() => state.selectProfile(item.profile.name)}
          />
        ))}
        <MenuBarExtra.Item title={t("Use Preference Default")} onAction={() => state.selectProfile()} />
      </MenuBarExtra.Submenu>
      <MenuBarExtra.Section title={t("Profiles")}>
        {state.profiles.map((item) => (
          <MenuBarExtra.Submenu
            key={item.profile.name}
            title={`${item.profile.name} · ${t(item.status)}`}
            icon={statusIcon(item.status)}
          >
            <MenuBarExtra.Item title={`${t("Remaining Time")}: ${t(formatRemainingTime(item.expiration))}`} />
            {item.stale && <MenuBarExtra.Item title={t("Stale — showing the last known result")} />}
            {item.message && <MenuBarExtra.Item title={t(item.message)} />}
            {!item.profile.issues.length && (
              <MenuBarExtra.Item
                title={loginLabel(item, state.settings.language)}
                icon={Icon.Key}
                onAction={() => state.signIn(item)}
              />
            )}
            <MenuBarExtra.Item title={t("Refresh Profile")} onAction={() => state.refreshOne(item)} />
            {consoleUrl(item.profile) && (
              <MenuBarExtra.Item title={t("Open AWS Console")} onAction={() => open(consoleUrl(item.profile)!)} />
            )}
          </MenuBarExtra.Submenu>
        ))}
      </MenuBarExtra.Section>
      <MenuBarExtra.Section>
        <MenuBarExtra.Item title={t("Refresh")} icon={Icon.ArrowClockwise} onAction={state.refresh} />
        <MenuBarExtra.Item
          title={t("Open AWS SSO Status")}
          onAction={() => launchCommand({ name: "aws-sso-status", type: LaunchType.UserInitiated })}
        />
        <MenuBarExtra.Item
          title={t("Diagnostics")}
          icon={Icon.WrenchScrewdriver}
          onAction={() => launchCommand({ name: "diagnostics", type: LaunchType.UserInitiated })}
        />
        <MenuBarExtra.Item title={t("Preferences")} icon={Icon.Gear} onAction={openExtensionPreferences} />
      </MenuBarExtra.Section>
      {projectUrl && (
        <MenuBarExtra.Section>
          <MenuBarExtra.Item title={t("Star on GitHub")} icon={Icon.Star} onAction={() => open(projectUrl)} />
        </MenuBarExtra.Section>
      )}
    </MenuBarExtra>
  );
}
