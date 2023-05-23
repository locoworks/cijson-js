export type Result =
  | undefined
  | null
  | string
  | number
  | boolean
  | Array<Result>
  | Record<string, unknown>;

function isString(value: Result): value is string {
  return typeof value === "string" || value instanceof String;
}

describe("Utils", () => {
  describe("isString", () => {
    test.each([
      // Truthy
      ["1", true],
      [new String("1"), true],
      // Falsy
      [1, false],
      [true, false],
      [false, false],
      [{}, false],
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      [() => {}, false],
    ])("%p should evaluate as %p", (value, expected) => {
      // @ts-ignore
      expect(isString(value)).toBe(expected);
    });
  });
});
