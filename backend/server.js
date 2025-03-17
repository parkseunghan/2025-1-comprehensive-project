const express = require('express');
const app = express();
const port = 5000;

app.get('/', (req, res) => {
    res.send('Backend Server port 3000');
});

// 서버 시작
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})