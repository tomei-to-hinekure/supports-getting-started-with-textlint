import type {
  TextlintFilterRuleModule,
  TextlintFilterRuleReporter,
} from "@textlint/types";

const NOCHECK_COMMENT = /^<!-- textlint-nocheck -->/;

const reporter: TextlintFilterRuleReporter = (context) => {
  const { Syntax, getSource, shouldIgnore } = context;

  return {
    [Syntax.Document](node) {
      const firstChild = node.children[0];
      if (
        firstChild === undefined ||
        firstChild.type !== Syntax.Html ||
        !NOCHECK_COMMENT.test(getSource(firstChild))
      ) {
        return;
      }

      shouldIgnore([0, getSource().length], { ruleId: "*" });
    },
  };
};

export default reporter satisfies TextlintFilterRuleModule;
