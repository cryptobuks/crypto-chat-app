const expect = require("expect");
const {isRealString} = require("./validation")

describe("isRealString", () =>
    {
        it("should reject non-string values", () =>
            {
                var non_string = 10;
                var res = isRealString(non_string);

                expect(res).toBe(false);
            });

        it("should reject strings with only spaces", () =>
            {
                var empty_string = "   ";
                var res = isRealString(empty_string);

                expect(res).toBe(false);
            });

        it("should allow strings with non-spaces characters", () =>
            {
                var valid_string = "  test_string";
                var res = isRealString(valid_string);

                expect(res).toBe(true);
            });
    });
