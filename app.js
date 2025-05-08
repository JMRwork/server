const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 3000;
const morgan = require('morgan');
const mainRouters = require('./routers/mainRouter');
const cookieParser = require('cookie-parser');
const { messageApp } = require('./messageApp');
const { ioSession } = require('./middleware/sessionIO');
const { verifySession } = require('./middleware/session');

app.use(cookieParser());
// app.use(session)

app.use(morgan('tiny'), express.static('./public'), express.json());
// app.use(verifySession);
app.use(mainRouters);
app.use(verifySession);

app.all('*', function (request, response) {
    response.status(404).send('<h1> Invalid URL </h1>');
});

const serverExpress = app.listen(port, () => {
    console.log(`server listening on http://127.0.0.1:${port}`);
});

const server = messageApp(serverExpress);
server.use(ioSession);
