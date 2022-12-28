const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
dotenv.config()
const app = express()
const port = process.env.PORT || 3000
const mainRouters = require('./routers/mainRouter')

app.use([morgan('tiny'), express.static('./public')], express.json())
app.use(mainRouters)

app.all('*', function (request, response) {
    response.status(404).send('<h1> Invalid URL </h1>')
})
app.listen(port, () => {
    console.log('server listening on port', port)
})