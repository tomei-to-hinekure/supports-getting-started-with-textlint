import type { TextlintPluginCreator } from "@textlint/types";
import { SVGProcessor } from "./SVGProcessor.ts";

export default {
  Processor: SVGProcessor,
} satisfies TextlintPluginCreator;
