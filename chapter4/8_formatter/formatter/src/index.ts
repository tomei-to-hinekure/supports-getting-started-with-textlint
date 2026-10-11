import type { FormatterConfig as FixerFormatterConfig } from "@textlint/fixer-formatter";
import type { FormatterConfig as LinterFormatterConfig } from "@textlint/linter-formatter";
import type { TextlintFixResult, TextlintResult } from "@textlint/types";

type LinterFormatterFunction = (
  results: TextlintResult[],
  formatterConfig: LinterFormatterConfig,
) => string;
type FixerFormatterFunction = (
  results: TextlintFixResult[],
  formatterConfig: FixerFormatterConfig,
) => string;

const isTextlintFixResult = (
  results: TextlintResult[] | TextlintFixResult[],
): results is TextlintFixResult[] =>
  results.length > 0 && "output" in results[0];

const sortRuleId = (ruleIds: string[]) =>
  ruleIds.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

const linterFormatter: LinterFormatterFunction = (results, _option) => {
  let output = "";
  const ruleIds = new Set<string>();

  for (const { messages } of results) {
    for (const { ruleId } of messages) {
      ruleIds.add(ruleId);
    }
  }

  if (ruleIds.size > 0) {
    output += sortRuleId([...ruleIds]).join("\n");
    output += "\n";
  }

  return output;
};

const fixerFormatter: FixerFormatterFunction = (results, _option) => {
  let output = "";
  const fixedRuleIds = new Set<string>();
  const notFixedRuleIds = new Set<string>();

  for (const { applyingMessages, remainingMessages } of results) {
    for (const { ruleId } of applyingMessages) {
      fixedRuleIds.add(ruleId);
    }

    for (const { ruleId } of remainingMessages) {
      notFixedRuleIds.add(ruleId);
    }
  }

  const allFixedRuleIds = fixedRuleIds.difference(notFixedRuleIds);
  if (allFixedRuleIds.size > 0) {
    output += "Fixed\n";
    output += sortRuleId([...allFixedRuleIds]).join("\n");
    output += "\n";
  }

  if (notFixedRuleIds.size > 0) {
    if (output !== "") {
      output += "\n";
    }
    output += "Not fixed\n";
    output += sortRuleId([...notFixedRuleIds]).join("\n");
    output += "\n";
  }

  return output;
};

const formatter: LinterFormatterFunction & FixerFormatterFunction = (
  results,
  options,
) => {
  return isTextlintFixResult(results)
    ? fixerFormatter(results, options)
    : linterFormatter(results, options);
};

export default formatter;
