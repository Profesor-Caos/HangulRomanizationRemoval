let initials: "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ"
let medials: "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ"
let finals: "ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ"
const  leftPunctuation =  "‘“({[⟨⟪«‹〔〖〘〚【〝｢《「『【（［";
const rightPunctuation = "’”)}]⟩⟫»›〕〗〙〛】〞｣》」』】）］";

class HangulInText {
    text: string;
    index: number;

    constructor(text: string, index: number) {
        this.text = text;
        this.index = index;
    }

}

/**
 * Determines whether a character represents Hangul
 * @param {number} charCode 
 */
export function isCharacterCodeHangul(charCode: number): boolean {
    return (charCode >= 0xAC00 && charCode <= 0xD7A3  // Hangul Syllables
        || charCode >= 0x1100 && charCode <= 0x11FF // Hangul Jamo
        || charCode >= 0x3130 && charCode <= 0x318F // Hangul Compatibility Jamo
        || charCode >= 0xA960 && charCode <= 0xA97F // Hangul Jamo Extended-A
        ||charCode >= 0xD7B0 && charCode <= 0xD7FF // Hangul Jamo Extended-B
    )
}

/**
 * Determines whether a character might be a common symbol used in a Hangul string
 * @param {number} charCode 
 */
export function isCharacterCodeHangulPunctuation(charCode: number): boolean {
    return (charCode >= 0x0020 && charCode <= 0x002F || charCode >= 0x003A && charCode <= 0x0040 // Basic Latin punctuation
        || charCode >= 0x005B && charCode <= 0x0060 || charCode >= 0x007B && charCode <= 0x007E // Basic Latin punctuation
        || charCode >= 0x00A1 && charCode <= 0x00BF || charCode == 0x00D7 || charCode == 0x00F7 // Latin 1 Supplement punctuation/symbols
        || charCode >= 0x2000 && charCode <= 0x206F || charCode >= 0x2E00 && charCode <= 0x2E7F // General Punctuation and Supplemental Punctuation
        || charCode >= 0x3000 && charCode <= 0x303F // CJK (Chinese Japanese and Korean) Symbols and Punctuation
        || charCode >= 0x3200 && charCode <= 0x32FF // Enclosed CJK Letters and Months
    )
}

/**
 * Determines whether a character is a Chinese character, which could appear in a Hangul string (often in parentheses)
 * @param {number} charCode 
 */
export function isCharacterCodeHanCharacter(charCode: number): boolean {
    return (charCode >= 0x3400 && charCode <= 0x9FFF // CJK Unified Ideographs Extension A and CJK Unified Ideographs (largest)
        || charCode >= 0x2E80 && charCode <= 0x2FDF // CJK Radicals Supplement and Kangxi Radicals
        || charCode >= 0xF900 && charCode <= 0xFAFF //CJK Compatability Ideographs
        || charCode >= 0x20000 && charCode <= 0x3134F // Supplementary and Tertiary Ideographic Planes. Includes some unallocated code points as of Unicode 14.0
    )
}

