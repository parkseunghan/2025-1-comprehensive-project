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

