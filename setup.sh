#!/bin/bash
# 실행 전 권한 부여: chmod +x setup.sh
# 실행: ./setup.sh

echo "📦 frontend 의존성 설치 중..."
cd frontend && npm install && cd ..

echo "📦 backend 의존성 설치 중..."
cd backend && npm install && cd ..

echo "🐍 ai 가상환경 생성 및 의존성 설치 중..."
cd ai
py -3.9 -m venv venv
source venv/Scripts/activate
pip install -r requirements.txt
deactivate
cd ..

echo "🐍 symptom 가상환경 생성 및 의존성 설치 중..."
cd symptom
py -3.9 -m venv venv
source venv/Scripts/activate
pip install -r requirements.txt
deactivate
cd ..

echo "✅ 초기 설정 완료!"
