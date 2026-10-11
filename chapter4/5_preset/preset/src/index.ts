import type { TextlintConfigRulePreset } from "@textlint/config-loader";

const { moduleInterop } = require("@textlint/module-interop");
module.exports = {
  rules: {
    "no-ng": moduleInterop(require("textlint-rule-no-ng")),
    "no-todo": moduleInterop(require("textlint-rule-no-todo")),
  },
  rulesConfig: {
    "no-ng": {
      allowList: ["NGO"],
    },
    "no-todo": true,
  },
} satisfies TextlintConfigRulePreset["preset"];
