import * as romanization from "../src/romanization";

describe("Test romanization regex", () => {
    let tests: any[] = [
        { input: "", output: false },
        { input: "banana", output: true },
        { input: "apple", output: false },
        { input: "sagwa", output: true },
        { input: "orange", output: true },
        { input: "orenji", output: true },
        { input: "annyeonghaseyo", output: true },
        { input: "basket", output: false },
        { input: "think", output: false },
    ];

    const re = new RegExp('\\b(?:g|kk|n|d|tt|r|m|b|pp|s|ss|j|jj|ch|k|t|p|h)?(?:i|a|eo|eu|o|u|ae|e|ya|yeo|yo|yu|yae|ye|wa|oe|wae|wo|wi|we|ui)((?:((?:k|n|t|l|m|p|ng)?(?:g|kk|n|d|tt|r|m|b|pp|s|ss|j|jj|ch|k|t|p|h)?)|(?:ll)?)(?:i|a|eo|eu|o|u|ae|e|ya|yeo|yo|yu|yae|ye|wa|oe|wae|wo|wi|we|ui))*(?:k|n|t|l|m|p|ng)?\\b');

    tests.forEach((test) => {
        console.log(re.exec(test.input));
        it(`should return ${test.output} from ${test.input}`, () => {
            expect(re.test(test.input)).toEqual(test.output);
        });
    })
})

describe("Test decomposing Hangul function", () => {
    let tests: any[] = [
        { input: "", output: "" },
        { input: "한", output: "ㅎㅏㄴ" },
        { input: "안녕하세요", output: "ㅇㅏㄴㄴㅕㅇㅎㅏㅅㅔㅇㅛ" }
    ];
      
    tests.forEach((test) => {
        it(`should return the string with any hangul within romanized ${test.input}`, () => {
            expect(romanization.DecomposeHangulSyllables(test.input)).toEqual(test.output);
        });
    })
});

describe("Test full romanization", () => {
    let tests: any[] = [
        { input: "", output: "" },
        { input: "abc", output: "abc" },
        { input: "안녕하세요", output: "annyeonghaseyo" },
    ]
     
    tests.forEach((test) => {
        it(`should return ${test.output} romanized from ${test.input}`, () => {
            expect(romanization.RomanizeHangul(test.input)).toEqual(test.output);
        });
    })
})

describe("Test final k", () => {
    let tests: any[] = [
        { input: "국", output: "guk" }, // soup
        { input: "국이", output: "gugi" },
        { input: "부엌", output: "bueok" }, // kitchen
        { input: "부엌에", output: "bueoke" },
        { input: "밖", output: "bak" }, // outside 
        { input: "밖에", output: "bakke" },
        { input: "몫", output: "mok" }, // share 
        { input: "몫은", output: "mokseun" },
        { input: "읽다", output: "ikda" }, // to read 
        { input: "읽어요", output: "ilgeoyo" },
    ]

    tests.forEach((test) => {
        it(`should return ${test.output} for ${test.input}`, () => {
            expect(romanization.RomanizeHangul(test.input)).toEqual(test.output);
        });
    })
})

describe("Test final n", () => {
    let tests: any[] = [
        { input: "문", output: "mun" }, // door
        { input: "문이", output: "muni" },
        { input: "앉다", output: "anda" }, // to sit
        { input: "앉아요", output: "anjayo" },
        { input: "많다", output: "manta" }, // to be many 
        { input: "많은", output: "maneun" },
    ]

    tests.forEach((test) => {
        it(`should return ${test.output} for ${test.input}`, () => {
            expect(romanization.RomanizeHangul(test.input)).toEqual(test.output);
        });
    })
})

describe("Test final t", () => {
    let tests: any[] = [
        { input: "닫다", output: "datda" }, // to close
        { input: "닫아", output: "dada" },
        { input: "끝", output: "kkeut" }, // end
        { input: "앉아요", output: "anjayo" },
        { input: "많다", output: "manta" }, // to be many 
        { input: "많은", output: "maneun" },
    ]

    tests.forEach((test) => {
        it(`should return ${test.output} for ${test.input}`, () => {
            expect(romanization.RomanizeHangul(test.input)).toEqual(test.output);
        });
    })
})


