
- ollama 다운로드

- mistral 모델 설치 및 실행
```sh
ollama run mistral
```

테스트 명령어 (cmd)
```sh
curl -X POST http://localhost:5000/api/llm/extract -H "Content-Type: application/json" -d "{\"texts\":[\"머리가 아프고 기침이 나요. 그리고 피부가 가렵고 따가워요\"]}"

curl -X POST http://localhost:5000/api/llm/extract -H "Content-Type: application/json" -d "{\"texts\":[\"머리가 아프고 기침이 나요\", \"피부가 가렵고 따가워요\"]}"
```

- 테스트
```sh
User:
    다음 각 문장에서 증상만 한국어로 추출해서 하나의 리스트로 보여줘. 리스트 예: ['두통', '기침', '가려움', '어지럼중']

    문장: "몸살 기운이 있고 콧물이 나요", "피부가 가렵고 어지러워요.", "피부가 따가움", "머리가 띵함", "자꾸 콜록콜록 기침이 나고 가래가 나와요"
```

```sh
User:
    다음 리스트에서 비슷한 증상들을 하나의 증상으로 통일해줘. 예1: ['콜록콜록', '에취', '기침', '가래', '배아픔', '복통', '배가아픔'] -> ['기침', '복통']
    리스트: ['콜록콜록', '기침', '배통증', '배아픔']
```