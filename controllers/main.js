const path = require('path');
const file = path.join(__dirname, '../public/engineCSS.html');
const loginHTML = path.join(__dirname, '../public/login.html');
const registerHTML = path.join(__dirname, '../public/register.html');

const getHome = (req, res) => {
    res.status(200).sendFile(file);
};

const getGame = (req, res) => {
    res.status(200).sendFile(file);
};

const getAbout = (req, res) => {
    res.status(200).sendFile(file);
};

const getLogin = (req, res) => {
    res.status(200).sendFile(loginHTML);
};

const getRegister = (req, res) => {
    res.status(200).sendFile(registerHTML);
};

module.exports = {
    getHome,
    getGame,
    getAbout,
    getLogin,
    getRegister
};
