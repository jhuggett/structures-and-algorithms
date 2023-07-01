import { assertEquals } from "https://deno.land/std@0.190.0/testing/asserts.ts";
import { KDTree, KDTreeInput } from "./kdtree.ts";
import { multidimensionalRange } from "./range.ts";
import { Squirrel3 } from "https://raw.githubusercontent.com/jhuggett/random/1.1/mod.ts";
export { Squirrel3 } from "https://raw.githubusercontent.com/jhuggett/random/1.1/mod.ts";

Deno.test("KDTree.find", async (t) => {
  await t.step("can find point when there is one point", () => {
    const node = { point: [0, 0], value: "hello" };
    const tree = new KDTree([node]);

    assertEquals(tree.find(node.point)?.value, node.value);
  });

  await t.step("can find point when there are multiple points", async (t) => {
    const testCases: { start: number; end: number }[][] = [];

    await t.step("build test cases", () => {
      const random = new Squirrel3(0, 0);

      const numberOfTestCases = 5;

      for (let i = 0; i <= numberOfTestCases; i++) {
        testCases.push([
          {
            start: 0,
            end: random.getRandomNumber(1, 100),
          },
          {
            start: 0,
            end: random.getRandomNumber(1, 100),
          },
        ]);
      }
    });

    for (const testCase of testCases) {
      const points: KDTreeInput<string>[] = [];

      await t.step("define points", () => {
        multidimensionalRange(testCase, ([x, y]) => {
          points.push({
            point: [x, y],
            value: `(x: ${x}, y: ${y})`,
          });
        });
      });

      const random = new Squirrel3(0, 0);

      const { item: point } = random.getRandomItem(points);

      await t.step(
        `Out of ${points.length} points, find ${point.value}`,
        () => {
          const tree = new KDTree(points);

          assertEquals(tree.find(point.point)?.value, point.value);
        }
      );
    }
  });
});
