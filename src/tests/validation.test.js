const expect = require("expect");
const { isRealString } = require("./validation");

describe("isRealString", () => {
  it("should reject non string values", () => {
    const answer = isRealString(12);
    expect(answer).toBe(false);
  });

  it("should reject a string if it is only spaces", () => {
    const answer = isRealString("    ");
    expect(answer).toBe(false);
  });

  it("should allow string with non-space values", () => {
    const answer = isRealString("    TEST     ");
    expect(answer).toBe(true);
  });
});
