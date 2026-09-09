import { sessionKey } from "./aws/store";
import { scopeFor } from "./aws/coordinator";
import Diagnostics from "./diagnostics";
import { ProjectAction } from "./components/ProjectAction";
import { Action, ActionPanel, Icon, List, openExtensionPreferences } from "@raycast/api";
import { ProfileListItem } from "./components/ProfileListItem";
import { useProfiles } from "./hooks/useProfiles";
export default function Command() {
  const state = useProfiles();
  const { t } = state;
  return (
    <List
      isLoading={state.loading || state.signingIn}
      isShowingDetail={state.profiles.length > 0}
      searchBarPlaceholder={t("Search SSO profiles")}
    >
      <List.EmptyView
        icon={Icon.Cloud}
        title={t(state.error || (state.loading ? "Checking AWS Profiles" : "No IAM Identity Center Profiles"))}
        description={state.notice ? t(state.notice) : undefined}
        actions={
          <ActionPanel>
            <Action title={t("Refresh Status")} onAction={state.refresh} icon={Icon.ArrowClockwise} />
            <Action title={t("Open Extension Preferences")} onAction={openExtensionPreferences} icon={Icon.Gear} />
            <Action.OpenInBrowser
              title={t("IAM Identity Center Setup Guide")}
              url="https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html"
            />
            <Action.Push title={t("Diagnostics")} icon={Icon.WrenchScrewdriver} target={<Diagnostics />} />
            <ProjectAction language={state.settings.language} />
          </ActionPanel>
        }
      />
      {state.profiles.map((item) => (
        <ProfileListItem
          key={item.profile.name}
          item={item}
          language={state.settings.language}
          sharedProfiles={state.profiles
            .filter(
              (other) =>
                sessionKey(other.profile, scopeFor(state.settings)) ===
                sessionKey(item.profile, scopeFor(state.settings)),
            )
            .map((other) => other.profile.name)}
          onSignIn={() => state.signIn(item)}
          onRefresh={() => state.refreshOne(item)}
          onRefreshAll={state.refresh}
        />
      ))}
    </List>
  );
}
