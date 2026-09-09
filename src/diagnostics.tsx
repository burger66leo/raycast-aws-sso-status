import { Action, ActionPanel, Detail, openExtensionPreferences } from "@raycast/api";
import { useEffect, useMemo, useState } from "react";
import { configPath, readAwsConfig } from "./aws/config";
import { findAwsCli, runAws, CliError } from "./aws/cli";
import { discoverProfiles, filterProfiles } from "./aws/profiles";
import { sessionKey } from "./aws/store";
import { scopeFor } from "./aws/coordinator";
import { effectiveSettings } from "./runtime";
import { translator } from "./i18n";

export default function Diagnostics() {
  const [settings] = useState(effectiveSettings);
  const t = useMemo(() => translator(settings.language), [settings.language]);
  const [loading, setLoading] = useState(true);
  const [fields, setFields] = useState<[string, string][]>([]);
  const [message, setMessage] = useState("");
  useEffect(() => {
    async function inspect() {
      const rows: [string, string][] = [["AWS Config File", configPath()]];
      try {
        const profiles = filterProfiles(discoverProfiles(await readAwsConfig()), settings.profileFilter);
        rows.push(
          ["Profiles", String(profiles.length)],
          ["SSO Sessions", String(new Set(profiles.map((profile) => sessionKey(profile, scopeFor(settings)))).size)],
        );
        const path = await findAwsCli(settings.awsCliPath);
        rows.push(["AWS CLI Path", path || t("AWS CLI Not Found")]);
        if (path) {
          const output = await runAws(path, ["--version"], { timeoutMs: 3000 });
          rows.push(["AWS CLI Version", /^aws-cli\/([0-9.]+)/.exec(output)?.[1] || t("Unknown")]);
        }
      } catch (error) {
        setMessage(
          t(
            error instanceof CliError
              ? error.message
              : "AWS config is unreadable or invalid. Check its INI syntax and file permissions.",
          ),
        );
      } finally {
        setFields(rows);
        setLoading(false);
      }
    }
    void inspect();
  }, [settings, t]);
  return (
    <Detail
      isLoading={loading}
      markdown={message || t("Diagnostics are local only. No credentials or tokens are displayed.")}
      metadata={
        <Detail.Metadata>
          {fields.map(([title, value]) => (
            <Detail.Metadata.Label key={title} title={t(title)} text={value} />
          ))}
        </Detail.Metadata>
      }
      actions={
        <ActionPanel>
          <Action title={t("Open Extension Preferences")} onAction={openExtensionPreferences} />
        </ActionPanel>
      }
    />
  );
}
