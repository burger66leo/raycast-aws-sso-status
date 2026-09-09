import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import ts from "typescript";
import { languages, resolveLanguage, translator } from "../src/i18n";
import { messages } from "../src/i18n/messages";
import { displayDate } from "../src/formatting";
import { cliErrorMessage, CliFailure } from "../src/aws/cli";
import { discoverProfiles } from "../src/aws/profiles";
import { parseAwsConfig } from "../src/aws/config";

test("all messages have five nonempty translations and English remains the default", () => {
  assert.equal(languages.length, 5);
  for (const [key, translations] of Object.entries(messages)) {
    assert.equal(translations.length, languages.length);
    assert.equal(translations[0], key);
    languages.forEach((language, index) => {
      assert.ok(translations[index].trim());
      assert.equal(translator(language)(key), translations[index]);
    });
  }
  assert.equal(resolveLanguage("unsupported"), "en");
  assert.equal(translator()("Sign In"), "Sign In");
  assert.equal(translator("zh-TW")("Sign In"), "登入");
  assert.equal(translator("zh-CN")("Sign In"), "登录");
  assert.equal(translator("ja")("Sign In"), "サインイン");
  assert.equal(translator("ko")("Sign In"), "로그인");
  assert.equal(translator("ja")("dev-test_one"), "dev-test_one");
});
test("sanitized CLI errors and joined configuration issues translate completely", () => {
  const failures: CliFailure[] = ["missing", "timeout", "login-required", "configuration", "unsupported", "failed"];
  const profile = discoverProfiles(parseAwsConfig("[profile dev]\nsso_session=missing\ncredential_process=not-run"))[0];
  for (const language of languages.slice(1)) {
    const t = translator(language);
    for (const failure of failures) assert.notEqual(t(cliErrorMessage(failure)), cliErrorMessage(failure));
    assert.equal(t(profile.issues.join(" ")), profile.issues.map(t).join(" "));
    for (const issue of profile.issues) assert.notEqual(t(issue), issue);
  }
});
test("dates follow the selected language and invalid language falls back safely", () => {
  const date = "2026-01-01T12:00:00Z";
  for (const language of languages)
    assert.equal(
      displayDate(date, language),
      new Date(date).toLocaleString(language === "en" ? "en-US" : language, {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    );
  assert.equal(displayDate(date, "not_a_locale"), displayDate(date, "en"));
});
test("literal UI translations and generated AWS messages are included in the catalog", () => {
  for (const file of [
    "src/aws-sso-menu-bar.tsx",
    "src/aws-sso-status.tsx",
    "src/components/ProfileListItem.tsx",
    "src/hooks/useProfiles.ts",
    "src/aws/status.ts",
    "src/sign-in.ts",
    "src/aws-sso-sign-in.ts",
    "src/aws/profiles.ts",
  ]) {
    const source = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true);
    function visit(node: ts.Node) {
      if (ts.isCallExpression(node)) {
        const translates = ts.isIdentifier(node.expression) && node.expression.text === "t";
        const issues = ts.isPropertyAccessExpression(node.expression) && node.expression.name.text === "push";
        if ((translates || issues) && node.arguments[0] && ts.isStringLiteral(node.arguments[0]))
          assert.ok(node.arguments[0].text in messages, `${file}: ${node.arguments[0].text}`);
      }
      if (
        ts.isPropertyAssignment(node) &&
        ["message", "notice"].includes(node.name.getText(source)) &&
        ts.isStringLiteral(node.initializer)
      )
        assert.ok(node.initializer.text in messages, `${file}: ${node.initializer.text}`);
      ts.forEachChild(node, visit);
    }
    visit(source);
  }
});
