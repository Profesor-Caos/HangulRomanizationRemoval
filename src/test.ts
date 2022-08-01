let initials = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";
let medials = "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ";
let finals = " ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ";

writeStrings();

function writeStrings()
{
    printStringAsArray(initials);
    printStringAsArray(medials);
    printStringAsArray(finals);
}

function printStringAsArray(text: string) {
    let result = "[\n";
    for (let i = 0; i < text.length; i++)
    {
        result += "\t\"" + text.charAt(i) + "\",\n"
    }
    result += "]"
    console.log(result);
}
