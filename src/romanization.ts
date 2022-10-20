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

/**
 * This is largely based just a lot of examples within words I got from
 * some python code I wrote to go through all the words in a word list
 * of about 130,000 entries from https://github.com/garfieldnate/kengdic
 * and put them through the romanization converter available at
 * http://roman.cs.pusan.ac.kr/input_eng.aspx
 * 
 * I think it will be largely accurate, though may require some
 * additional improvements
 * 
 * Also used the following for reference:
 * https://en.wikipedia.org/wiki/Revised_Romanization_of_Korean
 * For guidelines to follow when I couldn't generate examples.
 * 
 * https://glenlanguage.wordpress.com/hangeul-pronunciation-rules/
 * For the pronunciation of 겹받침 like ㄻ, ㄼ, ㄽ, etc.
 */
const consonantAssimilationDictionary : { [id: string]: { [id: string] : string } } = 
{
	"ㄱ" : { // k
		"ㄱ" : "kg",
		"ㄲ" : "kkk",
		"ㄴ" : "ngn",
		"ㄷ" : "kd",
		"ㄸ" : "ktt",
		"ㄹ" : "ngn",
		"ㅁ" : "ngm",
		"ㅂ" : "kb",
		"ㅃ" : "kpp",
		"ㅅ" : "ks",
		"ㅆ" : "kss",
		"ㅇ" : "g", // ngn if subject to ㄴinsertion
		"ㅈ" : "kj",
		"ㅉ" : "kjj",
		"ㅊ" : "kch",
		"ㅋ" : "kk",
		"ㅌ" : "kt",
		"ㅍ" : "kp",
		"ㅎ" : "k" // Wikipedia says it can also be kh, but I found no examples of that.
	},
	"ㄲ" : { // k
		"ㄱ" : "kg",
		"ㄲ" : "kkk",
		"ㄴ" : "ngn",
		"ㄷ" : "kd",
		"ㄸ" : "ktt",
		"ㄹ" : "ngn",
		"ㅁ" : "ngm",
		"ㅂ" : "kb",
		"ㅃ" : "kpp",
		"ㅅ" : "ks",
		"ㅆ" : "kss",
		"ㅇ" : "kk",
		"ㅈ" : "kj",
		"ㅉ" : "kjj",
		"ㅊ" : "kch",
		"ㅋ" : "kk",
		"ㅌ" : "kt",
		"ㅍ" : "kp",
		"ㅎ" : "k"
	},
	"ㄳ" : { // k
		"ㄱ" : "kg",
		"ㄲ" : "kkk",
		"ㄴ" : "ngn",
		"ㄷ" : "kd",
		"ㄸ" : "ktt",
		"ㄹ" : "ngn",
		"ㅁ" : "ngm",
		"ㅂ" : "kb",
		"ㅃ" : "kpp",
		"ㅅ" : "ks",
		"ㅆ" : "kss",
		"ㅇ" : "ks", // ngn if subject to ㄴinsertion like 삯일
		"ㅈ" : "kj",
		"ㅉ" : "kjj",
		"ㅊ" : "kch",
		"ㅋ" : "kk",
		"ㅌ" : "kt",
		"ㅍ" : "kp",
		"ㅎ" : "k"
	},
	"ㄴ" : { // n
		"ㄱ" : "ng",
		"ㄲ" : "nkk",
		"ㄴ" : "nn",
		"ㄷ" : "nd",
		"ㄸ" : "ntt",
		"ㄹ" : "ll",
		"ㅁ" : "nm",
		"ㅂ" : "nb",
		"ㅃ" : "npp",
		"ㅅ" : "ns",
		"ㅆ" : "nss",
		"ㅇ" : "n", // nn if subject to ㄴinsertion like 삯일
		"ㅈ" : "nj",
		"ㅉ" : "njj",
		"ㅊ" : "nch",
		"ㅋ" : "nk",
		"ㅌ" : "nt",
		"ㅍ" : "np",
		"ㅎ" : "nh"
	},
	"ㄵ" : { // n
		"ㄱ" : "ng",
		"ㄲ" : "nkk",
		"ㄴ" : "nn",
		"ㄷ" : "nd",
		"ㄸ" : "ntt",
		"ㄹ" : "ll",
		"ㅁ" : "nm",
		"ㅂ" : "nb",
		"ㅃ" : "npp",
		"ㅅ" : "ns",
		"ㅆ" : "nss",
		"ㅇ" : "nj", // TODO: Palatalization, becomes nch before i and yeo
		"ㅈ" : "nj",
		"ㅉ" : "njj",
		"ㅊ" : "nch",
		"ㅋ" : "nk",
		"ㅌ" : "nt",
		"ㅍ" : "np",
		"ㅎ" : "nch" // Could maybe be n or nh as well, but was nch in every example I could find (n=8, all followed by iotized vowels)
					// I think it probably would generally be nch
	},
	"ㄶ" : { // n, the ㅎ causes following consonant to be voiceless
		"ㄱ" : "nk",
		"ㄲ" : "nkk",
		"ㄴ" : "nn",
		"ㄷ" : "nt",
		"ㄸ" : "ntt",
		"ㄹ" : "ll",
		"ㅁ" : "nm",
		"ㅂ" : "np",
		"ㅃ" : "npp",
		"ㅅ" : "ns", // TODO: 괜찮습니다 -> gwaenchansseumnida (nss) per http://roman.cs.pusan.ac.kr/input_eng.aspx? 
					// https://github.com/osori/korean-romanizer/blob/master/korean_romanizer/pronouncer.py also has nh before s become nss
		"ㅆ" : "nss",
		"ㅇ" : "n", // nn if subject to ㄴinsertion like 삯일
		"ㅈ" : "nj",
		"ㅉ" : "njj",
		"ㅊ" : "nch",
		"ㅋ" : "nk",
		"ㅌ" : "nt",
		"ㅍ" : "np",
		"ㅎ" : "nh"
	},
	"ㄷ" : { // t
		"ㄱ" : "tg",
		"ㄲ" : "tkk",
		"ㄴ" : "nn",
		"ㄷ" : "td",
		"ㄸ" : "ttt",
		"ㄹ" : "nn",
		"ㅁ" : "nm",
		"ㅂ" : "tb",
		"ㅃ" : "tpp",
		"ㅅ" : "ts",
		"ㅆ" : "tss",
		"ㅇ" : "d", // TODO: j before iotized vowel
		"ㅈ" : "tj",
		"ㅉ" : "tjj",
		"ㅊ" : "tch",
		"ㅋ" : "tk",
		"ㅌ" : "tt",
		"ㅍ" : "tp",
		"ㅎ" : "t" // TODO: ch before iotized vowel
	},
	"ㄹ" : { // l
		"ㄱ" : "lg",
		"ㄲ" : "lkk",
		"ㄴ" : "ll", // TODO: find more examples of this? Wikipedia says ln
		"ㄷ" : "ld",
		"ㄸ" : "ltt",
		"ㄹ" : "ll",
		"ㅁ" : "lm",
		"ㅂ" : "lb",
		"ㅃ" : "lpp",
		"ㅅ" : "ls",
		"ㅆ" : "lss",
		"ㅇ" : "r",
		"ㅈ" : "lj",
		"ㅉ" : "ljj",
		"ㅊ" : "lch",
		"ㅋ" : "lk",
		"ㅌ" : "lt",
		"ㅍ" : "lp",
		"ㅎ" : "lh"
	},
	"ㄺ" : { // k
		"ㄱ" : "kg",
		"ㄲ" : "kkk",
		"ㄴ" : "ngn",
		"ㄷ" : "kd",
		"ㄸ" : "ktt",
		"ㄹ" : "ngn",
		"ㅁ" : "ngm",
		"ㅂ" : "kb",
		"ㅃ" : "kpp",
		"ㅅ" : "ks",
		"ㅆ" : "kss",
		"ㅇ" : "lg", // ngn if subject to ㄴinsertion
		"ㅈ" : "kj",
		"ㅉ" : "kjj",
		"ㅊ" : "kch",
		"ㅋ" : "kk",
		"ㅌ" : "kt",
		"ㅍ" : "kp",
		"ㅎ" : "lk" // TODO: maybe different when ㅎ is before non-iotized vowels, but I could only find it before 히 and 혀 
					// EDIT: This seems right either way.
	},
	"ㄻ" : { // m
		"ㄱ" : "mg",
		"ㄲ" : "mkk",
		"ㄴ" : "mn",
		"ㄷ" : "md",
		"ㄸ" : "mtt",
		"ㄹ" : "mn",
		"ㅁ" : "mm",
		"ㅂ" : "mb",
		"ㅃ" : "mpp",
		"ㅅ" : "ms",
		"ㅆ" : "mss",
		"ㅇ" : "lm",
		"ㅈ" : "mj",
		"ㅉ" : "mjj",
		"ㅊ" : "mch",
		"ㅋ" : "mk",
		"ㅌ" : "mt",
		"ㅍ" : "mp",
		"ㅎ" : "mh"
	},
	"ㄼ" : { // this one is usually pronounced as ㄹ, 밟 is an exception
		"ㄱ" : "lg",
		"ㄲ" : "lkk",
		"ㄴ" : "ll", // could find no examples of this
		"ㄷ" : "ld",
		"ㄸ" : "ltt",
		"ㄹ" : "ll",
		"ㅁ" : "lm",
		"ㅂ" : "lb",
		"ㅃ" : "lpp",
		"ㅅ" : "ls",
		"ㅆ" : "lss",
		"ㅇ" : "lb",
		"ㅈ" : "pj",
		"ㅉ" : "ljj",
		"ㅊ" : "lch",
		"ㅋ" : "lk",
		"ㅌ" : "lt",
		"ㅍ" : "lp",
		"ㅎ" : "p" // TODO: sometimes ph... 
					//-- actually in the only examples I have, it's 넓히다 = neolpida or 짓밟히다 = jithaphida or some variation of those two
	},
	"ㄽ" : { // I found no examples of this before other consonants
		"ㄱ" : "tg",
		"ㄲ" : "tkk",
		"ㄴ" : "nn",
		"ㄷ" : "ta",
		"ㄸ" : "ttt",
		"ㄹ" : "nn",
		"ㅁ" : "nm",
		"ㅂ" : "tb",
		"ㅃ" : "tpp",
		"ㅅ" : "ts",
		"ㅆ" : "tss",
		"ㅇ" : "s",
		"ㅈ" : "tj",
		"ㅉ" : "tjj",
		"ㅊ" : "tch",
		"ㅋ" : "tk",
		"ㅌ" : "tt",
		"ㅍ" : "tp",
		"ㅎ" : "t"
	} ,
	"ㄾ" : { // l in the few examples I found
		"ㄱ" : "lg",
		"ㄲ" : "lkk",
		"ㄴ" : "nn",
		"ㄷ" : "ld",
		"ㄸ" : "ltt",
		"ㄹ" : "nn",
		"ㅁ" : "nm",
		"ㅂ" : "lb",
		"ㅃ" : "lpp",
		"ㅅ" : "ls",
		"ㅆ" : "lss",
		"ㅇ" : "lt",
		"ㅈ" : "lj",
		"ㅉ" : "ljj",
		"ㅊ" : "lch",
		"ㅋ" : "lk",
		"ㅌ" : "lt",
		"ㅍ" : "lp",
		"ㅎ" : "lt" // don't know about this, just a guess basically.
	},
	"ㄿ" : { // p
		"ㄱ" : "pg",
		"ㄲ" : "pkk",
		"ㄴ" : "mn",
		"ㄷ" : "pd",
		"ㄸ" : "ptt",
		"ㄹ" : "mn", // could find no examples of this
		"ㅁ" : "mm",
		"ㅂ" : "pb",
		"ㅃ" : "ppp", // could find no examples of this
		"ㅅ" : "ps",
		"ㅆ" : "pss",
		"ㅇ" : "lp",
		"ㅈ" : "pj",
		"ㅉ" : "pjj",
		"ㅊ" : "pch",
		"ㅋ" : "pk",
		"ㅌ" : "pt", // could find no examples of this
		"ㅍ" : "pp", // could find no examples of this
		"ㅎ" : "p" // don't know about this, just a guess basically.
	},
	"ㅀ" : { // l in the few examples I found
		"ㄱ" : "lk",
		"ㄲ" : "lkk",
		"ㄴ" : "ll", // need more examples of this, all my examples are before 는, but I exhausted my dictionary
					 // according to https://github.com/osori/korean-romanizer/blob/master/korean_romanizer/pronouncer.py this would be ln
		"ㄷ" : "lt",
		"ㄸ" : "ltt",
		"ㄹ" : "lr",
		"ㅁ" : "nm",
		"ㅂ" : "lp",
		"ㅃ" : "lpp",
		"ㅅ" : "ls", // TODO: according to https://github.com/osori/korean-romanizer/blob/master/korean_romanizer/pronouncer.py this would be lss
		"ㅆ" : "lss",
		"ㅇ" : "r", // I have examples of this being followed by 은, so it's interesting it varies whether it's followed by 은 or 는
		"ㅈ" : "lch",
		"ㅉ" : "ljj",
		"ㅊ" : "lch",
		"ㅋ" : "lk",
		"ㅌ" : "lt",
		"ㅍ" : "lp",
		"ㅎ" : "l" // TODO: don't know about this, just a guess basically.
	},
	"ㅁ" : { // m
		"ㄱ" : "mg",
		"ㄲ" : "mkk",
		"ㄴ" : "mn",
		"ㄷ" : "md",
		"ㄸ" : "mtt",
		"ㄹ" : "mn",
		"ㅁ" : "mm",
		"ㅂ" : "mb",
		"ㅃ" : "mpp",
		"ㅅ" : "ms",
		"ㅆ" : "mss",
		"ㅇ" : "m",
		"ㅈ" : "mj",
		"ㅉ" : "mjj",
		"ㅊ" : "mch",
		"ㅋ" : "mk",
		"ㅌ" : "mt",
		"ㅍ" : "mp",
		"ㅎ" : "mh"
	},
	"ㅂ" : { // p
		"ㄱ" : "pg",
		"ㄲ" : "pkk",
		"ㄴ" : "mn",
		"ㄷ" : "pd",
		"ㄸ" : "ptt",
		"ㄹ" : "mn",
		"ㅁ" : "mm",
		"ㅂ" : "pb",
		"ㅃ" : "ppp",
		"ㅅ" : "ps",
		"ㅆ" : "pss",
		"ㅇ" : "b",
		"ㅈ" : "pj",
		"ㅉ" : "pjj",
		"ㅊ" : "pch",
		"ㅋ" : "pk",
		"ㅌ" : "pt",
		"ㅍ" : "pp",
		"ㅎ" : "p"
	},
	"ㅄ" : { // p
		"ㄱ" : "pg",
		"ㄲ" : "pkk",
		"ㄴ" : "mn",
		"ㄷ" : "pd",
		"ㄸ" : "ptt", // could find no examples of this
		"ㄹ" : "mn", // could find no examples of this
		"ㅁ" : "mm",
		"ㅂ" : "pb",
		"ㅃ" : "ppp", // could find no examples of this
		"ㅅ" : "ps", // could find no examples of this
		"ㅆ" : "pss",
		"ㅇ" : "ps", 
		"ㅈ" : "pj",
		"ㅉ" : "pjj", // could find no examples of this
		"ㅊ" : "pch", // could find no examples of this
		"ㅋ" : "pk", // could find no examples of this
		"ㅌ" : "pt", // could find no examples of this
		"ㅍ" : "pp", // could find no examples of this
		"ㅎ" : "ps" // don't know about this, just a guess basically.
	},
	"ㅅ" : { // t
		"ㄱ" : "tg",
		"ㄲ" : "tkk",
		"ㄴ" : "nn",
		"ㄷ" : "td",
		"ㄸ" : "ttt",
		"ㄹ" : "tr", // Wikipedia says nn, but all my examples (n=5)  say tr, 
					// e.g. 마못류 = mamotryu,  피킷라인 = pikitrain (a google search shows this is probably Picket Line)
		"ㅁ" : "nm",
		"ㅂ" : "tb",
		"ㅃ" : "tpp",
		"ㅅ" : "ts",
		"ㅆ" : "tss",
		"ㅇ" : "s", // can be nn if subject to n insertion
		"ㅈ" : "tj",
		"ㅉ" : "tjj",
		"ㅊ" : "tch",
		"ㅋ" : "tk",
		"ㅌ" : "tt",
		"ㅍ" : "tp",
		"ㅎ" : "t"
	},
	"ㅆ" : { // t
		"ㄱ" : "tg",
		"ㄲ" : "tkk",
		"ㄴ" : "nn",
		"ㄷ" : "td",
		"ㄸ" : "ttt",
		"ㄹ" : "nn",
		"ㅁ" : "nm",
		"ㅂ" : "tb",
		"ㅃ" : "tpp",
		"ㅅ" : "ts",
		"ㅆ" : "tss",
		"ㅇ" : "ss",
		"ㅈ" : "tj",
		"ㅉ" : "tjj",
		"ㅊ" : "tch",
		"ㅋ" : "tk",
		"ㅌ" : "tt",
		"ㅍ" : "tp",
		"ㅎ" : "th"
	},
	"ㅇ" : { // ng
		"ㄱ" : "ngg",
		"ㄲ" : "ngkk",
		"ㄴ" : "ngn",
		"ㄷ" : "ngd",
		"ㄸ" : "ngtt",
		"ㄹ" : "ngn",
		"ㅁ" : "ngm",
		"ㅂ" : "ngb",
		"ㅃ" : "ngpp",
		"ㅅ" : "ngs",
		"ㅆ" : "ngss",
		"ㅇ" : "ng",
		"ㅈ" : "ngj",
		"ㅉ" : "ngjj",
		"ㅊ" : "ngch",
		"ㅋ" : "ngk",
		"ㅌ" : "ngt",
		"ㅍ" : "ngp",
		"ㅎ" : "ngh"
	},
	"ㅈ" : { // t
		"ㄱ" : "tg",
		"ㄲ" : "tkk",
		"ㄴ" : "nn",
		"ㄷ" : "td",
		"ㄸ" : "ttt",
		"ㄹ" : "nn", // could find no examples of this
		"ㅁ" : "nm",
		"ㅂ" : "tb",
		"ㅃ" : "tpp", // could find no examples of this
		"ㅅ" : "ts",
		"ㅆ" : "tss", // could find no examples of this
		"ㅇ" : "j",
		"ㅈ" : "tj",
		"ㅉ" : "tjj", // could find no examples of this
		"ㅊ" : "tch",
		"ㅋ" : "tk", // could find no examples of this
		"ㅌ" : "tt",
		"ㅍ" : "tp", // could find no examples of this
		"ㅎ" : "t" // // TODO: ch before i... but still t before yeo in the examples I could find
	},
	"ㅊ" : { // t
		"ㄱ" : "tg",
		"ㄲ" : "tkk",
		"ㄴ" : "nn",
		"ㄷ" : "td",
		"ㄸ" : "ttt", // could find no examples of this, but Wikipedia says it's right
		"ㄹ" : "nn", // could find no examples of this, but Wikipedia says it's right
		"ㅁ" : "nm",
		"ㅂ" : "tb",
		"ㅃ" : "tpp", // could find no examples of this
		"ㅅ" : "ts",
		"ㅆ" : "tss",
		"ㅇ" : "ch",
		"ㅈ" : "tj",
		"ㅉ" : "tjj",
		"ㅊ" : "tch",
		"ㅋ" : "tk",
		"ㅌ" : "tt",
		"ㅍ" : "tp",
		"ㅎ" : "t" // varies according to wikipedia, t in the two examples I could find.
	},
	"ㅋ" : { // k, could find no examples of almost all of these.
		"ㄱ" : "kg",
		"ㄲ" : "kkk",
		"ㄴ" : "ngn",
		"ㄷ" : "kd",
		"ㄸ" : "ktt",
		"ㄹ" : "ngn",
		"ㅁ" : "ngm",
		"ㅂ" : "kb",
		"ㅃ" : "kpp",
		"ㅅ" : "ks",
		"ㅆ" : "kss",
		"ㅇ" : "k", // get more examples of this... the one I had was kk and it could be subject to ㄴ insertion
		"ㅈ" : "kj",
		"ㅉ" : "kjj",
		"ㅊ" : "kch",
		"ㅋ" : "kk",
		"ㅌ" : "kt",
		"ㅍ" : "kp",
		"ㅎ" : "k" 
	},
	"ㅌ" : { // t
		"ㄱ" : "tg",
		"ㄲ" : "tkk",
		"ㄴ" : "nn",
		"ㄷ" : "td",
		"ㄸ" : "ttt",
		"ㄹ" : "nn",
		"ㅁ" : "nm",
		"ㅂ" : "tb",
		"ㅃ" : "tpp",
		"ㅅ" : "ts",
		"ㅆ" : "tss",
		"ㅇ" : "t", // TODO: ch before i, but still t before yeo
		"ㅈ" : "tj",
		"ㅉ" : "tjj",
		"ㅊ" : "tch",
		"ㅋ" : "tk",
		"ㅌ" : "tt",
		"ㅍ" : "tp",
		"ㅎ" : "t"
	},
	"ㅍ" : { // p
		"ㄱ" : "pg",
		"ㄲ" : "pkk",
		"ㄴ" : "mn",
		"ㄷ" : "pd",
		"ㄸ" : "ptt",
		"ㄹ" : "mn", // could find no examples of this
		"ㅁ" : "mm",
		"ㅂ" : "pb",
		"ㅃ" : "ppp", // could find no examples of this
		"ㅅ" : "ps",
		"ㅆ" : "pss",
		"ㅇ" : "p",
		"ㅈ" : "pj",
		"ㅉ" : "pjj",
		"ㅊ" : "pch",
		"ㅋ" : "pk",
		"ㅌ" : "pt", // could find no examples of this
		"ㅍ" : "pp", // could find no examples of this
		"ㅎ" : "p" // probably varies
	},
	"ㅎ" : { // t - words basically don't end in ㅎ. 히읗, the name of the jamo is an exception, and it's pronounced as a t
		"ㄱ" : "k",
		"ㄲ" : "kk", // could find no examples of this
		"ㄴ" : "nn",
		"ㄷ" : "t",
		"ㄸ" : "tt", // could find no examples of this
		"ㄹ" : "nn", // could find no examples of this, Wikipedia says nn
		"ㅁ" : "nm", // could find no examples of this, Wikipedia says nm
		"ㅂ" : "p", // The one example I could find was a b - 옿비삼척 - obisamcheok 
					// which seems wrong since it should make the adjacent vowel unvoiced.
		"ㅃ" : "pp", // could find no examples of this
		"ㅅ" : "s", // I only found one example of this - 그렇소 - geureoso
					// https://github.com/osori/korean-romanizer/blob/master/korean_romanizer/pronouncer.py has h before s as ss
					// wikipedia has it as hs in their table.
		"ㅆ" : "tss", // could find no examples of this
		"ㅇ" : "", // Wikipedia says h, every word I put through the Korean Romanization Converter gave no h
					// https://github.com/osori/korean-romanizer/blob/master/korean_romanizer/pronouncer.py has no letter
		"ㅈ" : "ch",
		"ㅉ" : "jj", // could find no examples of this
		"ㅊ" : "ch", // need to find more examples, Wikipedia says tch, my one source gives just ch.
		"ㅋ" : "tk", // could find no examples of this, Wikipedia says tk
		"ㅌ" : "t", // could find no examples of this, Wikipedia says t
		"ㅍ" : "tp", // could find no examples of this, Wikipedia says tp
		"ㅎ" : "t"  // could find no examples of this, Wikipedia says t
	},
}


