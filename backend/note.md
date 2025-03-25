models - controllers - routes - server.ts 순으로 코드 작성

이후 엔드포인트 테스트
POST /api/*/*

# 1. postman
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