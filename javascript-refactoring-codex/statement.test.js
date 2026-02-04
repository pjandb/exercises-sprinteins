const fs = require("fs");
const path = require("path");
const { statement, formatUSD, amountFor } = require("./statement");
const invoices = require("./invoices.json");
const plays = require("./plays.json");

describe("statement", () => {
  test("golden master matches result.txt", () => {
    const expected = fs.readFileSync(
      path.join(__dirname, "result.txt"),
      "utf8"
    );
    const actual = statement(invoices[0], plays);

    const normalize = (str) => str.replace(/\r\n/g, "\n").trim();

    expect(normalize(actual)).toBe(normalize(expected));
  });

  describe("formatUSD", () => {
    test("formatUSD formats cents as dollars", () => {
    expect(formatUSD(65000 / 100)).toBe("$650.00");
  });
    test("formatUSD formats cents as dollars, high amount", () => {
    expect(formatUSD(650000 / 100)).toBe("$6,500.00");
  });
    test("formatUSD formats 0 cents", () => {
    expect(formatUSD(0)).toBe("$0.00");
  });
  });
  

  describe("amountFor", () => {
    test("tragedy with 30 audience", () => {
      const perf = { audience: 30 };
      const play = { type: "tragedy" };
      expect(amountFor(perf, play)).toBe(40000);
    });

    test("tragedy with 40 audience", () => {
      const perf = { audience: 40 };
      const play = { type: "tragedy" };
      expect(amountFor(perf, play)).toBe(40000 + 1000 * 10);
    });

    test("comedy with 20 audience", () => {
      const perf = { audience: 20 };
      const play = { type: "comedy" };
      expect(amountFor(perf, play)).toBe(30000 + 300 * 20);
    });

    test("comedy with 30 audience", () => {
      const perf = { audience: 30 };
      const play = { type: "comedy" };
      // 30000 base + 10000 + 500*(30-20) + 300*30
      expect(amountFor(perf, play)).toBe(30000 + 10000 + 500 * 10 + 300 * 30);
    });

    test("unknown play type throws error", () => {
      const perf = { audience: 10 };
      const play = { type: "opera" };
      expect(() => amountFor(perf, play)).toThrow("unknown type: opera");
    });
  });
});
