import * as hangul from "../src/hangul";

describe("Test extract function", () => {
    let testString = "누구 ends in a vowel so it would have to be followed by 가, but “누구” plus “가” changes to “누가” instead of “누구가” for ease of pronunciation.";
    let test2 = "\"누가 했어요?\""

    it("should return the Hangul within 누구 ends in a vowel so it would have to be followed by 가, but “누구” plus “가” changes to “누가” instead of “누구가” for ease of pronunciation.", () => {
        expect(hangul.extractHangul(testString)).toBe(15);
      });
});

describe("Test fixing punctuation", () => {
    let tests: any[] = [
        { input: ["", "", 0 , 0], output: ""}, 
        { input: ["(ABC) DEF GHI (JKL.).", "ABC) DEF GHI (JKL.).", 1], output: "(ABC) DEF GHI (JKL)"}, 
        { input: ["abc (ABC) DEF GHI (JKL.).abc", "ABC) DEF GHI (JKL.).", 5], output: "(ABC) DEF GHI (JKL)"}, 
    ];

    tests.forEach((test) => {
        it(`Should return ${test.output} for ${test.input}`, () => {
            expect(hangul.fixPunctuation(test.input[0], test.input[1], test.input[2])).toBe(test.output);
        });
    })
})

describe("Test find unmatched left punctuation", () => {
    let tests = [
        { input: "", output: false}, 
        { input: "(", output: true}, 
        { input: "()", output: false}, 
        { input: "(()(()A))", output: false}, 
        { input: "((()(()A))", output: true}, 
    ];

    tests.forEach((test) => {
        it(`Should return ${test.output} for ${test.input}`, () => {
            expect(hangul.findUnmatchedLeftPunctuation(test.input, "(", ")")).toBe(test.output);
        });
    })
})

describe("Test find unmatched right punctuation", () => {
    let tests = [
        { input: "", output: false}, 
        { input: ")", output: true}, 
        { input: "()", output: false}, 
        { input: "(()(()A))", output: false}, 
        { input: "(()(()A)))", output: true}, 
    ];

    tests.forEach((test) => {
        it(`Should return ${test.output} for ${test.input}`, () => {
            expect(hangul.findUnmatchedRightPunctuation(test.input, "(", ")")).toBe(test.output);
        });
    })
})