export function RomanizeHangul(text: string) {
    let result: string = '';10
	let storedConsonantAssimilation: string = ''

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

		if (storedConsonantAssimilation != '')
		{
			result += storedConsonantAssimilation
		}
		else
		{
			result += initialDictionary[initials[initialIndex]]
		}
		result += medialDictionary[medials[medialIndex]]
		
		let nextSyllableCode = -1;
		if (i + 1 < text.length) // this also covers the case of the string ending.
			nextSyllableCode = text.charCodeAt(i+1);
		
		if (!hangul.isCharacterCodeHangulSyllable(nextSyllableCode) || finalIndex == 0)
		{
			result += finalDictionary[finals[finalIndex]];
			storedConsonantAssimilation = '';
			continue;
		}

		const nextInitialIndex: number = Math.floor((nextSyllableCode - unicodeOffset) / unicodeInitialOffset);
		const nextMedialIndex: number = Math.floor (((nextSyllableCode - unicodeOffset) % unicodeInitialOffset) / unicodeMedialOffset);

		// If d or t before empty initial consonant with an iotized vowel (ㅣ, ㅑ, ㅕ, ㅛ, or ㅠ )
		// Is it all iotized vowels or just i? Need to get more examples probably.
		// d before i = j
		// t before i = ch, but not before ㅕ in the examples I found
		// d before h before i = ch
		// j before h before i = ch, but not before ㅕ in the examples I found
		// I could find no examples with ㅑ, ㅛ, or ㅠ
		if (medials[nextMedialIndex] == "ㅣ")
		{
			if (initials[nextInitialIndex] == "ㅇ")
			{
				if (finals[finalIndex] == "ㄷ")
				{
					storedConsonantAssimilation = 'j';
					continue;
				}
				else if (finals[finalIndex] == "ㅌ")
				{
					storedConsonantAssimilation = 'ch';
					continue;
				}
			}
			else if (initials[nextInitialIndex] == "ㅎ")
			{
				if (finals[finalIndex] == "ㄷ" || finals[finalIndex] == "ㅌ" || finals[finalIndex] == "ㅈ")
				{
					storedConsonantAssimilation = 'ch';
					continue;
				}
			}
		}
		

		// TODO: other weird things like ㄴinsertion.
		// This is a final consonant followed by a second word where the second word starts with an iotized vowel ㅣ, ㅑ, ㅕ, ㅛ, or ㅠ 
		// This is very hard to account for, since it depends on the following syllable to be the start of a word forming a compound word.
		
		storedConsonantAssimilation = consonantAssimilationDictionary[finals[finalIndex]][initials[nextInitialIndex]];
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