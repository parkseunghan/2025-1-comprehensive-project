# utils/symptom_mapping.py

# 52개 증상
SYMPTOM_LIST = [
    "가래",
    "기침",
    "미열",
    "고열",
    "구토",
    "구역질",
    "근육통",
    "식욕 저하",
    "오한",
    "피로",
    "황달",
    "배변 후 불쾌감",
    "변비",
    "복부팽만",
    "복통",
    "설사",
    "만성 기침",
    "운동 시 숨참",
    "호흡곤란",
    "두통",
    "심계항진",
    "어지러움",
    "창백함",
    "인후통",
    "코막힘",
    "콧물",
    "삼킴 곤란",
    "발열",
    "탈수",
    "부종",
    "야간 호흡곤란",
    "배뇨통",
    "빈뇨",
    "잔뇨감",
    "하복부 통증",
    "혈뇨",
    "목 이물감",
    "속쓰림",
    "역류",
    "흉통",
    "소화불량",
    "메스꺼움",
    "가슴 답답함",
    "야간 기침",
    "천명",
    "등으로 퍼지는 통증",
    "복부 압통",
    "상복부 통증",
    "체중 감소",
    "식후 통증",
    "식은땀",
    "운동 시 통증",
]

SYMPTOM_MAPPING = {
    "가래": {
        "ko": ["가래", "가래가 많아요", "가래가 끓어요", "가래 증상"],
        "en": ["phlegm", "mucus", "sputum"],
        "token_sets": [],
    },
    "기침": {
        "ko": ["기침", "기침이 나요", "계속 기침해요", "야간 기침"],
        "en": ["cough", "coughing", "persistent cough", "night cough"],
        "token_sets": [],
    },
    "미열": {
        "ko": ["열", "미열", "열이 조금 있어요", "살짝 열이 나요"],
        "en": ["mild fever", "slight fever", "low-grade fever"],
        "token_sets": [
            {"part1": ["열", "체온"], "part2": ["조금", "살짝", "약간", "미열"]}
        ],
    },
    "고열": {
        "ko": ["고열", "열이 심해요", "체온이 높아요"],
        "en": ["high fever", "severe fever", "fever over 39"],
        "token_sets": [{"part1": ["열", "체온"], "part2": ["심하", "높", "고열"]}],
    },
    "구토": {
        "ko": ["구토", "토했어요", "토해요", "토합니다", "계속 토해요"],
        "en": ["vomiting", "throwing up", "puking"],
        "token_sets": [{"part1": ["토", "구토"], "part2": ["하", "했", "중"]}],
    },
    "구역질": {
        "ko": ["구역질", "구역질 나요", "구역감", "속이 메스꺼워요"],
        "en": ["nausea", "retching", "gagging"],
        "token_sets": [{"part1": ["속", "입"], "part2": ["울렁", "구역", "메스꺼"]}],
    },
    "근육통": {
        "ko": ["근육통", "근육이 아파요", "몸이 쑤셔요"],
        "en": ["muscle pain", "muscle ache", "soreness"],
        "token_sets": [{"part1": ["근육", "몸"], "part2": ["쑤시", "통증", "아프", "아픈", "아파", "뻐근"]}],
    },
    "식욕 저하": {
        "ko": ["식욕이 없어요", "입맛이 없어요", "식욕 저하"],
        "en": ["loss of appetite", "no appetite", "reduced appetite"],
        "token_sets": [{"part1": ["식욕", "입맛"], "part2": ["없", "떨어", "줄"]}],
    },
    "오한": {
        "ko": ["오한", "몸이 으슬으슬해요", "춥고 떨려요"],
        "en": ["chills", "shivering", "cold sweats"],
        "token_sets": [
            {
                "part1": ["몸", "온몸"],
                "part2": ["떨", "오한", "춥", "으슬으슬", "으슬", "추워"],
            }
        ],
    },
    "피로": {
        "ko": ["기운", "피로", "기운이 없어요", "무기력해요", "피곤해요", "힘이 없어"],
        "en": ["fatigue", "tiredness", "exhaustion"],
        "token_sets": [
            {"part1": ["몸", "기운"], "part2": ["없", "떨어", "지침", "피곤"]}
        ],
    },
    "황달": {
        "ko": ["황달", "눈이 노래요", "피부가 노래요"],
        "en": ["jaundice", "yellow eyes", "yellow skin"],
        "token_sets": [{"part1": ["눈", "피부"], "part2": ["노랗", "노래", "황달"]}],
    },
    "배변 후 불쾌감": {
        "ko": ["배변 후 불쾌감", "대변 후 찝찝함", "변 보고도 개운하지 않아요"],
        "en": ["discomfort after defecation", "unpleasant after bowel movement"],
        "token_sets": [
            {"part1": ["배변", "변"], "part2": ["불쾌", "불편", "개운하지 않"]}
        ],
    },
    "변비": {
        "ko": ["변비", "변이 잘 안 나와요", "며칠째 대변이 없어요"],
        "en": ["constipation", "hard stool", "difficulty passing stool"],
        "token_sets": [
            {"part1": ["변", "대변"], "part2": ["안나", "안 나", "잘 안 나"]}
        ],
    },
    "복부팽만": {
        "ko": ["복부팽만", "배가 빵빵해요", "복부가 부풀어요"],
        "en": ["abdominal bloating", "stomach bloated", "bloating"],
        "token_sets": [
            {"part1": ["배", "복부"], "part2": ["팽만", "부풀", "불편", "부어"]}
        ],
    },
    "복통": {
        "ko": ["복통", "배가 아파요", "복부가 아파요", "배에 통증이 있어요"],
        "en": ["abdominal pain", "stomachache", "stomach pain", "stomach hurt"],
        "token_sets": [
            {"part1": ["배가", "배", "복부", "위"], "part2": ["아프", "쑤시", "통증"]}
        ],
    },
    "설사": {
        "ko": ["설사", "물을 쌌어요", "묽은 변이 나와요"],
        "en": ["diarrhea", "loose stool", "watery stool"],
        "token_sets": [
            {
                "part1": ["변", "배변", "배"],
                "part2": ["묽", "설사", "물 같", "꾸륵", "꾸룩"],
            }
        ],
    },
    "만성 기침": {
        "ko": ["만성 기침", "기침이 오래가요", "기침이 몇 주째 지속돼요"],
        "en": ["chronic cough", "long-term cough", "persistent cough"],
        "token_sets": [{"part1": ["기침"], "part2": ["오래", "지속", "만성"]}],
    },
    "운동 시 숨참": {
        "ko": ["운동 시 숨참", "뛰면 숨이 가빠요", "운동하면 숨이 차요"],
        "en": ["shortness of breath during exercise", "breathless when running"],
        "token_sets": [{"part1": ["운동", "뛰"], "part2": ["숨차", "숨참", "숨 가빠"]}],
    },
    "호흡곤란": {
        "ko": ["호흡곤란", "숨쉬기 힘들어요", "숨이 막혀요"],
        "en": ["dyspnea", "shortness of breath", "difficulty breathing"],
        "token_sets": [{"part1": ["숨", "호흡", "숨쉬기"], "part2": ["힘들", "막히", "곤란", "어렵", "어려워"]}],
    },
    "두통": {
        "ko": ["두통", "머리가 아파요", "머리가 지끈거려요"],
        "en": ["headache", "throbbing head", "pain in the head"],
        "token_sets": [{"part1": ["머리"], "part2": ["아프", "지끈", "통증"]}],
    },
    "심계항진": {
        "ko": ["심계항진", "심장이 빨리 뛰어요", "심장이 두근거려요"],
        "en": ["palpitations", "rapid heartbeat", "heart racing"],
        "token_sets": [
            {"part1": ["심장"], "part2": ["빨리 뛰", "두근", "빠르게", "심계항진"]}
        ],
    },
    "어지러움": {
        "ko": ["어지러움", "어지러워요", "빙빙 돌아요"],
        "en": ["dizziness", "feeling dizzy", "lightheadedness"],
        "token_sets": [{"part1": ["머리", "몸"], "part2": ["어지럽", "빙빙"]}],
    },
    "창백함": {
        "ko": ["창백함", "얼굴이 하얘요", "피부가 창백해요"],
        "en": ["paleness", "pale skin", "white face"],
        "token_sets": [{"part1": ["얼굴", "피부"], "part2": ["하얗", "창백"]}],
    },
    "인후통": {
        "ko": ["인후통", "목이 아파요", "목이 따가워요", "목이 따끔거려요"],
        "en": ["sore throat", "throat pain", "throat irritation"],
        "token_sets": [
            {
                "part1": ["목", "인후", "목구멍"],
                "part2": ["아프", "따갑", "통증", "따끔", "쓰라리", "쓰리", "쓰려", "아픈"],
            }
        ],
    },
    "코막힘": {
        "ko": ["코막힘", "코가 막혀요", "숨쉬기 힘들어요"],
        "en": ["nasal congestion", "stuffy nose", "blocked nose"],
        "token_sets": [{"part1": ["코"], "part2": ["막히", "막힘", "숨쉬기 힘들", "막혀"]}],
    },
    "콧물": {
        "ko": ["콧물", "코에서 물이 나와요"],
        "en": ["runny nose", "nasal discharge"],
        "token_sets": [{"part1": ["코", "콧물"], "part2": ["나오", "흐르"]}],
    },
    "삼킴 곤란": {
        "ko": ["삼킴 곤란", "음식 삼키기 어려워요", "삼킬 때 아파요"],
        "en": ["difficulty swallowing", "swallowing pain"],
        "token_sets": [
            {"part1": ["삼킴", "삼키기"], "part2": ["곤란", "어렵", "불편", "아프", "힘들"]}
        ],
    },
    "발열": {
        "ko": ["발열", "열이 나요", "체온이 올라갔어요"],
        "en": ["fever", "high temperature", "having a fever"],
        "token_sets": [{"part1": ["열", "체온"], "part2": ["나", "올라", "발열"]}],
    },
    "탈수": {
        "ko": ["탈수", "입이 마르고", "소변이 안 나와요"],
        "en": ["dehydration", "dry mouth", "lack of urination"],
        "token_sets": [
            {
                "part1": ["입", "소변", "오줌"],
                "part2": ["마르", "안 나", "탈수", "안나"],
            }
        ],
    },
    "부종": {
        "ko": ["부종", "몸이 붓고 있어요", "손발이 부어요"],
        "en": ["swelling", "edema", "swollen body"],
        "token_sets": [{"part1": ["손", "발", "몸"], "part2": ["붓", "부어", "부종"]}],
    },
    "야간 호흡곤란": {
        "ko": ["야간 호흡곤란", "밤에 숨이 차요", "밤에 숨쉬기 힘들어요"],
        "en": ["nocturnal dyspnea", "shortness of breath at night"],
        "token_sets": [
            {"part1": ["밤", "야간"], "part2": ["숨이 차", "숨쉬기 힘들", "호흡곤란"]}
        ],
    },
    "배뇨통": {
        "ko": ["배뇨통", "소변 볼 때 아파요", "소변이 따가워요"],
        "en": ["painful urination", "dysuria", "burning urination"],
        "token_sets": [{"part1": ["소변", "배뇨"], "part2": ["아프", "따갑", "통증"]}],
    },
    "빈뇨": {
        "ko": ["빈뇨", "소변 자주 봐요", "화장실 자주 가요"],
        "en": ["frequent urination", "urinating often"],
        "token_sets": [
            {"part1": ["소변", "화장실", "배뇨"], "part2": ["자주", "빈뇨"]}
        ],
    },
    "잔뇨감": {
        "ko": ["잔뇨감", "소변이 남은 느낌이에요", "다 본 것 같지 않아요"],
        "en": ["residual urine feeling", "incomplete urination"],
        "token_sets": [{"part1": ["소변", "배뇨"], "part2": ["남", "잔", "다 안 본"]}],
    },
    "하복부 통증": {
        "ko": ["하복부 통증", "아랫배가 아파요", "아랫배가 뻐근해요"],
        "en": ["lower abdominal pain", "lower belly ache"],
        "token_sets": [
            {"part1": ["하복부", "아랫배"], "part2": ["통증", "아프", "아픈", "아파", "뻐근"]}
        ],
    },
    "혈뇨": {
        "ko": ["혈뇨", "소변에 피가 나와요", "붉은 소변"],
        "en": ["hematuria", "blood in urine", "red urine"],
        "token_sets": [{"part1": ["소변", "오줌"], "part2": ["피", "붉", "혈"]}],
    },
    "목 이물감": {
        "ko": ["목 이물감", "목에 뭔가 걸린 느낌", "목이 껄끄러워요"],
        "en": ["foreign body sensation in throat", "something stuck in throat"],
        "token_sets": [{"part1": ["목"], "part2": ["이물감", "걸린", "껄끄럽"]}],
    },
    "속쓰림": {
        "ko": ["속쓰림", "가슴이 쓰려요", "명치가 쓰려요"],
        "en": ["heartburn", "burning chest", "epigastric burning"],
        "token_sets": [{"part1": ["속", "가슴", "명치"], "part2": ["쓰리", "속쓰림"]}],
    },
    "역류": {
        "ko": ["역류", "위산이 올라와요", "목까지 올라와요"],
        "en": ["acid reflux", "regurgitation"],
        "token_sets": [
            {"part1": ["위산", "내용물", "신물"], "part2": ["올라오", "역류"]}
        ],
    },
    "흉통": {
        "ko": ["흉통", "가슴이 아파요", "가슴이 쥐어짜는 듯해요"],
        "en": ["chest pain", "thoracic pain", "tight chest"],
        "token_sets": [
            {"part1": ["가슴", "흉부"], "part2": ["아프", "쥐어짜", "통증"]}
        ],
    },
    "소화불량": {
        "ko": ["소화불량", "소화가 잘 안돼요", "먹고 나서 더부룩해요", "속이 더부룩"],
        "en": ["indigestion", "dyspepsia", "bloating after eating"],
        "token_sets": [
            {"part1": ["소화", "속"], "part2": ["불량", "안돼", "안되", "더부룩"]},
            {"part1": ["먹고", "식사 후"], "part2": ["더부룩", "불편"]},
        ],
    },
    "메스꺼움": {
        "ko": ["메스꺼움", "속이 메스꺼워요", "토할 것 같아요"],
        "en": ["nausea", "queasy", "feel like vomiting"],
        "token_sets": [
            {"part1": ["속", "배"], "part2": ["메스꺼", "구역질", "토할 것 같"]}
        ],
    },
    "가슴 답답함": {
        "ko": ["가슴 답답함", "가슴이 답답해요", "숨이 턱 막혀요"],
        "en": ["chest tightness", "pressure in chest"],
        "token_sets": [{"part1": ["가슴", "흉부"], "part2": ["답답", "막혀"]}],
    },
    "야간 기침": {
        "ko": ["야간 기침", "밤에 기침 나요", "밤마다 기침"],
        "en": ["night cough", "coughing at night"],
        "token_sets": [{"part1": ["밤", "야간"], "part2": ["기침"]}],
    },
    "천명": {
        "ko": ["천명", "쎅쎅거리는 소리", "숨쉴 때 쎅쎅거려요"],
        "en": ["wheezing", "wheeze", "whistling sound when breathing"],
        "token_sets": [
            {
                "part1": ["숨", "호흡", "숨쉴 때"],
                "part2": ["쎅쎅", "천명", "휘파람소리"],
            }
        ],
    },
    "등으로 퍼지는 통증": {
        "ko": ["등으로 퍼지는 통증", "등까지 아파요", "복통이 등까지 번져요"],
        "en": ["radiating pain to back", "pain that spreads to the back"],
        "token_sets": [
            {
                "part1": ["복통", "배", "복부", "등"],
                "part2": ["등으로 퍼지", "등까지 아프", "번져", "아픈", "아프", "아파"],
            }
        ],
    },
    "복부 압통": {
        "ko": ["복부 압통", "배를 누르면 아파요", "배 누르면 통증"],
        "en": ["abdominal tenderness", "tender belly", "pain when pressing abdomen"],
        "token_sets": [
            {"part1": ["배", "복부"], "part2": ["누르", "압통", "눌렀을 때 아프"]}
        ],
    },
    "상복부 통증": {
        "ko": ["상복부 통증", "명치가 아파요", "위쪽 배가 아파요"],
        "en": ["upper abdominal pain", "epigastric pain"],
        "token_sets": [
            {"part1": ["상복부", "명치", "윗배"], "part2": ["통증", "아프", "아픈", "아파"]}
        ],
    },
    "체중 감소": {
        "ko": ["체중 감소", "살이 빠졌어요", "몸무게가 줄었어요"],
        "en": ["weight loss", "losing weight"],
        "token_sets": [
            {"part1": ["체중", "몸무게", "살"], "part2": ["줄", "빠졌", "감소"]}
        ],
    },
    "식후 통증": {
        "ko": ["식후 통증", "밥 먹고 나서 아파요", "식사 후 배가 아파요"],
        "en": ["pain after eating", "postprandial pain"],
        "token_sets": [
            {"part1": ["식후", "식사 후", "밥 먹고"], "part2": ["통증", "아프", "아픈", "아파"]}
        ],
    },
    "식은땀": {
        "ko": ["식은땀", "갑자기 식은땀이 나요", "땀이 식어요"],
        "en": ["cold sweat", "clammy skin"],
        "token_sets": [{"part1": ["땀", "몸"], "part2": ["식", "식은땀", "차가워"]}],
    },
    "운동 시 통증": {
        "ko": ["운동 시 통증", "움직일 때 아파요", "활동 중 통증"],
        "en": ["pain during exercise", "pain with movement"],
        "token_sets": [{"part1": ["운동", "움직", "활동"], "part2": ["통증", "아프", "아픈", "아파"]}],
    },
}
