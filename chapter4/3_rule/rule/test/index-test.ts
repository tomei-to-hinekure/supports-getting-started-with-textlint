import TextLintTester from "textlint-tester";
import rule from "../src/index";

const tester = new TextLintTester();
tester.run("textlint-rule-no-ng", rule, {
  valid: [
    "# OK Header",
    "This is OK text.",
    {
      text: "NGO is Non-Governmental Organization",
      options: {
        allowList: ["NGO"],
      },
    },
  ],
  invalid: [
    {
      text: "# NG Header",
      errors: [
        {
          message: "「NG」の文字列は使わないでください",
          range: [2, 4],
        },
      ],
    },
    {
      text: "This is NG text.",
      errors: [
        {
          message: "「NG」の文字列は使わないでください",
          range: [8, 10],
        },
      ],
    },
    {
      text: "NGO is Non-Governmental Organization",
      errors: [
        {
          message: "「NG」の文字列は使わないでください",
          range: [0, 2],
        },
      ],
    },
  ],
});
