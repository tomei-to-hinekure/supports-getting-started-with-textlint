import assert from "node:assert";
import { describe, it } from "node:test";
import type { TextlintFixResult, TextlintResult } from "@textlint/types";
import formatter from "../src/index.ts";

const options = {
  formatterName: "violation-rules",
  color: true,
};

describe("textlint-formatter-violation-rules", () => {
  describe("linterFormatter", () => {
    it("rule違反がないときは、空文字列を返す", () => {
      const results: TextlintResult[] = [
        {
          messages: [],
          filePath: "/path/to/docs/sample.md",
        },
        {
          messages: [],
          filePath: "/path/to/docs/sample2.md",
        },
      ];

      assert.strictEqual(formatter(results, options), "");
    });

    it("rule違反があるときは、すべてのファイル内のruleIdを重複のなく列挙した文字列を返す", () => {
      const results: TextlintResult[] = [
        {
          messages: [
            {
              type: "lint",
              ruleId: "ja-spacing/ja-no-space-around-parentheses",
              message: "かっこの外側、内側ともにスペースを入れません。",
              index: 58,
              line: 3,
              column: 2,
              range: [58, 59],
              loc: {
                start: { line: 3, column: 2 },
                end: { line: 3, column: 3 },
              },
              severity: 2,
              fix: { range: [58, 59], text: "" },
            },
            {
              type: "lint",
              ruleId: "ja-spacing/ja-no-space-around-parentheses",
              message: "かっこの外側、内側ともにスペースを入れません。",
              index: 63,
              line: 3,
              column: 7,
              range: [63, 64],
              loc: {
                start: { line: 3, column: 7 },
                end: { line: 3, column: 8 },
              },
              severity: 2,
              fix: { range: [63, 64], text: "" },
            },
            {
              type: "lint",
              ruleId: "ja-spacing/ja-no-space-around-slash",
              message: "スラッシュの前後にスペースを入れません。",
              index: 116,
              line: 7,
              column: 2,
              range: [116, 117],
              loc: {
                start: { line: 7, column: 2 },
                end: { line: 7, column: 3 },
              },
              severity: 2,
              fix: { range: [116, 119], text: "/" },
            },
            {
              type: "lint",
              ruleId: "sentence-length",
              message:
                "Line 9 sentence length(105) exceeds the maximum sentence length of 100.\nOver 5 characters.",
              index: 122,
              line: 9,
              column: 115,
              range: [122, 227],
              loc: {
                start: { line: 9, column: 115 },
                end: { line: 9, column: 220 },
              },
              severity: 2,
            },
          ],
          filePath: "/path/to/docs/sample.md",
        },
        {
          messages: [
            {
              type: "lint",
              ruleId: "sentence-length",
              message:
                "Line 1 sentence length(105) exceeds the maximum sentence length of 100.\nOver 5 characters.",
              index: 0,
              line: 1,
              column: 1,
              range: [0, 105],
              loc: {
                start: { line: 1, column: 1 },
                end: { line: 1, column: 106 },
              },
              severity: 2,
            },
            {
              type: "lint",
              ruleId: "ja-spacing/ja-no-space-around-slash",
              message: "スラッシュの前後にスペースを入れません。",
              index: 156,
              line: 5,
              column: 2,
              range: [156, 157],
              loc: {
                start: { line: 5, column: 2 },
                end: { line: 5, column: 3 },
              },
              severity: 2,
              fix: { range: [156, 159], text: "/" },
            },
            {
              type: "lint",
              ruleId: "ja-spacing/ja-space-around-link",
              message: "リンクの後にスペースを入れません。",
              index: 266,
              line: 10,
              column: 30,
              range: [266, 267],
              loc: {
                start: { line: 10, column: 30 },
                end: { line: 10, column: 31 },
              },
              severity: 2,
              fix: { range: [265, 266], text: "" },
            },
          ],
          filePath: "/path/to/docs/sample2.md",
        },
      ];

      assert.strictEqual(
        formatter(results, options),
        "ja-spacing/ja-no-space-around-parentheses\nja-spacing/ja-no-space-around-slash\nja-spacing/ja-space-around-link\nsentence-length\n",
      );
    });
  });
  describe("fixerFormatter", () => {
    it("rule違反がないときは、空文字列を返す", () => {
      const results: TextlintFixResult[] = [
        {
          filePath: "/path/to/docs/sample.md",
          output: "",
          messages: [],
          applyingMessages: [],
          remainingMessages: [],
        },
        {
          filePath: "/path/to/docs/sample2.md",
          output: "",
          messages: [],
          applyingMessages: [],
          remainingMessages: [],
        },
      ];

      assert.strictEqual(formatter(results, options), "");
    });

    it("rule違反があるときは、すべてのファイル内で自動修正できたruleIdと自動修正できなかったruleIdを重複のなく列挙した文字列を返す（どちらにも属するruleIdは「自動修正できなかったruleId」として扱う）", () => {
      const results: TextlintFixResult[] = [
        {
          filePath: "/path/to/docs/sample.md",
          output:
            "`textlint-rule-ja-no-space-around-parentheses`の確認。\n「よい例」。\n「ダメな例」。\n\n`textlint-rule-ja-no-space-around-slash`の確認。\na/b。\na/b。\n\nあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえお。\n\n`textlint-rule-ja-no-mixed-period`の確認。\n\nあいうえお\n",
          messages: [
            {
              type: "lint",
              ruleId: "ja-no-mixed-period",
              message:
                '文末が"。"で終わっていません。\n理由: 日本語文章では"。"を使用します\n修正: "."を"。"に置き換えてください',
              index: 273,
              line: 11,
              column: 38,
              range: [273, 274],
              loc: {
                start: { line: 11, column: 38 },
                end: { line: 11, column: 39 },
              },
              severity: 2,
              fix: { range: [273, 274], text: "。" },
            },
            {
              type: "lint",
              ruleId: "ja-no-mixed-period",
              message:
                '文末が"。"で終わっていません。\n理由: 句点は文の境界を明確にし、読み手の理解を助けます\n修正: 適切な文末表現で文を完結させ、句点を追加してください\n例: 「〜です。」「〜ます。」「〜でした。」など',
              index: 280,
              line: 13,
              column: 5,
              range: [280, 281],
              loc: {
                start: { line: 13, column: 5 },
                end: { line: 13, column: 6 },
              },
              severity: 2,
            },
            {
              type: "lint",
              ruleId: "ja-spacing/ja-no-space-around-parentheses",
              message: "かっこの外側、内側ともにスペースを入れません。",
              index: 60,
              line: 3,
              column: 2,
              range: [60, 61],
              loc: {
                start: { line: 3, column: 2 },
                end: { line: 3, column: 3 },
              },
              severity: 2,
              fix: { range: [60, 61], text: "" },
            },
            {
              type: "lint",
              ruleId: "ja-spacing/ja-no-space-around-parentheses",
              message: "かっこの外側、内側ともにスペースを入れません。",
              index: 65,
              line: 3,
              column: 7,
              range: [65, 66],
              loc: {
                start: { line: 3, column: 7 },
                end: { line: 3, column: 8 },
              },
              severity: 2,
              fix: { range: [65, 66], text: "" },
            },
            {
              type: "lint",
              ruleId: "ja-spacing/ja-no-space-around-slash",
              message: "スラッシュの前後にスペースを入れません。",
              index: 119,
              line: 7,
              column: 2,
              range: [119, 120],
              loc: {
                start: { line: 7, column: 2 },
                end: { line: 7, column: 3 },
              },
              severity: 2,
              fix: { range: [119, 122], text: "/" },
            },
          ],
          applyingMessages: [
            {
              type: "lint",
              ruleId: "ja-no-mixed-period",
              message:
                '文末が"。"で終わっていません。\n理由: 日本語文章では"。"を使用します\n修正: "."を"。"に置き換えてください',
              index: 273,
              line: 11,
              column: 38,
              range: [273, 274],
              loc: {
                start: { line: 11, column: 38 },
                end: { line: 11, column: 39 },
              },
              severity: 2,
              fix: { range: [273, 274], text: "." },
            },
            {
              type: "lint",
              ruleId: "ja-spacing/ja-no-space-around-parentheses",
              message: "かっこの外側、内側ともにスペースを入れません。",
              index: 60,
              line: 3,
              column: 2,
              range: [60, 61],
              loc: {
                start: { line: 3, column: 2 },
                end: { line: 3, column: 3 },
              },
              severity: 2,
              fix: { range: [60, 60], text: " " },
            },
            {
              type: "lint",
              ruleId: "ja-spacing/ja-no-space-around-parentheses",
              message: "かっこの外側、内側ともにスペースを入れません。",
              index: 65,
              line: 3,
              column: 7,
              range: [65, 66],
              loc: {
                start: { line: 3, column: 7 },
                end: { line: 3, column: 8 },
              },
              severity: 2,
              fix: { range: [65, 65], text: " " },
            },
            {
              type: "lint",
              ruleId: "ja-spacing/ja-no-space-around-slash",
              message: "スラッシュの前後にスペースを入れません。",
              index: 119,
              line: 7,
              column: 2,
              range: [119, 120],
              loc: {
                start: { line: 7, column: 2 },
                end: { line: 7, column: 3 },
              },
              severity: 2,
              fix: { range: [119, 120], text: " / " },
            },
          ],
          remainingMessages: [
            {
              type: "lint",
              ruleId: "ja-no-mixed-period",
              message:
                '文末が"。"で終わっていません。\n理由: 句点は文の境界を明確にし、読み手の理解を助けます\n修正: 適切な文末表現で文を完結させ、句点を追加してください\n例: 「〜です。」「〜ます。」「〜でした。」など',
              index: 280,
              line: 13,
              column: 5,
              range: [280, 281],
              loc: {
                start: { line: 13, column: 5 },
                end: { line: 13, column: 6 },
              },
              severity: 2,
            },
          ],
        },
        {
          filePath: "/path/to/docs/sample2.md",
          output:
            "あいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえお\n\n`textlint-rule-ja-no-space-around-slash`の確認\na/b\na/b\n\n`textlint-rule-ja-space-around-link`の確認\n\n[package.json](package.json)とOKな例\n[package.json](package.json)とNGな例\n",
          messages: [
            {
              type: "lint",
              ruleId: "ja-no-mixed-period",
              message:
                '文末が"。"で終わっていません。\n理由: 句点は文の境界を明確にし、読み手の理解を助けます\n修正: 適切な文末表現で文を完結させ、句点を追加してください\n例: 「〜です。」「〜ます。」「〜でした。」など',
              index: 104,
              line: 1,
              column: 105,
              range: [104, 105],
              loc: {
                start: { line: 1, column: 105 },
                end: { line: 1, column: 106 },
              },
              severity: 2,
            },
            {
              type: "lint",
              ruleId: "ja-no-mixed-period",
              message:
                '文末が"。"で終わっていません。\n理由: 句点は文の境界を明確にし、読み手の理解を助けます\n修正: 適切な文末表現で文を完結させ、句点を追加してください\n例: 「〜です。」「〜ます。」「〜でした。」など',
              index: 159,
              line: 5,
              column: 5,
              range: [159, 160],
              loc: {
                start: { line: 5, column: 5 },
                end: { line: 5, column: 6 },
              },
              severity: 2,
            },
            {
              type: "lint",
              ruleId: "ja-no-mixed-period",
              message:
                '文末が"。"で終わっていません。\n理由: 句点は文の境界を明確にし、読み手の理解を助けます\n修正: 適切な文末表現で文を完結させ、句点を追加してください\n例: 「〜です。」「〜ます。」「〜でした。」など',
              index: 200,
              line: 7,
              column: 39,
              range: [200, 201],
              loc: {
                start: { line: 7, column: 39 },
                end: { line: 7, column: 40 },
              },
              severity: 2,
            },
            {
              type: "lint",
              ruleId: "ja-no-mixed-period",
              message:
                '文末が"。"で終わっていません。\n理由: 句点は文の境界を明確にし、読み手の理解を助けます\n修正: 適切な文末表現で文を完結させ、句点を追加してください\n例: 「〜です。」「〜ます。」「〜でした。」など',
              index: 270,
              line: 10,
              column: 34,
              range: [270, 271],
              loc: {
                start: { line: 10, column: 34 },
                end: { line: 10, column: 35 },
              },
              severity: 2,
            },
            {
              type: "lint",
              ruleId: "ja-spacing/ja-no-space-around-slash",
              message: "スラッシュの前後にスペースを入れません。",
              index: 156,
              line: 5,
              column: 2,
              range: [156, 157],
              loc: {
                start: { line: 5, column: 2 },
                end: { line: 5, column: 3 },
              },
              severity: 2,
              fix: { range: [156, 159], text: "/" },
            },
            {
              type: "lint",
              ruleId: "ja-spacing/ja-space-around-link",
              message: "リンクの後にスペースを入れません。",
              index: 264,
              line: 10,
              column: 30,
              range: [264, 265],
              loc: {
                start: { line: 10, column: 30 },
                end: { line: 10, column: 31 },
              },
              severity: 2,
              fix: { range: [263, 264], text: "" },
            },
          ],
          applyingMessages: [
            {
              type: "lint",
              ruleId: "ja-spacing/ja-no-space-around-slash",
              message: "スラッシュの前後にスペースを入れません。",
              index: 156,
              line: 5,
              column: 2,
              range: [156, 157],
              loc: {
                start: { line: 5, column: 2 },
                end: { line: 5, column: 3 },
              },
              severity: 2,
              fix: { range: [156, 157], text: " / " },
            },
            {
              type: "lint",
              ruleId: "ja-spacing/ja-space-around-link",
              message: "リンクの後にスペースを入れません。",
              index: 264,
              line: 10,
              column: 30,
              range: [264, 265],
              loc: {
                start: { line: 10, column: 30 },
                end: { line: 10, column: 31 },
              },
              severity: 2,
              fix: { range: [263, 263], text: " " },
            },
          ],
          remainingMessages: [
            {
              type: "lint",
              ruleId: "ja-no-mixed-period",
              message:
                '文末が"。"で終わっていません。\n理由: 句点は文の境界を明確にし、読み手の理解を助けます\n修正: 適切な文末表現で文を完結させ、句点を追加してください\n例: 「〜です。」「〜ます。」「〜でした。」など',
              index: 104,
              line: 1,
              column: 105,
              range: [104, 105],
              loc: {
                start: { line: 1, column: 105 },
                end: { line: 1, column: 106 },
              },
              severity: 2,
            },
            {
              type: "lint",
              ruleId: "ja-no-mixed-period",
              message:
                '文末が"。"で終わっていません。\n理由: 句点は文の境界を明確にし、読み手の理解を助けます\n修正: 適切な文末表現で文を完結させ、句点を追加してください\n例: 「〜です。」「〜ます。」「〜でした。」など',
              index: 159,
              line: 5,
              column: 5,
              range: [159, 160],
              loc: {
                start: { line: 5, column: 5 },
                end: { line: 5, column: 6 },
              },
              severity: 2,
            },
            {
              type: "lint",
              ruleId: "ja-no-mixed-period",
              message:
                '文末が"。"で終わっていません。\n理由: 句点は文の境界を明確にし、読み手の理解を助けます\n修正: 適切な文末表現で文を完結させ、句点を追加してください\n例: 「〜です。」「〜ます。」「〜でした。」など',
              index: 200,
              line: 7,
              column: 39,
              range: [200, 201],
              loc: {
                start: { line: 7, column: 39 },
                end: { line: 7, column: 40 },
              },
              severity: 2,
            },
            {
              type: "lint",
              ruleId: "ja-no-mixed-period",
              message:
                '文末が"。"で終わっていません。\n理由: 句点は文の境界を明確にし、読み手の理解を助けます\n修正: 適切な文末表現で文を完結させ、句点を追加してください\n例: 「〜です。」「〜ます。」「〜でした。」など',
              index: 270,
              line: 10,
              column: 34,
              range: [270, 271],
              loc: {
                start: { line: 10, column: 34 },
                end: { line: 10, column: 35 },
              },
              severity: 2,
            },
          ],
        },
      ];

      assert.strictEqual(
        formatter(results, options),
        "Fixed\nja-spacing/ja-no-space-around-parentheses\nja-spacing/ja-no-space-around-slash\nja-spacing/ja-space-around-link\n\nNot fixed\nja-no-mixed-period\n",
      );
    });
  });
});
