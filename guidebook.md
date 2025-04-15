
되돌리기
```sh
git fetch origin && git reset --hard origin/main && git clean -fd
```


# 명령어

################# docker compose up --build ###################

# frontend
npx create-expo-app@3.2.0 frontend --example with-router
npm start

# backend
npm init -y
npm install express
npm start

# Docker 빌드 및 실행
docker compose up
    --bulid: 처음 실행할 때 모든 컨테이너를 빌드

# 실행 중지
docker compose dowm
    -v :볼륨도 삭제

# 
docker ps

#
docker images

#
docker exec

#
docker logs

