import { Action, Icon } from "@raycast/api";
import { translator } from "../i18n";
import { githubRepositoryUrl } from "../project";
export function ProjectAction({ language }: { language?: string }) {
  const url = githubRepositoryUrl();
  return url ? (
    <Action.OpenInBrowser title={translator(language)("Star on GitHub")} icon={Icon.Star} url={url} />
  ) : null;
}
