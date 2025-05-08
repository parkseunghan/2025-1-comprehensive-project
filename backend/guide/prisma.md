
(db 수정 후)
migrations 폴더 삭제

# 올인원
```sh
cd backend

npm run setup
```

# 수동 
```sh
cd backend

npm run reset
```

```sh
npm run generate
```

postgres.md 완료 후

```sh
npm run migrate
```

seed.ts 작성 후

```sh
npx ts-node scripts/insertDiseases.ts
npx ts-node scripts/insertMedications.ts
npx ts-node scripts/insertSymptoms.ts

npm run seed
```

확인

```sh
npm run studio
```