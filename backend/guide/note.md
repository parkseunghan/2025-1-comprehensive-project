models - controllers - routes - server.ts 순으로 코드 작성

이후 엔드포인트 테스트
POST /api/*/*

# postman 사용법

    api: register
    url: http://localhost:5000/api/users/register
    - +create new collection
    - GET -> POST 변경
    - Body - raw - json형식으로 입력
        예시:
        {
        "username": "박",
        "email": "park@example.com",
        "password": "park123"
        }
    - Send

    
    api:
        /users/register
        - userModel -> authController -> authRoutes 

        /symptoms
        - symptomModel -> symptomController -> symptomRoutes
        
        /:userId
        - userController -> userRoutes

    
# 계층별 구성요소 역할

    | 계층         | 역할 설명 |
    |--------------|-----------|
    | **Router**     | 클라이언트의 요청 URL 및 HTTP 메서드를 기반으로 어떤 컨트롤러 함수로 연결할지 결정함 |
    | **Controller** | 요청(request)을 받고, 파라미터를 정리하고, 적절한 서비스 함수를 호출. HTTP 응답(response)을 반환함 |
    | **Service**     | 비즈니스 로직 담당 계층. 검증, 연산, 외부 API 호출, 트랜잭션 등을 처리. 모델(ORM)과 통신 |
    | **Model (ORM)** | 데이터베이스와 직접 연결되는 계층 (Prisma, Sequelize 등). CRUD 처리 전담 |




# 테이블

    Table User {
    id               uuid    [pk]
    email            varchar [unique]
    password         varchar
    name             varchar
    gender           varchar
    age              int
    height           float
    weight           float
    medications      text[]
    createdAt        datetime
    updatedAt        datetime
    }

    Table Disease {
    id    uuid    [pk]
    name  varchar [unique]
    }

    Table UserDisease {
    id         uuid    [pk]
    userId     uuid    [ref: > User.id]
    diseaseId  uuid    [ref: > Disease.id]

    indexes {
        (userId, diseaseId) [unique]
    }
    }

    Table Symptom {
    id    uuid    [pk]
    name  varchar [unique]
    }

    Table SymptomRecord {
    id        uuid    [pk]
    userId    uuid    [ref: > User.id]
    createdAt datetime
    }

    Table SymptomOnRecord {
    id        uuid    [pk]
    symptomId uuid    [ref: > Symptom.id]
    recordId  uuid    [ref: > SymptomRecord.id]

    indexes {
        (symptomId, recordId) [unique]
    }
    }

    Table Prediction {
    id         uuid    [pk]
    recordId   uuid    [ref: > SymptomRecord.id, unique]
    result     varchar
    confidence float
    guideline  text
    createdAt  datetime
    }

