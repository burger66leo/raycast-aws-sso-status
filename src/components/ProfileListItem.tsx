import Diagnostics from "../diagnostics";
import { ProjectAction } from "./ProjectAction";
import { translator } from "../i18n";
import { Action, ActionPanel, Color, Icon, Keyboard, List, openExtensionPreferences } from "@raycast/api";
import { consoleUrl } from "../aws/profiles";
import { CredentialStatus, ProfileStatus } from "../aws/types";
import { displayDate, formatRemainingTime } from "../formatting";
export function statusIcon(status: CredentialStatus) {
  return {
    source: status === "Signed In" ? Icon.CheckCircle : status === "Checking" ? Icon.Clock : Icon.ExclamationMark,
    tintColor: status === "Signed In" ? Color.Green : status === "Expiring Soon" ? Color.Orange : Color.SecondaryText,
  };
}
export function loginLabel(item: ProfileStatus, language?: string) {
  return translator(language)(
    ["Signed In", "Expiring Soon", "Expired"].includes(item.status) ? "Sign In Again" : "Sign In",
  );
}
export function ProfileListItem({
  item,
  language,
  sharedProfiles,
  onSignIn,
  onRefresh,
  onRefreshAll,
}: {
  item: ProfileStatus;
  language?: string;
  sharedProfiles: string[];
  onSignIn: () => Promise<void>;
  onRefresh: () => Promise<void>;
  onRefreshAll: () => Promise<void>;
}) {
  const t = translator(language);
  const profile = item.profile;
  const portal = consoleUrl(profile);
  const fields = [
    ["Status", t(item.status)],
    ["Account ID", profile.accountId],
    ["Role", profile.roleName],
    ["Region", profile.region],
    ["SSO Region", profile.ssoRegion],
    ["SSO Session", profile.sessionName || t("Legacy")],
    ["Credential Expiration", t(displayDate(item.expiration, language))],
    ["Remaining Time", t(formatRemainingTime(item.expiration))],
    ["Shared Profiles", sharedProfiles.join(", ")],
    ["Last Successful Check", t(displayDate(item.lastSuccessAt, language))],
    ["Data Freshness", t(item.stale ? "Stale — showing the last known result" : "Current")],
    ["Last Checked", t(displayDate(item.checkedAt, language))],
  ];
  return (
    <List.Item
      title={profile.name}
      icon={statusIcon(item.status)}
      accessories={[{ text: t(item.status) }]}
      detail={
        <List.Item.Detail
          markdown={t(
            item.message ||
              "Remaining time is the resolved AWS credential lifetime. AWS CLI may refresh credentials automatically while your Identity Center session remains valid.",
          )}
          metadata={
            <List.Item.Detail.Metadata>
              {fields.map(([title, value]) => (
                <List.Item.Detail.Metadata.Label key={title} title={t(title!)} text={value || t("Not configured")} />
              ))}
            </List.Item.Detail.Metadata>
          }
        />
      }
      actions={
        <ActionPanel>
          {!profile.issues.length && <Action title={loginLabel(item, language)} icon={Icon.Key} onAction={onSignIn} />}
          <Action
            title={t("Refresh Status")}
            icon={Icon.ArrowClockwise}
            shortcut={Keyboard.Shortcut.Common.Refresh}
            onAction={onRefresh}
          />
          <Action title={t("Refresh All Profiles")} icon={Icon.ArrowClockwise} onAction={onRefreshAll} />
          {portal && <Action.OpenInBrowser title={t("Open AWS Console")} url={portal} />}
          <Action.CopyToClipboard title={t("Copy Profile Name")} content={profile.name} />
          {profile.accountId && <Action.CopyToClipboard title={t("Copy Account ID")} content={profile.accountId} />}
          <Action title={t("Open Extension Preferences")} icon={Icon.Gear} onAction={openExtensionPreferences} />
          <ActionPanel.Section>
            <Action.Push title={t("Diagnostics")} icon={Icon.WrenchScrewdriver} target={<Diagnostics />} />
            <ProjectAction language={language} />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
}
