Table User {
  id               uuid    [pk]          → 사용자 고유 ID (Primary Key, UUID 형식)
  email            varchar [unique]     → 사용자 이메일 (중복 불가)
  password         varchar              → 사용자 비밀번호 (암호화 저장)
  name             varchar              → 사용자 이름 (선택 사항)
  gender           varchar              → 성별 ("남성", "여성" 등 문자열)
  age              int                  → 나이 (숫자, 정수형)
  height           float                → 키 (cm 단위, 실수형)
  weight           float                → 몸무게 (kg 단위, 실수형)
  medications      text[]               → 복용 중인 약물 목록 (문자열 배열)
  createdAt        datetime             → 계정 생성일 (자동 저장)
  updatedAt        datetime             → 마지막 수정일 (변경 시 자동 업데이트)
}


Table Disease {
  id    uuid    [pk]                  → 지병 고유 ID (Primary Key)
  name  varchar [unique]             → 지병 이름 (중복 불가)
}

Table UserDisease {
  id         uuid    [pk]                          → 사용자-지병 관계의 고유 ID
  userId     uuid    [ref: > User.id]              → 어떤 사용자(User)를 참조하는 외래 키
  diseaseId  uuid    [ref: > Disease.id]           → 어떤 지병(Disease)을 참조하는 외래 키

  indexes {
    (userId, diseaseId) [unique]                   → 동일 사용자-지병 조합 중복 방지
  }
}

Table Symptom {
  id    uuid    [pk]                  → 증상 고유 ID (Primary Key)
  name  varchar [unique]             → 증상 이름 (중복 불가)
}

Table SymptomRecord {
  id        uuid    [pk]                      → 증상 기록 ID
  userId    uuid    [ref: > User.id]          → 어떤 사용자(User)가 작성했는지 나타내는 외래 키
  createdAt datetime                          → 기록 생성 시각
}


-- 증상 기록에 연결된 증상 N:M
Table SymptomOnRecord {
  id        uuid    [pk]                              → 증상기록-증상 연결의 고유 ID
  symptomId uuid    [ref: > Symptom.id]               → 어떤 증상(Symptom)을 참조하는 외래 키
  recordId  uuid    [ref: > SymptomRecord.id]         → 어떤 증상기록을 참조하는 외래 키

  indexes {
    (symptomId, recordId) [unique]                    → 중복 연결 방지 (동일한 증상 중복 추가 금지)
  }
}


Table Prediction {
  id         uuid    [pk]                                  → 예측 결과 고유 ID
  recordId   uuid    [ref: > SymptomRecord.id, unique]     → 어떤 증상기록에 대한 예측인지 (1:1 연결)
  result     varchar                                       → 예측된 질병명 또는 요약 결과
  confidence float                                         → 예측 신뢰도 (0.0 ~ 1.0 사이)
  guideline  text                                          → 사용자에게 제공되는 행동 가이드라인
  createdAt  datetime                                      → 예측 생성 시각
}

