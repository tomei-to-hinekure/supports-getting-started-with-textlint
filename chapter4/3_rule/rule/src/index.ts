import type { TextlintRuleReporter } from "@textlint/types";

export interface Options {
  allowList?: string[];
}

const reporter: TextlintRuleReporter<Options> = (context, options = {}) => {
  const { Syntax, getSource, locator, RuleError, report } = context;
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
        report(
          node,
          new RuleError("「NG」の文字列は使わないでください", {
            padding: locator.range([index, index + match[0].length]),
          }),
        );
      }
    },
  };
};

export default reporter;
