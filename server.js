const http = require('http')
const url = require('url')
const fs = require('fs')
const path = require('path')
const confirmationCallback = () => {
    console.log('Server is running...');
}
const requestListener = (req, res) => {
    var pathName = url.parse(req.url).pathname;
    var defaultPath = "/index.html";
    //var query = url.parse(req.url).query;    
    if (pathName==='/') {
        var file = path.join(__dirname, 'site', pathName, 'index.html');
    } else if (pathName === "/count"){
        var num = 7;
        var file = path.join(__dirname, 'site', defaultPath);
    } else {
        var file = path.join(__dirname, 'site', pathName);
    }
    fs.readFile(file, function (erro, dados) {
        if (erro) {
        res.writeHead(404);
        res.end();
        } else if (num){
            res.write(dados + "<p>"+num+"</p>");
            res.end()
        } else {
            res.end(dados);
        }
})}



const server = http.createServer(requestListener);
    
server.listen(80, 'localhost', confirmationCallback);