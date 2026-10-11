import assert from "node:assert";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { TextlintKernel } from "@textlint/kernel";
import type { TextlintKernelOptions } from "@textlint/kernel";
import { moduleInterop } from "@textlint/module-interop";
import svgPlugin from "../src/index.ts";

const rules: TextlintKernelOptions["rules"] = [
  {
    ruleId: "no-todo",
    rule: moduleInterop(
      // @ts-expect-error
      (await import("textlint-rule-no-todo")).default,
    ),
  },
];

describe("SVGProcessor", () => {
  it(".svgファイルをlintできる", async () => {
    const kernel = new TextlintKernel();
    const fixturePath = path.join(import.meta.dirname, "/fixtures/test.svg");
    const { messages, filePath } = await kernel.lintText(
      readFileSync(fixturePath, "utf-8"),
      {
        filePath: fixturePath,
        ext: path.extname(fixturePath),
        plugins: [
          {
            pluginId: "svg",
            plugin: svgPlugin,
          },
        ],
        rules,
      },
    );

    assert.strictEqual(messages.length, 1);
    assert.strictEqual(filePath, fixturePath);
  });

  it("オプションで指定した拡張子をlintできる", async () => {
    const kernel = new TextlintKernel();
    const fixturePath = path.join(import.meta.dirname, "/fixtures/test.custom");
    const { messages, filePath } = await kernel.lintText(
      readFileSync(fixturePath, "utf-8"),
      {
        filePath: fixturePath,
        ext: path.extname(fixturePath),
        plugins: [
          {
            pluginId: "svg",
            plugin: svgPlugin,
            options: { extensions: [".custom"] },
          },
        ],
        rules,
      },
    );

    assert.strictEqual(messages.length, 1);
    assert.strictEqual(filePath, fixturePath);
  });

  it("ファイルパスがないときは、結果のファイルパスが`<svg>`になる", async () => {
    const kernel = new TextlintKernel();
    const { messages, filePath } = await kernel.lintText(
      `<svg xmlns="http://www.w3.org/2000/svg">
  <title>タイトル</title>
  <desc>説明</desc>
  <text>TODO: ここはrule違反になる</text>
</svg>
`,
      {
        ext: ".svg",
        plugins: [
          {
            pluginId: "svg",
            plugin: svgPlugin,
          },
        ],
        rules,
      },
    );

    assert.strictEqual(messages.length, 1);
    assert.strictEqual(filePath, "<svg>");
  });
});
