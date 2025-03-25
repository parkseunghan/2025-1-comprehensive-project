# Node.js - 25.03.13 기준 LTS 버전(23.10.0) + 불필요 패키지 제거(slim)
FROM node:23.10.0-slim

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사 후 의존성 설치
COPY package.json package-lock.json ./
RUN npm install

# 모든 소스 코드 복사
COPY . .

# 컨테이너 시작 시 실행 명령
# 서버 실행
CMD ["npm", "start"]

# 컨테이너 외부에서 5173번 포트로 접근 가능
# Vite
EXPOSE 8081