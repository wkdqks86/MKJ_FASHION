# MKJ FASHION

React(Vite) 클라이언트 + Express/MongoDB API 서버 쇼핑몰 프로젝트입니다.

## 로컬 실행

```bash
# 서버
cd server
cp .env.example .env   # 값 설정
npm install
npm run dev

# 클라이언트 (별도 터미널)
cd client
cp .env.example .env   # 값 설정
npm install
npm run dev
```

## 배포

- **클라이언트 (Vercel)**: Root Directory = `client`, `client/.env.example` 참고
- **서버 (Heroku)**: 루트 `Procfile` + `package.json`으로 `server/` 배포, Buildpack `heroku/nodejs`만 사용, `server/.env.example` 환경 변수 등록
