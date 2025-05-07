import re
from typing import List
from utils.korean_rules import JOSA, EOMI


def clean_text(text: str) -> str:
    # 이모지, 특수문자 제거
    return re.sub(r"[^\w\sㄱ-힣]", "", text).strip()


def remove_josa_and_eomi(token: str) -> str:
    """
    조사, 어미 등을 반복적으로 제거해서 핵심 단어를 반환
    예: '배가요' → '배', '아프고' → '아프'
    """

    while True:
        original = token
        print(f"🧪 [정제 전] {token}", end=" → ")
        for j in sorted(JOSA, key=len, reverse=True):
            if token.endswith(j):
                token = token[: -len(j)]
                break
        for e in sorted(EOMI, key=len, reverse=True):
            if token.endswith(e):
                token = token[: -len(e)]
                break
        if token == original:
            break
        print(f"[정제 후] {token}")
    return token


def clean_and_tokenize(text: str) -> List[str]:
    """
    문장을 정제하고, 조사/어미 제거 후 핵심 단어로 구성된 토큰 리스트 반환
    """
    cleaned = clean_text(text)
    raw_tokens = cleaned.split()

    whitelist = {"배", "피", "열", "목", "속", "눈", "귀", "코", "팔", "위", "몸"}
    tokens: List[str] = []

    for token in raw_tokens:
        stripped = remove_josa_and_eomi(token)
        if len(stripped) > 1 or stripped in whitelist:
            tokens.append(stripped)

    return tokens
