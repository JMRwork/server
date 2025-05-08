const path = require('path');
const engine = path.join(__dirname, '../public/engineCSS.html');
const index = path.join(__dirname, '../public/index.html');
const login = path.join(__dirname, '../public/login.html');
const register = path.join(__dirname, '../public/register.html');

const getHome = (req, res) => {
    res.status(200).sendFile(index);
};

const getGame = (req, res) => {
    res.status(200).sendFile(engine);
};

const getAbout = (req, res) => {
    res.status(200).sendFile(index);
};

const getLogin = (req, res) => {
    res.status(200).sendFile(login);
};

const getRegister = (req, res) => {
    res.status(200).sendFile(register);
};

module.exports = {
    getHome,
    getGame,
    getAbout,
    getLogin,
    getRegister
};