describe("Test special cases", () => {
    let tests: any[] = [
        // ㄱ - before other consonants
        { input: "관악기", output: "gwanakgi" }, // before ㄱ
        { input: "가죽끈", output: "gajukkkeun" }, // before ㄲ
        { input: "가죽나무", output: "gajungnamu" }, // before ㄴ
        { input: "가로막다", output: "garomakda" }, // before ㄷ
        { input: "똑딱거리다", output: "ttokttakgeorida" }, // before ㄸ
        { input: "과격론자", output: "gwagyeongnonja" }, // before ㄹ
        { input: "국민당", output: "gungmindang" }, // before ㅁ
        { input: "가죽배", output: "gajukbae" }, // before ㅂ
        { input: "흑빵", output: "heukppang" }, // before ㅃ
        { input: "객석조명", output: "gaekseokjomyeong" }, // before ㅅ
        { input: "먼과녁쏘기", output: "meongwanyeokssogi" }, // before ㅆ
        { input: "큰쪽의", output: "keunjjogui" }, // before ㅇ
        { input: "오락장거리", output: "orakjanggeori" }, // before ㅈ
        { input: "가장북쪽의", output: "gajangbukjjogui" }, // before ㅉ
        { input: "가득찬", output: "gadeukchan" }, // before ㅊ
        { input: "금속카르보닐", output: "geumsokkareubonil" }, // before ㅋ
        { input: "박탈하다", output: "baktalhada" }, // before ㅌ
        { input: "문학작품", output: "munhakjakpum" }, // before ㅍ
        { input: "감독하다.", output: "gamdokada." }, // before ㅎ
        // ㄲ - before other consonants
        { input: "나사깎개", output: "nasakkakgae" }, // before ㄱ
        { input: "꺾꽂이", output: "kkeokkkoji" }, // before ㄲ
        { input: "닦는사람", output: "dangneunsaram" }, // before ㄴ
        { input: "솎다", output: "sokda" }, // before ㄷ
        { input: "굴림낚시", output: "gullimnaksi" }, // before ㅅ
        { input: "뜻밖에", output: "tteutbakke" }, // before ㅇ
        { input: "꺾자", output: "kkeokja" }, // before ㅈ
        // ㄳ - before other consonants
        { input: "삯말", output: "sangmal" }, // before ㅁ
        { input: "삯바느질", output: "sakbaneujil" }, // before ㅂ
        { input: "삯일", output: "sangnil" }, // before ㅇ
        { input: "삯주는", output: "sakjuneun" }, // before ㅈ
        // ㄴ - before other consonants
        { input: "검은고니", output: "geomeungoni" }, // before ㄱ
        { input: "거간꾼", output: "geogankkun" }, // before ㄲ
        { input: "결판내다", output: "gyeolpannaeda" }, // before ㄴ
        { input: "그런대로", output: "geureondaero" }, // before ㄷ
        { input: "눈뜨다", output: "nuntteuda" }, // before ㄸ
        { input: "곤란하여", output: "gollanhayeo" }, // before ㄹ
        { input: "단면", output: "danmyeon" }, // before ㅁ
        { input: "건반", output: "geonban" }, // before ㅂ
        { input: "점잔빼다", output: "jeomjanppaeda" }, // before ㅃ
        { input: "대예언서", output: "daeyeeonseo" }, // before ㅅ
        { input: "눈썰매", output: "nunsseolmae" }, // before ㅆ
        { input: "겉치례뿐이다", output: "geotchiryeppunida" }, // before ㅇ
        { input: "개인주의", output: "gaeinjuui" }, // before ㅈ
        { input: "큰쪽의", output: "keunjjogui" }, // before ㅉ
        { input: "괜찮음", output: "gwaenchaneum" }, // before ㅊ
        { input: "놀랄만큼", output: "nollalmankeum" }, // before ㅋ
        { input: "동문통첩", output: "dongmuntongcheop" }, // before ㅌ
        { input: "거센파도", output: "geosenpado" }, // before ㅍ
        { input: "간혹", output: "ganhok" }, // before ㅎ
        // ㄵ - before other consonants
        { input: "앉게하다", output: "angehada" }, // before ㄱ
        { input: "가라앉다", output: "garaanda" }, // before ㄷ
        { input: "가라앉아", output: "garaanja" }, // before ㅇ
        { input: "가라앉히다", output: "garaanchida" }, // before ㅎ
        // ㄶ - before other consonants
        { input: "괜찮게", output: "gwaenchanke" }, // before ㄱ
        { input: "않는", output: "anneun" }, // before ㄴ
        { input: "결코않다", output: "gyeolkoanta" }, // before ㄷ
        { input: "괜찮습니다", output: "gwaenchanseumnida" }, // before ㅅ
        { input: "괜찮음", output: "gwaenchaneum" }, // before ㅇ
        // ㄷ - before other consonants
        { input: "걷기", output: "geotgi" }, // before ㄱ
        { input: "믿는", output: "minneun" }, // before ㄴ
        { input: "걷다", output: "geotda" }, // before ㄷ
        { input: "맏물", output: "manmul" }, // before ㅁ
        { input: "곧바로", output: "gotbaro" }, // before ㅂ
        { input: "굳세다", output: "gutseda" }, // before ㅅ
        { input: "걷어차다", output: "geodeochada" }, // before ㅇ
        { input: "걷잡다", output: "geotjapda" }, // before ㅈ
        { input: "팔받침", output: "palbatchim" }, // before ㅊ
        { input: "걷힘", output: "geochim" }, // before ㅎ
        // ㄹ - before other consonants
        { input: "갈기갈기", output: "galgigalgi" }, // before ㄱ
        { input: "껄끄러운", output: "kkeolkkeureoun" }, // before ㄲ
        { input: "각골나망", output: "gakgollamang" }, // before ㄴ
        { input: "갈다", output: "galda" }, // before ㄷ
        { input: "들뜨다", output: "deultteuda" }, // before ㄸ
        { input: "걸레받이널", output: "geollebajineol" }, // before ㄹ
        { input: "골무", output: "golmu" }, // before ㅁ
        { input: "결빙", output: "gyeolbing" }, // before ㅂ
        { input: "공갈빵", output: "gonggalppang" }, // before ㅃ
        { input: "걸쇠", output: "geolsoe" }, // before ㅅ
        { input: "떠들썩함", output: "tteodeulsseokam" }, // before ㅆ
        { input: "통틀어", output: "tongteureo" }, // before ㅇ
        { input: "열중하여", output: "yeoljunghayeo" }, // before ㅈ
        { input: "골짜기", output: "goljjagi" }, // before ㅉ
        { input: "걸치다", output: "geolchida" }, // before ㅊ
        { input: "실컷울다", output: "silkeosulda" }, // before ㅋ
        { input: "결탁", output: "gyeoltak" }, // before ㅌ
        { input: "결판내다", output: "gyeolpannaeda" }, // before ㅍ
        { input: "박탈하다", output: "baktalhada" }, // before ㅎ
        // ㄺ - before other consonants
        { input: "갉기", output: "gakgi" }, // before ㄱ
        { input: "갉는", output: "gangneun" }, // before ㄴ
        { input: "읽다", output: "ikda" }, // before ㄷ
        { input: "진흙떡", output: "jinheuktteok" }, // before ㄸ
        { input: "얽매다", output: "eongmaeda" }, // before ㅁ
        { input: "진흙받이", output: "jinheukbaji" }, // before ㅂ
        { input: "닭새우", output: "daksaeu" }, // before ㅅ
        { input: "닭싸움", output: "dakssaum" }, // before ㅆ
        { input: "맑은", output: "malgeun" }, // before ㅇ
        { input: "갉작거리는", output: "gakjakgeorineun" }, // before ㅈ
        { input: "삵쾡이", output: "sakkwaengi" }, // before ㅋ
        { input: "진흙탕의", output: "jinheuktangui" }, // before ㅌ
        { input: "뒤얽히다", output: "dwieolkida" }, // before ㅎ
        // ㄻ - before other consonants
        { input: "곪게하다", output: "gomgehada" }, // before ㄱ
        { input: "옮는", output: "omneun" }, // before ㄴ
        { input: "곪다", output: "gomda" }, // before ㄷ
        { input: "만듦새", output: "mandeumsae" }, // before ㅅ
        { input: "짊어지우다", output: "jilmeojiuda" }, // before ㅇ
        { input: "굶주리게하다", output: "gumjurigehada" }, // before ㅈ
        // ㄼ - before other consonants
        { input: "밟기", output: "bapgi" }, // before ㄱ
        { input: "넓다", output: "neolda" }, // before ㄷ
        { input: "떫은", output: "tteolbeun" }, // before ㅇ
        { input: "넓적다리", output: "neopjeokdari" }, // before ㅈ
        { input: "넓찍한", output: "neoljjikan" }, // before ㅉ
        { input: "넓히다", output: "neolpida" }, // before ㅎ
        // ㄽ - before other consonants
        // ㄾ - before other consonants
        { input: "개미핥기", output: "gaemihalgi" }, // before ㄱ
        { input: "핥다", output: "halda" }, // before ㄷ
        { input: "대충훑어보다", output: "daechunghulteoboda" }, // before ㅇ
        // ㄿ - before other consonants
        { input: "읊다", output: "eupda" }, // before ㄷ
        // ㅀ - before other consonants
        { input: "감각을잃게하다", output: "gamgageurilkehada" }, // before ㄱ
        { input: "꿰뚫는", output: "kkwettulleun" }, // before ㄴ
        { input: "곯다", output: "golta" }, // before ㄷ
        { input: "곯리기", output: "golrigi" }, // before ㄹ
        { input: "끓어오르다", output: "kkeureooreuda" }, // before ㅇ
        { input: "보링-싫증나게하는", output: "boring-silcheungnagehaneun" }, // before ㅈ
        // ㅁ - before other consonants
        { input: "가슴걸이", output: "gaseumgeori" }, // before ㄱ
        { input: "잠깐", output: "jamkkan" }, // before ㄲ
        { input: "뽐내다", output: "ppomnaeda" }, // before ㄴ
        { input: "감다", output: "gamda" }, // before ㄷ
        { input: "굼뜬", output: "gumtteun" }, // before ㄸ
        { input: "검량", output: "geomnyang" }, // before ㄹ
        { input: "감미로운", output: "gammiroun" }, // before ㅁ
        { input: "겸비하다", output: "gyeombihada" }, // before ㅂ
        { input: "가슴뼈", output: "gaseumppyeo" }, // before ㅃ
        { input: "감상적인", output: "gamsangjeogin" }, // before ㅅ
        { input: "조금씩", output: "jogeumssik" }, // before ㅆ
        { input: "검은고니", output: "geomeungoni" }, // before ㅇ
        { input: "점잔빼다", output: "jeomjanppaeda" }, // before ㅈ
        { input: "섬쩍지근하게붉은", output: "seomjjeokjigeunhagebulgeun" }, // before ㅉ
        { input: "감찰", output: "gamchal" }, // before ㅊ
        { input: "강남콩", output: "gangnamkong" }, // before ㅋ
        { input: "감탕흙", output: "gamtangheuk" }, // before ㅌ
        { input: "바람피우다", output: "barampiuda" }, // before ㅍ
        { input: "간담회", output: "gandamhoe" }, // before ㅎ
        // ㅂ - before other consonants
        { input: "독립기념관", output: "dongnipginyeomgwan" }, // before ㄱ
        { input: "겹꽃", output: "gyeopkkot" }, // before ㄲ
        { input: "고맙습니다", output: "gomapseumnida" }, // before ㄴ
        { input: "결핍되다", output: "gyeolpipdoeda" }, // before ㄷ
        { input: "납땜하다", output: "napttaemhada" }, // before ㄸ
        { input: "공법률", output: "gongbeomnyul" }, // before ㄹ
        { input: "배급물", output: "baegeummul" }, // before ㅁ
        { input: "급변", output: "geupbyeon" }, // before ㅂ
        { input: "말굽뼈", output: "malgupppyeo" }, // before ㅃ
        { input: "고립시키다", output: "goripsikida" }, // before ㅅ
        { input: "허섭쓰레기", output: "heoseopsseuregi" }, // before ㅆ
        { input: "굽은", output: "gubeun" }, // before ㅇ
        { input: "갑자기", output: "gapjagi" }, // before ㅈ
        { input: "그리스어알파벳의일곱째글자", output: "geuriseueoalpabesuiilgopjjaegeulja" }, // before ㅉ
        { input: "답차", output: "dapcha" }, // before ㅊ
        { input: "냅킨", output: "naepkin" }, // before ㅋ
        { input: "겁탈", output: "geoptal" }, // before ㅌ
        { input: "평갑판", output: "pyeonggappan" }, // before ㅍ
        { input: "뒤집히다", output: "dwijipida" }, // before ㅎ
        // ㅄ - before other consonants
        { input: "분별없게", output: "bunbyeoreopge" }, // before ㄱ
        { input: "빈틈없는", output: "binteumeomneun" }, // before ㄴ
        { input: "가없다", output: "gaeopda" }, // before ㄷ
        { input: "값매기다", output: "gammaegida" }, // before ㅁ
        { input: "값비싸다", output: "gapbissada" }, // before ㅂ
        { input: "값싸다", output: "gapssada" }, // before ㅆ
        { input: "세상없어도", output: "sesangeopseodo" }, // before ㅇ
        { input: "값지게", output: "gapjige" }, // before ㅈ
        // ㅅ - before other consonants
        { input: "깃가지", output: "gitgaji" }, // before ㄱ
        { input: "갓깐", output: "gatkkan" }, // before ㄲ
        { input: "옛날", output: "yennal" }, // before ㄴ
        { input: "뱃대끈", output: "baetdaekkeun" }, // before ㄷ
        { input: "떳떳치못하게여기다", output: "tteottteotchimotageyeogida" }, // before ㄸ
        { input: "마못류", output: "mamotryu" }, // before ㄹ
        { input: "뒷문", output: "dwinmun" }, // before ㅁ
        { input: "뒷바퀴", output: "dwitbakwi" }, // before ㅂ
        { input: "깃뼈", output: "gitppyeo" }, // before ㅃ
        { input: "뱃사람", output: "baetsaram" }, // before ㅅ
        { input: "다섯씩의", output: "daseotssigui" }, // before ㅆ
        { input: "너털웃음", output: "neoteoruseum" }, // before ㅇ
        { input: "거짓잠", output: "geojitjam" }, // before ㅈ
        { input: "넷째", output: "netjjae" }, // before ㅉ
        { input: "갓천", output: "gatcheon" }, // before ㅊ
        { input: "됫케르크", output: "doetkereukeu" }, // before ㅋ
        { input: "갓태어나다", output: "gattaeeonada" }, // before ㅌ
        { input: "갓핀", output: "gatpin" }, // before ㅍ
        { input: "기껏해야", output: "gikkeotaeya" }, // before ㅎ
        // ㅆ - before other consonants
        { input: "맛있게", output: "masitge" }, // before ㄱ
        { input: "비어있는", output: "bieoinneun" }, // before ㄴ
        { input: "누워있다", output: "nuwoitda" }, // before ㄷ
        { input: "알았습니다", output: "aratseumnida" }, // before ㅅ
        { input: "관계있음", output: "gwangyeisseum" }, // before ㅇ
        { input: "그렇겠지", output: "geureoketji" }, // before ㅈ
        { input: "불쳤하다", output: "bulchyeothada" }, // before ㅎ
        // ㅇ - before other consonants
        { input: "경계인", output: "gyeonggyein" }, // before ㄱ
        { input: "만능꾼", output: "manneungkkun" }, // before ㄲ
        { input: "고장나서", output: "gojangnaseo" }, // before ㄴ
        { input: "해병대", output: "haebyeongdae" }, // before ㄷ
        { input: "구멍뚫기", output: "gumeongttulki" }, // before ㄸ
        { input: "공뢰", output: "gongnoe" }, // before ㄹ
        { input: "공동성명", output: "gongdongseongmyeong" }, // before ㅁ
        { input: "가정부", output: "gajeongbu" }, // before ㅂ
        { input: "등뼈", output: "deungppyeo" }, // before ㅃ
        { input: "정상이다", output: "jeongsangida" }, // before ㅅ
        { input: "병씻는기계", output: "byeongssinneungigye" }, // before ㅆ
        { input: "정상이다", output: "jeongsangida" }, // before ㅇ
        { input: "가장자리", output: "gajangjari" }, // before ㅈ
        { input: "강쪽으로", output: "gangjjogeuro" }, // before ㅉ
        { input: "경치", output: "gyeongchi" }, // before ㅊ
        { input: "잉크병", output: "ingkeubyeong" }, // before ㅋ
        { input: "총톤수", output: "chongtonsu" }, // before ㅌ
        { input: "골동품", output: "goldongpum" }, // before ㅍ
        { input: "열중하여", output: "yeoljunghayeo" }, // before ㅎ
        // ㅈ - before other consonants
        { input: "갖가지", output: "gatgaji" }, // before ㄱ
        { input: "늦꾀", output: "neutkkoe" }, // before ㄲ
        { input: "걸맞는", output: "geolmanneun" }, // before ㄴ
        { input: "꽂다", output: "kkotda" }, // before ㄷ
        { input: "젖떼다", output: "jeottteda" }, // before ㄸ
        { input: "맞물림", output: "manmullim" }, // before ㅁ
        { input: "맞벌이하다", output: "matbeorihada" }, // before ㅂ
        { input: "맞서다", output: "matseoda" }, // before ㅅ
        { input: "낮은", output: "najeun" }, // before ㅇ
        { input: "갖지않은", output: "gatjianeun" }, // before ㅈ
        { input: "낮추다", output: "natchuda" }, // before ㅊ
        { input: "젖통", output: "jeottong" }, // before ㅌ
        { input: "꽂히다", output: "kkochida" }, // before ㅎ
        // ㅊ - before other consonants
        { input: "몇개", output: "myeotgae" }, // before ㄱ
        { input: "꽃꼭지", output: "kkotkkokji" }, // before ㄲ
        { input: "빛나는", output: "binnaneun" }, // before ㄴ
        { input: "돛대에", output: "dotdaee" }, // before ㄷ
        { input: "꽃마차", output: "kkonmacha" }, // before ㅁ
        { input: "꽃병", output: "kkotbyeong" }, // before ㅂ
        { input: "가로돛식의", output: "garodotsigui" }, // before ㅅ
        { input: "꽃씨", output: "kkotssi" }, // before ㅆ
        { input: "간빛의", output: "ganbichui" }, // before ㅇ
        { input: "꽃자루", output: "kkotjaru" }, // before ㅈ
        { input: "낯짝", output: "natjjak" }, // before ㅉ
        { input: "꼬리꽃차례", output: "kkorikkotcharye" }, // before ㅊ
        { input: "꽃턱", output: "kkotteok" }, // before ㅌ
        { input: "꽃피다", output: "kkotpida" }, // before ㅍ
        { input: "꽃향유", output: "kkotyangyu" }, // before ㅎ
        // ㅋ - before other consonants
        { input: "부엌데기", output: "bueokdegi" }, // before ㄷ
        { input: "부엌의", output: "bueokkui" }, // before ㅇ
        // ㅌ - before other consonants
        { input: "떠맡기다", output: "tteomatgida" }, // before ㄱ
        { input: "겉껍질", output: "geotkkeopjil" }, // before ㄲ
        { input: "곁눈질", output: "gyeonnunjil" }, // before ㄴ
        { input: "불붙다", output: "bulbutda" }, // before ㄷ
        { input: "흩뜨러놓은", output: "heuttteureonoeun" }, // before ㄸ
        { input: "겉만의", output: "geonmanui" }, // before ㅁ
        { input: "겉보기", output: "geotbogi" }, // before ㅂ
        { input: "흩뿌려진", output: "heutppuryeojin" }, // before ㅃ
        { input: "곁쇠", output: "gyeotsoe" }, // before ㅅ
        { input: "겉씨의", output: "geotssiui" }, // before ㅆ
        { input: "같은", output: "gateun" }, // before ㅇ
        { input: "겉잠", output: "geotjam" }, // before ㅈ
        { input: "바깥쪽", output: "bakkatjjok" }, // before ㅉ
        { input: "겉치례뿐이다", output: "geotchiryeppunida" }, // before ㅊ
        { input: "끝토막", output: "kkeuttomak" }, // before ㅌ
        { input: "겉포장", output: "geotpojang" }, // before ㅍ
        { input: "겉핥기의", output: "geotalgiui" }, // before ㅎ
        // ㅍ - before other consonants
        { input: "덮개천", output: "deopgaecheon" }, // before ㄱ
        { input: "무릎꿇다", output: "mureupkkulta" }, // before ㄲ
        { input: "앞날개", output: "amnalgae" }, // before ㄴ
        { input: "뒤덮다", output: "dwideopda" }, // before ㄷ
        { input: "앞뜰", output: "aptteul" }, // before ㄸ
        { input: "앞마구리", output: "ammaguri" }, // before ㅁ
        { input: "무릎부분", output: "mureupbubun" }, // before ㅂ
        { input: "앞선", output: "apseon" }, // before ㅅ
        { input: "높쎈구름", output: "nopssengureum" }, // before ㅆ
        { input: "감명깊은", output: "gammyeonggipeun" }, // before ㅇ
        { input: "늪지", output: "neupji" }, // before ㅈ
        { input: "앞쪽", output: "apjjok" }, // before ㅉ
        { input: "덮치다", output: "deopchida" }, // before ㅊ
        { input: "네잎클로버", output: "neipkeullobeo" }, // before ㅋ
        { input: "잎혀", output: "ipyeo" }, // before ㅎ
        // ㅎ - before other consonants
        { input: "가느다랗게", output: "ganeudarake" }, // before ㄱ
        { input: "낳는", output: "nanneun" }, // before ㄴ
        { input: "낳다", output: "nata" }, // before ㄷ
        { input: "옿비삼척", output: "obisamcheok" }, // before ㅂ
        { input: "그렇소", output: "geureoso" }, // before ㅅ
        { input: "좋아서", output: "joaseo" }, // before ㅇ
        { input: "그렇지", output: "geureochi" }, // before ㅈ
        { input: "놓치다", output: "nochida" }, // before ㅊ
    ];
    
    tests.forEach((test) => {
        it(`should return ${test.output} for ${test.input}`, () => {
            expect(romanization.RomanizeHangul(test.input)).toEqual(test.output);
        });
    })
})

