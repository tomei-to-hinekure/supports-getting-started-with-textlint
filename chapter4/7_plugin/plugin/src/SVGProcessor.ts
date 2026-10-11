import type {
  TextlintMessage,
  TextlintPluginOptions,
  TextlintPluginPostProcessResult,
  TextlintPluginPreProcessResult,
} from "@textlint/types";
import { parse } from "./svg-to-ast.ts";

export class SVGProcessor {
  readonly #extensions: string[];

  constructor(options: TextlintPluginOptions = {}) {
    this.#extensions = Array.isArray(options.extensions)
      ? (options.extensions as string[])
      : [];
  }

  availableExtensions(): string[] {
    return [".svg"].concat(this.#extensions);
  }

  processor(_extension: string) {
    return {
      preProcess(
        text: string,
        _filePath?: string,
      ): TextlintPluginPreProcessResult {
        return parse(text);
      },
      postProcess(
        messages: TextlintMessage[],
        filePath?: string,
      ): TextlintPluginPostProcessResult {
        return {
          messages,
          filePath: filePath ?? "<svg>",
        };
      },
    };
  }
}
