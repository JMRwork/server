const path = require('path');
const file = path.join(__dirname, '../public/engineCSS.html');
const loginHTML = path.join(__dirname, '../public/login.html');

const getActions = async (req, res) => {
    if (req.cookies['session.sig'] && req.cookies.session) {
        res.status(200).sendFile(file);
    } else {
        res.status(401).sendFile(loginHTML);
    }
};

const getMap = async (req, res) => {
    if (req.cookies['session.sig'] && req.cookies.session) {
        res.status(200).sendFile(file);
    } else {
        res.status(401).sendFile(loginHTML);
    }
};

const getInventory = async (req, res) => {
    if (req.cookies['session.sig'] && req.cookies.session) {
        res.status(200).sendFile(file);
    } else {
        res.status(401).sendFile(loginHTML);
    }
};

const getResearch = async (req, res) => {
    if (req.cookies['session.sig'] && req.cookies.session) {
        res.status(200).sendFile(file);
    } else {
        res.status(401).sendFile(loginHTML);
    }
};

const getMissions = async (req, res) => {
    if (req.cookies['session.sig'] && req.cookies.session) {
        res.status(200).sendFile(file);
    } else {
        res.status(401).sendFile(loginHTML);
    }
};

const logout = async (req, res) => {
    req.session = null;
    res.clearCookie('u_on');
    res.status(200).redirect('/');
};

module.exports = {
    getActions,
    getMap,
    getInventory,
    getResearch,
    getMissions,
    logout
};
