const path = require('path');
const file = path.join(__dirname, '../public/engineCSS.html');
const loginHTML = path.join(__dirname, '../public/login.html');
const registerHTML = path.join(__dirname, '../public/register.html');

const getHome = async (req, res) => {
    if (req.cookies['session.sig'] && req.cookies.session) {
        res.status(200).sendFile(file);
    } else {
        res.status(200).sendFile(file);
    }
};

const getGame = async (req, res) => {
    res.status(200).sendFile(file);
};

const getAbout = async (req, res) => {
    res.status(200).sendFile(file);
};

const getLogin = async (req, res) => {
    res.status(200).sendFile(loginHTML);
};

const getRegister = async (req, res) => {
    res.status(200).sendFile(registerHTML);
};

module.exports = {
    getHome,
    getGame,
    getAbout,
    getLogin,
    getRegister
};