describe("Test double consonant cases", () => {
    let tests: any[] = [
        // ㄳ - k before consonant, ks before vowel
        { input: "넋", output: "neok" },
        { input: "넋이", output: "neoksi" },
        { input: "넋두리", output: "neokduri" },
        // ㄵ - seems like if followed by consonant, it remains n. If followed by vowel, becomes nj
        // consonants that follow it become voiced (anda, ango)
        { input: "앉다", output: "anda" },
        { input: "앉아요", output: "anjayo" },
        { input: "앉는데", output: "anneunde" },
        { input: "앉습니다", output: "anseumnida" },
        { input: "앉겠습니다", output: "angetseumnida" },
        { input: "앉고", output: "ango" },
        { input: "앉더니", output: "andeoni" },
        // ㄶ - remains n no matter what follows. Never becomes nh
        // consonants that follow remain voiceless (manta, manko)
        { input: "많다", output: "manta" },
        { input: "많아요", output: "manayo" },
        { input: "많은데", output: "maneunde" },
        { input: "많습니다", output: "manseumnida" },
        { input: "많겠습니다", output: "manketseumnida" },
        { input: "많고", output: "manko" },
        { input: "많더니", output: "manteoni" },
    ];
    
    tests.forEach((test) => {
        it(`should return ${test.output} for ${test.input}`, () => {
            expect(romanization.RomanizeHangul(test.input)).toEqual(test.output);
        });
    })
})