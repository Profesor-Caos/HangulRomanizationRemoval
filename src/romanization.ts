import * as hangul from "../src/hangul";

// https://en.wikipedia.org/wiki/Korean_language_and_computers#Hangul_in_Unicode
const unicodeOffset: number = 44032;
const unicodeInitialOffset: number = 588;
const unicodeMedialOffset: number = 28;

const initials: string = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";
const ieungIndex = 11;
const medials: string = "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ";
const finals: string = " ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ";

const initialDictionary: { [id: string]: string }  = {
	"ㄱ" : "g",
	"ㄲ" : "kk",
	"ㄴ" : "n",
	"ㄷ" : "d",
	"ㄸ" : "tt",
	"ㄹ" : "r",
	"ㅁ" : "m",
	"ㅂ" : "b",
	"ㅃ" : "pp",
	"ㅅ" : "s",
	"ㅆ" : "ss",
	"ㅇ" : "",
	"ㅈ" : "j",
	"ㅉ" : "jj",
	"ㅊ" : "ch",
	"ㅋ" : "k",
	"ㅌ" : "t",
	"ㅍ" : "p",
	"ㅎ" : "h"
}

const medialDictionary: { [id: string]: string }  = {
	"ㅏ" : "a",
	"ㅐ" : "ae",
	"ㅑ" : "ya",
	"ㅒ" : "yae",
	"ㅓ" : "eo",
	"ㅔ" : "e",
	"ㅕ" : "yeo",
	"ㅖ" : "ye",
	"ㅗ" : "o",
	"ㅘ" : "wa",
	"ㅙ" : "wae",
	"ㅚ" : "oe",
	"ㅛ" : "yo",
	"ㅜ" : "u",
	"ㅝ" : "wo",
	"ㅞ" : "we",
	"ㅟ" : "wi",
	"ㅠ" : "yu",
	"ㅡ" : "eu",
	"ㅢ" : "ui",
	"ㅣ" : "i"
}

const finalDictionary: { [id: string]: string } = {
	" " : "",
	"ㄱ" : "k",
	"ㄲ" : "k",
	"ㄳ" : "k",
	"ㄴ" : "n",
	"ㄵ" : "n",
	"ㄶ" : "n",
	"ㄷ" : "t",
	"ㄹ" : "l",
	"ㄺ" : "k",
	"ㄻ" : "m",
	"ㄼ" : "p",
	"ㄽ" : "t",
	"ㄾ" : "t",
	"ㄿ" : "p",
	"ㅀ" : "l",
	"ㅁ" : "m",
	"ㅂ" : "p",
	"ㅄ" : "p",
	"ㅅ" : "t",
	"ㅆ" : "t",
	"ㅇ" : "ng",
	"ㅈ" : "t",
	"ㅊ" : "t",
	"ㅋ" : "k",
	"ㅌ" : "t",
	"ㅍ" : "p",
	"ㅎ" : "t"
}

export function RomanizeHangul(text: string) {
    let result: string = '';

    for (let i = 0; i < text.length; i++)
    {
        const currentCharCode = text.charCodeAt(i);
        if (!hangul.isCharacterCodeHangulSyllable(currentCharCode))
        {
			result += text.charAt(i);
            continue;
        }
			
		const initialIndex: number = Math.floor((currentCharCode - unicodeOffset) / unicodeInitialOffset);
		const medialIndex: number = Math.floor (((currentCharCode - unicodeOffset) % unicodeInitialOffset) / unicodeMedialOffset);
		const finalIndex: number = ((currentCharCode - unicodeOffset) % unicodeInitialOffset) % unicodeMedialOffset;
		
		let nextSyllableCode = -1;
		if (i + 1 < text.length)
			nextSyllableCode = text.charCodeAt(i+1);
		
		if (!hangul.isCharacterCodeHangulSyllable(nextSyllableCode))
		{
			result += initialDictionary[initials[initialIndex]] + medialDictionary[medials[medialIndex]] + finalDictionary[finals[finalIndex]];
			continue;
		}
		
		const nextInitialIndex: number = Math.floor((nextSyllableCode - unicodeOffset) / unicodeInitialOffset);
		const nextSyllableStartsWithConsonant = nextInitialIndex != ieungIndex;
    }

    return result;
}

/**
 * Takes Hangul syllables and breaks them up into individual Jamo. 
 * Will probably just be a proof of concept for the algorithm and not actually used.
 * @param {string} text 
 * @returns 
 */
export function DecomposeHangulSyllables(text: string) {
    let result: string = '';

    for (let i = 0; i < text.length; i++)
    {
        let currentCharCode = text.charCodeAt(i);
        let currentChar = text.charAt(i);

        if (!hangul.isCharacterCodeHangulSyllable(currentCharCode))
        {
            continue;
        }
        
        let initialIndex: number = Math.floor((currentCharCode - unicodeOffset) / unicodeInitialOffset);
        let medialIndex: number = Math.floor (((currentCharCode - unicodeOffset) % unicodeInitialOffset) / unicodeMedialOffset);
        let finalIndex: number = ((currentCharCode - unicodeOffset) % unicodeInitialOffset) % unicodeMedialOffset;

        result += initials[initialIndex] + medials[medialIndex] + (finals[finalIndex] == ' ' ? '' : finals[finalIndex]);
    }

    return result;
}