import assert from "node:assert";
import { describe, it } from "node:test";
import { TextlintKernel } from "@textlint/kernel";
import markdownPlugin from "@textlint/textlint-plugin-markdown";
import filterRule from "../src/index.ts";

const lintMarkdown = (text: string) => {
  const kernel = new TextlintKernel();
  return kernel.lintText(text, {
    filePath: "input.md",
    ext: ".md",
    plugins: [{ pluginId: "markdown", plugin: markdownPlugin.default }],
    rules: [
      {
        ruleId: "dummy-rule",
        rule: (context) => {
          const { Syntax, RuleError, report } = context;
          return {
            [Syntax.Str](node) {
              report(node, new RuleError("dummy-rule violation"));
            },
          };
        },
      },
    ],
    filterRules: [{ ruleId: "filter", rule: filterRule }],
  });
};

describe("textlint-filter-rule-nocheck", () => {
  it("先頭にtextlint-nocheckがあるときはファイル全体を無視する", async () => {
    const { messages } = await lintMarkdown(`<!-- textlint-nocheck -->

This is ignored.

This is also ignored.
`);
    assert.strictEqual(messages.length, 0);
  });

  it("textlint-nocheckがないときは無視しない", async () => {
    const { messages } = await lintMarkdown(`This is Error.
`);
    assert.strictEqual(messages.length, 1);
  });

  it("先頭以外にtextlint-nocheckがあるときは無視しない", async () => {
    const { messages } = await lintMarkdown(`This is Error.

<!-- textlint-nocheck -->

This is also Error.
`);
    assert.strictEqual(messages.length, 2);
  });

  it("段落の途中にあるtextlint-nocheckは無視しない", async () => {
    const { messages } =
      await lintMarkdown(`This is <!-- textlint-nocheck --> Error.
`);
    assert.strictEqual(messages.length, 2);
  });

  it("別のコメントが先頭にあるときは無視しない", async () => {
    const { messages } = await lintMarkdown(`<!-- textlint-disable -->

This is Error.
`);
    assert.strictEqual(messages.length, 1);
  });

  it("`<!--`の後に半角空白がないときは無視しない", async () => {
    const { messages } = await lintMarkdown(`<!--textlint-nocheck -->

This is Error.
`);
    assert.strictEqual(messages.length, 1);
  });

  it("`-->`の前に半角空白がないときは無視しない", async () => {
    const { messages } = await lintMarkdown(`<!-- textlint-nocheck-->

This is Error.
`);
    assert.strictEqual(messages.length, 1);
  });

  it("textlint-nocheckで始まる別のコメントは無視しない", async () => {
    const { messages } = await lintMarkdown(`<!-- textlint-nocheckable -->

This is Error.
`);
    assert.strictEqual(messages.length, 1);
  });
});
