const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 3000;
const morgan = require('morgan');
const mainRouters = require('./routers/mainRouter');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(cookieSession({
    keys: [process.env.SESSIONKEY],
    maxAge: 3 * 60 * 60 * 1000 // 3 hours
}));

app.use(morgan('tiny'), express.static('./public'), express.json());
app.use(mainRouters);

app.all('*', function (request, response) {
    response.status(404).send('<h1> Invalid URL </h1>');
});

app.listen(port, () => {
    console.log(`server listening on http://127.0.0.1:${port}`);
});
