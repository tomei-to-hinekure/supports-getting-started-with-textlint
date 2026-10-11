import assert from "node:assert";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { test } from "@textlint/ast-tester";
import { parse } from "../src/svg-to-ast.ts";

describe("svg-to-ast", () => {
  const fixtureDirs = path.join(import.meta.dirname, "/fixtures/svg-to-ast");
  for (const fixtureDir of readdirSync(fixtureDirs)) {
    it(`${path.basename(fixtureDir)} matches AST`, () => {
      const input = readFileSync(
        path.join(fixtureDirs, fixtureDir, "input.svg"),
        "utf-8",
      );
      const AST = parse(input);

      test(AST as unknown as Record<string, unknown>);

      const output = readFileSync(
        path.join(fixtureDirs, fixtureDir, "output.json"),
        "utf-8",
      );
      assert.deepStrictEqual(AST, JSON.parse(output));
    });
  }
});