/*
    I was considering backtracking to add any opening punctuation like quotes or parentheses to the left, 
    then I thought it would be far easier to ignore it, then trim the closing punctuation from the end.
    Then I realized this would be wrong in a case like (ABC) DEF GHI (JKL). We'd start at A and trim the paren after L.
    Ultimately the work to handle such punctuation, especially with potential nesting, is probably not worth it.

    It's clear however I need to do something to clean up punctuation, because it's too ugly doing nothing.
    Just trimming all trailing punctuation is probably better than doing nothing at least.

    Another option is just removing all punctuation...

    Brainstorming algorithm for cleaning punctuation:
    Categorize punctuation into standalone, paired, paired left specific, and paired right specific.
    Most punctuation would be standalone .,;:!? etc.
    Things like "" are paired, possibly '' and `` as well. These are all probably the hardest to deal with.
    () {} and [] are all paired with left and right specific characters.
    Maybe standalone needs to be further categorized. Terminating, like .!? continuing like ,:; and perhaps opening and/or neutral.

    At the end of the string, work backwards removing punctuation.
    If we come across a regular punction, we should delete it.
    If we come across a left specific character, we should delete it.
    If we come across a right specific character, and there's a matching left specific character in the string, don't delete it.
    We actually need to count the right and left specific characters. If there are more right than left, we should just delete that right.
    Lastly for "", if we have something like `"AB" CD "something else"`, we'd end up with `AB" CD "`. This seems problematic, and I'm 
    not sure how to address that. In scanning the entire text, we could try to track quote marks to tell if a quote is open or closed.
    E.g. have a variable isQuoteOpen = false and toggle it whenever we come across a " mark.
    This would only work however if we can assume there are no nested quote marks. Generally, the inner quote would use '', so it hopefully wouldn't be a problem.
    I imagine this method would however not work for single quote marks (') as we could not distinguish this from use as an apostrophe.

    Now after coming up with that, I realize it still doesn't solve the issue if we have a string like (ABC) DEF GHI (JKL), since we'd end up removing the
    left paren before A, and then probably the one after L as well. So, maybe when we start the string, we should save the initial index in a variable
    then after we reach the end, we can backtrack from the start to try to add punctuation. We wouldn't want terminating punctuation, but might want to add left specific
    characters if there are right specific ones to match.
*/
export function fixPunctuation(text: string, hangul: string, startingIndex: number): string {
    let lookbackIndex: number = startingIndex - 1;
    let endIndex: number = startingIndex + hangul.length - 1;
    while (lookbackIndex >= 0) {
        if (!isCharacterCodeHangulPunctuation(text.charCodeAt(lookbackIndex)))
        {
            break; // We only want to look back to add opening punctuation.
        }
        let char: string = text.charAt(lookbackIndex--);
        let punctuationIndex: number = leftPunctuation.indexOf(char);
        if (punctuationIndex == -1)
        {
            continue; // Punctuation/symbol, but not opening punctuation.
        }
        let rightPunct: string = rightPunctuation.charAt(punctuationIndex);
        if (findUnmatchedRightPunctuation(hangul, char, rightPunct))
        {
            hangul = char + hangul; // Add this left punctuation to the start of the hangul string.
            endIndex++;
        }
    }

    lookbackIndex = endIndex; // start looking at the last character in the string.
    let hangulIndex = hangul.length;
    while (lookbackIndex-- > 0) {
        hangulIndex--;
        let char: string = text.charAt(lookbackIndex);
        if (char == ' ')
        {
            continue; // Don't remove spaces.
        }
        if (!isCharacterCodeHangulPunctuation(text.charCodeAt(lookbackIndex)))
        {
            break; // We only want to look back to deal with punctuation.
        }
        let punctuationIndex: number = rightPunctuation.indexOf(char);
        if (punctuationIndex == -1)
        {
            hangul = hangul.slice(0, hangulIndex) + hangul.slice(hangulIndex + 1);
            continue; // Punctuation/symbol, but not closing punctuation.
        }
        let leftPunct: string = leftPunctuation.charAt(punctuationIndex);
        if (!findUnmatchedLeftPunctuation(hangul.slice(0, hangulIndex), leftPunct, char))
        {
            // remove the closing punctuation if it doesn't have an unpaired opening one
            hangul = hangul.slice(0, hangulIndex) + hangul.slice(hangulIndex + 1);
        }
    }
    return hangul;
}

export function findUnmatchedRightPunctuation(text: string, leftPunct: string, rightPunct: string): boolean
{
    let unmatchedLeftCount: number = 0;
    for (var i = 0; i < text.length; i++)
    {
        if (text.charAt(i) == rightPunct)
        {
            if (unmatchedLeftCount == 0)
                return true;
            unmatchedLeftCount -= 1;
        }
        else if (text.charAt(i) == leftPunct)
        {
            unmatchedLeftCount += 1;
        }
    }
    return false;
}

export function findUnmatchedLeftPunctuation(text: string, leftPunct: string, rightPunct: string): boolean
{
    let unmatchedRightCount: number = 0;
    for (var i = text.length - 1; i >= 0; i--)
    {
        if (text.charAt(i) == leftPunct)
        {
            if (unmatchedRightCount == 0)
                return true;
                unmatchedRightCount -= 1;
        }
        else if (text.charAt(i) == rightPunct)
        {
            unmatchedRightCount += 1;
        }
    }
    return false;
}

/**
 * 
 * @param {string} text 
 * @returns 
 */
export function extractHangul(text: string): HangulInText[] {
    let hangul: HangulInText[] = [];
    let currentHangul: string = '';
    let writingHangul = false;
    let currentCharCode = 0;
    let hangulStartIndex = 0;
    for (var i = 0; i< text.length; i++)
    {
        currentCharCode = text.charCodeAt(i);

        if (writingHangul)
        {
            if (!isCharacterCodeHangul(currentCharCode) && !isCharacterCodeHangulPunctuation(currentCharCode) && !isCharacterCodeHanCharacter(currentCharCode))
            {
                // We've come across a character we don't want to extract. Stop and move to the next character.
                writingHangul = false;
                currentHangul = fixPunctuation(text, currentHangul, hangulStartIndex);
                hangul.push(new HangulInText(currentHangul, hangulStartIndex));
                currentHangul = '';
                continue;
            }

            currentHangul += text[i];
            continue;
        }

        if (isCharacterCodeHangul(currentCharCode))
        {
            writingHangul = true;
            hangulStartIndex = i;
            currentHangul += text[i];        
        }
    }
    return hangul;
}