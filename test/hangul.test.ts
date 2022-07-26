import * as hangul from "../src/hangul";

describe("Test extract function", () => {
    let tests: any[] = [
        { input: "", output: [] },
        { input: "this (string) has, no 「不」 hangul", output: [] },
        { input: "abc “(누가) 했어요?”", output:  [{"index": 4, "text": "“(누가) 했어요”"}] },
        { input: "누구 a 가, b “누구” c “가” d “누가” e “누구가”.", output: [{"index": 0, "text": "누구 "}, {"index": 5, "text": "가,"}, {"index": 11, "text": "“누구” "}, {"index": 18, "text": "“가” "}, {"index": 24, "text": "“누가” "}] }, 
    ];
      
    tests.forEach((test) => {
        it(`should extract the hangul within the string ${test.input}`, () => {
            expect(hangul.extractHangul(test.input)).toStrictEqual<hangul.HangulInText[]>(test.output);
        });
    })

    let fails: any[] = [
        { input: "abc “(누가) 했어요?”", output: [{"index": 4, "text": "“(누가) 했어요”"}]},
    ];

    fails.forEach((test) => {
        it(`should test that the ouput data fails ${test.input}`, () => {
            expect(hangul.extractHangul(test.input)).not.toEqual(test.output);
        })
    })
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