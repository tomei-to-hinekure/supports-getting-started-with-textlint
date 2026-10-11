import type {
  TextlintFixableRuleModule,
  TextlintRuleReporter,
} from "@textlint/types";

export interface Options {
  allowList?: string[];
}

const reporter: TextlintRuleReporter<Options> = (context, options = {}) => {
  const { Syntax, getSource, locator, RuleError, report, fixer } = context;
  const allowList = options.allowList ?? [];

  return {
    [Syntax.Str](node) {
      const text = getSource(node);
      if (allowList.some((allow) => text.includes(allow))) {
        return;
      }

      const matches = text.matchAll(/NG/g);
      for (const match of matches) {
        const index = match.index ?? 0;
        const range = [index, index + match[0].length] as const;
        report(
          node,
          new RuleError("「NG」の文字列は使わないでください", {
            padding: locator.range(range),
            fix: fixer.replaceTextRange(range, "OK"),
          }),
        );
      }
    },
  };
};

export default {
  linter: reporter,
  fixer: reporter,
} satisfies TextlintFixableRuleModule;
