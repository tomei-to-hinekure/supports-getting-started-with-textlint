import { ASTNodeTypes } from "@textlint/ast-node-types";
import type {
  TxtDocumentNode,
  TxtNodeRange,
  TxtParentNode,
  TxtStrNode,
} from "@textlint/ast-node-types";
import type { Element, Text } from "hast";
import rehypeParse from "rehype-parse";
import { StructuredSource } from "structured-source";
import { unified } from "unified";
import { SKIP, visit } from "unist-util-visit";

const TEXT_CONTENT_TAG_NAMES = ["title", "desc", "text"] as const;
type TextContentTagName = (typeof TEXT_CONTENT_TAG_NAMES)[number];

type TxtTextContentNode = Omit<TxtParentNode, "type" | "children"> & {
  type: TextContentTagName;
  children: TxtStrNode[];
};

const toRange = (nodeOrElement: Text | Element): TxtNodeRange => {
  const position = nodeOrElement.position!;
  return [position.start.offset!, position.end.offset!];
};

export const parse = (text: string): TxtDocumentNode => {
  const source = new StructuredSource(text);

  const createStr = (node: Text): TxtStrNode => {
    const range = toRange(node);
    return {
      type: ASTNodeTypes.Str,
      range,
      loc: source.rangeToLocation(range),
      raw: text.slice(range[0], range[1]),
      value: node.value,
    };
  };

  const createTextContentNode = (
    element: Element,
    strNodes: TxtStrNode[],
  ): TxtTextContentNode => {
    const range = toRange(element);
    return {
      type: element.tagName as TextContentTagName,
      range,
      loc: source.rangeToLocation(range),
      raw: text.slice(range[0], range[1]),
      children: strNodes,
    };
  };

  const textContentNodes: TxtTextContentNode[] = [];
  visit(
    unified().use(rehypeParse, { fragment: true }).parse(text),
    "element",
    (element) => {
      if (
        !(TEXT_CONTENT_TAG_NAMES as readonly string[]).includes(element.tagName)
      ) {
        return;
      }

      const strNodes: TxtStrNode[] = [];
      visit(element, "text", (textNode) => {
        strNodes.push(createStr(textNode));
      });
      textContentNodes.push(createTextContentNode(element, strNodes));

      return SKIP;
    },
  );

  const range: TxtNodeRange = [0, text.length];
  return {
    type: ASTNodeTypes.Document,
    range,
    loc: source.rangeToLocation(range),
    raw: text,
    children: textContentNodes,
  } as unknown as TxtDocumentNode;
};
