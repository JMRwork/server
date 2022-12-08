const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.end('<h1>Hello<h1/>')
});

app.listen(3000, () => {
    console.log("server is up on 3000 port");
});