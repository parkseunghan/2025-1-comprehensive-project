-- PostgreSQL 실행 시 자동으로 DB 및 사용자 계정 생성
CREATE DATABASE aidiagnosis_db;
CREATE USER root WITH ENCRYPTED PASSWORD 'root';
GRANT ALL PRIVILEGES ON DATABASE aidiagnosis_db TO root;

